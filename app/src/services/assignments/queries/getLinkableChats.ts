import { gql } from '../../../__generated__';

export const GET_LINKABLE_CHATS = gql(`
  query getLinkableChats($assignmentId: String!, $page: Float!) {
    getLinkableChats(assignmentId: $assignmentId, page: $page) {
      icon,
      name,
      id
    }
  }  
`);
