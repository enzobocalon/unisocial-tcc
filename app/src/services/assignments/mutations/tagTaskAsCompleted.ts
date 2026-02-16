import { gql } from '../../../__generated__';

export const TAG_TASK_AS_COMPLETED = gql(`
  mutation tagTaskAsCompleted($taskId: String!) {
    tagTaskAsCompleted(taskId: $taskId) {
      success,
      message
    }
  }
`);
