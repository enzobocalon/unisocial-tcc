import { gql } from '../../../__generated__/gql';

export const UNSHARE_POST = gql(`
  mutation unsharePost($postId: String!) {
    unshare(postId: $postId) {
      success,
      message
      compl_data,
    }
  }
`);
