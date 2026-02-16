import { gql } from '../../../__generated__';

export const GET_ASSIGNMENTS = gql(`
  query getAssignments($page: Float!) {
    getAssignments(page: $page) {
      dueDate,
      item {
        dueDate,
        icon,
        id,
        isPending,
        name,
        pendingCount,
      }
    }
  }  
`);
