import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(10).max(15).default(12),
  CORS_ORIGIN: z.string().default('*'),
  LOG_LEVEL: z
    .enum(['error', 'warn', 'info', 'http', 'debug'])
    .default('info'),
});

const testDefaults =
  process.env.NODE_ENV === 'test'
    ? {
        MONGODB_URI:
          process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/test_db',
        JWT_SECRET:
          process.env.JWT_SECRET ??
          'test-jwt-secret-key-minimum-32-characters-long',
      }
    : {};

const parsed = envSchema.safeParse({ ...testDefaults, ...process.env });

if (!parsed.success) {
  const formatted = parsed.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  throw new Error(`Environment validation failed:\n${formatted}`);
}

export const env = parsed.data;

export type Env = z.infer<typeof envSchema>;
