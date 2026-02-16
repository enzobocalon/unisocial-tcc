import { gql } from '../../../__generated__';

export const INVALIDATE_TRACKING = gql(`
  mutation invalidateTracking {
    invalidateTracking {
      id,
      latitude,
      longitude,
      building,
      avatar,
      name,
      username
    }
  }
`);
