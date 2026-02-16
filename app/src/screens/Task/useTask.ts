import { useNavigation } from '@react-navigation/native';
import { StackProps } from '../../types/Navigation';
import { useTheme } from 'styled-components';
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { makeGraphQLRequest } from '../../lib/graphQLClient';
import { GET_TASK } from '../../services/assignments/queries/getTask';
import {
  DeleteAssignmentTaskMutation,
  GetAssignmentByIdQuery,
  GetTaskMembersQuery,
  GetTaskQuery,
  LeaveTaskMutation,
  RemoveUsersFromTaskMutation,
} from '../../__generated__/graphql';
import { GET_TASK_MEMBERS } from '../../services/assignments/queries/getTaskMembers';
import { PAGE_SIZE } from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';
import { LEAVE_TASK } from '../../services/assignments/mutations/leaveTask';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { DELETE_TASK } from '../../services/assignments/mutations/deleteTask';
import { useCallback, useRef, useState } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { REMOVE_USER_FROM_TASK } from '../../services/assignments/mutations/removeUserFromTask';
import { useRefetchOnAppFocus } from '../../hooks/useRefetchOnAppFocus';

export function useTask(taskId: string) {
  const navigation = useNavigation<StackProps>();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const { user } = useAuth();
  const bottomSheetRef = useRef<BottomSheetModal | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: task,
    isLoading: isLoadingTask,
    refetch: refetchTask,
  } = useQuery({
    queryKey: ['getTask', taskId],
    queryFn: async () => {
      try {
        const data = await makeGraphQLRequest<GetTaskQuery>({
          document: GET_TASK,
          variables: { taskId },
        });

        return data.getTask;
      } catch (e: any) {
        if ('message' in e) {
          Toast.show({
            type: 'error',
            text1: 'Falha ao navegar para a tarefa.',
            text2: e.message,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Falha ao navegar para a tarefa.',
            text2: 'Tente novamente mais tarde.',
          });
        }
        navigation.goBack();
      }
    },
  });

  const {
    data: members,
    isLoading: isLoadingMembers,
    refetch: refetchMembers,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['taskMembers', taskId],
    queryFn: async ({ pageParam = 0 }) => {
      const data = await makeGraphQLRequest<GetTaskMembersQuery>({
        document: GET_TASK_MEMBERS,
        variables: { taskId, page: pageParam },
      });

      return data.getTaskMembers;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage || lastPage.length < PAGE_SIZE) {
        return undefined;
      }
      return pages.length;
    },
  });

  const assignment = queryClient.getQueryData<
    GetAssignmentByIdQuery['getAssignmentById']
  >(['getAssignment', task?.assignmentId]);

  const { mutateAsync: leaveTaskFn, isPending: isPendingLeave } = useMutation({
    mutationFn: async () => {
      const data = await makeGraphQLRequest<LeaveTaskMutation>({
        document: LEAVE_TASK,
        variables: { taskId },
      });
      return data.leaveTask;
    },
  });

  async function onRefresh() {
    Promise.all([refetchMembers(), refetchTask()]);
    setRefreshing(false);
  }

  const handleLeave = async () => {
    try {
      await leaveTaskFn();
      queryClient.setQueryData(
        ['taskMembers', taskId],
        (oldData: InfiniteData<GetTaskMembersQuery['getTaskMembers']>) => {
          return {
            pages: oldData.pages.map((page) => {
              return page.filter((member) => member.user.id !== user?.me.id);
            }),
            pageParams: oldData.pageParams,
          };
        }
      );
      await Promise.all([
        queryClient.refetchQueries({
          queryKey: [
            'getUserTasksByAssignmentId',
            { assignmentId: assignment?.id },
          ],
        }),
        queryClient.refetchQueries({
          queryKey: ['allAssignments'],
        }),
      ]);
      queryClient.setQueryData(
        ['getTask', taskId],
        (oldData: GetTaskQuery['getTask']) => {
          return {
            ...oldData,
            isMember: false,
          };
        }
      );
      Toast.show({
        type: 'success',
        text1: 'Você saiu da tarefa',
      });
      navigation.navigate('Assignment', { assignmentId: assignment!.id });
    } catch (e: any) {
      if ('message' in e) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao sair da tarefa',
          text2: e.message,
        });
        return;
      }
      Toast.show({
        type: 'error',
        text1: 'Erro ao sair da tarefa',
        text2: 'Tente novamente mais tarde',
      });
      return;
    }
  };

  const handleLeaveAlert = () => {
    Alert.alert(
      'Sair da tarefa',
      'Tem certeza que deseja sair da tarefa? Você não poderá mais adicionar arquivos.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          onPress: handleLeave,
        },
      ]
    );
  };

  const { mutateAsync: deleteTaskFn, isPending: isPendingDelete } = useMutation(
    {
      mutationFn: async () => {
        const data = await makeGraphQLRequest<DeleteAssignmentTaskMutation>({
          document: DELETE_TASK,
          variables: { taskId },
        });
        return data.deleteAssignmentTask;
      },
    }
  );

  const handleDelete = async () => {
    try {
      await deleteTaskFn();
      await Promise.all([
        queryClient.refetchQueries({
          queryKey: [
            'getAllTasksByAssignmentId',
            { assignmentId: assignment?.id },
          ],
        }),
        queryClient.refetchQueries({
          queryKey: [
            'getUserTasksByAssignmentId',
            { assignmentId: assignment?.id },
          ],
        }),
        queryClient.refetchQueries({
          queryKey: ['allAssignments'],
        }),
      ]);
      Toast.show({
        type: 'success',
        text1: 'Você apagou a tarefa.',
      });
      navigation.navigate('Assignment', { assignmentId: assignment!.id });
    } catch (e: any) {
      if ('message' in e) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao apagar a tarefa',
          text2: e.message,
        });
        return;
      }
      Toast.show({
        type: 'error',
        text1: 'Erro ao apagar a tarefa',
        text2: 'Tente novamente mais tarde',
      });
      return;
    }
  };

  const handleDeleteAlert = () => {
    Alert.alert(
      'Apagar tarefa?',
      'Tem certeza que deseja apagar a tarefa? Todos os arquivos serão apagados. Essa ação não poderá ser desfeita.',
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

  const { mutateAsync: removeUserFromTaskFn, isPending: isPendingRemove } =
    useMutation({
      mutationKey: ['deleteUserTask'],
      mutationFn: async () => {
        const data = await makeGraphQLRequest<RemoveUsersFromTaskMutation>({
          document: REMOVE_USER_FROM_TASK,
          variables: {
            taskId,
            userIds: [selectedUser!],
          },
        });
        return data.removeUsersFromTask;
      },
    });

  const handleUserSelection = useCallback((userId: string) => {
    setSelectedUser(userId);
    bottomSheetRef.current?.present();
  }, []);

  const handleDeleteUser = async () => {
    try {
      const data = await removeUserFromTaskFn();
      if (data.success) {
        Toast.show({
          type: 'success',
          text1: 'Usuário removido da tarefa',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro ao remover usuário',
          text2: data.message as string,
        });
      }
      bottomSheetRef.current?.dismiss();
    } catch (e: any) {
      if ('message' in e) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao remover usuário',
          text2: e.message,
        });
        return;
      }
      Toast.show({
        type: 'error',
        text1: 'Erro ao remover usuário',
        text2: 'Tente novamente mais tarde',
      });
    }
  };

  const handleDeleteUserAlert = () => {
    Alert.alert(
      'Remover usuário',
      'Tem certeza que deseja remover o usuário da tarefa?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Remover',
          onPress: handleDeleteUser,
        },
      ]
    );
  };

  useRefetchOnAppFocus([
    ['getAssignment', assignment?.id],
    ['getAssignmentUsers', assignment?.id],
    ['getUserTasksByAssignmentId', { assignmentId: assignment?.id }],
    ['getAllTasksByAssignmentId', { assignmentId: assignment?.id }],
    ['getTask', taskId],
  ]);

  return {
    navigation,
    theme,
    task,
    isLoading: isLoadingTask || isLoadingMembers,
    members: members?.pages.flat(),
    assignment,
    user,
    handleLeaveAlert,
    handleDeleteAlert,
    bottomSheetRef,
    handleUserSelection,
    setSelectedUser,
    handleDeleteUserAlert,
    refreshing,
    onRefresh,
    hasNextPage,
    fetchNextPage,
    isPendingDelete,
    isPendingLeave,
    isPendingRemove,
  };
}
