import { gql } from '../../../__generated__';

export const GET_CHAT_FRIENDS = gql(`
  query getChatFriends($chatId: String!, $page: Float!) {
    getChatFriends(chatId: $chatId, page: $page) {
      hasNextPage,
      count,
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
