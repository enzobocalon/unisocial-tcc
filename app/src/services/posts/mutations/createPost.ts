import { gql } from '../../../__generated__';

export const CREATE_POST = gql(`
  mutation createPost($content: String, $medias: [String!]) {
    createPost(data: {
      content: $content, medias: $medias
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
