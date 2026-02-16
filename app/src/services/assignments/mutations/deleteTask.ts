import { gql } from '../../../__generated__';

export const DELETE_TASK = gql(`
  mutation deleteAssignmentTask($taskId: String!) {
    deleteAssignmentTask(taskId: $taskId) {
      success,
      message
    }
  }
`);
