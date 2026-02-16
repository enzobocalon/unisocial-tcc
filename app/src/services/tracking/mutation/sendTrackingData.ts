import { gql } from '../../../__generated__';

export const SEND_TRACKING_DATA = gql(`
  mutation sendTrackingData($latitude: Float!, $longitude: Float!) {
    sendTrackingData(data: {
      latitude: $latitude,
      longitude: $longitude
    }) {
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
