import { gql } from '../../../__generated__';

export const ADD_USER_TO_TASK = gql(`
  mutation addUsersToTask($taskId: String!, $users: [String!]!) {
    addUsersToTask(data: {
      taskId: $taskId,
      userIds: $users
    }) {
      success,
      message
    }
  }
`);
