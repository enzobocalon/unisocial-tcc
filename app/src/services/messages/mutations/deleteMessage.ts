import { gql } from '../../../__generated__';

export const DELETE_MESSAGE = gql(`
  mutation deleteMessage($messageId: String!, $chatId: String!) {
    deleteMessage(
      messageId: $messageId, chatId: $chatId
    ) {
      success,
      message
  }
  }
`);
