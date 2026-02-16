import Toast from 'react-native-toast-message';
import { GQLErrors } from '../../../lib/errors';
import { useNavigation } from '@react-navigation/native';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useTheme } from 'styled-components';
import {
  BaseUser,
  GetAllFriendsAlphabeticallyQuery,
  CreateChatMutationVariables,
  CreateChatMutation,
  GetChatByUserMemberQuery,
  SearchFriendsAlphabeticallyMutation,
} from '../../../__generated__/graphql';
import { makeGraphQLRequest } from '../../../lib/graphQLClient';
import { CREATE_CHAT } from '../../../services/chats/mutations/createChat';
import { GET_CHAT_BY_USER } from '../../../services/chats/queries/getChatByUserMember';
import { GET_ALL_FRIENDS_ALPHABETICALLY } from '../../../services/friendship/queries/getAllFriendsAlphabetical';
import {
  AlphabeticalFriendsData,
  AlphabeticalFriends,
} from '../../../types/AlphabeticalFriends';
import { StackProps } from '../../../types/Navigation';
import { SEARCH_FRIENDS_ALPHABETICALLY } from '../../../services/friendship/queries/searchFriendsAlphabetical';
import { useDebounce } from '../../../hooks/useDebounce';

export function useNewChat() {
  const theme = useTheme();
  const navigation = useNavigation<StackProps>();
  const [searchVal, setSearchVal] = useState<string | null>(null);
  const [data, setData] = useState<AlphabeticalFriendsData>([]);
  const [hasMoreSearchPages, setHasMoreSearchPages] = useState(true);
  const [searchPage, setSearchPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const isFirstRender = useRef(true);
  const [clickedUser, setClickedUser] = useState<string | null>(null);
  const parseData = useCallback(
    (data: AlphabeticalFriends['getAllFriendsAlphabetically']['data']) => {
      return data.map((item: { letter: string; friends: BaseUser[] }) => [
        item.letter,
        item.friends,
      ]);
    },
    []
  );
  const { isLoading, fetchNextPage, refetch } = useInfiniteQuery({
    queryKey: ['allFriends'],
    queryFn: async ({ pageParam = 0 }) => {
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
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasNextPage ? allPages.length : undefined,
    initialPageParam: 0,
  });

  const { mutateAsync: createChat, isPending: isPendingCreateChat } =
    useMutation({
      mutationKey: ['createChat'],
      mutationFn: async (users: CreateChatMutationVariables['users']) => {
        const response = await makeGraphQLRequest<CreateChatMutation>({
          document: CREATE_CHAT,
          variables: { users, type: 'PRIVATE', isDirect: true },
        });
        return response.createChat;
      },
    });

  const handleChatClick = async (id: string) => {
    try {
      setClickedUser(id);
      const { getChatByUserMember: chat } =
        await makeGraphQLRequest<GetChatByUserMemberQuery>({
          document: GET_CHAT_BY_USER,
          variables: { userId: id },
        });
      navigation.navigate('Chat', { chatId: chat.id });
    } catch (error: any) {
      if (
        error instanceof GQLErrors &&
        error.message === 'Chat não encontrado.'
      ) {
        try {
          const newChat = await createChat([id]);
          navigation.navigate('Chat', { chatId: newChat.id });
        } catch (innerError) {
          Toast.show({
            type: 'error',
            text1: 'Erro ao criar o chat.',
            text2:
              innerError instanceof GQLErrors
                ? innerError.message
                : 'Erro interno. Tente novamente mais tarde.',
          });
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro ao abrir o chat.',
          text2: error.message,
        });
      }
    } finally {
      setClickedUser(null);
    }
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

  useEffect(() => {
    if (!fetchNextPage) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchNextPage();
      return;
    }
  }, [fetchNextPage]);

  const onRefresh = async () => {
    setRefreshing(false);
    await refetch();
  };

  return {
    data,
    theme,
    isLoading,
    searchVal,
    setSearchVal,
    handleChatClick,
    fetchNextPage,
    navigation,
    handleSearch,
    hasMoreSearchPages,
    searchPage,
    refreshing,
    onRefresh,
    isPendingCreateChat,
    clickedUser,
  };
}
