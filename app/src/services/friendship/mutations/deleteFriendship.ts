import { gql } from '../../../__generated__';

export const DELETE_FRIENDSHIP = gql(`
  mutation deleteFriendship($friendshipId: String!) {
    deleteFriendship(id: $friendshipId) {
      message,
      success
      compl_data
    }
  }
`);
