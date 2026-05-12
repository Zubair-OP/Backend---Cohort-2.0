import config from "../config/config.js";
import { ChatGoogle } from "@langchain/google";
import { ChatMistralAI } from "@langchain/mistralai";

export const geminiModel = new ChatGoogle({
    model: "gemini-2.5-flash",
    apiKey: config.GEMINI_API_KEY as string,
});

export const mistralAIModel = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: config.Mistral_API_KEY as string,
});


