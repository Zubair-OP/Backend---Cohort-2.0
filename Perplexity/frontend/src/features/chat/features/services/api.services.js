import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
});

export const sendMessage = async (message, chatId) => {
    const response = await API.post("/chats/message", { message, chat: chatId });
    return response.data;
};

/**
 *
 * @param {string}      message     - The user's new message text
 * @param {string|null} chatId      - Existing chat ID, or null for a new chat
 * @param {object}      handlers    - { onStart, onChunk, onDone, onError }
 * @param {AbortSignal} signal      - AbortController signal for "Stop generating"
 */
export const streamMessage = async (message, chatId, handlers = {}, signal = null) => {
    const response = await fetch("http://localhost:3000/api/chats/message/stream", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, chat: chatId }),
        // Pass the AbortController signal so fetch is cancelled when user clicks Stop
        signal,
    });

    // Non-streaming error case (e.g. 401 Unauthorized before SSE headers are set)
    if (!response.ok || !response.body) {
        let errorMessage = "Failed to start message stream";
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch {
            // Ignore JSON parse failures for non-JSON bodies
        }
        throw new Error(errorMessage);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let currentEventName = null; // tracks the most recent "event:" field

    const processBlock = (block) => {
        const lines = block.split("\n");
        let eventName = currentEventName;
        const dataLines = [];

        for (const line of lines) {
            if (line.startsWith("event:")) {
                eventName = line.slice(6).trim();
            } else if (line.startsWith("data:")) {
                dataLines.push(line.slice(5).trim());
            }
        }

        // Reset current event name after consuming the block
        currentEventName = null;

        if (dataLines.length === 0) return;

        const rawData = dataLines.join("\n");

        // ── End-of-stream sentinel ──────────────────────────────────────────────
        if (rawData === "[DONE]") return;

        // ── Parse JSON payload ──────────────────────────────────────────────────
        let payload;
        try {
            payload = JSON.parse(rawData);
        } catch {
            // Non-JSON line (e.g. a comment) — skip
            return;
        }

        // ── Route to the correct handler ────────────────────────────────────────
        if (eventName === "start") {
            handlers.onStart?.(payload);
        } else if (eventName === "done") {
            handlers.onDone?.(payload);
        } else if (payload.error) {
            // Plain data error: { error: "..." }
            handlers.onError?.(payload);
        } else if (payload.text !== undefined) {
            // Plain data token: { text: "..." }
            handlers.onChunk?.({ token: payload.text });
        }
    };

    // ── Read the stream chunk by chunk ──────────────────────────────────────────
    try {
        while (true) {
            const { done, value } = await reader.read();
            buffer += decoder.decode(value || new Uint8Array(), { stream: !done });

            // SSE blocks are separated by \n\n
            let separatorIndex = buffer.indexOf("\n\n");
            while (separatorIndex !== -1) {
                const block = buffer.slice(0, separatorIndex).trim();
                buffer = buffer.slice(separatorIndex + 2);

                if (block) {
                    processBlock(block);
                }

                separatorIndex = buffer.indexOf("\n\n");
            }

            if (done) {
                // Flush any trailing block (shouldn't normally happen)
                const trailing = buffer.trim();
                if (trailing) processBlock(trailing);
                break;
            }
        }
    } catch (err) {
        // AbortError is expected when user clicks "Stop generating" — swallow it
        if (err.name === "AbortError") return;
        throw err;
    }
};

export const getChats = async () => {
    const response = await API.get("/chats/", {
        params: {
            limit: 20,
        },
    });
    return response.data;
};

export const getChatMessages = async (chatId) => {
    const response = await API.get(`/chats/messages/${chatId}`);
    return response.data;
};

export const deleteChat = async (chatId) => {
    const response = await API.delete(`/chats/delete/${chatId}`);
    return response.data;
};

export const logout = async () => {
    const response = await API.get("/auth/logout");
    return response.data;
};
