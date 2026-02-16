import { gql } from '../../../__generated__';

export const GET_REPLIES = gql(`
  query replies($postId: String!, $page: Float!) {
    replies(id: $postId, page: $page) {
      id
      content
      likes
      liked
      user {
        avatar
        id
        username
        name
      },
      medias {
        id
        replyId
        url
        postId
      }
      parentId
      postId
      createdAt,
      replies
    }
  }
`);

export const GET_CHILDREN_REPLIES = gql(`
query getChildrenReplies($postId: String!, $replyId: String!, $page: Float!) {
  getChildrenReplies(postId: $postId, parentId: $replyId, page: $page) {
    id
    content
    likes
    liked
    mentions {
      avatar
      id
      username
      name
    }
    user {
      avatar
      id
      username
      name
    }
    parentId
    postId
    createdAt,
    replies
  }
}
`);
