import { gql } from '../../../__generated__';

export const GET_USER_TASKS_BY_ASSIGNMENT_ID = gql(`
  query getUsersTaskByAssignmentId($assignmentId: String!, $page: Float!) {
    getUsersTaskByAssignmentId(assignmentId: $assignmentId, page: $page) {
      dueDate,
      item {
        name,
        id,
        isPending,
        dueDate,
        description
      }
    }
  }  
`);
