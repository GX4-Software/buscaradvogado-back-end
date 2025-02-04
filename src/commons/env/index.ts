import "dotenv/config";
import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "production", "test"]).default("dev"),
  PORT: z.coerce.number().default(3333),

  ORIGIN_URL: z.string().default("http://localhost:3333"),
  CLIENT_URL: z.string().default("http://localhost:3000"),

  JWT_PUBLIC_KEY: z.string(),
  JWT_PRIVATE_KEY: z.string(),
});

export type Env = z.infer<typeof envSchema>;

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables", _env.error.format());

  throw new Error("Invalid environment variables");
}

export const env = _env.data;