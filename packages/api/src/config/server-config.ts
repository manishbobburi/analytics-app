import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),

  ALLOWED_ORIGINS: z.string().default('http://localhost:5173'),
  MAX_BATCH_SIZE: z.coerce.number().default(100),
  BODY_LIMIT: z.string().default('1mb'),

  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),

  ACCESS_TOKEN_EXPIRY: z.enum(['15m', '30m', '1h']).default('15m'),
  REFRESH_TOKEN_EXPIRY: z.enum(['7d', '30d', '90d']).default('30d'),
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

  jwt: {
    accessSecret: env.JWT_ACCESS_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    accessExpiry: env.ACCESS_TOKEN_EXPIRY,
    refreshExpiry: env.REFRESH_TOKEN_EXPIRY,
  },
} as const;
