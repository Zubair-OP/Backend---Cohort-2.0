import { generateResponse, generateChatTitle, streamResponse } from "../services/ai.services.js";
import chatModel from "../model/chat.model.js";
import messageModel from "../model/message.model.js";


function writeSseEvent(res, event, data) {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
}

async function safeChatTitle(message) {
    try {
        const aiTitle = await generateChatTitle(message);
        if (aiTitle?.trim()) return aiTitle.trim();
    } catch (err) {
        // Non-fatal — log and fall through to the local fallback
        console.warn("generateChatTitle failed (will use fallback):", err?.message || err);
    }

    // Local fallback: use the first 5 words of the message, capitalised
    const words = String(message).trim().split(/\s+/).slice(0, 5).join(" ");
    return words.charAt(0).toUpperCase() + words.slice(1);
}

export async function HandleChat(req, res) {
    try {
        const { message, chat: chatId } = req.body;

        if (!message || !String(message).trim()) {
            return res.status(400).json({
                message: "message is required"
            });
        }

        let title = null, chat = null;

        if (!chatId) {
            // safeChatTitle never throws — falls back to first-words title on error
            title = await safeChatTitle(message);
            chat = await chatModel.create({
                user: req.user.id,
                title: String(title || "New Chat").trim()
            });
        }

        await messageModel.create({
            chat: chatId || chat._id,
            content: message,
            role: "user"
        });

        const History = await messageModel.find({ chat: chatId || chat._id }).sort({ createdAt: 1 });

        const result = await generateResponse(History);
        const aiText = String(result || "").trim() || "I could not generate a response right now.";

        const aiMessage = await messageModel.create({
            chat: chatId || chat._id,
            content: aiText,
            role: "ai"
        });

        res.status(201).json({
            title: title || chat?.title || "New Chat",
            chat,
            aiMessage
        });
    } catch (error) {
        console.error("HandleChat error:", error?.message || error);
        return res.status(error?.status || 500).json({
            message: "Failed to process chat request",
            error: error?.message || "Unknown error"
        });
    }
}

export async function HandleChatStream(req, res) {
    try {
        const { message, chat: chatId } = req.body;

        if (!message || !String(message).trim()) {
            return res.status(400).json({
                message: "message is required"
            });
        }

        // ── SSE Headers ─────────────────────────────────────────────────────────
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders?.();

        let title = null;
        let chat = null;

        if (!chatId) {
            // safeChatTitle never throws — falls back to first-words title on error
            title = await safeChatTitle(message);
            chat = await chatModel.create({
                user: req.user.id,
                title: String(title || "New Chat").trim()
            });
        } else {
            chat = await chatModel.findOne({ _id: chatId, user: req.user.id });

            if (!chat) {
                writeSseEvent(res, "error", {
                    message: "Chat not found"
                });
                return res.end();
            }
        }

        const activeChatId = chatId || chat._id;

        await messageModel.create({
            chat: activeChatId,
            content: message,
            role: "user"
        });

        writeSseEvent(res, "start", {
            chat: {
                _id: String(activeChatId),
                title: title || chat?.title || "New Chat"
            }
        });

        // ── Full conversation history for context ──────────────────────────────
        const history = await messageModel
            .find({ chat: activeChatId })
            .sort({ createdAt: 1 });

        // ── Stream tokens — each chunk: data: {"text":"..."} ──────────────────
        const aiText = await streamResponse(history, {
            onToken(token) {
                res.write(`data: ${JSON.stringify({ text: token })}\n\n`);
            }
        });

        // ── Persist completed AI message ───────────────────────────────────────
        const aiMessage = await messageModel.create({
            chat: activeChatId,
            content: aiText,
            role: "ai"
        });

        // ── Done metadata (named event so sidebar can refresh title) ───────────
        writeSseEvent(res, "done", {
            chat: {
                _id: String(activeChatId),
                title: title || chat?.title || "New Chat"
            },
            aiMessage
        });

        // ── OpenAI-style end-of-stream sentinel ────────────────────────────────
        res.write("data: [DONE]\n\n");
        return res.end();

    } catch (error) {
        console.error("HandleChatStream error:", error?.message || error);

        if (!res.headersSent) {
            return res.status(error?.status || 500).json({
                message: "Failed to process chat request",
                error: error?.message || "Unknown error"
            });
        }

        // Headers already flushed — send error via SSE then close
        res.write(`data: ${JSON.stringify({ error: error?.message || "Unknown error" })}\n\n`);
        return res.end();
    }
}

export async function getChats(req, res) {
    const user = req.user

    const chats = await chatModel.find({ user: user.id })

    res.status(200).json({
        message: "Chats retrieved successfully",
        chats
    })
}

export async function getChatMessages(req, res) {
    const { Id } = req.params;

    const chat = await chatModel.find({ _id: Id, user: req.user.id })

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found"
        })
    }

    const messages = await messageModel.find({ chat: Id })

    if (!messages) {
        return res.status(404).json({
            message: "Messages not found for this chat"
        })
    }

    res.status(200).json({
        message: "Messages retrieved successfully",
        messages
    })
}

export async function deleteChat(req, res) {
    const { Id } = req.params;

    const chat = await chatModel.findOneAndDelete({ _id: Id, user: req.user.id })

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found"
        })
    }

    await messageModel.deleteMany({ chat: Id })

    res.status(200).json({
        message: "Chat and its messages deleted successfully"
    })

}

