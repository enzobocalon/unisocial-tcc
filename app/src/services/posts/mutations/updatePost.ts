import { gql } from '../../../__generated__';

export const UPDATE_POST = gql(`
  mutation updatePost($id: String!, $content: String, $medias: [String!]) {
    updatePost(updatePost: {
      content: $content, medias: $medias, id: $id
    }) {
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
        content
        user {
          avatar
          id
          name
          username
        }
        hasMedia
        createdAt
        media {
          id
          url
        }
      }
    }
  }
`);
