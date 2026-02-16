import { gql } from '../../../__generated__';

export const TRANSFER_ASSIGNMENT_OWNERSHIP = gql(`
  mutation transferAssignmentOwnership($assignmentId: String!, $userId: String!) {
    transferAssignmentOwnership(assignmentId: $assignmentId, userId: $userId) {
      success,
      message
    }
  }
`);
