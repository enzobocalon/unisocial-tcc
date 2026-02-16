import { gql } from '../../../__generated__';

export const LEAVE_ASSIGNMENT = gql(`
  mutation leaveAssignment($assignmentId: String!) {
    leaveAssignment(assignmentId: $assignmentId) {
      success,
      message
    }
  }
`);
