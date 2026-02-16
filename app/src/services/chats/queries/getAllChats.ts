import { gql } from '../../../__generated__';

export const GET_CHATS = gql(`
  query getAllChats($page: Float!) {
    getAllChats(page: $page) {
      chat {
      id,
      isDirect,
      name,
      type,
      icon,
      unreadMessages,
      createdAt,
      isOnline,
      directUserMember,
    },
    message {
      content,
      id,
      createdAt,
      hasMedia,
      user {
      	name,
        username,
        id,
        avatar
      },
      media {
      	id,
        url,
      },
      messageStatus {
        status,
        messageId,
        user {
          id,
          name,
          username,
          avatar
        },
        userId,
      }
    },
    chatAction {
      action,
      actionAuthor {
        avatar,
        name,
        username,
        id
      },
      user  {
        avatar,
        id,
        name,
        username
      },
      createdAt
      chatId,
      id,
    }
    }
  }
`);
