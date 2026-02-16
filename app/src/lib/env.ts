import { z } from 'zod';
import {
  API_URL,
  RAW_API_URL,
  STORAGE_ENCRYPTION_KEY,
  SUBS_API_URL,
  MAPBOX_TOKEN,
} from '@env';

const envSchema = z.object({
  API_URL: z.string().min(1),
  RAW_API_URL: z.string().min(1),
  STORAGE_ENCRYPTION_KEY: z.string().min(1),
  SUBS_API_URL: z.string().min(1),
  MAPBOX_TOKEN: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;
export const env = envSchema.parse({
  API_URL: API_URL || process.env.API_URL,
  STORAGE_ENCRYPTION_KEY:
    STORAGE_ENCRYPTION_KEY || process.env.STORAGE_ENCRYPTION_KEY,
  RAW_API_URL: RAW_API_URL || process.env.RAW_API_URL,
  SUBS_API_URL: SUBS_API_URL || process.env.SUBS_API_URL,
  MAPBOX_TOKEN: MAPBOX_TOKEN || process.env.MAPBOX_TOKEN,
});
