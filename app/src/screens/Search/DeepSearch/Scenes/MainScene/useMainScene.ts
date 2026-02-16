import { useInfiniteQuery } from '@tanstack/react-query';
import { SearchQuery } from '../../../../../__generated__/graphql';
import { PAGE_SIZE } from '../../../../../lib/constants';
import { makeGraphQLRequest } from '../../../../../lib/graphQLClient';
import { SEARCH } from '../../../../../services/search/query/getSearch';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { useMemo, useState } from 'react';
import { useFocusedTab } from 'react-native-collapsible-tab-view';
import { useScreenTransition } from '../../../../../hooks/useScreenTransition';
import { StackProps } from '../../../../../types/Navigation';

export function useMainScene(query: string, enableQuery = true) {
  const navigation = useNavigation<StackProps>();
  const theme = useTheme();
  const focused = useFocusedTab();
  const [refreshing, setRefreshing] = useState(false);
  const { transitionFinished } = useScreenTransition();
  const { data, isLoading, fetchNextPage, hasNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ['mainSearchScene', query],
      queryFn: async ({ pageParam: page }) => {
        try {
          if (!query) return;
          const { search: data } = await makeGraphQLRequest<SearchQuery>({
            document: SEARCH,
            variables: {
              query,
              page: page,
            },
          });
          return data;
        } catch (e) {
          console.log(e);
        }
      },
      initialPageParam: 0,
      staleTime: 0,
      enabled:
        !!query && focused === 'BUSCAS' && enableQuery && transitionFinished,
      getNextPageParam: (lastPage, pages) => {
        if (
          !lastPage ||
          !lastPage.posts ||
          lastPage.posts.length < PAGE_SIZE ||
          !pages ||
          !pages.length
        ) {
          return undefined;
        }
        return pages.length + 1;
      },
    });

  const users = useMemo(() => {
    return data?.pages.flatMap((page) => page?.users) || [];
  }, [data]);

  const posts = useMemo(() => {
    return data?.pages.flatMap((page) => page?.posts) || [];
  }, [data]);

  async function onRefresh() {
    await refetch();
    setRefreshing(false);
  }

  return {
    data,
    users,
    posts,
    isLoading: !transitionFinished || isLoading,
    fetchNextPage,
    hasNextPage,
    theme,
    navigation,
    refreshing,
    onRefresh,
  };
}
