import { useInfiniteQuery } from '@tanstack/react-query';
import { makeGraphQLRequest } from '../../../../../lib/graphQLClient';
import { SEARCH_USERS } from '../../../../../services/search/query/getSearchUsers';
import { SearchUsersQuery } from '../../../../../__generated__/graphql';
import { PAGE_SIZE } from '../../../../../lib/constants';
import { useTheme } from 'styled-components';
import { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useFocusedTab } from 'react-native-collapsible-tab-view';
import { StackProps } from '../../../../../types/Navigation';

export function useUsersScene(query: string) {
  const theme = useTheme();
  const navigation = useNavigation<StackProps>();
  const focused = useFocusedTab();
  const [refreshing, setRefreshing] = useState(false);
  const { data, isLoading, refetch } = useInfiniteQuery({
    queryKey: ['searchUsers', query],
    initialPageParam: 0,
    queryFn: async ({ pageParam: page }) => {
      if (!query) return;
      try {
        const { searchUsers: data } =
          await makeGraphQLRequest<SearchUsersQuery>({
            document: SEARCH_USERS,
            variables: {
              query,
              page,
            },
          });
        return data;
      } catch (e) {
        console.log('usersScene error', e);
      }
    },
    enabled: !!query && focused === 'PESSOAS',
    getNextPageParam: (lastPage, pages) => {
      if (
        !lastPage ||
        !lastPage.length ||
        lastPage?.length < PAGE_SIZE ||
        !pages ||
        !pages.length
      ) {
        return undefined;
      }
      return pages.length + 1;
    },
  });

  const users = useMemo(() => data?.pages.flatMap((page) => page), [data]);

  async function onRefresh() {
    await refetch();
    setRefreshing(false);
  }

  return {
    data,
    isLoading,
    theme,
    users,
    navigation,
    refreshing,
    onRefresh,
  };
}
