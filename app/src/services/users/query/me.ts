import { gql } from '../../../__generated__';

export const ME = gql(`
  query me {
    me {
      avatar
      id
      name
      username
      banner
      bio
      course {
        id
        name
      }
    }
  }
`);
