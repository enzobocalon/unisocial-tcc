import { gql } from '../../../__generated__';

export const GET_ASSIGNMENT_USERS = gql(`
  query getAssignmentUsers($assignmentId: String!, $page: Float!) {
    getAssignmentUsers(assignmentId: $assignmentId, page: $page) {
      id,
      isAdmin,
      assignmentId,
      userId,
      user {
        id,
        name,
        username,
        avatar
      }
    }
  }  
`);
