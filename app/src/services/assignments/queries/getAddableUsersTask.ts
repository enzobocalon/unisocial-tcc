import { gql } from '../../../__generated__';

export const GET_ADDABLE_USERS = gql(`
  query getAddableUsers($assignmentId: String!, $page: Float!, $taskId: String!) {
    getAddableUsers(assignmentId: $assignmentId, page: $page, taskId: $taskId) {
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
     hasNextPage,
     count
    }
  }  
`);
