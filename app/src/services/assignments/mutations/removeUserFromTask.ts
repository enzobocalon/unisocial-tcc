import { gql } from '../../../__generated__';

export const REMOVE_USER_FROM_TASK = gql(`
  mutation removeUsersFromTask($taskId: String!, $userIds: [String!]!) {
    removeUsersFromTask(data: {
      taskId: $taskId,
      userIds: $userIds
    }) {
      success,
      message
    }
  }
`);
