import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTheme } from 'styled-components';
import { useDebounce } from '../../hooks/useDebounce';
import { makeGraphQLRequest } from '../../lib/graphQLClient';
import {
  GetUsersByIdQuery,
  SearchUsersQuery,
} from '../../__generated__/graphql';
import { useNavigation } from '@react-navigation/native';
import { StackProps } from '../../types/Navigation';
import { storage } from '../../lib/storage';
import { GET_USERS_BY_ID } from '../../services/users/query/getUsersById';
import { SEARCH_USERS } from '../../services/search/query/getSearchUsers';

type History = {
  users: string[];
  posts: string[];
};

export function useSearch(enableQueries = true) {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const navigate = useNavigation<StackProps>();
  const debouncedSearch = useDebounce(search, 500);
  const [history, setHistory] = useState<History>(() => {
    const history = storage.getString('history');
    if (history) {
      return JSON.parse(history);
    }
    return { users: [], posts: [] };
  });
  const { data, isLoading } = useQuery({
    queryKey: ['search', debouncedSearch],
    queryFn: async () => {
      const { searchUsers: data } = await makeGraphQLRequest<SearchUsersQuery>({
        document: SEARCH_USERS,
        variables: {
          query: debouncedSearch,
          page: 0,
        },
      });
      return data;
    },
    enabled: !!debouncedSearch && enableQueries,
    staleTime: 0,
  });

  const { data: usersData } = useQuery({
    queryKey: ['search', history.users],
    queryFn: async () => {
      const { getUsersById: data } =
        await makeGraphQLRequest<GetUsersByIdQuery>({
          document: GET_USERS_BY_ID,
          variables: {
            ids: history.users,
            page: 0,
          },
        });
      return data;
    },
    enabled: !!history.users.length && enableQueries,
  });

  const onSearchSubmit = (query: string) => {
    if (!query || !query.trim()) return;
    const currentHistory: History = JSON.parse(
      storage.getString('history') || '{"posts": [], "users": []}'
    );
    if (!currentHistory['posts'].includes(search)) {
      currentHistory['posts'].push(search);
    }
    storage.set('history', JSON.stringify(currentHistory));
    setHistory(currentHistory);

    navigate.push('DeepSearch', { query });
  };

  const storeUserHistory = (id: string) => {
    const currentHistory: History = JSON.parse(
      storage.getString('history') || '{"posts": [], "users": []}'
    );
    if (!currentHistory['users'].includes(id)) {
      currentHistory['users'].push(id);
    }
    storage.set('history', JSON.stringify(currentHistory));
    setHistory(currentHistory);

    navigate.navigate('UserProfile', {
      userId: id,
    });
  };

  const clearHistory = () => {
    storage.delete('history');
    setHistory({ users: [], posts: [] });
  };

  return {
    theme,
    search,
    setSearch,
    data,
    isLoading,
    onSearchSubmit,
    storeUserHistory,
    clearHistory,
    usersData,
    history,
    navigate,
  };
}
