import { gql } from '../../../__generated__';

export const GET_TASK_MEMBERS = gql(`
  query getTaskMembers($taskId: String!, $page: Float!) {
    getTaskMembers(taskId: $taskId, page: $page) {
      user {
        avatar,
        name,
        username,
        id
      },
      id,
      userId,
      completed
    }
  }  
`);
