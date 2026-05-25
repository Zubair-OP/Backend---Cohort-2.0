import { ChatGroq } from '@langchain/groq';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { config } from '../config/config.js';
import ProductModel from '../models/product.model.js';
import ConversationModel from '../models/conversation.model.js';

const model = new ChatGroq({
  apiKey: config.GROQ_API_KEY.trim(),
  model: 'llama-3.3-70b-versatile',
  temperature: 0.6,
  maxTokens: 1024,
});

const MAX_HISTORY = 15;
const SESSION_TTL_MS = 30 * 60 * 1000;
const MAX_CONTEXT_PRODUCTS = 5;

/* ------------------------------------------------------------------ */
/*  In-memory session memory                                           */
/* ------------------------------------------------------------------ */

const sessions = new Map();

export function getSessionHistory(sessionId) {
  const session = sessions.get(sessionId);
  return session ? session.messages : [];
}

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

const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.lastActive > SESSION_TTL_MS) {
      sessions.delete(sessionId);
    }
  }
}, 5 * 60 * 1000);

cleanupTimer.unref?.();

/* ------------------------------------------------------------------ */
/*  Product context                                                    */
/* ------------------------------------------------------------------ */

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'you', 'your', 'are', 'have', 'has', 'can',
  'what', 'which', 'how', 'does', 'about', 'this', 'that', 'show', 'me',
  'any', 'some', 'looking', 'want', 'need', 'please', 'tell', 'from',
]);

function extractKeywords(query) {
  return (query || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length >= 3 && !STOP_WORDS.has(word))
    .slice(0, 8);
}

function describeStock(product) {
  const variants = product.variants || [];
  if (variants.length === 0) return 'Available';
  const total = variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
  return total > 0 ? `In stock (${total} available)` : 'Out of stock';
}

export async function findRelevantProducts(query) {
  const keywords = extractKeywords(query);
  if (keywords.length === 0) return [];

  const regexes = keywords.map((word) => new RegExp(word, 'i'));

  return ProductModel.find({
    $or: [
      { title: { $in: regexes } },
      { description: { $in: regexes } },
    ],
  })
    .limit(MAX_CONTEXT_PRODUCTS)
    .lean();
}

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
/*  System prompt                                                      */
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
/*  LangChain chain                                                    */
/* ------------------------------------------------------------------ */

const promptTemplate = ChatPromptTemplate.fromMessages([
  ['system', '{systemPrompt}'],
  new MessagesPlaceholder('history'),
]);

const chain = promptTemplate.pipe(model).pipe(new StringOutputParser());

function toLangChainMessages(messages) {
  return messages.map(({ role, content }) =>
    role === 'user' ? new HumanMessage(content) : new AIMessage(content),
  );
}

// Returns an async iterable where each chunk is a plain string token.
export async function streamChatCompletion(systemPrompt, history) {
  return chain.stream({
    systemPrompt,
    history: toLangChainMessages(history),
  });
}

/* ------------------------------------------------------------------ */
/*  Persistence                                                        */
/* ------------------------------------------------------------------ */

export async function persistConversation(sessionId, visitorId, messages) {
  await ConversationModel.findOneAndUpdate(
    { sessionId },
    { sessionId, visitorId: visitorId || 'anonymous', messages },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
}
