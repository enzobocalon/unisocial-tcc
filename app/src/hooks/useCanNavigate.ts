import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { CanNavigateBetweenAssignmentAndChatQuery } from '../__generated__/graphql';
import { makeGraphQLRequest } from '../lib/graphQLClient';
import { CAN_NAVIGATE } from '../services/assignments/queries/canNavigateBetweenAssignmentAndChat';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { StackProps } from '../types/Navigation';

export function useCanNavigate(source: string) {
  const navigate = useNavigation<StackProps>();
  const queryClient = useQueryClient();
  const { mutateAsync: navigateFn, isPending: isPendingNavigate } = useMutation(
    {
      mutationKey: ['navigate'],
      mutationFn: async ({
        assignmentId,
        chatId,
      }: {
        assignmentId: string;
        chatId: string;
      }) => {
        const data =
          await makeGraphQLRequest<CanNavigateBetweenAssignmentAndChatQuery>({
            document: CAN_NAVIGATE,
            variables: { assignmentId, chatId },
          });
        return data.canNavigateBetweenAssignmentAndChat;
      },
    }
  );

  const handleChatAssignmentNavigation = useCallback(
    async (assignmentId: string, chatId: string) => {
      try {
        const canNavigate = await navigateFn({
          assignmentId,
          chatId,
        });

        if (canNavigate.success) {
          if (source === 'CHAT') {
            navigate.navigate('Assignment', {
              assignmentId,
            });
          } else {
            await Promise.all([
              queryClient.refetchQueries({
                queryKey: ['activeChat', chatId],
              }),
              queryClient.refetchQueries({
                queryKey: ['messages', chatId],
              }),
            ]);
            navigate.navigate('Chat', {
              chatId,
            });
          }
        }
      } catch (e: any) {
        if ('message' in e) {
          Toast.show({
            type: 'error',
            text1: 'Falha ao Navegar',
            text2: e.message,
          });
          await queryClient.refetchQueries({
            queryKey: ['getAssignment', assignmentId],
          });
          return;
        }
        Toast.show({
          type: 'error',
          text1: 'Falha ao Navegar',
          text2: 'Erro desconhecido. Tente novamente mais tarde.',
        });
        await queryClient.refetchQueries({
          queryKey: ['getAssignment', assignmentId],
        });
      }
    },
    []
  );

  return {
    handleChatAssignmentNavigation,
    isPendingNavigate,
  };
}
