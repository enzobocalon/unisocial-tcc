import { gql } from '../../../__generated__';

export const TASKS_SUB = gql(`
  subscription tasks {
    tasks {
      assignment {
        id,
        ownerId,
      },
      task {
        id,
        name,
        dueDate,
        description
      },
      action,
      ids {
        userId,
        id
      }
    }
  }
  `);
