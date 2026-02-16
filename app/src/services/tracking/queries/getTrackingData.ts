import { gql } from '../../../__generated__';

export const GET_TRACKING_DATA = gql(`
  query getTrackingData {
    getTrackingData {
      id,
      latitude,
      longitude,
      avatar,
      name,
      username
    }
  }
`);
