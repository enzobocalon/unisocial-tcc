import { gql } from '../../../__generated__';

export const GET_ASSIGNMENT_FRIENDS = gql(`
  query getAssignmentFriends($assignmentId: String!, $page: Float!) {
    getAssignmentFriends(assignmentId: $assignmentId, page: $page) {
      hasNextPage,
      count,
      data {
        friends {
          id,
          isMember,
          name,
          avatar,
          username
        }
        letter
      }
    }
  }
`);
