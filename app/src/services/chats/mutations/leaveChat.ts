import { gql } from '../../../__generated__';

export const LEAVE_CHAT = gql(`
  mutation leaveChat($chatId: String!, $user: String!) {
    leaveChat(data: {
      chatId: $chatId,
      userToRemoveId: $user
    }) {
      id
      isDirect
      name
      type
      createdAt
      icon,
    }
  }
`);
