import { gql } from '../../../__generated__';

export const USER_STATUS = gql(`
  subscription userStatus {
    userStatus {
      id
    }
  }  
`);
