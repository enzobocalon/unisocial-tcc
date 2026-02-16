import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { GET_CHAT_FRIENDS } from '../../services/chats/queries/getChatFriends';
import { makeGraphQLRequest } from '../../lib/graphQLClient';
import {
  AddUsersToTaskMutation,
  AddUserToAssignmentMutation,
  AddUserToChatMutation,
  BaseUser,
  BaseUserExtended,
  GetAddableUsersQuery,
  GetAssignmentFriendsQuery,
  GetChatFriendsQuery,
  SearchAddableUsersQuery,
  SearchAssignmentFriendsQuery,
  SearchChatFriendsMutation,
} from '../../__generated__/graphql';
import { useCallback, useEffect, useState } from 'react';
import { AlphabeticalFriends } from '../../types/AlphabeticalFriends';
import { SEARCH_CHAT_FRIENDS } from '../../services/chats/mutations/searchChatFriends';
import { useDebounce } from '../../hooks/useDebounce';
import Toast from 'react-native-toast-message';
import { ADD_USER_TO_CHAT } from '../../services/chats/mutations/addUser';
import { useNavigation } from '@react-navigation/native';
import { StackProps } from '../../types/Navigation';
import { GET_ASSIGNMENT_FRIENDS } from '../../services/assignments/queries/getAssignmentFriends';
import { ADD_USER_TO_ASSIGNMENT } from '../../services/assignments/mutations/addUserToAssignment';
import { GET_ADDABLE_USERS } from '../../services/assignments/queries/getAddableUsersTask';
import { ADD_USER_TO_TASK } from '../../services/assignments/mutations/addUserToTask';
import { SEARCH_ASSIGNMENT_FRIENDS } from '../../services/assignments/queries/searchAssignmentFriends';
import { SEARCH_ADDABLE_USERS } from '../../services/assignments/queries/searchAddableUsers';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from 'styled-components';

interface IUserAddable extends BaseUserExtended {
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
}

type ChatMemberData = [string, IUserAddable[]][];

export function useAddUsersToChat({
  chatId,
  assignmentId,
  taskId,
}: {
  chatId?: string;
  assignmentId?: string;
  taskId?: string;
}) {
  const theme = useTheme();
  const [data, setData] = useState<ChatMemberData>([]);
  const [searchVal, setSearchVal] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedYourself, setSelectedYourself] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<BaseUser[]>([]);
  const [hasMoreSearchPages, setHasMoreSearchPages] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchPage, setSearchPage] = useState(0);
  const navigation = useNavigation<StackProps>();
  const queryClient = useQueryClient();
  const [totalUsers, setTotalUsers] = useState(0);
  const { user } = useAuth();
  const parseData = useCallback(
    (data: AlphabeticalFriends['getAllFriendsAlphabetically']['data']) => {
      return data.map(
        (item: { letter: string; friends: BaseUserExtended[] }) => [
          item.letter,
          item.friends,
        ]
      ) as ChatMemberData;
    },
    []
  );
  const { fetchNextPage, refetch, isLoading } = useInfiniteQuery({
    queryKey: ['getChatFriends', chatId, taskId, assignmentId],
    queryFn: async ({ pageParam = 0 }) => {
      try {
        if (chatId) {
          const data = await makeGraphQLRequest<GetChatFriendsQuery>({
            document: GET_CHAT_FRIENDS,
            variables: { chatId, page: pageParam },
          });
          setTotalUsers(50 - data.getChatFriends.count);
          const parsedData = parseData(data.getChatFriends.data);
          setData((prev) =>
            pageParam === 0 ? parsedData : [...prev, ...parsedData]
          );
          return data.getChatFriends;
        }
        if (assignmentId && !taskId) {
          const data = await makeGraphQLRequest<GetAssignmentFriendsQuery>({
            document: GET_ASSIGNMENT_FRIENDS,
            variables: { assignmentId, page: pageParam },
          });
          setTotalUsers(50 - data.getAssignmentFriends.count);
          const parsedData = parseData(data.getAssignmentFriends.data);
          setData((prev) =>
            pageParam === 0 ? parsedData : [...prev, ...parsedData]
          );
          return data.getAssignmentFriends;
        }

        if (assignmentId && taskId) {
          const data = await makeGraphQLRequest<GetAddableUsersQuery>({
            document: GET_ADDABLE_USERS,
            variables: { assignmentId, page: pageParam, taskId },
          });
          setTotalUsers(50 - data.getAddableUsers.count);
          const parsedData = parseData(data.getAddableUsers.data);
          setData((prev) =>
            pageParam === 0 ? parsedData : [...prev, ...parsedData]
          );
          return data.getAddableUsers;
        }
      } catch (e: any) {
        if ('message' in e) {
          Toast.show({
            type: 'error',
            text1: 'Erro',
            text2: e.message,
          });
          navigation.goBack();
          return;
        }
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'Erro ao buscar usuários',
        });
        navigation.goBack();
      }
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.hasNextPage ? allPages.length : undefined,
    initialPageParam: 0,
  });

  async function onRefresh() {
    setRefreshing(false);
    await refetch();
  }

  const { mutateAsync: searchFn, isPending: isPendingSearchByAlph } =
    useMutation({
      mutationKey: ['searchByFriendAlph'],
      mutationFn: async ({ query, page }: { query: string; page: number }) => {
        if (chatId) {
          const data = await makeGraphQLRequest<SearchChatFriendsMutation>({
            document: SEARCH_CHAT_FRIENDS,
            variables: { page, query, chatId },
          });
          return data.searchChatFriends;
        }
        if (assignmentId && !taskId) {
          const data = await makeGraphQLRequest<SearchAssignmentFriendsQuery>({
            document: SEARCH_ASSIGNMENT_FRIENDS,
            variables: { assignmentId, page, query },
          });
          return data.searchAssignmentFriends;
        }
        if (assignmentId && taskId) {
          const data = await makeGraphQLRequest<SearchAddableUsersQuery>({
            document: SEARCH_ADDABLE_USERS,
            variables: { assignmentId, page, taskId, query },
          });
          return data.searchAddableUsers;
        }
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
      const parsedData = parseData(search?.data);

      if (page === 0) {
        setData(parsedData);
      } else {
        setData((prev) => [...prev, ...parsedData]);
      }

      setHasMoreSearchPages(search!.hasNextPage);
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

  const handleUserClick = async (cUser: BaseUser | IUserAddable) => {
    if (selectedUsers.length >= 50) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Você só pode selecionar até 50 usuários',
      });
      return;
    }
    if ('user' in cUser && cUser.user.id === user?.me.id) {
      setSelectedYourself(true);
    }
    setSelectedUsers((prev) => {
      const index = prev.findIndex((item) => item.id === cUser.id);
      if (index === -1) {
        return [...prev, cUser as BaseUser];
      }
      return prev.filter((item) => item.id !== cUser.id);
    });
  };

  const { mutateAsync: addUserToChatFn, isPending: isPendingAddUserToChat } =
    useMutation({
      mutationKey: ['addUserToChat', chatId],
      mutationFn: async ({
        chatId,
        users,
      }: {
        chatId: string;
        users: string[];
      }) => {
        const data = await makeGraphQLRequest<AddUserToChatMutation>({
          document: ADD_USER_TO_CHAT,
          variables: { chatId, users },
        });
        return data.addUserToChat;
      },
    });

  const {
    mutateAsync: addUserToAssignmentFn,
    isPending: isPendingAddUserToAssignment,
  } = useMutation({
    mutationKey: ['addUserToAssignment', assignmentId],
    mutationFn: async ({
      assignmentId,
      users,
    }: {
      assignmentId: string;
      users: string[];
    }) => {
      const data = await makeGraphQLRequest<AddUserToAssignmentMutation>({
        document: ADD_USER_TO_ASSIGNMENT,
        variables: { assignmentId, users },
      });
      return data.addUserToAssignment;
    },
  });

  const { mutateAsync: addUserToTaskFn, isPending: isPendingAddUserToTask } =
    useMutation({
      mutationKey: ['addUsersToTask', taskId],
      mutationFn: async ({
        taskId,
        users,
      }: {
        taskId: string;
        users: string[];
      }) => {
        const data = await makeGraphQLRequest<AddUsersToTaskMutation>({
          document: ADD_USER_TO_TASK,
          variables: { taskId, users },
        });
        return data.addUsersToTask;
      },
    });

  async function handleAdd() {
    if (chatId && assignmentId) return;
    const selectedUsersIds = selectedUsers.map((user) => user.id);
    if (chatId) {
      try {
        await addUserToChatFn({ chatId, users: selectedUsersIds });
        Toast.show({
          type: 'success',
          text1: 'Sucesso',
          text2: 'Usuários adicionados com sucesso',
        });
        await Promise.all([
          queryClient.refetchQueries({
            queryKey: ['chatMembers', chatId],
          }),
          queryClient.refetchQueries({ queryKey: ['activeChat', chatId] }),
        ]);

        navigation.goBack();
      } catch (e: any) {
        console.error('ADD-USERS-TO-CHAT-ERROR-CHAT', e);
        if ('message' in e) {
          Toast.show({
            type: 'error',
            text1: 'Erro',
            text2: e.message,
          });
          return;
        }
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'Erro ao adicionar usuários',
        });
      }
    } else if (assignmentId && !taskId) {
      try {
        await addUserToAssignmentFn({ assignmentId, users: selectedUsersIds });
        Toast.show({
          type: 'success',
          text1: 'Sucesso',
          text2: 'Usuários adicionados com sucesso',
        });
        await queryClient.refetchQueries({
          queryKey: ['getAssignmentUsers', assignmentId],
        });
        navigation.goBack();
        return;
      } catch (e: any) {
        console.error('ADD-USERS-TO-CHAT-ERROR-CHAT', e);
        if ('message' in e) {
          Toast.show({
            type: 'error',
            text1: 'Erro',
            text2: e.message,
          });
          return;
        }
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'Erro ao adicionar usuários',
        });
      }
    } else if (assignmentId && taskId) {
      try {
        if (selectedUsersIds.length >= 50) {
          Toast.show({
            type: 'error',
            text1: 'Erro',
            text2: 'Você só pode selecionar até 50 usuários',
          });
          return;
        }
        await addUserToTaskFn({ taskId, users: selectedUsersIds });
        Toast.show({
          type: 'success',
          text1: 'Sucesso',
          text2: 'Usuários adicionados com sucesso',
        });
        await queryClient.refetchQueries({
          queryKey: ['taskMembers', taskId],
        });
        if (user && selectedYourself) {
          await Promise.all([
            queryClient.refetchQueries({
              queryKey: ['getAllTasksByAssignmentId', { assignmentId }],
            }),
            queryClient.refetchQueries({
              queryKey: ['getUserTasksByAssignmentId', { assignmentId }],
            }),
            queryClient.refetchQueries({
              queryKey: ['allAssignments'],
            }),
          ]);
        }
        setSelectedYourself(false);
        navigation.goBack();
        return;
      } catch (e: any) {
        console.error('ADD-USERS-TO-TASK-ERROR-CHAT', e);
        if ('message' in e) {
          Toast.show({
            type: 'error',
            text1: 'Erro',
            text2: e.message,
          });
          return;
        }
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'Erro ao adicionar usuários',
        });
      }
    }
  }

  return {
    data,
    fetchNextPage,
    searchVal,
    setSearchVal,
    isSearchOpen,
    setIsSearchOpen,
    selectedUsers,
    handleUserClick,
    hasMoreSearchPages,
    handleSearch,
    searchPage,
    handleAdd,
    theme,
    refreshing,
    onRefresh,
    isLoading,
    isPendingAddUserToAssignment,
    isPendingAddUserToChat,
    isPendingAddUserToTask,
    isPendingSearchByAlph,
    totalUsers,
  };
}
