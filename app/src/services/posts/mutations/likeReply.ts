import { gql } from '../../../__generated__';

export const LIKE_REPLY = gql(`
  mutation likeReply($replyId: String!) {
    likePost(id: $replyId, entity: "REPLY") {
      message,
      success
    }
  }
`);
