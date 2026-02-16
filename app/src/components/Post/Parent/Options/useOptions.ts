import { Alert } from 'react-native';
import {
  Post,
  RemovePostMutation,
  TimelineByCourseQuery,
  TimelineQuery,
} from '../../../../__generated__/graphql';
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { makeGraphQLRequest } from '../../../../lib/graphQLClient';
import { REMOVE_POST } from '../../../../services/posts/mutations/removePost ';
import Toast from 'react-native-toast-message';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useTheme } from 'styled-components';

export function useOptions(post: Post, ref: BottomSheetModal) {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const { mutateAsync: deletePost, isPending } = useMutation({
    mutationFn: async () => {
      const { removePost: data } = await makeGraphQLRequest<RemovePostMutation>(
        {
          document: REMOVE_POST,
          variables: { id: post.id },
        }
      );
      return data;
    },
  });

  const handleDelete = async () => {
    try {
      const { id } = await deletePost();
      queryClient.setQueryData(
        ['timeline'],
        (oldData: InfiniteData<TimelineQuery>) => {
          return {
            ...oldData,
            pages: oldData.pages.map((page) => {
              if (!page) return page;

              return {
                ...page,
                timeline: page.timeline.filter((p) => p.id !== id),
              };
            }),
          };
        }
      );

      queryClient.setQueryData(
        ['courseTimeline'],
        (
          oldData:
            | InfiniteData<TimelineByCourseQuery['timelineByCourse']>
            | undefined
        ) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => {
              if (!page) return page;
              // page já é um array de posts, então só filtrar
              return page.filter((p) => p.id !== id);
            }),
          };
        }
      );

      queryClient.setQueryData(
        ['profile', 'posts', post.user.id],
        (oldData: InfiniteData<Post[]> | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) =>
              page ? page.filter((p) => p.id !== id) : page
            ),
          };
        }
      );

      queryClient.setQueryData(
        ['profile', 'likes', post.user.id],
        (oldData: InfiniteData<Post[]> | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) =>
              page ? page.filter((p) => p.id !== id) : page
            ),
          };
        }
      );

      queryClient.setQueryData(
        ['profile', 'medias', post.user.id],
        (oldData: InfiniteData<Post[]> | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) =>
              page ? page.filter((p) => p.id !== id) : page
            ),
          };
        }
      );

      Toast.show({
        type: 'success',
        text1: 'Postagem apagada',
      });

      ref.current.dismiss();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao apagar postagem',
        text2:
          'Não foi possível apagar a postagem, tente novamente mais tarde.',
      });
      console.log('error', error);
    }
  };

  const handleAlert = () => {
    Alert.alert(
      'Apagar postagem?',
      'Essa é um ação definitiva. Você não será capaz de desfazer.',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        { text: 'Confirmar', onPress: handleDelete },
      ]
    );
  };

  return {
    handleAlert,
    isPending,
    theme,
  };
}
