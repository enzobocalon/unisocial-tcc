import { gql } from '../../../__generated__';

export const GET_CHAT_MESSAGES = gql(`
  query getChatMessages($chatId: String!, $page: Float!) {
    getChatMessages(chatId: $chatId, page: $page) {
      id,
      createdAt,
      system,
      message {
          content,
          hasMedia,
          media, {
            urls,
          },
        }
      author {
          id,
          username,
          avatar,
          name
        },
        action {
          action,
          user {
            avatar,
            username,
            name
          },
          message
        }
    }
  }
`);
