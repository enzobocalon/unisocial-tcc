import { useInfiniteQuery } from '@tanstack/react-query';
import { makeGraphQLRequest } from '../../../../lib/graphQLClient';
import { GetAllTasksByAssignmentIdQuery } from '../../../../__generated__/graphql';
import { GET_ALL_TASKS_BY_ASSIGNMENT_ID } from '../../../../services/assignments/queries/getAllTasksByAssignmentId';
import { useDateParser } from '../../../../hooks/useDateParser';
import { useTheme } from 'styled-components';

export function useAllTasks(assignmentId: string) {
  const { formatDay } = useDateParser();
  const theme = useTheme();
  const {
    data,
    refetch,
    hasNextPage,
    isRefetching,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['getAllTasksByAssignmentId', { assignmentId }],
    queryFn: async ({ pageParam }) => {
      const data = await makeGraphQLRequest<GetAllTasksByAssignmentIdQuery>({
        document: GET_ALL_TASKS_BY_ASSIGNMENT_ID,
        variables: {
          assignmentId,
          page: pageParam,
        },
      });
      return data.getAllTasksByAssignmentId;
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
    isFetchingNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
    hasNextPage,
    theme,
  };
}
