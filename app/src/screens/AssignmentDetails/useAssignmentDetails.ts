import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useTheme } from 'styled-components';
import { makeGraphQLRequest } from '../../lib/graphQLClient';
import { GET_ASSIGNMENT_USERS } from '../../services/assignments/queries/getAssignmentUsers';
import {
  Assignment,
  AssignmentMemberSubscription,
  AssignmentsUsers,
  DeleteAssignmentMutation,
  GetAssignmentByIdQuery,
  GetAssignmentsQuery,
  GetAssignmentUsersQuery,
  LeaveAssignmentMutation,
  RemoveUserFromAssignmentMutation,
  TransferAssignmentOwnershipMutation,
  UnlinkChatAndAssignmentMutation,
  UpdateUserRoleInAssignmentMutation,
} from '../../__generated__/graphql';
import { GET_ASSIGNMENT_BY_ID } from '../../services/assignments/queries/getAssignmentById';
import { useNavigation } from '@react-navigation/native';
import { StackProps } from '../../types/Navigation';
import { UNLINK_CHAT_AND_ASSIGNMENT } from '../../services/assignments/mutations/unlinkChatAndAssignment';
import Toast from 'react-native-toast-message';
import { Alert } from 'react-native';
import { LEAVE_ASSIGNMENT } from '../../services/assignments/mutations/leaveAssignment';
import { useRef, useState } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { UPDATE_USER_ROLE_IN_ASSIGNMENT } from '../../services/assignments/mutations/updateUserRoleInAssignment';
import { useAuth } from '../../context/AuthContext';
import { TRANSFER_ASSIGNMENT_OWNERSHIP } from '../../services/assignments/mutations/transferAssignmentOwnership';
import { useSubscription } from '../../hooks/useSubscription';
import { ASSIGNMENT_MEMBER_SUB } from '../../services/assignments/subscriptions/assignmentMember';
import { REMOVE_USER_FROM_ASSIGNMENT } from '../../services/assignments/mutations/removeUserFromAssignment';
import { DELETE_ASSIGNMENT } from '../../services/assignments/mutations/deleteAssignment';
import { useRefetchOnAppFocus } from '../../hooks/useRefetchOnAppFocus';

export function useAssignmentDetails(assignmentId: string) {
  const theme = useTheme();
  const navigate = useNavigation<StackProps>();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const bottomSheetRef = useRef<BottomSheetModal | null>(null);
  const [clickedUser, setClickedUser] = useState<AssignmentsUsers | null>(null);

  const {
    data,
    isLoading: isLoadingData,
    refetch: refetchData,
    isRefetching: isRefetchingData,
  } = useQuery({
    queryKey: ['getAssignment', assignmentId],
    queryFn: async () => {
      const data = await makeGraphQLRequest<GetAssignmentByIdQuery>({
        document: GET_ASSIGNMENT_BY_ID,
        variables: { assignmentId },
      });

      return data.getAssignmentById;
    },
  });

  const {
    data: members,
    isLoading: isLoadingMembers,
    hasNextPage,
    fetchNextPage,
    refetch: refetchMembers,
    isRefetching: isRefetchingMembers,
  } = useInfiniteQuery({
    queryKey: ['getAssignmentUsers', assignmentId],
    queryFn: async ({ pageParam }) => {
      const data = await makeGraphQLRequest<GetAssignmentUsersQuery>({
        document: GET_ASSIGNMENT_USERS,
        variables: { assignmentId, page: pageParam },
      });

      return data.getAssignmentUsers;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage && lastPage.length > 0) {
        return allPages.length;
      }
      return undefined;
    },
  });

  const { mutateAsync: unlinkChatFn, isPending: isPendingUnlinkChat } =
    useMutation({
      mutationFn: async () => {
        if (!assignmentId || !data?.chatId) return;
        const content =
          await makeGraphQLRequest<UnlinkChatAndAssignmentMutation>({
            document: UNLINK_CHAT_AND_ASSIGNMENT,
            variables: { assignmentId, chatId: data?.chatId },
          });
        return content.unlinkChatAndAssignment;
      },
    });

  const handleUnlinkChat = async () => {
    try {
      await unlinkChatFn();
      Toast.show({
        type: 'success',
        text1: 'Chat desvinculado',
        text2: 'O chat foi desvinculado com sucesso.',
      });
      queryClient.setQueryData(
        ['getAssignment', assignmentId],
        (data: Assignment) => {
          return { ...data, chatId: null };
        }
      );
    } catch (e: any) {
      if ('message' in e) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao desvincular',
          text2: e.message,
        });
        return;
      }
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Erro ao desvincular o chat. Tente novamente mais tarde.',
      });
    }
  };

  const handleUnlinkAlert = () => {
    Alert.alert(
      'Desvincular Chat',
      'Tem certeza que deseja desvincular o chat? Essa ação não poderá ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Desvincular',
          onPress: handleUnlinkChat,
          style: 'destructive',
        },
      ]
    );
  };

  const {
    mutateAsync: leaveAssignmentFn,
    isPending: isPendingLeaveAssignment,
  } = useMutation({
    mutationFn: async () => {
      const content = await makeGraphQLRequest<LeaveAssignmentMutation>({
        document: LEAVE_ASSIGNMENT,
        variables: { assignmentId },
      });
      return content.leaveAssignment;
    },
  });

  const handleLeaveAssignment = async () => {
    try {
      await leaveAssignmentFn();
      Toast.show({
        type: 'success',
        text1: 'Saiu da atividade',
        text2: 'Você saiu da atividade com sucesso.',
      });
      navigate.navigate('Communications');
    } catch (e: any) {
      if ('message' in e) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao sair',
          text2: e.message,
        });
        return;
      }
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Erro ao sair da atividade. Tente novamente mais tarde.',
      });
    }
  };

  const handleLeaveAssignmentAlert = () => {
    Alert.alert('Sair do Chat', 'Tem certeza que deseja sair do chat?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Sair',
        onPress: handleLeaveAssignment,
        style: 'destructive',
      },
    ]);
  };

  const refresh = async () => {
    await Promise.all([refetchData(), refetchMembers()]);
  };

  const handleUserClick = (user: AssignmentsUsers) => {
    setClickedUser(user);
    bottomSheetRef.current?.present();
  };

  const { mutateAsync: updateRoleFn, isPending: isPendingUpdateRole } =
    useMutation({
      mutationFn: async () => {
        const data =
          await makeGraphQLRequest<UpdateUserRoleInAssignmentMutation>({
            document: UPDATE_USER_ROLE_IN_ASSIGNMENT,
            variables: {
              userId: clickedUser?.user.id,
              isAdmin: !clickedUser?.isAdmin,
              assignmentId,
            },
          });
        return data.updateUserRoleInAssignment;
      },
    });

  const handleChangeRole = async () => {
    try {
      const data = await updateRoleFn();
      if (data.success) {
        Toast.show({
          type: 'success',
          text1: 'Sucesso',
          text2: data.message || 'Cargo atualizado com sucesso.',
        });
        queryClient.setQueryData(
          ['getAssignmentUsers', assignmentId],
          (
            data: InfiniteData<GetAssignmentUsersQuery['getAssignmentUsers']>
          ) => {
            return {
              pageParams: data.pageParams,
              pages: data.pages.map((page) =>
                page.map((user) =>
                  user.user.id === clickedUser?.user.id
                    ? { ...user, isAdmin: !clickedUser?.isAdmin }
                    : user
                )
              ),
            };
          }
        );
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro ao atualizar',
          text2: data.message || 'Erro ao atualizar o cargo do usuário.',
        });
      }
    } catch (e: any) {
      if ('message' in e) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao atualizar',
          text2: e.message,
        });
        return;
      }
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Erro ao atualizar o usuário. Tente novamente mais tarde.',
      });
    } finally {
      bottomSheetRef.current?.dismiss();
    }
  };

  const {
    mutateAsync: transferAssignmentOwnershipFn,
    isPending: isPendingTransferOwnership,
  } = useMutation({
    mutationFn: async () => {
      const data =
        await makeGraphQLRequest<TransferAssignmentOwnershipMutation>({
          document: TRANSFER_ASSIGNMENT_OWNERSHIP,
          variables: {
            assignmentId,
            userId: clickedUser?.user.id,
          },
        });
      return data.transferAssignmentOwnership;
    },
  });

  const handleTransferOwnership = async () => {
    try {
      await transferAssignmentOwnershipFn();
      queryClient.setQueryData(
        ['getAssignment', assignmentId],
        (oldData: GetAssignmentByIdQuery['getAssignmentById']) => {
          return {
            ...oldData,
            ownerId: clickedUser?.user.id,
          };
        }
      );
      queryClient.setQueryData(
        ['getAssignmentUsers', assignmentId],
        (
          oldData:
            | InfiniteData<GetAssignmentUsersQuery['getAssignmentUsers']>
            | undefined
        ) => {
          if (!oldData) return oldData;
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) =>
              page.map((user) => {
                if (user.user.id === clickedUser?.user.id) {
                  return {
                    ...user,
                    isAdmin: true,
                  };
                }
                return user;
              })
            ),
          };
        }
      );
      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Liderança transferida com sucesso.',
      });
    } catch (e: any) {
      if ('message' in e) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao transferir',
          text2: e.message,
        });
        return;
      }
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Erro ao transferir a liderança. Tente novamente mais tarde.',
      });
    } finally {
      bottomSheetRef.current?.dismiss();
    }
  };

  const { mutateAsync: removeUserFn, isPending: isPendingRemoveUser } =
    useMutation({
      mutationFn: async () => {
        const data = await makeGraphQLRequest<RemoveUserFromAssignmentMutation>(
          {
            document: REMOVE_USER_FROM_ASSIGNMENT,
            variables: { assignmentId, userId: clickedUser?.user.id },
          }
        );
        return data.removeUserFromAssignment;
      },
    });

  const handleRemoveUser = async () => {
    try {
      await removeUserFn();
      queryClient.setQueryData(
        ['getAssignmentUsers', assignmentId],
        (
          oldData: InfiniteData<GetAssignmentUsersQuery['getAssignmentUsers']>
        ) => {
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) =>
              page.filter((user) => user.user.id !== clickedUser?.user.id)
            ),
          };
        }
      );
      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Usuário removido com sucesso.',
      });
    } catch (e: any) {
      if ('message' in e) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao remover',
          text2: e.message,
        });
        return;
      }
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Erro ao remover o usuário. Tente novamente mais tarde.',
      });
    }
  };

  const handleSubData = async (
    subData: AssignmentMemberSubscription | null
  ) => {
    if (!subData) return;
    const { assignmentMember: data } = subData;
    if (data.assignment.id !== assignmentId) return;
    if (data.action === 'UPDATE' || data.action === 'TRANSFER') {
      queryClient.setQueryData(
        ['getAssignmentUsers', assignmentId],
        (
          oldData:
            | InfiniteData<GetAssignmentUsersQuery['getAssignmentUsers']>
            | undefined
        ) => {
          if (!oldData) return oldData;
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) =>
              page.map((user) => {
                if (user.user.id === data.member?.user.id) {
                  return {
                    ...user,
                    isAdmin: data.member.isAdmin,
                  };
                }
                return user;
              })
            ),
          };
        }
      );
    }
    if (data.action === 'JOIN') {
      await refetchMembers();
    }

    if (data.action === 'LEAVE' || data.action === 'DELETE') {
      queryClient.setQueryData(
        ['getAssignmentUsers', assignmentId],
        (
          oldData:
            | InfiniteData<GetAssignmentUsersQuery['getAssignmentUsers']>
            | undefined
        ) => {
          if (!oldData) return oldData;
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) =>
              page.filter((user) => user.user.id !== data.member?.user.id)
            ),
          };
        }
      );

      if (data.member?.user.id === user?.me.id) {
        queryClient.setQueryData(
          ['allAssignments'],
          (oldData: InfiniteData<GetAssignmentsQuery['getAssignments']>) => {
            if (!oldData) return oldData;
            return {
              pageParams: oldData.pageParams,
              pages: oldData.pages.map((page) =>
                page.map((assignmentList) => ({
                  ...assignmentList,
                  item: assignmentList.item.filter(
                    (assignment) => assignment.id !== assignmentId
                  ),
                }))
              ),
            };
          }
        );
        navigate.navigate('Communications');
      }
    }
  };

  useSubscription({
    request: {
      query: ASSIGNMENT_MEMBER_SUB,
      variables: { assignmentId },
    },
    connectionParams: {
      isStatus: false,
      isTracking: false,
    },
    onData: handleSubData,
  });

  const {
    mutateAsync: deleteAssignmentFn,
    isPending: isPendingDeleteAssignment,
  } = useMutation({
    mutationFn: async () => {
      const data = await makeGraphQLRequest<DeleteAssignmentMutation>({
        document: DELETE_ASSIGNMENT,
        variables: { assignmentId },
      });
      return data.deleteAssignment;
    },
  });

  const handleDelete = async () => {
    try {
      await deleteAssignmentFn();
      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Atividade apagada com sucesso.',
      });
      navigate.navigate('Communications');
    } catch (e: any) {
      if ('message' in e) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao apagar',
          text2: e.message,
        });
        return;
      }
      Toast.show({
        type: 'error',
        text1: 'Erro ao apagar',
        text2: 'Erro ao apagar a atividade. Tente novamente mais tarde.',
      });
    }
  };

  const handleDeleteAssignment = () => {
    Alert.alert(
      'Apagar atividade.',
      'Tem certeza que deseja apagar a atividade?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Apagar',
          onPress: handleDelete,
        },
      ]
    );
  };

  useRefetchOnAppFocus([
    ['getAssignment', assignmentId],
    ['getAssignmentUsers', assignmentId],
    ['getUserTasksByAssignmentId', { assignmentId }],
    ['getAllTasksByAssignmentId', { assignmentId }],
  ]);

  return {
    theme,
    members: members?.pages.flat(),
    data,
    isLoading: isLoadingData || isLoadingMembers,
    fetchNextPage,
    hasNextPage,
    navigate,
    isRefreshing: isRefetchingData && isRefetchingMembers,
    refresh,
    handleUnlinkAlert,
    handleLeaveAssignmentAlert,
    bottomSheetRef,
    clickedUser,
    handleUserClick,
    setClickedUser,
    handleChangeRole,
    user,
    handleTransferOwnership,
    handleRemoveUser,
    handleDeleteAssignment,
    isPendingUnlinkChat,
    isPendingLeaveAssignment,
    isPendingUpdateRole,
    isPendingTransferOwnership,
    isPendingRemoveUser,
    isPendingDeleteAssignment,
  };
}
