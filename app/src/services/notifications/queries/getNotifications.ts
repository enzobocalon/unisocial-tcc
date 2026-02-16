import { gql } from '../../../__generated__';

export const GET_NOTIFICATIONS = gql(`
  query getNotifications($page: Float!) {
    getNotifications(page: $page) {
      id
      postId,
      replyId,
      assignmentId,
      taskId,
      friendshipId,
      emitters {
        id
        username
        avatar
        name
      }
      message
      status
      type {
        name
      }
      createdAt
      post {
      content,
      mentions {
        user {
          name,
          username
        }
      }
    }
    reply {
      content,
      mentions {
        name,
        username
      }
    }
    }
  }
`);
