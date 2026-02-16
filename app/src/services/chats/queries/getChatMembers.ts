import { gql } from '../../../__generated__';

export const GET_CHAT_MEMBERS = gql(`
  query getChatMembers($chatId: String!, $page: Float!) {
    getChatMembers(chatId: $chatId, page: $page) {
      id,
      isAdmin,
      user {
        name,
        id,
        avatar,
        username,
      }
    }
  }
`);
