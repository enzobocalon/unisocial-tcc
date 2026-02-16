import { gql } from '../../../__generated__';

export const REFRESH_TOKEN = gql(`
  query refreshToken($refreshToken: String!) { 
    refreshToken(refreshToken: $refreshToken) {
      token,
      refreshToken
  }}
`);
