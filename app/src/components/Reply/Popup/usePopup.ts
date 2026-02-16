import { useTheme } from 'styled-components';
import { useAuth } from '../../../context/AuthContext';
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { DeleteReplyMutation, Reply } from '../../../__generated__/graphql';
import { makeGraphQLRequest } from '../../../lib/graphQLClient';
import { DELETE_REPLY } from '../../../services/posts/mutations/deleteReply';
import Toast from 'react-native-toast-message';

export function usePopup(
  reply: Reply,
  setReplies: React.Dispatch<React.SetStateAction<number>>,
  queryKey: string
) {
  const { user } = useAuth();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { mutateAsync: deleteReplyFn, isPending: isPendingDelete } =
    useMutation({
      mutationFn: async () => {
        const { deleteReply: data } =
          await makeGraphQLRequest<DeleteReplyMutation>({
            document: DELETE_REPLY,
            variables: {
              id: reply.id,
            },
          });
        return data;
      },
    });

  const handleDelete = async () => {
    if (reply.user.id !== user?.me.id) return;
    try {
      const { success, message } = await deleteReplyFn();
      if (success) {
        Toast.show({
          type: 'success',
          text1: message || 'Comentário apagado com sucesso',
        });
        if (!reply.parentId) {
          queryClient.setQueryData(
            [queryKey, 'replies', reply.postId],
            (oldData: InfiniteData<Reply[]>) => {
              return {
                ...oldData,
                pages: oldData.pages.map((r) =>
                  r.filter((r) => r.id !== reply.id)
                ),
              };
            }
          );
        }

        if (reply.parentId) {
          queryClient.setQueryData(
            [queryKey, 'getChildrenReplies', reply.parentId],
            (oldData: InfiniteData<Reply[]>) => {
              return {
                ...oldData,
                pages: oldData.pages.map((r) =>
                  r.filter((r) => r.id !== reply.id)
                ),
              };
            }
          );
        }
        setReplies((prev) => prev - 1);
      } else {
        Toast.show({
          type: 'error',
          text1: message || 'Erro ao apagar comentário',
        });
      }
    } catch (e) {
      console.log(e);
      Toast.show({
        type: 'error',
        text1: 'Erro ao apagar comentário.',
        text2: 'Tente novamente mais tarde.',
      });
    }
  };

  return {
    user,
    theme,
    handleDelete,
    isPendingDelete,
  };
}
