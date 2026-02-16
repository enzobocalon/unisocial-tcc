import { gql } from '../../../__generated__';

export const SEARCH_FRIENDS_ALPHABETICALLY = gql(
  `mutation searchFriendsAlphabetically($page: Float!, $value: String!) {
    searchFriendsAlphabetically(page: $page, value: $value) {
      data,
      hasNextPage
    }
  }`
);
