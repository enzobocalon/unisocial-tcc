import { gql } from '../../../__generated__';

export const ADD_USER_TO_CHAT = gql(`
  mutation addUserToChat($chatId: String!, $users: [String!]!) {
    addUserToChat(data: {
      chatId: $chatId,
      userToAddId: $users
    }) {
      id
      isDirect
      name
      type
      createdAt
      icon,
    }
  }
`);
