import { randomUUID } from "crypto";
import {
  getSessionHistory,
  appendMessage,
  findRelevantProducts,
  buildSystemPrompt,
  streamChatCompletion,
  persistConversation,
} from "../services/chat.services.js";

const FALLBACK_MESSAGE = "I'm having trouble right now. Please try again in a moment.";
const RATE_LIMIT_MESSAGE = "I'm a bit busy right now, please try again in a few seconds.";

function friendlyError(error) {
  return error?.status === 429 ? RATE_LIMIT_MESSAGE : FALLBACK_MESSAGE;
}

/**
 * POST /api/chat/stream
 * Streams the bot reply token by token over Server-Sent Events.
 */
export const streamMessage = async (req, res) => {
  const message = req.body.message;
  const visitorId = req.cookies?.visitorId || req.body.visitorId || "anonymous";
  const sessionId = req.body.sessionId || randomUUID();

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  });
  res.flushHeaders?.();

  const send = (payload) => res.write(`data: ${JSON.stringify(payload)}\n\n`);

  send({ sessionId });

  let clientGone = false;
  req.on("close", () => { clientGone = true; });

  try {
    appendMessage(sessionId, "user", message);
    const products = await findRelevantProducts(message);
    const systemPrompt = buildSystemPrompt(products);
    const history = getSessionHistory(sessionId);
    const stream = await streamChatCompletion(systemPrompt, history);

    let reply = "";
    for await (const chunk of stream) {
      if (clientGone) break;
      if (chunk) {
        reply += chunk;
        send({ token: chunk });
      }
    }

    if (!clientGone) {
      const messages = appendMessage(sessionId, "assistant", reply);
      await persistConversation(sessionId, visitorId, messages);
      send({ done: true, sessionId });
    }

    res.end();
  } catch (error) {
    console.error("streamMessage failed:", error);
    if (!res.writableEnded) {
      send({ error: friendlyError(error) });
      res.end();
    }
  }
};
