import { ChatOpenAI } from "@langchain/openai";
import config from "../config/config.js";
import { OpenAI } from "@langchain/openai";
import { ChatGoogle } from "@langchain/google";

export const geminiModel = new ChatGoogle({
    model: "gemini-2.5-flash",
    apiKey: config.GEMINI_API_KEY as string,
});


