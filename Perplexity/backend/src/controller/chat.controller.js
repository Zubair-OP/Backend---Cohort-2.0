import { generateResponse, generateChatTitle } from "../services/ai.services.js";
import chatModel from "../model/chat.model.js";
import messageModel from "../model/message.model.js";

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
            title = await generateChatTitle(message);
            chat = await chatModel.create({
                user: req.user.id,
                title: String(title || "New Chat").trim()
            })
        }

        await messageModel.create({
            chat: chatId || chat._id,
            content: message,
            role: "user"
        })

        const History = await messageModel.find({ chat: chatId || chat._id }).sort({ createdAt: 1 })

        const result = await generateResponse(History);
        const aiText = String(result || "").trim() || "I could not generate a response right now.";

        const aiMessage = await messageModel.create({
            chat: chatId || chat._id,
            content: aiText,
            role: "ai"
        })


        res.status(201).json({
            title: title || chat?.title || "New Chat",
            chat,
            aiMessage
        })
    } catch (error) {
        console.error("HandleChat error:", error?.message || error);
        return res.status(error?.status || 500).json({
            message: "Failed to process chat request",
            error: error?.message || "Unknown error"
        });
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

