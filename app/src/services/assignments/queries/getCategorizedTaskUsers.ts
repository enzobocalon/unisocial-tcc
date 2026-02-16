import { gql } from '../../../__generated__';

export const GET_CATEGORIZED_TASK_USERS = gql(`
  query getCategorizedTaskUsers($assignmentId: String!, $page: Float!) {
    getCategorizedTaskUsers(assignmentId: $assignmentId, page: $page) {
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
