import { gql } from '../../../__generated__';

export const CHATS_SUB = gql(`
  subscription chats {
    chats {
    chat {
      id,
      isDirect,
      name,
      type,
      unreadMessages,
      ownerId,
      createdAt,
      icon
    },
    message {
      content,
      deletedAt,
      id,
      createdAt,
      hasMedia,
      user {
      	name,
        username,
        id,
        avatar,
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
        userId
      }
    },
    chatAction {
      action,
      message,
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
