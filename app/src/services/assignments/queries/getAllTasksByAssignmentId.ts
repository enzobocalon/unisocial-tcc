import { gql } from '../../../__generated__';

export const GET_ALL_TASKS_BY_ASSIGNMENT_ID = gql(`
  query getAllTasksByAssignmentId($assignmentId: String!, $page: Float!) {
    getAllTasksByAssignmentId(assignmentId: $assignmentId, page: $page) {
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
