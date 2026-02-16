import { useNavigation, useNavigationState } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { StackParams, StackProps } from '../../../types/Navigation';
import {
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { makeGraphQLRequest } from '../../../lib/graphQLClient';
import { GET_ASSIGNMENTS } from '../../../services/assignments/queries/getAssignments';
import {
  AssignmentsSubscription,
  GetAssignmentByIdQuery,
  GetAssignmentsQuery,
  GetTaskMembersQuery,
  GetTaskQuery,
  TasksSubscription,
} from '../../../__generated__/graphql';
import { useDateParser } from '../../../hooks/useDateParser';
import { useSubscription } from '../../../hooks/useSubscription';
import { ASSIGNMENTS_SUB } from '../../../services/assignments/subscriptions/assignments';
import Toast from 'react-native-toast-message';
import { TASKS_SUB } from '../../../services/assignments/subscriptions/tasks';
import { useAuth } from '../../../context/AuthContext';
import { useState } from 'react';
import { useRefetchOnAppFocus } from '../../../hooks/useRefetchOnAppFocus';

export function useAssignments() {
  const theme = useTheme();
  const navigation = useNavigation<StackProps>();
  const { formatDay } = useDateParser();
  const queryClient = useQueryClient();
  const currentRoute = useNavigationState((state) => state.routes[state.index]);
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, refetch } = useInfiniteQuery({
    queryKey: ['allAssignments'],
    queryFn: async ({ pageParam }) => {
      const data = await makeGraphQLRequest<GetAssignmentsQuery>({
        document: GET_ASSIGNMENTS,
        variables: {
          page: pageParam,
        },
      });

      return data.getAssignments;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage && lastPage.length > 0) {
        return allPages.length;
      }
      return undefined;
    },
  });

  const handleSubscription = async (
    rawData: AssignmentsSubscription | null
  ) => {
    const {
      assignments: { assignment, action },
    } = rawData as AssignmentsSubscription;
    if (action === 'JOIN' || action === 'LEAVE' || action === 'DELETE') {
      await refetch();
    }
    if (action === 'UPDATE' || action === 'TRANSFER') {
      queryClient.setQueryData(
        ['allAssignments'],
        (oldData: InfiniteData<GetAssignmentsQuery['getAssignments']>) => {
          if (!oldData) return oldData;
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) =>
              page.map((a) => {
                return {
                  ...a,
                  item: a.item.map((i) => {
                    if (i.id === assignment.id) {
                      return assignment;
                    }
                    return i;
                  }),
                };
              })
            ),
          };
        }
      );

      queryClient.setQueryData(
        ['getAssignment', assignment.id],
        (oldData: GetAssignmentByIdQuery['getAssignmentById']) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            ...assignment,
            isAdmin:
              assignment.isAdmin !== null
                ? assignment.isAdmin
                : oldData.isAdmin,
          };
        }
      );
    }
    if (
      (action === 'LEAVE' || action === 'DELETE') &&
      (currentRoute.name === 'Assignment' ||
        currentRoute.name === 'AssignmentDetails')
    ) {
      const params = currentRoute.params as StackParams[
        | 'Assignment'
        | 'AssignmentDetails'];

      if (params.assignmentId === assignment.id) {
        Toast.show({
          type: 'info',
          text1: 'Você saiu da atividade',
          text2: 'Você será redirecionado para a tela de atividades',
        });
        navigation.navigate('Communications');
      }
    }
  };

  useSubscription({
    request: {
      query: ASSIGNMENTS_SUB,
    },
    connectionParams: {
      isStatus: false,
      isTracking: false,
    },
    onData: handleSubscription,
  });

  const handleTaskSubscription = async (rawData: TasksSubscription | null) => {
    if (!rawData) return;
    const {
      tasks: { action, assignment, task, ids },
    } = rawData;

    // const currentUserId = user?.me.id;
    // const authorId = ids?.find((i) => i.userId === currentUserId)?.userId;

    if (['COMPLETE', 'INCOMPLETE'].includes(action)) {
      await queryClient.refetchQueries({
        queryKey: ['taskMembers', task.id],
      });
      await queryClient.refetchQueries({
        queryKey: ['getTask', task.id],
      });
      return;
    }

    const params = currentRoute.params as StackParams['Task'];
    if (action === 'UPDATE') {
      queryClient.setQueryData(
        ['getTask', task.id],
        (oldData: GetTaskQuery['getTask']) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            name: task.name,
            description: task.description,
            dueDate: task.dueDate,
          };
        }
      );
    }

    if ((action === 'REMOVE_USER' || action === 'LEAVE') && ids?.length) {
      const idsSet = new Set(ids.map((item) => item.id));
      const userIdSet = new Set(ids.map((item) => item.userId));
      queryClient.setQueryData(
        ['taskMembers', task.id],
        (oldData: InfiniteData<GetTaskMembersQuery['getTaskMembers']>) => {
          if (!oldData) {
            return {
              pages: [],
              pageParams: [],
            };
          }

          return {
            pages: oldData.pages.map((page) =>
              page.filter((member) => !idsSet.has(member.userId))
            ),
            pageParams: oldData.pageParams,
          };
        }
      );

      if (action === 'REMOVE_USER') {
        // Leave já é tratado no useTask, e as atualizações são todas client-side (exceto a da lista de membros)
        queryClient.setQueryData(
          ['getTask', task.id],
          (oldData: GetTaskQuery['getTask']) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              totalCount: oldData.totalCount - 1,
            };
          }
        );
        if (user && userIdSet.has(user.me.id)) {
          await Promise.all([
            queryClient.refetchQueries({
              queryKey: [
                'getAllTasksByAssignmentId',
                { assignmentId: assignment.id },
              ],
            }),
            queryClient.refetchQueries({
              queryKey: [
                'getUserTasksByAssignmentId',
                { assignmentId: assignment.id },
              ],
            }),
            queryClient.refetchQueries({
              queryKey: ['allAssignments'],
            }),
          ]);
          if (currentRoute.name === 'Task' && params?.taskId === task.id) {
            Toast.show({
              type: 'info',
              text1: 'Você foi removido da tarefa',
              text2: 'Você será redirecionado para a tela de atividades',
            });
            navigation.navigate('Assignment', { assignmentId: assignment.id });
          }
        }
      }
    }

    if (action === 'DELETE') {
      if (currentRoute.name === 'Task' && params?.taskId === task.id) {
        Toast.show({
          type: 'info',
          text1: 'A tarefa foi apagada',
          text2: 'Você será redirecionado para a tela de atividades',
        });
        await Promise.all([
          queryClient.refetchQueries({
            queryKey: [
              'getAllTasksByAssignmentId',
              { assignmentId: assignment.id },
            ],
          }),
          queryClient.refetchQueries({
            queryKey: [
              'getUserTasksByAssignmentId',
              { assignmentId: assignment.id },
            ],
          }),
          queryClient.refetchQueries({
            queryKey: ['allAssignments'],
          }),
        ]);
        navigation.navigate('Assignment', { assignmentId: assignment.id });
      }
    }

    if (action === 'CREATE') {
      await Promise.all([
        queryClient.refetchQueries({
          queryKey: [
            'getAllTasksByAssignmentId',
            { assignmentId: assignment.id },
          ],
        }),
        queryClient.refetchQueries({
          queryKey: [
            'getUserTasksByAssignmentId',
            { assignmentId: assignment.id },
          ],
        }),
        queryClient.refetchQueries({
          queryKey: ['allAssignments'],
        }),
      ]);
    }

    if (action === 'JOIN') {
      if (!ids) return;
      const userIdsSet = new Set(ids.map((item) => item.userId));
      if (params?.taskId === task.id && currentRoute.name === 'Task') {
        await queryClient.refetchQueries({
          queryKey: ['taskMembers', task.id],
        });
      }
      queryClient.setQueryData(
        ['getTask', task.id],
        (oldData: GetTaskQuery['getTask']) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            isMember: true,
            totalCount: oldData.totalCount + 1,
          };
        }
      );
      if (user && userIdsSet.has(user.me.id)) {
        await Promise.all([
          queryClient.refetchQueries({
            queryKey: [
              'getAllTasksByAssignmentId',
              { assignmentId: assignment.id },
            ],
          }),
          queryClient.refetchQueries({
            queryKey: [
              'getUserTasksByAssignmentId',
              { assignmentId: assignment.id },
            ],
          }),
          queryClient.refetchQueries({
            queryKey: ['allAssignments'],
          }),
        ]);
      }
    }
  };

  useSubscription({
    request: {
      query: TASKS_SUB,
    },
    connectionParams: {
      isStatus: false,
      isTracking: false,
    },
    onData: handleTaskSubscription,
  });

  async function onRefresh() {
    await refetch();
    setRefreshing(false);
  }

  useRefetchOnAppFocus([['allChats'], ['allAssignments']]);

  return {
    theme,
    navigation,
    data: data?.pages.flat(),
    formatDay,
    isLoading,
    refreshing,
    onRefresh,
  };
}
