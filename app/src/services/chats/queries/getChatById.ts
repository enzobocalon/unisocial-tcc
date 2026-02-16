import { gql } from '../../../__generated__';

export const GET_CHAT_BY_ID = gql(`
  query getChatById($chatId: String!) {
    getChatById(chatId: $chatId) {
      id,
      isDirect,
      name,
      type,
      createdAt,
      isOnline,
      icon,
      isAdmin,
      ownerId,
      directUserMember
    }
  }
`);
