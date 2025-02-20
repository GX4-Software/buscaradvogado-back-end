import 'dotenv/config';
import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'production', 'test']).default('dev'),
  PORT: z.coerce.number().default(3333),

  ORIGIN_URL: z.string().default('http://localhost:3333'),
  CLIENT_URL: z.string().default('http://localhost:3000'),

  JWT_PUBLIC_KEY: z.string(),
  JWT_PRIVATE_KEY: z.string(),

  DATABASE_URL: z.string(),

  CRYPTO_KEY: z.string().transform((value) => Buffer.from(value, 'base64')),

  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),

  EMAIL_HOST: z.string(),
  EMAIL_USER: z.string(),
  EMAIL_PASS: z.string(),
  EMAIL_FROM: z.string(),
  EMAIL_PORT: z.coerce.number(),

  S3_REGION: z.string(),
  S3_ENDPOINT: z.string(),
  S3_ACCESS_KEY_ID: z.string(),
  S3_ACCESS_KEY_SECRET: z.string(),
  S3_PRIMARY_BUCKET: z.string(),
});

export type Env = z.infer<typeof envSchema>;

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables', _env.error.format());

  throw new Error('Invalid environment variables');
}

export const env = _env.data;
