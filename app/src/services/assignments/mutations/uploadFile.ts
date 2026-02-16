import { gql } from '../../../__generated__';

export const UPLOAD_TASK_FILE = gql(`
  mutation uploadFiles($data: UploadFileToTaskDTO!) {
    uploadFiles(data: $data) {
      success,
      message
    }
  }
`);
