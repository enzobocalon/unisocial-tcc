import { useInfiniteQuery } from '@tanstack/react-query';
import { makeGraphQLRequest } from '../../../../lib/graphQLClient';
import { GetUsersTaskByAssignmentIdQuery } from '../../../../__generated__/graphql';
import { useDateParser } from '../../../../hooks/useDateParser';
import { GET_USER_TASKS_BY_ASSIGNMENT_ID } from '../../../../services/assignments/queries/getUsersTaskByAssignmentId';
import { useTheme } from 'styled-components';

export function useUserTasks(assignmentId: string) {
  const { formatDay } = useDateParser();
  const theme = useTheme();
  const {
    data,
    refetch,
    fetchNextPage,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['getUserTasksByAssignmentId', { assignmentId }],
    queryFn: async ({ pageParam }) => {

      const data = await makeGraphQLRequest<GetUsersTaskByAssignmentIdQuery>({
        document: GET_USER_TASKS_BY_ASSIGNMENT_ID,
        variables: {
          assignmentId,
          page: pageParam,
        },
      });
      return data.getUsersTaskByAssignmentId;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage && lastPage.length > 0) {
        return allPages.length;
      }
      return undefined;
    },
  });

  return {
    data: data?.pages.flat(),
    formatDay,
    refetch,
    fetchNextPage,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    theme,
  };
}
