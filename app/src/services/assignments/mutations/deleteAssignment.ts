import { gql } from '../../../__generated__';

export const DELETE_ASSIGNMENT = gql(`
  mutation deleteAssignment($assignmentId: String!) {
    deleteAssignment(assignmentId: $assignmentId) {
      success,
      message
    }
  }
`);
