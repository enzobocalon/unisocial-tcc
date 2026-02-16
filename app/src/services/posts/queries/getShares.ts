import { gql } from '../../../__generated__';

export const GET_SHARES = gql(`
  query getShareByPostId($postId: String!, $page: Float!) {
    getShareByPostId(postId: $postId, page: $page){
      share {
        id,
        user {
          avatar,
          id,
          username,
          name
        }
      }
      count
    }
  }
`);
