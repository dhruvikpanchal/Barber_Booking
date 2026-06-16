import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET must be at least 32 characters"),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
  JWT_ACCESS_EXPIRES: z.string().default("15m"),
  JWT_REFRESH_EXPIRES: z.string().default("7d"),

  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),

  MAIL_HOST: z.string().min(1),
  MAIL_PORT: z.coerce.number().int().positive(),
  MAIL_USER: z.string().min(1),
  MAIL_PASS: z.string().min(1),
  MAIL_FROM: z.string().default("Iron & Oak <no-reply@ironandoak.com>"),

  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),

  /** Google OAuth client ID (required for POST /auth/google) */
  GOOGLE_CLIENT_ID: z.string().optional(),

  /** Public Google client ID for browser sign-in (falls back to GOOGLE_CLIENT_ID) */
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid environment variables:\n${message}`);
  }
  return parsed.data;
}

/** Validated server environment (throws on first access if misconfigured). */
export const env: Env = loadEnv();
