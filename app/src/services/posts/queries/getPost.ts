import { gql } from '../../../__generated__';

export const GET_POST_BY_ID = gql(`
  query postById($id: String!) {
    postById(id: $id) {
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
