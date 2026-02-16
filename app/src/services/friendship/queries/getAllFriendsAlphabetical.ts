import { gql } from '../../../__generated__';

export const GET_ALL_FRIENDS_ALPHABETICALLY = gql(
  `query getAllFriendsAlphabetically($page: Float!) {
    getAllFriendsAlphabetically(page: $page) {
      data,
      hasNextPage
    }
  }`
);
