import { gql } from '../../../__generated__';

export const UPDATE_PROFILE = gql(`
  mutation updateProfile($data: UpdateProfileDTO!) {
    updateProfile(data: $data) {
      id
      name
      username
      bio
      avatar
      banner
      course {
        id
        name
      }
    }
  }
  `);
