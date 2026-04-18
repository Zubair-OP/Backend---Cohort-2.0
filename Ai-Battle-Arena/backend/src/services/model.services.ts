import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import config from "../config/config.js";

export const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: config.GEMINI_API_KEY!,
});

export const groqModel = new ChatOpenAI({
  model: "llama3-70b-8192",
  apiKey: config.GROK_API_KEY,
  configuration: {
    baseURL: "https://api.groq.com/openai/v1",
  },
});


export const openRouterModel = new ChatOpenAI({
  model: "mistralai/mistral-7b-instruct",
  apiKey: config.OPENROUTER_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
});



