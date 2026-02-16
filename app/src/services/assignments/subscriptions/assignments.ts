import { gql } from '../../../__generated__';

export const ASSIGNMENTS_SUB = gql(`
  subscription assignments {
    assignments {
      assignment {
        id,
        name,
        icon,
        createdAt,
        ownerId,
        chatId,
        isAdmin,
      },
      member {
        id,
        userId,
        isAdmin,
        user {
          id,
          name,
          avatar,
          username
        }
      },
      action
    }
  }
  `);
