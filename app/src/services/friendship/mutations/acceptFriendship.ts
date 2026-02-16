import { gql } from '../../../__generated__';

export const ACCEPT_FRIENDSHIP = gql(`
  mutation acceptFriendship($friendshipId: String!) {
    acceptFriendship(id: $friendshipId) {
      message,
      success
      compl_data
    }
  }
`);
