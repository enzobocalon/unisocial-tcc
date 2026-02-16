import { gql } from '../../../__generated__';

export const CREATE_FRIENDSHIP = gql(`
  mutation createFriendship($friendId: String!) {
    createFriendship(data: {
      friendId: $friendId
    }) {
      message,
      success,
      compl_data
    }
  }
`);
