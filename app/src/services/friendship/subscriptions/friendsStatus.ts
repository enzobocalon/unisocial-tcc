import { gql } from '../../../__generated__';

export const FRIENDS_STATUS = gql(`
  subscription friendStatus {
    friendStatus {
      id,
      online,
      name,
      avatar,
      username,
    }
  }  
`);
