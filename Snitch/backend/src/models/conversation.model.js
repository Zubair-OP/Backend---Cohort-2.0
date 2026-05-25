import mongoose from 'mongoose';

// A single turn in the conversation. Stored without its own _id to keep
// the messages array lightweight.
const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
}, { _id: false });

const conversationSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        index: true,
    },
    // Identifies the shopper across sessions. Falls back to "anonymous"
    // when no cookie/identifier is provided by the client.
    visitorId: {
        type: String,
        default: 'anonymous',
        index: true,
    },
    messages: [messageSchema],
}, { timestamps: true });

const ConversationModel = mongoose.model('Conversation', conversationSchema);

export default ConversationModel;
