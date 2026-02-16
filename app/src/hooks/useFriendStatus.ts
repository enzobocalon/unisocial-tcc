import { useCallback } from 'react';
import { FriendStatusSubscription } from '../__generated__/graphql';
import { FRIENDS_STATUS } from '../services/friendship/subscriptions/friendsStatus';
import { useSubscription } from './useSubscription';

interface Params {
  cb: (data: FriendStatusSubscription['friendStatus']) => void;
}

export function useFriendsStatus({ cb }: Params) {
  const { data } = useSubscription<FriendStatusSubscription>({
    request: {
      query: FRIENDS_STATUS,
    },
    connectionParams: {
      isStatus: false,
      isTracking: false,
    },
    onData: (data) => handleData(data?.friendStatus),
  });

  const handleData = useCallback(
    (data: FriendStatusSubscription['friendStatus'] | undefined) => {
      if (!data) return;
      cb(data);
    },
    []
  );

  return {
    data,
  };
}
