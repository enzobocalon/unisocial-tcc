import {
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { makeGraphQLRequest } from '../../../lib/graphQLClient';
import {
  ChatMessageSub,
  GetAllChatsQuery,
} from '../../../__generated__/graphql';
import { GET_CHATS } from '../../../services/chats/queries/getAllChats';
import { PAGE_SIZE } from '../../../lib/constants';
import { useSubscription } from '../../../hooks/useSubscription';
import { CHATS_SUB } from '../../../services/chats/subscriptions/chats';
import { useFriendsStatus } from '../../../hooks/useFriendStatus';
import { useNavigation } from '@react-navigation/native';
import { StackProps } from '../../../types/Navigation';
import { useTheme } from 'styled-components';
import { useAuth } from '../../../context/AuthContext';
import { useState } from 'react';
import { useRefetchOnAppFocus } from '../../../hooks/useRefetchOnAppFocus';

export function useChats() {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const navigation = useNavigation<StackProps>();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const { data, refetch, isLoading } = useInfiniteQuery({
    queryKey: ['allChats'],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const data = await makeGraphQLRequest<GetAllChatsQuery>({
        document: GET_CHATS,
        variables: {
          page: pageParam,
        },
      });
      return data.getAllChats;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length; // próxima página
    },
    refetchOnMount: 'always',
    staleTime: 0,
  });

  const handleChatsAndData = (
    values: { chats: ChatMessageSub } | null,
    statusUpdate?: {
      userId: string;
      online: boolean;
    }
  ) => {
    queryClient.setQueryData(
      ['allChats'],
      (oldData: InfiniteData<GetAllChatsQuery['getAllChats']>) => {
        if (!oldData?.pages) return oldData;

        // Mapeando as páginas para criar novas referências
        const updatedPages = oldData.pages?.map((page, pageIndex) => {
          if (!page) return [];
          if (statusUpdate) {
            // Atualizando o status do usuário online/offline
            return page.map((item) => {
              if (item.chat.directUserMember === statusUpdate.userId) {
                return {
                  ...item,
                  chat: {
                    ...item.chat,
                    isOnline: statusUpdate.online, // Mantendo o status online do usuário
                  },
                };
              }
              return item;
            });
          }

          if (values) {
            if (
              (values?.chats.chatAction?.action === 'REMOVE' ||
                values?.chats.chatAction?.action === 'LEAVE') &&
              user?.me.id === values?.chats.chatAction?.user?.id
            ) {
              return page.filter(
                (item) => item.chat.id !== values?.chats.chat.id
              );
            }
            const newChat = values.chats;
            const chatIndex = page.findIndex(
              (item) => item.chat.id === newChat.chat.id
            );
            if (chatIndex !== -1) {
              const chat = page[chatIndex];
              if (values.chats.message?.deletedAt) {
                if (chat.message && chat.message.id !== values.chats.message.id)
                  return page;
                refetch();
              }

              page[chatIndex] = {
                ...page[chatIndex],
                chat: {
                  ...page[chatIndex].chat,
                  name: newChat.chat.name || chat.chat.name,
                  icon: newChat.chat.icon || chat.chat.icon,
                  id: newChat.chat.id,
                  isOnline: chat.chat.isOnline,
                  unreadMessages:
                    chat.message?.user.id === user?.me.id
                      ? 0
                      : chat && chat.chat.unreadMessages
                        ? chat.chat.unreadMessages + 1
                        : 1,
                },
              };
              if (
                chat.message &&
                newChat.message &&
                chat.message?.createdAt > newChat.message?.createdAt
              ) {
                return page;
              }
              // Remove o chat da posição antiga e coloca no topo da primeira página
              const updatedPage = [...page];
              updatedPage.splice(chatIndex, 1);
              updatedPage.unshift({
                ...newChat,
                chat: {
                  ...newChat.chat,
                  isOnline: chat.chat.isOnline,
                  icon: newChat.chat.icon || chat.chat.icon,
                  unreadMessages:
                    newChat.message?.user.id !== user?.me.id // Se a mensagem **não** foi enviada pelo próprio usuário
                      ? (chat.chat.unreadMessages || 0) + 1 // Então incrementa o contador
                      : chat.chat.unreadMessages || 0, // Caso contrário, mantém o valor atual
                },
              });
              return updatedPage;
            } else if (pageIndex === 0) {
              // se o chat não existir, adiciona no topo
              return [
                {
                  ...newChat,
                  chat: {
                    ...newChat.chat,
                    unreadMessages:
                      newChat.message?.user.id !== user?.me.id
                        ? (newChat.chat.unreadMessages || 0) + 1
                        : newChat.chat.unreadMessages || 0,
                  },
                },
                ...page,
              ];
            }
          }
          return page;
        });

        return {
          ...oldData,
          pages: updatedPages || [],
        };
      }
    );
  };
  useSubscription<{ chats: ChatMessageSub }>({
    connectionParams: {
      isStatus: false,
      isTracking: false,
    },
    request: {
      query: CHATS_SUB,
    },
    onData: handleChatsAndData,
  });

  useFriendsStatus({
    cb: (data) => {
      handleChatsAndData(null, {
        userId: data.id,
        online: data.online,
      });
    },
  });

  async function onRefresh() {
    await refetch();
    setRefreshing(false);
  }

  useRefetchOnAppFocus([['allChats'], ['allAssignments']]);

  return {
    chats: data?.pages.flatMap((page) => page) ?? [],
    navigation,
    isLoading,
    theme,
    refreshing,
    onRefresh,
  };
}
