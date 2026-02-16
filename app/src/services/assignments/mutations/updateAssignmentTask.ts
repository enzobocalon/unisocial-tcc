import { gql } from '../../../__generated__';

export const UPDATE_TASK = gql(`
  mutation updateAssignmentTask($name: String, $taskId: String!, $dueDate: DateTime, $description: String) {
    updateAssignmentTask(data: {
      taskId: $taskId
      dueDate: $dueDate
      name: $name
      description: $description
    }) {
      id,
      assignmentId,
      description,
      dueDate,
      name,
    }
  }
`);
