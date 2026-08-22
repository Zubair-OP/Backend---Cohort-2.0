import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage, AIMessage, ToolMessage, tool } from "langchain";
import * as z from "zod";
import { internetSearch, isInternetSearchAvailable } from "./internet.services.js";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY?.trim();
const GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";

// Keep only recent messages so long conversations stay under the token limit.
const MAX_HISTORY_MESSAGES = 12;

const THINK_OPEN = "<think>";
const THINK_CLOSE = "</think>";

function missingApiKeyError() {
  const error = new Error("Missing GOOGLE_API_KEY in environment.");
  error.status = 500;
  return error;
}

// Log details server-side, surface only a generic message to clients.
function wrapAiError(error, context) {
  console.error(`${context}:`, error?.message || error);
  const friendlyError = new Error(context);
  friendlyError.status = 502;
  return friendlyError;
}

let geminiModel;
let geminiModelWithTools;

const searchTool = tool(
  ({ query }) => internetSearch({ query }),
  {
    name: "internet_search",
    description: "Search the internet for up-to-date information.",
    schema: z.object({
      query: z.string().describe("The search query to find relevant information."),
    }),
  }
);

function getModel() {
  if (!GOOGLE_API_KEY) {
    throw missingApiKeyError();
  }

  geminiModel ??= new ChatGoogleGenerativeAI({
    apiKey: GOOGLE_API_KEY,
    model: GEMINI_MODEL,
    temperature: 0.6,
  });

  return geminiModel;
}

function getModelWithTools() {
  if (!isInternetSearchAvailable()) {
    return getModel();
  }

  geminiModelWithTools ??= getModel().bindTools([searchTool]);
  return geminiModelWithTools;
}

const MESSAGE_TYPES = { user: HumanMessage, ai: AIMessage };

function buildChatContext(messages) {
  return messages.slice(-MAX_HISTORY_MESSAGES).map(({ role, content }) => {
    const MessageType = MESSAGE_TYPES[role] ?? SystemMessage;
    return new MessageType(content);
  });
}

function buildSystemPrompt() {
  const searchNote = isInternetSearchAvailable()
    ? "Use the internet_search tool when up-to-date information is necessary."
    : "Internet search is unavailable, answer from your built-in knowledge only.";

  return new SystemMessage(
    `Today is ${new Date().toDateString()}. You are a helpful assistant. ` +
      "Give accurate and concise answers with reasoning. " +
      "For acronym questions, give the full form first, then one short explanation. " +
      searchNote
  );
}

async function runToolCalls(toolCalls, appendToContext) {
  for (const call of toolCalls) {
    if (call.name !== "internet_search") continue;

    let output;
    try {
      output = await internetSearch({ query: call.args.query });
    } catch (error) {
      output = `Internet search failed: ${error.message}`;
    }

    appendToContext(new ToolMessage({ tool_call_id: call.id, content: output }));
  }
}

function extractText(result) {
  const content = result?.content;

  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part === "string" ? part : part?.text ?? ""))
      .join("");
  }

  return "";
}

function stripThinkingTags(text) {
  return text ? text.replace(/<think>[\s\S]*?<\/think>/g, "").trim() : "";
}

// Reasoning models emit <think>...</think> around their chain-of-thought.
// Tags can split across stream chunks, so filtering runs on a rolling buffer.
class ThinkingFilter {
  #buffer = "";
  #insideThink = false;

  get isThinking() {
    return this.#insideThink;
  }

  push(chunk) {
    if (!chunk) return "";

    this.#buffer += chunk;
    let emitable = "";

    while (this.#buffer) {
      if (!this.#insideThink) {
        const start = this.#buffer.indexOf(THINK_OPEN);

        if (start === -1) {
          const safeEnd = this.#safeLength(this.#buffer);
          emitable += this.#buffer.slice(0, safeEnd);
          this.#buffer = this.#buffer.slice(safeEnd);
          break;
        }

        emitable += this.#buffer.slice(0, start);
        this.#buffer = this.#buffer.slice(start + THINK_OPEN.length);
        this.#insideThink = true;
      } else {
        const end = this.#buffer.indexOf(THINK_CLOSE);
        if (end === -1) break;

        this.#buffer = this.#buffer.slice(end + THINK_CLOSE.length);
        this.#insideThink = false;
      }
    }

    return emitable;
  }

  flush() {
    // Text still inside a think block when the stream ends is reasoning, not content.
    const rest = this.#insideThink ? "" : this.#buffer;
    this.#buffer = "";
    return rest;
  }

  // Hold back a trailing partial "<think" until we know it is not a tag opening.
  #safeLength(text) {
    for (let keep = Math.min(THINK_OPEN.length - 1, text.length); keep > 0; keep--) {
      if (THINK_OPEN.startsWith(text.slice(-keep))) return text.length - keep;
    }
    return text.length;
  }
}

async function invokeWithTools(context) {
  let result = await getModelWithTools().invoke(context);

  if (result.tool_calls?.length) {
    context.push(result);
    await runToolCalls(result.tool_calls, (message) => context.push(message));
    result = await getModelWithTools().invoke(context);
  }

  return extractText(result);
}

export async function generateResponse(messages) {
  try {
    const context = [buildSystemPrompt(), ...buildChatContext(messages)];
    return stripThinkingTags(await invokeWithTools(context));
  } catch (error) {
    throw wrapAiError(error, `Failed to generate response with ${GEMINI_MODEL}`);
  }
}

export async function streamResponse(messages, { onToken, onThinking } = {}) {
  let fullText = "";
  const filter = new ThinkingFilter();
  let thinkingNotified = false;

  const emit = async (text) => {
    if (!text) return;
    fullText += text;
    await onToken?.(text);
  };

  const streamUntilToolCall = async (context) => {
    const stream = await getModelWithTools().stream(context);
    const collectedToolCalls = [];

    for await (const chunk of stream) {
      collectedToolCalls.push(...(chunk.tool_calls ?? []));
      const chunkText = typeof chunk.content === "string" ? chunk.content : "";

      await emit(filter.push(chunkText));

      // Notify once when the model enters the thinking/reasoning phase
      if (!thinkingNotified && filter.isThinking) {
        thinkingNotified = true;
        onThinking?.();
      }
    }

    await emit(filter.flush());
    return collectedToolCalls;
  };

  try {
    const context = [buildSystemPrompt(), ...buildChatContext(messages)];

    const firstRoundToolCalls = await streamUntilToolCall(context);

    if (firstRoundToolCalls.length > 0) {
      context.push(new AIMessage({ content: "", tool_calls: firstRoundToolCalls }));
      await runToolCalls(firstRoundToolCalls, (message) => context.push(message));
      await streamUntilToolCall(context);
    }

    return stripThinkingTags(fullText) || "I could not generate a response right now.";
  } catch (error) {
    throw wrapAiError(error, `Failed to stream response with ${GEMINI_MODEL}`);
  }
}

export async function generateChatTitle(message) {
  try {
    const response = await getModel().invoke([
      new SystemMessage(
        "Generate a short 2-4 word title for this conversation. " +
          "Return ONLY the title text - no quotes, no punctuation, no explanation, no XML tags."
      ),
      new HumanMessage(`First message: "${message}"`),
    ]);

    return stripThinkingTags(extractText(response));
  } catch (error) {
    throw wrapAiError(error, `Failed to generate chat title with ${GEMINI_MODEL}`);
  }
}
