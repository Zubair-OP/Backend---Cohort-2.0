import dotenv from "dotenv";

dotenv.config();

const config = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    Mistral_API_KEY: process.env.Mistral_API_KEY || process.env.MISTRAL_API_KEY,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
}

export default config;
