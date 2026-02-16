import { gql } from '../../../__generated__';

export const REMOVE_USER_FROM_ASSIGNMENT = gql(`
  mutation removeUserFromAssignment($assignmentId: String!, $userId: String!) {
    removeUserFromAssignment(data: {
      assignmentId: $assignmentId,
      userIdToRemove: $userId
    }) {
      success,
      message
    }
  }
`);
