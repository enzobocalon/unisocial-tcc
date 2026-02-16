import { gql } from '../../../__generated__';

export const NOTIFICATIONS_SUBSCRIPTION = gql(`
  subscription notifications {
    notifications {
      id
      postId,
      replyId,
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
