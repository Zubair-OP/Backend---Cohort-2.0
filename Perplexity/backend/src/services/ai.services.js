import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { HumanMessage, SystemMessage, AIMessage,tool,createAgent } from "langchain"
import * as z from "zod";
import {internetSearch} from "./internet.services.js";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY?.trim();
const GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash-lite";

function missingApiKeyError() {
        const error = new Error("Missing GOOGLE_API_KEY in environment.");
        error.status = 500;
        return error;
}

function wrapAiError(error, context = "AI request failed") {
        const rawMessage = error?.message || "Unknown AI provider error";
        const friendlyError = new Error(`${context}: ${rawMessage}`);
        friendlyError.status = 502;
        return friendlyError;
}

const geminiModel = new ChatGoogleGenerativeAI({
    model: GEMINI_MODEL,
    apiKey: GOOGLE_API_KEY,
    temperature: 0.2,
});

function toPlainText(result) {
    if (!result) return "";

    if (typeof result.content === "string") {
        return result.content.trim();
    }

    if (Array.isArray(result.content)) {
        return result.content
            .map((part) => {
                if (typeof part === "string") return part;
                if (part?.type === "text" && typeof part.text === "string") return part.text;
                return "";
            })
            .join(" ")
            .replace(/\s+/g, " ")
            .trim();
    }

    if (typeof result.text === "string") {
        return result.text.trim();
    }

    return String(result.content ?? "").trim();
}

const searchTool = tool(
    internetSearch,
    {
        name: "internet_search",
        description: "Use this tool to search the internet for up-to-date information.",
        schema: z.object({
            query: z.string().describe("The search query to find relevant information on the internet.")
        })
    }
)

const agent = createAgent({
    model: geminiModel,
    tools: [searchTool],
})

export async function generateResponse(messages) {
    if (!GOOGLE_API_KEY) {
        throw missingApiKeyError();
    }

    const chatContext = messages.map((msg) => {
        if (msg.role == "user") {
            return new HumanMessage(msg.content);
        } else if (msg.role == "ai") {
            return new AIMessage(msg.content);
        }
        return new SystemMessage(msg.content);
    });

    try {
        const result = await agent.invoke({
            messages: [
                new SystemMessage(
                    "You are a helpful assistant. Give accurate and concise answers. " +
                    "For acronym questions, provide full form first and then one short explanation."
                ),
                ...chatContext,
            ]
        });

        const response = result.messages[result.messages.length - 1];

        return toPlainText(response);
    } catch (error) {
        throw wrapAiError(error, `Failed to generate response with model ${GEMINI_MODEL}`);
    }

}

export async function generateChatTitle(message) {
    if (!GOOGLE_API_KEY) {
        throw missingApiKeyError();
    }

    try {
        const response = await geminiModel.invoke([
            new SystemMessage(`
                You are a helpful assistant that generates concise and descriptive titles for chat conversations.
                
                User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic.    
            `),
            new HumanMessage(`
                Generate a title for a chat conversation based on the following first message:
                "${message}"
                `)
        ])

        return toPlainText(response);
    } catch (error) {
        throw wrapAiError(error, `Failed to generate chat title with model ${GEMINI_MODEL}`);
    }

}