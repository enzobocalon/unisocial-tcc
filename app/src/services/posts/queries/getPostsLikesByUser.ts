import { gql } from '../../../__generated__/gql';

export const GET_LIKED_POSTS_BY_USER = gql(`
  query getPostLikesByUserId($id: String!, $page: Float!) {
    getPostLikesByUserId(id: $id, page: $page) {
      id
      content
      key
      actions {
        author {
          id
          avatar
          name
          username
        }
        createdAt
        id
        type
      }
      createdAt
      updatedAt
      hasMedia
      isShared
      parentId
      liked
      user {
        name
        avatar
        id
        username
      }
      media {
        id
        url
      }
      shared
      shares
      likes
      replies
      parent {
        id
        content
        user {
          avatar
          id
          name
          username
        }
        hasMedia
        createdAt
        updatedAt
        media {
          id
          url
        }
      }
    }
  }
`);
