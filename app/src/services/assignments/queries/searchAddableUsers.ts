import { gql } from '../../../__generated__';

export const SEARCH_ADDABLE_USERS = gql(`
  query searchAddableUsers($assignmentId: String!, $taskId: String!, $page: Float!, $query: String!) {
    searchAddableUsers(assignmentId: $assignmentId, page: $page, taskId: $taskId, query: $query) {
      data {
      letter,
      friends {
        id,
        isMember,
				user {
          name,
          avatar,
          username,
          id
        }
      }
    },
    hasNextPage
    }
  }  
`);
