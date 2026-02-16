import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { makeGraphQLRequest } from '../../lib/graphQLClient';

import {
  ChangeUserRoleMutation,
  Chat,
  ChatMember,
  GetChatByIdQuery,
  GetChatMembersQuery,
  RemoveUserFromChatMutation,
  TransferOwnershipMutation,
} from '../../__generated__/graphql';
import { GET_CHAT_MEMBERS } from '../../services/chats/queries/getChatMembers';
import { PAGE_SIZE } from '../../lib/constants';
import { useTheme } from 'styled-components';
import { useCallback, useRef, useState } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { REMOVE_USER_FROM_CHAT } from '../../services/chats/mutations/removeUser';
import { Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { StackProps } from '../../types/Navigation';
import { TRANSFER_OWNERSHIP } from '../../services/chats/mutations/transferOwnership';
import { CHAGE_USER_ROLE } from '../../services/chats/mutations/changeUserRole';
import { GET_CHAT_BY_ID } from '../../services/chats/queries/getChatById';
import { useRefetchOnAppFocus } from '../../hooks/useRefetchOnAppFocus';

export function useChatDetails(chatId: string) {
  const user = useAuth();
  const [clickedUser, setClickedUser] = useState<ChatMember | null>(null);
  const theme = useTheme();
  const queryClient = useQueryClient();
  const navigation = useNavigation<StackProps>();

  const bottomSheetRef = useRef<BottomSheetModal | null>(null);

  const {
    data: chat,
    isLoading: isLoadingChat,
    refetch: refetchChat,
  } = useQuery({
    queryKey: ['chatDetails', chatId],
    queryFn: async () => {
      const data = await makeGraphQLRequest<GetChatByIdQuery>({
        document: GET_CHAT_BY_ID,
        variables: {
          chatId,
        },
      });
      return data.getChatById;
    },
  });

  const {
    data: members,
    fetchNextPage,
    isLoading: isLoadingMembers,
    hasNextPage,
    refetch: refetchMembers,
  } = useInfiniteQuery({
    queryKey: ['chatMembers', chatId],
    queryFn: async ({ pageParam }) => {
      const data = await makeGraphQLRequest<GetChatMembersQuery>({
        document: GET_CHAT_MEMBERS,
        variables: {
          chatId,
          page: pageParam,
        },
      });
      return data.getChatMembers;
    },
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage || lastPage.length < PAGE_SIZE) {
        return undefined;
      }
      return pages.length;
    },
    initialPageParam: 0,
    enabled: !!chat && !chat.isDirect,
  });

  const handleOnPress = useCallback((user: ChatMember) => {
    setClickedUser(user);
    bottomSheetRef.current?.present();
  }, []);

  const onDismiss = useCallback(() => {
    setClickedUser(null);
  }, []);

  const { mutateAsync: removeUserFn, isPending: isPendingRemoveUser } =
    useMutation({
      mutationKey: ['removeUser'],
      mutationFn: async (userId: string) => {
        const data = await makeGraphQLRequest<RemoveUserFromChatMutation>({
          document: REMOVE_USER_FROM_CHAT,
          variables: {
            chatId,
            user: userId,
          },
        });
        return data.removeUserFromChat;
      },
    });

  const { mutateAsync: leaveChatFn, isPending: isPendingLeaveChat } =
    useMutation({
      mutationKey: ['leaveChat'],
      mutationFn: async () => {
        const data = await makeGraphQLRequest<RemoveUserFromChatMutation>({
          document: REMOVE_USER_FROM_CHAT,
          variables: {
            chatId,
            user: user?.user?.me.id,
          },
        });
        return data.removeUserFromChat;
      },
    });

  const removeUser = useCallback(async () => {
    if (clickedUser) {
      try {
        await removeUserFn(clickedUser.user.id);
        queryClient.setQueryData(
          ['chatMembers', chatId],
          (data: InfiniteData<ChatMember[]>) => {
            return {
              ...data,
              pages: data.pages.map((page) => {
                return page.filter(
                  (member) => member.user.id !== clickedUser?.user.id
                );
              }),
            };
          }
        );
        bottomSheetRef.current?.dismiss();
      } catch (e: any) {
        console.error('REMOVE-USER-CHATDETAILS-ERROR', e);
        if ('message' in e) {
          Toast.show({
            type: 'error',
            text1: 'Erro ao remover usuário',
            text2: e.message,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Erro ao remover usuário',
            text2: 'Tente novamente mais tarde',
          });
        }
      }
    }
  }, [clickedUser, removeUserFn, queryClient, chatId]);

  const handleRemoveUser = () => {
    Alert.alert(
      'Remover usuário',
      'Tem certeza que deseja remover o usuário?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Remover',
          onPress: removeUser,
        },
      ]
    );
  };

  const leaveChat = useCallback(async () => {
    if (chat && chat.isDirect) return;
    try {
      await leaveChatFn();
      queryClient.refetchQueries({
        queryKey: ['allChats'],
      });
      Toast.show({
        type: 'success',
        text1: 'Você saiu do chat',
        text2: 'Agora você não receberá mais mensagens',
      });
      navigation.navigate('Communications');
    } catch (e: any) {
      console.error('LEAVE-CHAT-ERROR', e);
      if ('message' in e) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao sair do chat',
          text2: e.message,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro ao sair do chat',
          text2: 'Tente novamente mais tarde',
        });
      }
    }
  }, [queryClient, leaveChatFn, navigation]);

  const handleLeaveChat = () => {
    Alert.alert('Sair do chat', 'Tem certeza que deseja sair do chat?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Sair',
        onPress: leaveChat,
      },
    ]);
  };

  const {
    mutateAsync: transferOwnershipFn,
    isPending: isPendingTransferOwnership,
  } = useMutation({
    mutationKey: ['transferOwnership'],
    mutationFn: async (userId: string) => {
      const data = await makeGraphQLRequest<TransferOwnershipMutation>({
        document: TRANSFER_OWNERSHIP,
        variables: {
          chatId,
          newOwnerId: userId,
        },
      });
      return data.transferOwnership;
    },
  });

  const transferOwnership = useCallback(async () => {
    if (chat && clickedUser && !chat.isDirect) {
      // Quando o usuário não for mais dono, ele ainda será um administrador
      // até que alguem remova seu cargo.
      try {
        await transferOwnershipFn(clickedUser.user.id);
        queryClient.setQueryData(
          ['chatMembers', chatId],
          (data: InfiniteData<ChatMember[]>) => {
            return {
              ...data,
              pages: data.pages.map((page) => {
                return page.map((member) => {
                  if (member.user.id === clickedUser.user.id) {
                    return {
                      ...member,
                      isAdmin: true,
                    };
                  }
                  return member;
                });
              }),
            };
          }
        );
        queryClient.setQueryData(['chat', chatId], (chat: Chat) => {
          return {
            ...chat,
            ownerId: clickedUser.user.id,
          };
        });
        queryClient.setQueryData(
          ['chatDetails', chatId],
          (oldData: GetChatByIdQuery['getChatById']) => {
            return {
              ...oldData,
              ownerId: clickedUser.user.id,
            };
          }
        );
        bottomSheetRef.current?.dismiss();
        Toast.show({
          type: 'success',
          text1: 'Liderança transferida',
          text2: 'Agora você não é mais o dono do grupo',
        });
      } catch (e: any) {
        console.error('TRANSFER-OWNERSHIP-ERROR', e);
        if ('message' in e) {
          Toast.show({
            type: 'error',
            text1: 'Erro ao transferir liderança',
            text2: e.message,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Erro ao transferir liderança',
            text2: 'Tente novamente mais tarde',
          });
        }
      }
    }
  }, [queryClient, chatId, clickedUser, transferOwnershipFn, chat]);

  const handleTransferOwnership = () => {
    Alert.alert(
      'Transferir Liderança',
      'Tem certeza que deseja transferir a liderança do chat?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Transferir',
          onPress: transferOwnership,
        },
      ]
    );
  };

  const { mutateAsync: changeRoleFn, isPending: isPendingChangeRole } =
    useMutation({
      mutationKey: ['changeUserRole'],
      mutationFn: async ({
        userId,
        isAdmin,
      }: {
        userId: string;
        isAdmin: boolean;
      }) => {
        const data = await makeGraphQLRequest<ChangeUserRoleMutation>({
          document: CHAGE_USER_ROLE,
          variables: {
            chatId,
            userId,
            isAdmin,
          },
        });
        return data.changeUserRole;
      },
    });

  const changeRole = useCallback(async () => {
    if (!clickedUser) return;
    try {
      const data = await changeRoleFn({
        userId: clickedUser.user.id,
        isAdmin: !clickedUser.isAdmin,
      });
      Toast.show({
        type: data.success ? 'success' : 'error',
        text1: data.success ? 'Cargo Alterado' : 'Falha ao alterar o cargo',
        text2: data.success
          ? 'O cargo do usuário foi alterado com sucesso'
          : data.message
            ? data.message
            : 'Tente novamente mais tarde',
      });
    } catch (e: any) {
      console.error('CHANGE-ROLE-ERROR', e);
      if ('message' in e) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao alterar cargo',
          text2: e.message,
        });
      }
    } finally {
      bottomSheetRef.current?.dismiss();
    }
  }, [clickedUser]);

  const handleChangeRole = () => {
    if (!clickedUser) return;
    Alert.alert(
      clickedUser?.isAdmin ? 'Retirar Admin' : 'Tornar Admin',
      `Tem certeza que deseja ${clickedUser?.isAdmin ? 'retirar o administrador deste usuário' : 'tornar esse usuário um administrador'}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Atualizar',
          onPress: changeRole,
        },
      ]
    );
  };

  async function refreshData() {
    await Promise.all([refetchChat(), refetchMembers()]);
  }

  useRefetchOnAppFocus([
    ['activeChat', chatId],
    ['messages', chatId],
    ['chatMembers', chatId],
  ]);

  return {
    members: members?.pages.flat(),
    fetchNextPage,
    isLoading: isLoadingMembers || isLoadingChat,
    hasNextPage,
    theme,
    bottomSheetRef,
    handleOnPress,
    chat,
    clickedUser,
    onDismiss,
    handleRemoveUser,
    user,
    handleLeaveChat,
    handleTransferOwnership,
    navigation,
    handleChangeRole,
    isPendingChangeRole,
    isPendingLeaveChat,
    isPendingRemoveUser,
    isPendingTransferOwnership,
    refreshData,
  };
}
