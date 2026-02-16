import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { makeGraphQLRequest } from '../../lib/graphQLClient';
import { GET_LINKABLE_CHATS } from '../../services/assignments/queries/getLinkableChats';
import {
  Assignment,
  GetLinkableChatsQuery,
  LinkChatToAssignmentMutation,
} from '../../__generated__/graphql';
import { useState } from 'react';
import { PAGE_SIZE } from '../../lib/constants';
import { LINK_CHAT_TO_ASSIGNMENT } from '../../services/assignments/mutations/linkChatToAssignment';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { StackProps } from '../../types/Navigation';
import { useTheme } from 'styled-components';

export function useLinkableChats(assignmentId: string) {
  const theme = useTheme();
  const [chat, setChat] = useState<string | null>(null);
  const navigate = useNavigation<StackProps>();
  const queryClient = useQueryClient();
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['getLinkableChats', assignmentId],
    queryFn: async ({ pageParam }) => {
      const data = await makeGraphQLRequest<GetLinkableChatsQuery>({
        document: GET_LINKABLE_CHATS,
        variables: {
          assignmentId,
          page: pageParam,
        },
      });
      return data.getLinkableChats;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, page) => {
      if (!lastPage || !lastPage.length || lastPage.length < PAGE_SIZE) {
        return undefined;
      }
      return page.length;
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      if (!chat) return;
      const data = await makeGraphQLRequest<LinkChatToAssignmentMutation>({
        document: LINK_CHAT_TO_ASSIGNMENT,
        variables: {
          assignmentId,
          chatId: chat,
        },
      });
      return data.linkChatToAssignment;
    },
  });

  const handleLinkChat = async (chatId: string) => {
    if (!chatId) return;
    try {
      await mutateAsync();
      Toast.show({
        type: 'success',
        text1: 'Chat vinculado com sucesso',
      });
      queryClient.setQueryData(
        ['getAssignment', assignmentId],
        (data: Assignment) => {
          if (!data) return;
          return {
            ...data,
            chatId: chatId,
          };
        }
      );
      navigate.goBack();
    } catch (e: any) {
      if ('message' in e) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao vincular',
          text2: e.message,
        });
        return;
      }
      Toast.show({
        type: 'error',
        text1: 'Erro ao vincular',
        text2: 'Ocorreu um erro inesperado. Tente novamente mais tarde',
      });
    } finally {
      setChat(null);
    }
  };

  const handleSelection = async (chatId: string) => {
    setChat(chatId);
    Alert.alert(
      'Vincular Chat',
      'Deseja vincular este chat a esta atividade?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => setChat(null),
        },
        {
          text: 'Vincular',
          onPress: () => handleLinkChat(chatId),
        },
      ]
    );
  };

  return {
    data: data?.pages.flat(),
    hasNextPage,
    fetchNextPage,
    handleSelection,
    isPending,
    theme,
    chat,
  };
}
