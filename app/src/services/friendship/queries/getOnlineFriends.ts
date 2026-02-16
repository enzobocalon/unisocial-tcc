import { gql } from '../../../__generated__';

export const GET_ONLINE_FRIENDS = gql(
  `query getAllOnlineFriends {
    getAllOnlineFriends {
      id,
      name,
      username,
      avatar
    }
  }`
);
