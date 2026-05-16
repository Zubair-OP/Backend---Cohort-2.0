import config from "../config/config.js";
import { ChatGoogle } from "@langchain/google";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatGroq } from "@langchain/groq";

export const geminiModel = new ChatGoogle({
    model: "gemini-2.5-flash",
    apiKey: config.GEMINI_API_KEY as string,
});

export const mistralAIModel = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: config.Mistral_API_KEY as string,
});

export const GroqModel = new ChatGroq({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    apiKey: config.GROQ_API_KEY as string,
});


