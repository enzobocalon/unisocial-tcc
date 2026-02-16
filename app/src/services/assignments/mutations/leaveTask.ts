import { gql } from '../../../__generated__';

export const LEAVE_TASK = gql(`
  mutation leaveTask($taskId: String!) {
    leaveTask(taskId: $taskId) {
      success,
      message
    }
  }
`);
