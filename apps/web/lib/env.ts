import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  ADMIN_PIN: z.string().min(12),
  ADMIN_SESSION_SECRET: z.string().min(32),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

export const env =
  process.env.NODE_ENV === "test"
    ? ({} as z.infer<typeof envSchema>)
    : envSchema.parse(process.env);
