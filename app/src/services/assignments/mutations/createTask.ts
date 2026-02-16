import { gql } from '../../../__generated__';

export const CREATE_TASK = gql(`
  mutation createAssignmentTask($name: String!, $assignmentId: String!, $dueDate: DateTime!, $users: [String!], $description: String) {
    createAssignmentTask(data: {
      assignmentId: $assignmentId
      users: $users
      dueDate: $dueDate
      name: $name
      description: $description
    }) {
      id,
      assignmentId,
      description,
      dueDate,
    }
  }
`);
