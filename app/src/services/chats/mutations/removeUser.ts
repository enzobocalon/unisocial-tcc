import { gql } from '../../../__generated__';

export const REMOVE_USER_FROM_CHAT = gql(`
  mutation removeUserFromChat($chatId: String!, $user: String!) {
    removeUserFromChat(data: {
      chatId: $chatId,
      userToRemoveId: $user
    }) {
      id
      isDirect
      name
      type
      createdAt
      icon,
      isAdmin
    }
  }
`);
