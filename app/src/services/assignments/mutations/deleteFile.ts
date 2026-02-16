import { gql } from '../../../__generated__';

export const DELETE_FILE = gql(`
  mutation deleteFile($taskId: String!, $fileUrl: String!) {
    deleteFile(taskId: $taskId, fileUrl: $fileUrl) {
      success,
      message
    }
  }
`);
