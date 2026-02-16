import { gql } from '../../../__generated__';

export const GET_FRIEND_REQUESTS = gql(`
  query getFriendRequests($page: Float!) {
    getFriendRequests(page: $page) {
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
