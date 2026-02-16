import { gql } from '../../../__generated__';

export const TRACKING_SUBSCRIPTION = gql(`
  subscription tracking {
    tracking {
      id,
      latitude,
      longitude,
      avatar,
      name,
      username
    }
  }
`);
