import { gql } from '../../../__generated__';

export const UNLIKE_POST = gql(`
  mutation unlikePost($postId: String!) {
    unlikePost(id: $postId, entity: "POST") {
      message,
      success
    }
  }
`);
