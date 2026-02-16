import { useMutation } from '@tanstack/react-query';
import { makeGraphQLRequest } from '../lib/graphQLClient';
import { CREATE_FRIENDSHIP } from '../services/friendship/mutations/createFriendshipt';
import { ACCEPT_FRIENDSHIP } from '../services/friendship/mutations/acceptFriendship';
import { DELETE_FRIENDSHIP } from '../services/friendship/mutations/deleteFriendship';
import {
  AcceptFriendshipMutation,
  CreateFriendshipMutation,
  DeleteFriendshipMutation,
} from '../__generated__/graphql';

export function useFriendship() {
  const {
    mutateAsync: createFriendship,
    isPending: isPendingCreateFriendship,
  } = useMutation({
    mutationKey: ['createFriendship'],
    mutationFn: async (friendId: string) => {
      try {
        const { createFriendship: data } =
          await makeGraphQLRequest<CreateFriendshipMutation>({
            document: CREATE_FRIENDSHIP,
            variables: {
              friendId,
            },
          });
        return data;
      } catch (e) {
        console.log('createFriend error', e);
      }
    },
  });

  const {
    mutateAsync: acceptFriendship,
    isPending: isPendingAcceptFriendship,
  } = useMutation({
    mutationKey: ['acceptFriendship'],
    mutationFn: async (friendshipId: string) => {
      try {
        const { acceptFriendship: data } =
          await makeGraphQLRequest<AcceptFriendshipMutation>({
            document: ACCEPT_FRIENDSHIP,
            variables: {
              friendshipId,
            },
          });
        return data;
      } catch (e) {
        console.log('acceptFriendship error', e);
      }
    },
  });

  const {
    mutateAsync: deleteFriendship,
    isPending: isPendingDeleteFriendship,
  } = useMutation({
    mutationKey: ['deleteFriendship'],
    mutationFn: async (friendshipId: string) => {
      try {
        const { deleteFriendship: data } =
          await makeGraphQLRequest<DeleteFriendshipMutation>({
            document: DELETE_FRIENDSHIP,
            variables: {
              friendshipId,
            },
          });
        return data;
      } catch (e) {
        console.log('deleteFriendship error', e);
      }
    },
  });

  return {
    createFriendship,
    acceptFriendship,
    deleteFriendship,
    isPendingAcceptFriendship,
    isPendingDeleteFriendship,
    isPendingCreateFriendship,
  };
}
