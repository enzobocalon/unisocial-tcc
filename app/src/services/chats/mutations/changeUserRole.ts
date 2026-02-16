import { gql } from '../../../__generated__';

export const CHAGE_USER_ROLE = gql(`
  mutation changeUserRole($chatId: String!, $userId: String!, $isAdmin: Boolean!) {
    changeUserRole(
      data: {
        chatId: $chatId,
        userToUpdateId: $userId,
        isAdmin: $isAdmin
      }
    ) {
      success,
      message
  }
  }
`);
