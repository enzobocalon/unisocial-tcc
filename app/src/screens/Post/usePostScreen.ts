import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { makeGraphQLRequest } from '../../lib/graphQLClient';
import { GET_POST_BY_ID } from '../../services/posts/queries/getPost';
import { GET_REPLIES } from '../../services/posts/queries/getReplies';
import { Post, PostByIdQuery, RepliesQuery } from '../../__generated__/graphql';
import { useCallback, useState } from 'react';
import { useReplies } from '../../components/Post/Replies/useReplies';
import { useFocusEffect } from '@react-navigation/native';

export function usePostScreen(postId: string) {
  const [repliesCount, setRepliesCount] = useState(0);
  const {
    data: post,
    isLoading: isLoadingPost,
    isRefetching: isRefetchingPost,
    refetch: refetchPost,
  } = useQuery({
    queryKey: ['postScreen', 'post', postId],
    queryFn: async () => {
      try {
        const { postById: post } = await makeGraphQLRequest<PostByIdQuery>({
          document: GET_POST_BY_ID,
          variables: { id: postId },
        });
        setRepliesCount(post.replies);
        return post;
      } catch (e) {
        console.log(e);
      }
    },
  });
  const {
    data: replies,
    isLoading: isLoadingReplies,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isRefetching: isRefetchingReplies,
    refetch: refetchReplies,
  } = useInfiniteQuery({
    queryKey: ['postScreen', 'replies', postId],
    queryFn: async ({ pageParam }) => {
      try {
        const { replies } = await makeGraphQLRequest<RepliesQuery>({
          document: GET_REPLIES,
          variables: { postId, page: pageParam },
        });
        return replies;
      } catch (e) {
        console.log(e);
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage && lastPage.length > 0) {
        return allPages.length;
      }
      return undefined;
    },
    initialPageParam: 0,
    enabled: false,
  });

  useFocusEffect(
    useCallback(() => {
      refetchPost();
      refetchReplies();
    }, [postId])
  );

  const {
    handleEdit,
    handleSubmit,
    editing,
    onSourceChange,
    control,
    setParent,
    renderSuggestions,
    inputRef,
    handleReplySelection,
    handleGallery,
    parent,
    selectedImages,
    loading,
    isPending,
  } = useReplies(null, (post as Post) || {}, setRepliesCount, 'postScreen');
  return {
    post: post,
    replies: replies?.pages.flatMap((page) => page) || [],
    isLoadingPost: isLoadingPost || isRefetchingPost,
    isLoadingReplies: isLoadingReplies || isRefetchingReplies,
    isLoadingRepliesHook: loading,
    repliesCount,
    setRepliesCount,
    handleEdit,
    handleSubmit,
    editing,
    onSourceChange,
    control,
    setParent,
    renderSuggestions,
    inputRef,
    handleReplySelection,
    handleGallery,
    parent,
    selectedImages,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isPending,
  };
}
