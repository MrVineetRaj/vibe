import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url("Database URL required"),
  NEXT_PUBLIC_APP_URL: z.string().url("Base URL of application is required"),
  OPENAI_API_KEY: z.string().min(10, "OpenAI API key is required"),
  E2B_API_KEY: z.string().min(10, "E2B API key is required"),
  NODE_ENV: z.string().default("development"),
});

function createEnv(env: NodeJS.ProcessEnv) {
  
  const validationResult = envSchema.safeParse(env);

  console.log(validationResult.success ,"HERE_________________")
  if (!validationResult.success) {
    throw new Error(validationResult.error.message);
  }

  return validationResult.data;
}

const env = createEnv(process.env);

// export { env };
