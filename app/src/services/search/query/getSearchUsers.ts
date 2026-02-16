import { gql } from '../../../__generated__';

export const SEARCH_USERS = gql(`
  query searchUsers($query: String!, $page: Float!) {
    searchUsers(query: $query, page: $page) {
      id,
      name,
      username,
      avatar,
      friendship {
        id,
        friendId,
        userId,
        status
      }
  }}
`);
