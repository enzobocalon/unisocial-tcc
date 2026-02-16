import { gql } from '../../../__generated__/gql';

export const GET_POST_MEDIA_BY_USER = gql(`
  query findPostMediaByUserId($id: String!, $page: Float!) {
    findPostMediaByUserId(id: $id, page: $page) {
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
      parentId
      isShared
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
