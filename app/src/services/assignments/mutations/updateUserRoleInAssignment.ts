import { gql } from '../../../__generated__';

export const UPDATE_USER_ROLE_IN_ASSIGNMENT = gql(`
  mutation updateUserRoleInAssignment($userId: String!, $isAdmin: Boolean!, $assignmentId: String!) {
    updateUserRoleInAssignment(data: {
      userId: $userId,
      assignmentId: $assignmentId,
      isAdmin: $isAdmin
    }) {
      message,
      success,
    }
  }
`);
