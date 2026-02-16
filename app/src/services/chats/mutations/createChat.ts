import { gql } from '../../../__generated__';

export const CREATE_CHAT = gql(`
  mutation createChat($icon: String, $users: [String!], $type: ChatType!, $name: String, $isDirect: Boolean!) {
    createChat(data: {
      icon: $icon
      users: $users
      type: $type
      name: $name
      isDirect: $isDirect
    }) {
      id
      isDirect
      name
      type
      createdAt
      isOnline
    }
  }
`);
