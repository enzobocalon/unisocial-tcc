import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { makeGraphQLRequest } from '../../../../lib/graphQLClient';
import { useFocusedTab } from 'react-native-collapsible-tab-view';
import { useEffect, useState } from 'react';
import { useTheme } from 'styled-components';
import { useScreenTransition } from '../../../../hooks/useScreenTransition';
import { PAGE_SIZE } from '../../../../lib/constants';
import { GET_LIKED_POSTS_BY_USER } from '../../../../services/posts/queries/getPostsLikesByUser';
import { GET_POST_MEDIA_BY_USER } from '../../../../services/posts/queries/getPostMediaByUser';
import { GET_POST_BY_USER } from '../../../../services/posts/queries/getPostsByUser';

export function useProfilePosts(
  type: 'POSTS' | 'LIKES' | 'MEDIAS',
  userId: string,
  onHeaderRefresh: () => void
) {
  const theme = useTheme();
  const focusedTab = useFocusedTab();
  const { transitionFinished } = useScreenTransition();

  const [refreshing, setRefreshing] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const queryMap = {
    POSTS: { queryKey: ['profile', 'posts', userId], query: GET_POST_BY_USER },
    LIKES: {
      queryKey: ['profile', 'likes', userId],
      query: GET_LIKED_POSTS_BY_USER,
    },
    MEDIAS: {
      queryKey: ['profile', 'medias', userId],
      query: GET_POST_MEDIA_BY_USER,
    },
  }[type];

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: queryMap.queryKey,
    queryFn: async ({ pageParam: page }) => {
      try {
        const response = await makeGraphQLRequest({
          document: queryMap.query,
          variables: { id: userId, page, getShare: type !== 'MEDIAS' },
        });
        if (!hasFetched) setHasFetched(true);
        return (
          response?.[Object.keys(response)[0] as keyof typeof response] ?? []
        );
      } catch (e) {
        console.error(e);
        return [];
      }
    },
    getNextPageParam: (lastPage, pages) =>
      lastPage?.length < PAGE_SIZE ? undefined : pages.length,
    initialPageParam: 0,
    enabled: true,
    staleTime: 0,
    refetchOnMount: true,
    placeholderData: keepPreviousData,
  });

  async function onRefresh() {
    setRefreshing(true);
    await Promise.all([onHeaderRefresh(), refetch()]);
    setRefreshing(false);
  }

  useEffect(() => {
    if (type === focusedTab && hasFetched) {
      refetch();
    }
  }, [focusedTab, type, hasFetched, refetch]);

  return {
    data: data?.pages.flat() || [],
    isLoading: !transitionFinished || isLoading || isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refreshing,
    onRefresh,
    theme,
    hasFetched,
  };
}
