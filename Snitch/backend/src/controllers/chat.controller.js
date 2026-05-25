import { randomUUID } from "crypto";
import {
  getSessionHistory,
  appendMessage,
  findRelevantProducts,
  buildSystemPrompt,
  streamChatCompletion,
  persistConversation,
} from "../services/chat.services.js";

// Friendly, user-facing fallbacks. We never leak raw error details to the UI.
const FALLBACK_MESSAGE =
  "I'm having trouble right now. Please try again in a moment.";
const RATE_LIMIT_MESSAGE =
  "I'm a bit busy right now, please try again in a few seconds.";

// Matches ASCII control characters so we can strip them from input.
const CONTROL_CHARS = new RegExp("[\\u0000-\\u001F\\u007F]", "g");

// Pick the friendly message that matches the failure type.
function friendlyError(error) {
  if (error?.status === 429) return RATE_LIMIT_MESSAGE;
  return FALLBACK_MESSAGE;
}

// Drop control characters; message is already trimmed/length-checked by the validator.
function sanitize(message) {
  return String(message).replace(CONTROL_CHARS, "").trim();
}

// Resolve identifiers: visitorId prefers the cookie, then the body, then anonymous.
function resolveIdentifiers(req) {
  const visitorId =
    req.cookies?.visitorId || req.body?.visitorId || "anonymous";
  const sessionId = req.body?.sessionId || randomUUID();
  return { visitorId, sessionId };
}

/**
 * POST /api/chat/message
 * Non-streaming endpoint. Returns the full bot reply as JSON.
 */
export const sendMessage = async (req, res) => {
  try {
    const message = sanitize(req.body.message);
    const { visitorId, sessionId } = resolveIdentifiers(req);

    // Record the user's turn, then ground the model on matching products.
    appendMessage(sessionId, "user", message);
    const products = await findRelevantProducts(message);
    const systemPrompt = buildSystemPrompt(products);
    const history = getSessionHistory(sessionId);

    // Reuse the streaming call and accumulate it into a single reply.
    const stream = await streamChatCompletion(systemPrompt, history);
    let reply = "";
    for await (const chunk of stream) {
      reply += chunk.choices[0]?.delta?.content || "";
    }

    // Save the bot turn in memory + DB (write happens after the bot reply).
    const messages = appendMessage(sessionId, "assistant", reply);
    await persistConversation(sessionId, visitorId, messages);

    res.status(200).json({ success: true, sessionId, reply });
  } catch (error) {
    console.error("sendMessage failed:", error);
    res.status(error?.status === 429 ? 429 : 500).json({
      success: false,
      reply: friendlyError(error),
    });
  }
};

/**
 * POST /api/chat/stream
 * Server-Sent Events endpoint. Streams the bot reply token by token.
 * Frames: { token } per chunk, { done, sessionId } at the end, { error } on failure.
 */
export const streamMessage = async (req, res) => {
  const message = sanitize(req.body.message);
  const { visitorId, sessionId } = resolveIdentifiers(req);

  // SSE headers — flush immediately so the client opens the stream.
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  });
  res.flushHeaders?.();

  const send = (payload) => res.write(`data: ${JSON.stringify(payload)}\n\n`);

  // Tell the client its session id up front so it can keep using the same one.
  send({ sessionId });

  // Stop generating if the client navigates away / closes the widget.
  let clientGone = false;
  req.on("close", () => {
    clientGone = true;
  });

  try {
    appendMessage(sessionId, "user", message);
    const products = await findRelevantProducts(message);
    const systemPrompt = buildSystemPrompt(products);
    const history = getSessionHistory(sessionId);

    const stream = await streamChatCompletion(systemPrompt, history);

    let reply = "";
    for await (const chunk of stream) {
      if (clientGone) break;
      const token = chunk.choices[0]?.delta?.content || "";
      if (token) {
        reply += token;
        send({ token });
      }
    }

    // Persist only after the full bot reply is assembled.
    if (!clientGone) {
      const messages = appendMessage(sessionId, "assistant", reply);
      await persistConversation(sessionId, visitorId, messages);
      send({ done: true, sessionId });
    }

    res.end();
  } catch (error) {
    console.error("streamMessage failed:", error);
    // Surface a friendly message through the same stream, then close.
    if (!res.writableEnded) {
      send({ error: friendlyError(error) });
      res.end();
    }
  }
};
