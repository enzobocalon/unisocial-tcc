import { gql } from '../../../__generated__';

export const GET_CHAT_BY_USER = gql(`
  query getChatByUserMember($userId: String!) {
    getChatByUserMember(userId: $userId) {
      id,
      isDirect,
      name,
      type,
      createdAt,
      isOnline,
    }
  }
`);
