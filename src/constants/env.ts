const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw Error(`Missing String Environment variable for ${key}`);
  }

  return value;
};

export const NODE_ENV = getEnv("NODE_ENV", "development");
export const PORT = getEnv("PORT", "4004");
export const MONGO_URI = getEnv("MONGO_URI");
export const MONGO_URI_DEVELOPMENT = getEnv(
  "MONGO_URI_DEVELOPMENT",
  "mongodb://mongo:27017/db"
);
export const JWT_SECRET = getEnv("JWT_SECRET", "Development");
