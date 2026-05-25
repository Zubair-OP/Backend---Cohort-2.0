import Groq from 'groq-sdk';
import { config } from '../config/config.js';
import ProductModel from '../models/product.model.js';
import ConversationModel from '../models/conversation.model.js';

const groq = new Groq({ apiKey: config.GROQ_API_KEY.trim() });

const MODEL = 'llama-3.3-70b-versatile';

// Keep only the most recent turns per session so we stay within token limits.
const MAX_HISTORY = 15;

// Drop in-memory sessions that have been idle for this long.
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes

// Maximum products injected as grounding context for a single reply.
const MAX_CONTEXT_PRODUCTS = 5;

/* ------------------------------------------------------------------ */
/*  In-memory conversation memory (per session)                       */
/* ------------------------------------------------------------------ */

// sessionId -> { messages: [{ role, content, timestamp }], lastActive }
const sessions = new Map();

export function getSessionHistory(sessionId) {
  const session = sessions.get(sessionId);
  return session ? session.messages : [];
}

// Append a turn and keep the rolling window trimmed to MAX_HISTORY.
export function appendMessage(sessionId, role, content) {
  let session = sessions.get(sessionId);
  if (!session) {
    session = { messages: [], lastActive: Date.now() };
    sessions.set(sessionId, session);
  }

  session.messages.push({ role, content, timestamp: new Date() });

  if (session.messages.length > MAX_HISTORY) {
    session.messages = session.messages.slice(-MAX_HISTORY);
  }

  session.lastActive = Date.now();
  return session.messages;
}

// Periodically evict idle sessions so the Map does not grow unbounded.
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.lastActive > SESSION_TTL_MS) {
      sessions.delete(sessionId);
    }
  }
}, 5 * 60 * 1000); // sweep every 5 minutes

// Don't let this timer keep the process alive on its own.
cleanupTimer.unref?.();

/* ------------------------------------------------------------------ */
/*  Product context injection                                         */
/* ------------------------------------------------------------------ */

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'you', 'your', 'are', 'have', 'has', 'can',
  'what', 'which', 'how', 'does', 'about', 'this', 'that', 'show', 'me',
  'any', 'some', 'looking', 'want', 'need', 'please', 'tell', 'from',
]);

// Pull meaningful keywords out of a free-text query.
function extractKeywords(query) {
  return (query || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length >= 3 && !STOP_WORDS.has(word))
    .slice(0, 8);
}

// Compute a human-readable stock status from a product's variants.
function describeStock(product) {
  const variants = product.variants || [];
  if (variants.length === 0) return 'Available';

  const total = variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
  return total > 0 ? `In stock (${total} available)` : 'Out of stock';
}

// Keyword-based search across product title and description (regex based,
// so it needs no special text index on the collection).
export async function findRelevantProducts(query) {
  const keywords = extractKeywords(query);
  if (keywords.length === 0) return [];

  const regexes = keywords.map((word) => new RegExp(word, 'i'));

  const products = await ProductModel.find({
    $or: [
      { title: { $in: regexes } },
      { description: { $in: regexes } },
    ],
  })
    .limit(MAX_CONTEXT_PRODUCTS)
    .lean();

  return products;
}

// Format matched products into a compact block the model can ground on.
function formatProductContext(products) {
  if (!products.length) {
    return 'No matching products were found in the catalog for this query.';
  }

  return products
    .map((p, i) => {
      const amount = p.price?.amount;
      const currency = p.price?.currency || 'PKR';
      const price = amount != null ? `${currency} ${amount}` : 'N/A';
      const description = (p.description || '').slice(0, 200);
      const stock = describeStock(p);
      return `${i + 1}. ${p.title}\n   Price: ${price}\n   Stock: ${stock}\n   Description: ${description}`;
    })
    .join('\n\n');
}

/* ------------------------------------------------------------------ */
/*  System prompt                                                     */
/* ------------------------------------------------------------------ */

export function buildSystemPrompt(products) {
  return `You are "Snitch Assistant", a professional customer support agent for the Snitch online clothing store.

YOUR SCOPE — you may ONLY help with:
- Product questions, recommendations and comparisons
- Size, fit and variant guidance
- Orders, shipping, returns and refunds
- General help navigating and shopping on the website

If the user asks about anything outside this scope (politics, coding, general knowledge, personal advice, etc.), politely decline with exactly:
"I'm here to help you with shopping and product queries only."

STYLE:
- Be concise, warm and helpful — never robotic.
- Use short paragraphs and bullet lists where it improves clarity (your output is rendered as Markdown).
- Never invent products, prices, stock levels or policies. Only state product facts that appear in the context below.
- If you don't have the information, say so and offer to help another way.

POLICIES you may share when asked:
- Returns/refunds: items can be returned within 7 days of delivery if unused and with tags; refunds are processed to the original payment method.
- Shipping: standard delivery typically takes 3-5 business days.
- Prices are shown in the product's listed currency (PKR by default).

RELEVANT PRODUCTS FROM OUR CATALOG (use these for any product-specific answer):
${formatProductContext(products)}`;
}

/* ------------------------------------------------------------------ */
/*  Groq streaming                                                    */
/* ------------------------------------------------------------------ */

// Returns an async-iterable stream of completion chunks from Groq.
// The caller is responsible for catching errors (e.g. 429 rate limits).
export async function streamChatCompletion(systemPrompt, history) {
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map(({ role, content }) => ({ role, content })),
  ];

  return groq.chat.completions.create({
    model: MODEL,
    messages,
    stream: true,
    temperature: 0.6,
    max_tokens: 1024,
  });
}

/* ------------------------------------------------------------------ */
/*  Persistence                                                       */
/* ------------------------------------------------------------------ */

// Upsert the full conversation for a session. Called after each bot reply
// (not after every user message) to reduce DB writes.
export async function persistConversation(sessionId, visitorId, messages) {
  await ConversationModel.findOneAndUpdate(
    { sessionId },
    {
      sessionId,
      visitorId: visitorId || 'anonymous',
      messages,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
}
