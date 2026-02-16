import { gql } from '../../../__generated__';

export const SEND_MESSAGE_IN_CHAT = gql(`
  mutation sendMessage($content: String, $chatId: String, $medias: [String!]) {
    sendMessage(data: {
      content: $content, medias: $medias, chatId: $chatId
    }) {
      id,
      content,
      createdAt,
      deletedAt,
      hasMedia,
      media, {
        id,
        messageId,
        url,
      },
      user {
        id,
        username,
        avatar,
        name
      },
    }
  }
`);
