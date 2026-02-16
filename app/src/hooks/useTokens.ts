import { storage } from '../lib/storage';

export function useTokens() {
  return {
    token: storage.getString('token'),
    refreshToken: storage.getString('refreshToken'),
  };
}
