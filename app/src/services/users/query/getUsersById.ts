import { gql } from '../../../__generated__';

export const GET_USERS_BY_ID = gql(`
  query getUsersById($ids: [String!]!, $page: Float!) {
    getUsersById(ids: $ids, page: $page) {
      avatar
      id
      name
      username
      friendship {
        id,
        friendId,
        userId,
        status
      }
    }
  }
`);
