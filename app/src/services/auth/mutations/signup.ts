import { gql } from '../../../__generated__';

export const SIGNUP = gql(`
  mutation signup($data: SignupDTO!) {
    signup(data: $data) {
      message,
      success
    }
  }
`);
