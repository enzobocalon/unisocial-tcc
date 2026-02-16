import { gql } from '../../../__generated__';

export const GET_ASSIGNMENT_BY_ID = gql(`
  query getAssignmentById($assignmentId: String!) {
    getAssignmentById(assignmentId: $assignmentId) {
      id,
      name,
      icon,
      createdAt,
      ownerId,
      isAdmin,
      chatId,
    }
  }  
`);
