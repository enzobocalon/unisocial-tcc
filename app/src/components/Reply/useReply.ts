import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { makeGraphQLRequest } from '../../lib/graphQLClient';
import {
  GetChildrenRepliesQuery,
  LikePostMutation,
  Reply,
  UnlikePostMutation,
} from '../../__generated__/graphql';
import { LIKE_REPLY } from '../../services/posts/mutations/likeReply';
import { useCallback, useEffect, useState } from 'react';
import { UNLIKE_REPLY } from '../../services/posts/mutations/unlikeReply';
import { GET_CHILDREN_REPLIES } from '../../services/posts/queries/getReplies';
import { useMention } from '../../hooks/useMention';
import { useAuth } from '../../context/AuthContext';
import { PAGE_SIZE } from '../../lib/constants';
import { useNavigation } from '@react-navigation/native';
import { StackProps } from '../../types/Navigation';

export function useReply(reply: Reply, queryKey: string = 'timeline') {
  const [liked, setLiked] = useState(reply?.liked || false);
  const [likes, setLikes] = useState(reply?.likes || 0);
  const [hasMoreData, setHasMoreData] = useState(reply.replies > 0);
  const [fetchNext, setFetchNext] = useState(false);
  const navigation = useNavigation<StackProps>();
  const [openReplyPopup, setOpenReplyPopup] = useState(false);
  const { replaceMetaTag } = useMention();
  const { user } = useAuth();
  const [contentWidth, setContentWidth] = useState(0);
  const { mutateAsync: likeFn, isPending: isPendingLike } = useMutation({
    mutationFn: async () => {
      return await makeGraphQLRequest<LikePostMutation>({
        document: LIKE_REPLY,
        variables: {
          replyId: reply.id,
        },
      });
    },
  });
  const { mutateAsync: unlikeFn, isPending: isPendingUnlike } = useMutation({
    mutationFn: async () => {
      return await makeGraphQLRequest<UnlikePostMutation>({
        document: UNLIKE_REPLY,
        variables: {
          replyId: reply.id,
        },
      });
    },
  });

  const onLikeReply = async () => {
    try {
      if (liked) {
        await unlikeFn();
        setLiked(false);
        setLikes((prev) => prev - 1);
        return;
      }
      await likeFn();
      setLiked(true);
      setLikes((prev) => prev + 1);
    } catch (e) {
      console.log(e);
    }
  };

  const { data, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: [queryKey, 'getChildrenReplies', reply?.id],
    queryFn: async ({ pageParam }) => {
      const { getChildrenReplies: scopedData } =
        await makeGraphQLRequest<GetChildrenRepliesQuery>({
          document: GET_CHILDREN_REPLIES,
          variables: {
            postId: reply.postId,
            replyId: reply.id,
            page: pageParam,
          },
        });

      return scopedData;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || !lastPage.length || lastPage.length < PAGE_SIZE) {
        return undefined;
      }
      return allPages.length;
    },
    initialPageParam: 0,
    enabled: fetchNext,
  });

  useEffect(() => {
    if (reply.replies > 0) {
      setHasMoreData(true);
    }
  }, [reply.replies]);

  const handlePopUpClose = useCallback(() => {
    setOpenReplyPopup(false);
  }, []);

  const handlePopUpOpen = useCallback(() => {
    setOpenReplyPopup(true);
  }, []);

  return {
    liked,
    likes,
    data: data?.pages.flatMap((page) => page) || [],
    onLikeReply,
    hasMoreData,
    replaceMetaTag,
    user,
    openReplyPopup,
    handlePopUpClose,
    handlePopUpOpen,
    fetchNextPage,
    hasNextPage,
    setFetchNext,
    navigation,
    setContentWidth,
    contentWidth,
    isPendingLike,
    isPendingUnlike,
  };
}
