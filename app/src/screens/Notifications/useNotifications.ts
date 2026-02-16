import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { makeGraphQLRequest } from '../../lib/graphQLClient';
import { GET_NOTIFICATIONS } from '../../services/notifications/queries/getNotifications';
import {
  GetFriendRequestsQuery,
  GetNotificationsQuery,
} from '../../__generated__/graphql';
import { useTheme } from 'styled-components';
import { GET_FRIEND_REQUESTS } from '../../services/notifications/queries/getFriendRequests';
import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export function useNotification() {
  const theme = useTheme();
  const [refreshingNotification, setRefreshingNotifications] = useState(false);
  const [refreshingRequests, setRefreshingRequests] = useState(false);
  const queryClient = useQueryClient();
  const {
    data: notifications,
    hasNextPage: hasMoreNotifications,
    fetchNextPage: fetchMoreNotifications,
    isLoading: isLoadingNotifications,
    isFetchingNextPage: isFetchingMoreNotifications,
    refetch: refetchNotifications,
  } = useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: async ({ pageParam }) => {
      const { getNotifications: data } =
        await makeGraphQLRequest<GetNotificationsQuery>({
          document: GET_NOTIFICATIONS,
          variables: { page: pageParam },
        });
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage && lastPage.length > 0) {
        return allPages?.length;
      }
      return undefined;
    },
    initialPageParam: 0,
  });

  const {
    data: friendRequestsData,
    hasNextPage: hasMoreFriendRequests,
    fetchNextPage: fetchMoreFriendRequests,
    isLoading: isLoadingFriendRequests,
    isFetchingNextPage: isFetchingMoreFriendRequests,
    refetch: refetchFriendRequests,
  } = useInfiniteQuery({
    queryKey: ['friendRequests'],
    queryFn: async ({ pageParam }) => {
      const { getFriendRequests: data } =
        await makeGraphQLRequest<GetFriendRequestsQuery>({
          document: GET_FRIEND_REQUESTS,
          variables: { page: pageParam },
        });
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage && lastPage.length > 0) {
        return allPages?.length;
      }
      return undefined;
    },
    initialPageParam: 0,
  });

  useFocusEffect(
    useCallback(() => {
      queryClient.setQueryData(
        ['unreadNotificationsCount'],
        (oldData: number | undefined) => {
          if (oldData === undefined || oldData === null) {
            return 0;
          }
          if (oldData > 0) {
            return 0;
          }
          return oldData;
        }
      );
    }, [queryClient])
  );

  useEffect(() => {}, [queryClient]);

  async function onRefreshNotification() {
    await refetchNotifications();
    setRefreshingNotifications(false);
  }

  async function onRefreshRequests() {
    await refetchFriendRequests();
    setRefreshingRequests(false);
  }

  return {
    notifications: notifications?.pages.flat() || [],
    hasMoreNotifications,
    fetchMoreNotifications,
    isLoadingNotifications,
    isFetchingMoreNotifications,
    theme,
    friendRequests: friendRequestsData?.pages.flat() || [],
    hasMoreFriendRequests,
    fetchMoreFriendRequests,
    isLoadingFriendRequests,
    isFetchingMoreFriendRequests,
    refreshingNotification,
    refreshingRequests,
    onRefreshNotification,
    onRefreshRequests,
  };
}
