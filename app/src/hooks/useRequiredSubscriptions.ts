import { useCallback } from 'react';
import {
  HeartbeatQuery,
  Notification,
  NotificationsSubscription,
} from '../__generated__/graphql';
import { useSubscription } from './useSubscription';
import { NOTIFICATIONS_SUBSCRIPTION } from '../services/notifications/subscriptions/notifications';
import { InfiniteData, useQuery, useQueryClient } from '@tanstack/react-query';
import { makeGraphQLRequest } from '../lib/graphQLClient';
import { HEARTBEAT } from '../services/users/query/heartbeat';
import { HEARTBEAT_INTERVAL } from '../lib/constants';

export function useRequiredSubscriptions(enabled: boolean) {
  const queryClient = useQueryClient();

  const handleNewNotifications = useCallback(
    (notification: NotificationsSubscription | null) => {
      if (!notification || !notification.notifications) return;
      const { notifications: data } = notification;
      if (!data) return;
      if (data.postId || data.replyId) {
        queryClient.setQueryData(
          ['notifications'],
          (oldData: InfiniteData<Notification>) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              pages: [data, ...oldData.pages],
            };
          }
        );
      }
      if (data.friendshipId) {
        queryClient.setQueryData(
          ['friendRequests'],
          (oldData: InfiniteData<Notification> | undefined) => {
            if (!oldData) {
              return oldData;
            }
            return {
              ...oldData,
              pages: [data, ...oldData.pages],
            };
          }
        );
      }

      queryClient.setQueryData(
        ['unreadNotificationsCount'],
        (oldData: number) => {
          if (oldData === undefined) {
            return 0;
          }
          return oldData + 1;
        }
      );
    },
    []
  );

  useSubscription<NotificationsSubscription>({
    connectionParams: {
      isStatus: false,
      isTracking: false,
    },
    request: {
      query: NOTIFICATIONS_SUBSCRIPTION,
    },
    onData: handleNewNotifications,
    enabled,
  });

  useQuery({
    queryKey: ['heartbeat'],
    enabled,
    queryFn: async () => {
      try {
        await makeGraphQLRequest<HeartbeatQuery>({
          document: HEARTBEAT,
        });
        return 1;
      } catch (e) {
        console.log(e);
        return null;
      }
    },
    refetchInterval: HEARTBEAT_INTERVAL,
  });
}
