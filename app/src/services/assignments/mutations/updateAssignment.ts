import { gql } from '../../../__generated__';

export const UPDATE_ASSIGNMENT = gql(`
  mutation updateAssignment($icon: String, $name: String, $assignmentId: String!) {
    updateAssignment(data: {
      icon: $icon,
      id: $assignmentId,
      name: $name
    }) {
      id,
      name,
      icon,
      createdAt,
      ownerId,
    }
  }
`);
