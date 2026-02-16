import { gql } from '../../../__generated__';

export const ASSIGNMENT_MEMBER_SUB = gql(`
  subscription assignmentMember($assignmentId: String!) {
    assignmentMember(assignmentId: $assignmentId) {
      assignment {
      id,
      chatId,
      name,
      ownerId,
      icon
    }
    member {
      user {
      	avatar,
        name,
        id,
        username
      },
      isAdmin
    }
    action
    }
  }
  `);
