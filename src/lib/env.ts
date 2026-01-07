function getEnvVar(key: string, required: boolean = true): string {
  const value = process.env[key];
  if (!value && required) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || "";
}

export const env = {
  DATABASE_URL: getEnvVar("DATABASE_URL"),
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "Home Gym Tracker",
} as const;
