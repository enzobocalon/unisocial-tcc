import { gql } from '../../../__generated__';

export const GET_ALL_FILES = gql(`
  query getAllFilesByTaskId($taskId: String!, $page: Float!) {
    getAllFilesByTaskId(page: $page, taskId: $taskId) {
      user {
        id,
        user {
          id,
          name,
          username,
          avatar
        }
      },
      files {
        filename,
        url,
        type,
        id
      }
    }
  }  
`);
