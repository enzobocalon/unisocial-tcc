import { gql } from '../../__generated__';

export const GET_COURSE_TIMELINE = gql(`
  query timelineByCourse($page: Float!) {
    timelineByCourse(page: $page) {
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
      parentId
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
