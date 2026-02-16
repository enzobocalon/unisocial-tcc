import { gql } from '../../../__generated__';

export const LIKE_POST = gql(`
  mutation likePost($postId: String!) {
    likePost(id: $postId, entity: "POST") {
      message,
      success
    }
  }
`);
