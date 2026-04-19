import dotenv from "dotenv";

dotenv.config();

const config = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GROK_API_KEY: process.env.GROK_API_KEY,
    TOGETHER_API_KEY: process.env.TOGETHER_API_KEY,
}

export default config;
