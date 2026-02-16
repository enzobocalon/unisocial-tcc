import { gql } from '../../../__generated__';

export const SEARCH = gql(`
  query search($query: String!, $page: Float!) {
    search(query: $query, page: $page) {
      users {
      id,
      name,
      username,
      avatar,
      friendship {
        id,
        friendId,
        userId,
        status
      }
    },
    posts {
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
        updatedAt
        id
        type
      }
      createdAt
      hasMedia
      updatedAt
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
    }}
  }
`);
