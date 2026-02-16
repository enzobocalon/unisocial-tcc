import { gql } from '../../../__generated__';

export const GET_UNREAD_NOTIFICATIONS = gql(`
  query unreadNotifications {
    unreadNotifications
  }
`);
