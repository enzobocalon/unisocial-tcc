import { gql } from '../../../__generated__';

export const LINK_CHAT_TO_ASSIGNMENT = gql(`
  mutation linkChatToAssignment($assignmentId: String!, $chatId: String!) {
    linkChatToAssignment(assignmentId: $assignmentId, chatId: $chatId) {
      success,
      message
    }
  }
`);
