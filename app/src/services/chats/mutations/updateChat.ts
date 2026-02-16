import { gql } from '../../../__generated__';

export const UPDATE_CHAT = gql(`
  mutation updateChatSettings($icon: String, $name: String, $chatId: String!, $type: ChatType!) {
    updateChatSettings(data: {
      icon: $icon,
      chatId: $chatId,
      type: $type,
      name: $name
    }) {
      id
      isDirect
      name
      type
      createdAt
      isOnline
      isAdmin
    }
  }
`);
