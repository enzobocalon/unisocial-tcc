import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import {
  BaseUser,
  GetAllFriendsAlphabeticallyQuery,
  GetCategorizedTaskUsersQuery,
  SearchFriendsAlphabeticallyMutation,
} from '../../../../../__generated__/graphql';
import { useDebounce } from '../../../../../hooks/useDebounce';
import { makeGraphQLRequest } from '../../../../../lib/graphQLClient';
import { SEARCH_FRIENDS_ALPHABETICALLY } from '../../../../../services/friendship/queries/searchFriendsAlphabetical';
import { GET_ALL_FRIENDS_ALPHABETICALLY } from '../../../../../services/friendship/queries/getAllFriendsAlphabetical';
import { AlphabeticalFriends } from '../../../../../types/AlphabeticalFriends';
import { useTheme } from 'styled-components';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackProps } from '../../../../../types/Navigation';
import Toast from 'react-native-toast-message';
import { GET_CATEGORIZED_TASK_USERS } from '../../../../../services/assignments/queries/getCategorizedTaskUsers';

interface IUser extends BaseUser {
  user: BaseUser;
}

type IAlphabeticalFriends = [string, IUser[]][];

export function useUserSelection(
  isAssignment: boolean,
  isTask: boolean,
  assignmentId: string | undefined,
  reset: boolean | undefined
) {
  const [refreshing, setRefreshing] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState<string | null>(null);
  const [data, setData] = useState<IAlphabeticalFriends>([]);
  const [selectedUsers, setSelectedUsers] = useState<BaseUser[]>([]);
  const [hasMoreSearchPages, setHasMoreSearchPages] = useState(true);
  const [searchPage, setSearchPage] = useState(0);
  const navigation = useNavigation<StackProps>();
  const theme = useTheme();
  const parseData = useCallback(
    (data: AlphabeticalFriends['getAllFriendsAlphabetically']['data']) => {
      return data.map((item: { letter: string; friends: IUser[] }) => [
        item.letter,
        item.friends,
      ]);
    },
    []
  );
  const { isLoading, fetchNextPage, refetch } = useInfiniteQuery({
    queryKey: ['allFriends', isTask, isAssignment, assignmentId],
    queryFn: async ({ pageParam = 0 }) => {
      if (!isTask) {
        const response =
          await makeGraphQLRequest<GetAllFriendsAlphabeticallyQuery>({
            document: GET_ALL_FRIENDS_ALPHABETICALLY,
            variables: { page: pageParam },
          });

        const parsedData = parseData(response.getAllFriendsAlphabetically.data);
        setData((prev) =>
          pageParam === 0 ? parsedData : [...prev, ...parsedData]
        );
        return response.getAllFriendsAlphabetically;
      } else {
        const response = await makeGraphQLRequest<GetCategorizedTaskUsersQuery>(
          {
            document: GET_CATEGORIZED_TASK_USERS,
            variables: { page: pageParam, assignmentId },
          }
        );

        const parsedData = parseData(response.getCategorizedTaskUsers.data);
        setData((prev) =>
          pageParam === 0 ? parsedData : [...prev, ...parsedData]
        );
        return response.getCategorizedTaskUsers;
      }
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasNextPage ? allPages.length : undefined,
    initialPageParam: 0,
  });

  const handleUserClick = async (user: BaseUser) => {
    if (selectedUsers.length >= 50) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Você só pode selecionar até 50 usuários',
      });
      return;
    }
    setSelectedUsers((prev) => {
      const index = prev.findIndex((item) => item.id === user.id);
      if (index === -1) {
        return [...prev, user];
      }
      return prev.filter((item) => item.id !== user.id);
    });
  };

  const { mutateAsync: searchFn } = useMutation({
    mutationKey: ['searchByFriendAlph'],
    mutationFn: async ({ query, page }: { query: string; page: number }) => {
      const data =
        await makeGraphQLRequest<SearchFriendsAlphabeticallyMutation>({
          document: SEARCH_FRIENDS_ALPHABETICALLY,
          variables: { page, value: query },
        });
      return data.searchFriendsAlphabetically;
    },
  });

  const handleSearch = useCallback(
    async (query: string, page: number = 0) => {
      if (query === '') {
        setData([]);
        setSearchPage(0);
        setHasMoreSearchPages(true);
        await refetch();
        return;
      }

      const search = await searchFn({ query, page });
      const parsedData = parseData(search.data);

      if (page === 0) {
        setData(parsedData);
      } else {
        setData((prev) => [...prev, ...parsedData]);
      }

      setHasMoreSearchPages(search.hasNextPage);
      setSearchPage(page);
    },
    [searchFn, parseData, refetch]
  );

  const debouncedValue = useDebounce(searchVal, 500);

  useEffect(() => {
    if (debouncedValue !== null) {
      handleSearch(debouncedValue, 0);
    }
  }, [debouncedValue]);

  const handleNextPage = () => {
    if (selectedUsers.length > 49) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Você só pode selecionar até 50 usuários',
      });
      return;
    }

    if (selectedUsers.length <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Você precisa selecionar ao menos 1 usuário',
      });
      return;
    }

    if (!assignmentId) {
      navigation.navigate('GroupInfo', {
        members: selectedUsers,
        isAssignment,
      });
      return;
    }
    navigation.navigate('NewTask', {
      selectedUsers: selectedUsers.map((i) => i.id),
      assignmentId,
    });
  };

  async function onRefresh() {
    await refetch();
    setRefreshing(false);
  }

  useFocusEffect(
    useCallback(() => {
      if (reset) {
        setSelectedUsers([]);

        navigation.setParams({ reset: false });
      }
    }, [reset])
  );

  return {
    searchVal,
    setSearchVal,
    data,
    isLoading,
    handleUserClick,
    fetchNextPage,
    isSearchOpen,
    setIsSearchOpen,
    selectedUsers,
    theme,
    handleNextPage,
    hasMoreSearchPages,
    handleSearch,
    searchPage,
    refreshing,
    onRefresh,
  };
}
