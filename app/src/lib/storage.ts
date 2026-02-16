import { MMKV } from 'react-native-mmkv';
import { env } from './env';

export const storage = new MMKV({
  id: 'com.unisocial',
  encryptionKey: env.STORAGE_ENCRYPTION_KEY,
});
