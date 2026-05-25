import dotenv from 'dotenv';
dotenv.config();


if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("GOOGLE_CLIENT_ID is not defined in environment variables");
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("GOOGLE_CLIENT_SECRET is not defined in environment variables");
}

if (!process.env.GOOGLE_CALLBACK_URL) {
  throw new Error("GOOGLE_CALLBACK_URL is not defined in environment variables");
}

if (!process.env.FRONTEND_URL) {
  throw new Error("FRONTEND_URL is not defined in environment variables");
}

if (!process.env.IMG_KIT_PRIVATE_KEY) {
  throw new Error("IMG_KIT_PRIVATE_KEY is not defined in environment variables");
}

if (!process.env.IMG_KIT_PUBLIC_KEY) {
  throw new Error("IMG_KIT_PUBLIC_KEY is not defined in environment variables");
}

if (!process.env.IMG_KIT_URL_ENDPOINT) {
  throw new Error("IMG_KIT_URL_ENDPOINT is not defined in environment variables");
}

if (!process.env.REDIS_HOST) {
  throw new Error("REDIS_HOST is not defined in environment variables");
}

if (!process.env.REDIS_PORT) {
  throw new Error("REDIS_PORT is not defined in environment variables");
}

if (!process.env.REDIS_PASSWORD) {
  throw new Error("REDIS_PASSWORD is not defined in environment variables");
}

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error("STRIPE_WEBHOOK_SECRET is not defined in environment variables");
}

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not defined in environment variables");
}

export const config = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
  FRONTEND_URL: process.env.FRONTEND_URL,
  IMG_KIT_PRIVATE_KEY: process.env.IMG_KIT_PRIVATE_KEY,
  IMG_KIT_PUBLIC_KEY: process.env.IMG_KIT_PUBLIC_KEY,
  IMG_KIT_URL_ENDPOINT: process.env.IMG_KIT_URL_ENDPOINT,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
};
