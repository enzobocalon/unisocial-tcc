import { gql } from '../../../__generated__';

export const UNLIKE_REPLY = gql(`
  mutation unlikeReply($replyId: String!) {
    unlikePost(id: $replyId, entity: "REPLY") {
      message,
      success
    }
  }
`);
