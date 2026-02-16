import { gql } from '../../../__generated__';

export const CREATE_ASSIGNMENT = gql(`
  mutation createAssignment($icon: String, $users: [String!], $name: String!,) {
    createAssignment(data: {
      icon: $icon
      usersIds: $users
      name: $name
    }) {
      id,
      name,
      ownerId,
      createdAt,
    }
  }
`);
