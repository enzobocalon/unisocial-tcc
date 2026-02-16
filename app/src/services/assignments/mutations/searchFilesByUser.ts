import { gql } from '../../../__generated__';

export const SEARCH_FILES = gql(`
  mutation searchFilesByUser($taskId: String!, $query: String!, $page: Float!) {
    searchFilesByUser(page: $page, taskId: $taskId, query: $query) {
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
