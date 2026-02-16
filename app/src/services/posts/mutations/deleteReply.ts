import { gql } from '../../../__generated__';

export const DELETE_REPLY = gql(`
  mutation deleteReply($id: String!) {
    deleteReply(id: $id) {
      message,
      success
    }
  }
`);
