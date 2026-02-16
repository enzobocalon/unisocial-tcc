import { gql } from '../../../__generated__';

export const GET_LIKES = gql(`
  query getLikeByPostId($postId: String!, $page: Float!) {
    getLikeByPostId(id: $postId, page: $page) {
      like {
        id
        username
        avatar
        name
      }
      count
    }
  }
`);
