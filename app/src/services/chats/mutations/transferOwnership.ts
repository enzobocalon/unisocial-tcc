import { gql } from '../../../__generated__';

export const TRANSFER_OWNERSHIP = gql(`
  mutation transferOwnership($chatId: String!, $newOwnerId: String!) {
    transferOwnership(
      chatId: $chatId,
      userId: $newOwnerId
    ) {
      id,
      isDirect,
      name,
      type,
      createdAt,
      isOnline,
      icon,
      isAdmin,
      ownerId
    }
  }
  `);
