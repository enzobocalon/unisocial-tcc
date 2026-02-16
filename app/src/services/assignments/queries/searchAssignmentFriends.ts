import { gql } from '../../../__generated__';

export const SEARCH_ASSIGNMENT_FRIENDS = gql(`
  query searchAssignmentFriends($assignmentId: String!, $page: Float!, $query: String!) {
    searchAssignmentFriends(assignmentId: $assignmentId, page: $page, query: $query) {
      hasNextPage,
      data {
        friends {
           id,
           isMember,
           name,
           avatar,
           username
         }
         letter
       }
    }
  }  
`);
