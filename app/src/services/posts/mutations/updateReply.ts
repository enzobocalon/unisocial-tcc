import { gql } from '../../../__generated__';

export const UPDATE_REPLY = gql(`
  mutation updateReply($id: String!, $content: String, $medias: [String!]) {
    updateReply(data: {
      id: $id,
      content: $content, 
      medias: $medias
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
      medias {
        id
        replyId
        url
        postId
      }
      replies,
      liked
    }
  }
`);
