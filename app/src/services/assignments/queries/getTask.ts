import { gql } from '../../../__generated__';

export const GET_TASK = gql(`
  query getTask($taskId: String!) {
    getTask(taskId: $taskId) {
      files {
    	url,
      userId,
      filename,
    },
      id,
      assignmentId,
      description,
      name,
      dueDate
      completed,
      isMember,
      totalCount,
      completedCount,
      ownerId,
    }
  }  
`);
