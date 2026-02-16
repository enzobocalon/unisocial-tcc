import { gql } from '../../../__generated__';

export const ADD_USER_TO_ASSIGNMENT = gql(`
  mutation addUserToAssignment($assignmentId: String!, $users: [String!]!) {
    addUserToAssignment(data: {
      assignmentId: $assignmentId,
      usersIds: $users
    }) {
      success,
      message
    }
  }
`);
