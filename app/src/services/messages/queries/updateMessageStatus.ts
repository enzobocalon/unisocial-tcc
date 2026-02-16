import { gql } from '../../../__generated__';

export const UPDATE_MESSAGE_STATUS = gql(`
  mutation updateMessagesStatus($chatId: String!) {
    updateMessagesStatus(chatId: $chatId) {
      message,
      success
    }
  }
`);
