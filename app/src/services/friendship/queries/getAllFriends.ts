import { gql } from '../../../__generated__';

export const GET_ALL_FRIENDS = gql(
  `query getAllFriends($page: Float!) {
    getAllFriends(page: $page) {
      id,
      name,
      username,
      avatar
    }
  }`
);
