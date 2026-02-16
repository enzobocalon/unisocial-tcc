import { gql } from '../../../__generated__';

export const ACTIVE_CHAT_SUB = gql(`
  subscription activeChat($chatId: String!) {
    activeChat(chatId: $chatId) {
      chat {
        id,
        isDirect,
        name,
        type,
        unreadMessages,
        ownerId,
        createdAt,
        isAdmin,
        icon,
      },
      message {
        content,
        id,
        createdAt,
        deletedAt,
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
          userId
        }
      },
      chatAction {
        id,
        action,
        message,
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
          username,
          isAdmin
        },
        createdAt
      }
    }
  }  
`);
