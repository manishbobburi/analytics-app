import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  ALLOWED_ORIGINS: z.string().default('http://localhost:5173'),
  API_KEY_PREFIX: z.string().default('org_'),
  MAX_BATCH_SIZE: z.coerce.number().default(100),
  BODY_LIMIT: z.string().default('1mb'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid env vars:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const env = parsed.data;

export const serverConfig = {
  nodeEnv: env.NODE_ENV,
  isDev: env.NODE_ENV === 'development',
  isProd: env.NODE_ENV === 'production',
  port: env.PORT,
  cors: {
    allowedOrigins: env.ALLOWED_ORIGINS.split(',').map((s) => s.trim()),
  },
  limits: {
    maxBatchSize: env.MAX_BATCH_SIZE,
    bodyLimit: env.BODY_LIMIT,
  },
  auth: {
    apiKeyPrefix: env.API_KEY_PREFIX,
  },
} as const;
