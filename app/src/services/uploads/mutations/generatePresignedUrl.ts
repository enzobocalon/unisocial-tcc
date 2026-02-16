import { gql } from '../../../__generated__';

export const GENERATE_PRESIGNED_URL = gql(`
  mutation generatePresignedUrls($data: [UrlRequestDTO!]!) {
    generatePresignedUrls(data: $data) {
      filename,
      uploadUrl,
      fileUrl,
      type
    }
  }
`);
