import { gql } from '../../../__generated__';

export const CAN_NAVIGATE = gql(`
  query canNavigateBetweenAssignmentAndChat($assignmentId: String!, $chatId: String!) {
    canNavigateBetweenAssignmentAndChat(assignmentId: $assignmentId, chatId: $chatId) {
      message,
      success
    }
  }  
`);
