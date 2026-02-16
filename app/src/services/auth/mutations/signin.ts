import { gql } from '../../../__generated__/gql';

export const SIGNIN = gql(`
  mutation signin($email: String!, $password: String!) {
    signin(data: { email: $email, password: $password }) {
      token
      refreshToken
    }
  }
`);
