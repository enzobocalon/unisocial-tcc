import { useInfiniteQuery } from '@tanstack/react-query';
import { GET_TIMELINE } from '../../services/timeline/getTimeline';
import { makeGraphQLRequest } from '../../lib/graphQLClient';
import {
  TimelineByCourseQuery,
  TimelineQuery,
} from '../../__generated__/graphql';
import { useTheme } from 'styled-components';
import { PAGE_SIZE } from '../../lib/constants';
import { GET_COURSE_TIMELINE } from '../../services/timeline/getCourseTimeline';
import { StackProps } from '../../types/Navigation';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

export function useHome() {
  const theme = useTheme();
  const navigation = useNavigation<StackProps>();
  const [refreshingTimeline, setRefreshingTimeline] = useState(false);
  const [refreshingCourses, setRefreshingCourses] = useState(false);
  const {
    data: timelineData,
    isLoading: isLoadingTimeline,
    fetchNextPage: fetchNextPageTimeline,
    hasNextPage: hasNextPageTimeline,
    refetch: refetchTimeline,
  } = useInfiniteQuery({
    queryKey: ['timeline'],
    queryFn: async ({ pageParam }) => {
      const data = await makeGraphQLRequest<TimelineQuery>({
        document: GET_TIMELINE,
        variables: {
          page: pageParam,
        },
      });
      return data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, page) => {
      if (
        !lastPage ||
        !lastPage.timeline ||
        !lastPage.timeline.length ||
        lastPage.timeline.length < PAGE_SIZE
      ) {
        return undefined;
      }
      return page.length + 1;
    },
  });

  const {
    data: courseTimeline,
    isLoading: isLoadingCourses,
    fetchNextPage: fetchNextPageCourses,
    hasNextPage: hasNextPageCourses,
    refetch: refetchCourses,
  } = useInfiniteQuery({
    queryKey: ['courseTimeline'],
    queryFn: async ({ pageParam: page }) => {
      const { timelineByCourse: data } =
        await makeGraphQLRequest<TimelineByCourseQuery>({
          document: GET_COURSE_TIMELINE,
          variables: {
            page: page,
          },
        });
      return data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, page) => {
      if (!lastPage || !lastPage.length || lastPage.length < PAGE_SIZE) {
        return undefined;
      }
      return page.length + 1;
    },
  });

  async function onRefreshTimeline() {
    await refetchTimeline();
    setRefreshingTimeline(false);
  }

  async function onRefreshCourses() {
    await refetchCourses();
    setRefreshingCourses(false);
  }

  return {
    timelineData: timelineData?.pages.flatMap((page) => page.timeline) || [],
    loadingTimeline: isLoadingTimeline,
    theme,
    hasNextPageTimeline,
    fetchNextPageTimeline,
    courseTimeline: courseTimeline?.pages.flatMap((page) => page) || [],
    isLoadingCourses,
    fetchNextPageCourses,
    hasNextPageCourses,
    navigation,
    refreshingTimeline,
    onRefreshTimeline,
    onRefreshCourses,
    refreshingCourses,
  };
}
