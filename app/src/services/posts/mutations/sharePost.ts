import { gql } from '../../../__generated__';

export const SHARE_POST = gql(`
  mutation sharePost($content: String, $medias: [String!], $parentId: String!) {
    share(data: {
      content: $content,
      medias: $medias,
      parentId: $parentId
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
