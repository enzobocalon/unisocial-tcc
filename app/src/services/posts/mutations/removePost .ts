import { gql } from '../../../__generated__';

export const REMOVE_POST = gql(`
  mutation removePost($id: String!) {
    removePost(id: $id) {
      id
    }
  }  
`);
