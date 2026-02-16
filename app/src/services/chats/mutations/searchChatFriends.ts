import { gql } from '../../../__generated__';

export const SEARCH_CHAT_FRIENDS = gql(`
  mutation searchChatFriends($chatId: String!, $page: Float!, $query: String!) {
    searchChatFriends(chatId: $chatId, page: $page, query: $query) {
      hasNextPage,
      data {
        friends {
          id,
          isMember,
          name,
          avatar,
          username
        }
        letter
      }
    }
  }
`);
