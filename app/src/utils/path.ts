import { env } from '../lib/env';

export function createPath(filename: string | null | undefined) {
  if (!filename) {
    return undefined;
  }

  if (filename.includes('amazonaws')) {
    return filename;
  }

  return `${env.RAW_API_URL}/public/uploads/${filename}`;
}

export function extractPath(path: string) {
  if (path.includes('amazonaws')) {
    return path;
  }
  return path.replace(`${env.RAW_API_URL}/public/uploads/`, '');
}
