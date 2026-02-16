import { LIKE_POST } from '../../../services/posts/mutations/likePost';
import { useCallback, useImperativeHandle, useRef, useState } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { PostActionsRef, ReplyRef } from '../../../types/Refs';
import { UNLIKE_POST } from '../../../services/posts/mutations/unlikePost';
import {
  LikePostMutation,
  Post,
  SharePostMutation,
  TimelineQuery,
  UnlikePostMutation,
  UnsharePostMutation,
} from '../../../__generated__/graphql';
import Toast from 'react-native-toast-message';
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { makeGraphQLRequest } from '../../../lib/graphQLClient';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { StackProps } from '../../../types/Navigation';
import { SHARE_POST } from '../../../services/posts/mutations/sharePost';
import { UNSHARE_POST } from '../../../services/posts/mutations/unsharePost';
import { useTheme } from 'styled-components';

interface Setters {
  setLikes: React.Dispatch<React.SetStateAction<number>>;
  setShares: React.Dispatch<React.SetStateAction<number>>;
  setReplies: React.Dispatch<React.SetStateAction<number>>;
}

export function usePostActions(
  ref: React.Ref<PostActionsRef>,
  post: Post,
  { setLikes, setReplies, setShares }: Setters,
  postKey?: string | null
) {
  const replyRef = useRef<ReplyRef>(null);
  const innerShareId = useRef<string | null>(null);
  const bottomShareRef = useRef<BottomSheetModal>(null);
  const sharesListBottomRef = useRef<BottomSheetModal>(null);
  const likeBottomSheetRef = useRef<BottomSheetModal>(null);
  const [liked, setLiked] = useState(post.liked);
  const [shared, setShared] = useState(post.shared);
  const navigation = useNavigation<StackProps>();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const route = useRoute();

  const { mutateAsync: likeFn, isPending: isPendingLike } = useMutation({
    mutationFn: async () => {
      return makeGraphQLRequest<LikePostMutation>({
        document: LIKE_POST,
        variables: { postId: post.id },
      });
    },
  });
  const { mutateAsync: unlikeFn, isPending: isPendingUnlike } = useMutation({
    mutationFn: async () => {
      return makeGraphQLRequest<UnlikePostMutation>({
        document: UNLIKE_POST,
        variables: { postId: post.id },
      });
    },
  });

  const { mutateAsync: shareFn, isPending: isPendingShare } = useMutation({
    mutationFn: async () => {
      try {
        const { share: data } = await makeGraphQLRequest<SharePostMutation>({
          document: SHARE_POST,
          variables: { parentId: post.id, content: null, medias: [] },
        });
        innerShareId.current = data.id;
        return data;
      } catch (e) {
        console.log(e);
      }
    },
  });

  const { mutateAsync: unshareFn, isPending: isPendingUnshare } = useMutation({
    mutationFn: async () => {
      try {
        const { unshare: data } = await makeGraphQLRequest<UnsharePostMutation>(
          {
            document: UNSHARE_POST,
            variables: {
              postId: post.id || postKey || innerShareId.current,
            },
          }
        );
        return data;
      } catch (e) {
        console.log(e);
      }
    },
  });

  useImperativeHandle(ref, () => {
    return {
      openReply() {
        replyRef.current?.present();
      },
      openLikes() {
        likeBottomSheetRef.current?.present();
      },
      openSharesList() {
        sharesListBottomRef.current?.present();
      },
    };
  });

  async function handleOnPressLike() {
    try {
      const isLiking = !liked;
      let data;

      if (isLiking) {
        const response = await likeFn();
        data = response.likePost;
        if (!data.success)
          throw new Error(data.message || 'Falha ao curtir a publicação');
      } else {
        const response = await unlikeFn();
        data = response.unlikePost;
        if (!data.success)
          throw new Error(data.message || 'Falha ao descurtir a publicação');
      }

      // Atualiza estados locais
      setLiked(isLiking);
      setLikes((prev) => (isLiking ? prev + 1 : prev - 1));

      // Atualiza cache da timeline
      queryClient.setQueryData<InfiniteData<TimelineQuery>>(
        ['timeline'],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              timeline: page.timeline.map((p) =>
                p.id === post.id
                  ? {
                      ...p,
                      likes: (p.likes || 0) + (isLiking ? 1 : -1),
                      liked: isLiking,
                    }
                  : p
              ),
            })),
          };
        }
      );

      if (
        (route.name === 'Profile' || route.name === 'UserProfile') &&
        route.params &&
        'userId' in route.params
      ) {
        queryClient.refetchQueries({
          queryKey: ['profile', 'likes', route.params.userId],
        });
      }
    } catch (error) {
      const message = (error as Error).message;

      Toast.show({
        type: 'error',
        text1: liked ? 'Falha ao descurtir' : 'Falha ao curtir',
        text2: message || 'Tente novamente mais tarde.',
      });

      // Tratativa específica
      if (message.includes('Post não curtido')) setLiked(false);
      if (message.includes('Post já curtido')) setLiked(true);
    }
  }

  function updateShares(isSharing: boolean, count: number) {
    setShared(isSharing);
    setShares(count);

    queryClient.setQueryData<InfiniteData<TimelineQuery>>(
      ['timeline'],
      (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            timeline: page.timeline.map((p) =>
              p.id === post.id ? { ...p, shared: isSharing, shares: count } : p
            ),
          })),
        };
      }
    );
  }

  async function handleShare() {
    try {
      const isSharing = !shared;

      if (isSharing) {
        // Compartilhar
        await shareFn();
        updateShares(true, (post.shares || 0) + 1);
      } else {
        await unshareFn();
        updateShares(false, Math.max(0, (post.shares || 1) - 1));
      }

      Toast.show({
        type: 'success',
        text1: isSharing
          ? 'Publicação compartilhada'
          : 'Publicação descompartilhada',
      });

      bottomShareRef.current?.close();
    } catch (error) {
      console.error('ERROR-SHARE', error);
      const isSharing = !shared;
      Toast.show({
        type: 'error',
        text1: isSharing ? 'Falha ao compartilhar' : 'Falha ao descompartilhar',
        text2: (error as Error).message,
      });
    }
  }

  useFocusEffect(
    useCallback(() => {
      // Atualizar estados locais com os valores mais recentes do post
      setLiked(post.liked);
      setShared(post.shared);
      setLikes(post.likes);
      setShares(post.shares);
      setReplies(post.replies);
    }, [post.liked, post.shared, post.likes, post.shares, post.replies])
  );

  return {
    bottomShareRef,
    handleOnPressLike,
    liked,
    likeBottomSheetRef,
    replyRef,
    sharesListBottomRef,
    shared,
    navigation,
    handleShare,
    isPendingLike,
    isPendingUnlike,
    isPendingShare,
    isPendingUnshare,
    theme,
  };
}
