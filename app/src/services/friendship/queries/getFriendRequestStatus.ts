import { gql } from '../../../__generated__';

export const GET_FRIEND_REQUEST_STATUS = gql(
  `query getFriendRequestStatus($id: String!) {
    getFriendRequestStatus(id: $id)
  }`
);
