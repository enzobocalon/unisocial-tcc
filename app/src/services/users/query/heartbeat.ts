import { gql } from '../../../__generated__';

export const HEARTBEAT = gql(`
  query heartbeat {
    heartbeat {
      success,
      message
    }
  }
`);
