import { gql } from '../../../__generated__';

export const GET_MENTIONABLE_USERS = gql(
  `query getMentionableUsers($content: String!) {
    getMentionableUsers(content: $content) {
      id,
      name,
      username,
      avatar
    }
  }`
);
