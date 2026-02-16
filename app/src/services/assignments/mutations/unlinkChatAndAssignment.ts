import { gql } from '../../../__generated__';

export const UNLINK_CHAT_AND_ASSIGNMENT = gql(`
  mutation unlinkChatAndAssignment($assignmentId: String!, $chatId: String!) {
    unlinkChatAndAssignment(assignmentId: $assignmentId, chatId: $chatId) {
      success,
      message
    }
  }
`);
