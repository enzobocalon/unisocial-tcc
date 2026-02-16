import { gql } from '../../../__generated__';

export const GET_PROFILE = gql(`
  query getUserProfile($id: String!) {
    getUserProfile(id: $id) {
      avatar
      id
      name
      bio
      username,
      banner,
      friendsCount,
      course {
        name,
        id
      }
      friendship {
        id
        friendId,
        status
      }
    }
  }
`);
