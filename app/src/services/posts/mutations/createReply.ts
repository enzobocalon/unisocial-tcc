import { gql } from '../../../__generated__';

export const CREATE_REPLY = gql(`
  mutation createReply($content: String, $medias: [String!], $postId: String!, $parentId: String) {
    createReply(data: {
      content: $content, medias: $medias, postId: $postId, parentId: $parentId
    }) {
      id
      content,
      createdAt,
      user {
        id
        name
        avatar
        username
      },
      likes
      parentId,
      postId,
      mentions {
        id
        name
        avatar
        username
      },
      replies,
      liked,
      medias {
        id
        replyId
        url
        postId
      }
    }
  }
`);
