import { ChatGroq } from '@langchain/groq'
import { HumanMessage, SystemMessage, AIMessage, ToolMessage, tool } from "langchain"
import * as z from "zod";
import {internetSearch, isInternetSearchAvailable} from "./internet.services.js";

const GROQ_API_KEY = process.env.GROQ_API_KEY?.trim();
const GROQ_MODEL = process.env.GROQ_MODEL?.trim() || "meta-llama/llama-4-scout-17b-16e-instruct";

// Keep only last N messages to avoid token limit errors on long conversations
const MAX_HISTORY_MESSAGES = 12;

function missingApiKeyError() {
    const error = new Error("Missing GROQ_API_KEY in environment.");
    error.status = 500;
    return error;
}

function wrapAiError(error, context = "AI request failed") {
        const rawMessage = error?.message || "Unknown AI provider error";
        const friendlyError = new Error(`${context}: ${rawMessage}`);
        friendlyError.status = 502;
        return friendlyError;
}


let groqModel = null;

function getGroqModel() {
    if (!GROQ_API_KEY) {
        throw missingApiKeyError();
    }

    if (!groqModel) {
        groqModel = new ChatGroq({
            model: GROQ_MODEL,
            apiKey: GROQ_API_KEY,
            temperature: 0.2,
        });
    }

    return groqModel;
}

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

function getAvailableTools() {
    return isInternetSearchAvailable() ? [searchTool] : [];
}

function trimMessages(messages) {
    if (messages.length <= MAX_HISTORY_MESSAGES) return messages;
    return messages.slice(-MAX_HISTORY_MESSAGES);
}

function buildChatContext(messages) {
    return trimMessages(messages).map((msg) => {
        if (msg.role == "user") {
            return new HumanMessage(msg.content);
        } else if (msg.role == "ai") {
            return new AIMessage(msg.content);
        }
        return new SystemMessage(msg.content);
    });
}

function buildSystemPrompt() {
    return new SystemMessage(
        `Today is ${new Date().toDateString()}. You are a helpful assistant. Give accurate and concise answers with reasoning. ` +
        "For acronym questions, provide full form first and then one short explanation. " +
        (isInternetSearchAvailable()
            ? "Use the internet search tool only when up-to-date information is necessary."
            : "Internet search is unavailable in this environment, so answer from your built-in knowledge only.")
    );
}

export async function generateResponse(messages) {
    if (!GROQ_API_KEY) {
        throw missingApiKeyError();
    }

    const chatContext = buildChatContext(messages);
    const messagesToInvoke = [buildSystemPrompt(), ...chatContext];

    try {
        const tools = getAvailableTools();
        const model = tools.length > 0 ? getGroqModel().bindTools(tools) : getGroqModel();

        let result = await model.invoke(messagesToInvoke);

        if (result.tool_calls && result.tool_calls.length > 0) {
            messagesToInvoke.push(result);
            for (const tc of result.tool_calls) {
                if (tc.name === "internet_search") {
                    try {
                        const searchOutput = await internetSearch({ query: tc.args.query });
                        messagesToInvoke.push(new ToolMessage({
                            tool_call_id: tc.id,
                            content: searchOutput
                        }));
                    } catch (e) {
                         messagesToInvoke.push(new ToolMessage({
                            tool_call_id: tc.id,
                            content: `Internet search failed: ${e.message}`
                        }));
                    }
                }
            }
            result = await model.invoke(messagesToInvoke);
        }

        return toPlainText(result);
    } catch (error) {
        throw wrapAiError(error, `Failed to generate response with model ${GROQ_MODEL}`);
    }

}

export async function streamResponse(messages, { onToken } = {}) {
    if (!GROQ_API_KEY) {
        throw missingApiKeyError();
    }

    const chatContext = buildChatContext(messages);

    let fullText = "";
    let lastCompletedText = "";
    const streamPlainText = async (model, messagesToStream) => {
        const stream = await model.stream(messagesToStream);
        let toolCalls = [];

        async function processStream(incomingStream) {
            for await (const chunk of incomingStream) {
                if (chunk.tool_calls && chunk.tool_calls.length > 0) {
                    toolCalls.push(...chunk.tool_calls);
                }

                const chunkText = chunk.content;
                if (chunkText && typeof chunkText === "string") {
                    const chunkSize = 2;
                    const delayMs = 15;
                    for (let i = 0; i < chunkText.length; i += chunkSize) {
                        const slice = chunkText.slice(i, i + chunkSize);
                        fullText += slice;
                        onToken?.(slice);
                        await new Promise(resolve => setTimeout(resolve, delayMs));
                    }
                    lastCompletedText = fullText.trim();
                }
            }
        }

        await processStream(stream);

        if (toolCalls.length > 0) {
            messagesToStream.push(new AIMessage({ content: "", tool_calls: toolCalls }));
            for (const tc of toolCalls) {
                if (tc.name === "internet_search") {
                    try {
                        onToken?.("\n\n*Searching the internet...*\n\n");
                        const searchOutput = await internetSearch({ query: tc.args.query });
                        messagesToStream.push(new ToolMessage({
                            tool_call_id: tc.id,
                            content: searchOutput
                        }));
                    } catch (e) {
                        messagesToStream.push(new ToolMessage({
                            tool_call_id: tc.id,
                            content: `Internet search failed: ${e.message}`
                        }));
                    }
                }
            }

            const followUpStream = await model.stream(messagesToStream);
            await processStream(followUpStream);
        }
    };

    try {
        const tools = getAvailableTools();
        const model = tools.length > 0 ? getGroqModel().bindTools(tools) : getGroqModel();
        const messagesToStream = [buildSystemPrompt(), ...chatContext];
        await streamPlainText(model, messagesToStream);

        const streamedText = fullText.trim();
        if (streamedText) {
            return streamedText;
        }

        if (lastCompletedText) {
            onToken?.(lastCompletedText);
            return lastCompletedText;
        }

        const fallbackText = await generateResponse(messages);
        if (fallbackText?.trim()) {
            onToken?.(fallbackText);
            return fallbackText.trim();
        }

        return "I could not generate a response right now.";
    } catch (error) {
        throw wrapAiError(error, `Failed to stream response with model ${GROQ_MODEL}`);
    }
}

export async function generateChatTitle(message) {
    if (!GROQ_API_KEY) {
        throw missingApiKeyError();
    }

    try {
        const response = await getGroqModel().invoke([
            new SystemMessage(
                "You are a chat title generator. " +
                "Return ONLY a 2-4 word title for the conversation — no quotes, no punctuation, no explanation, no prefix like 'Title:' or 'Here is a title'."
            ),
            new HumanMessage(`First message: "${message}"`)
        ])

        return toPlainText(response);
    } catch (error) {
        throw wrapAiError(error, `Failed to generate chat title with model ${GROQ_MODEL}`);
    }

}
