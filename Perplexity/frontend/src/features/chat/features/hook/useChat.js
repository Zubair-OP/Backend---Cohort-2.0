import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InitializeSocket } from "../services/chat.socket";
import { streamMessage, getChats, getChatMessages, deleteChat } from "../services/api.services";
import {
  setSidebarCollapsed as setSidebarCollapsedAction,
  setIsLoading,
  setStreamingMessageId,
  setMessages,
  addMessage,
  updateMessageById,
  setCurrentChatId,
  setSelectedChat,
  setChats,
  deleteChatById,
} from "../../chat.slice";

export function useChat() {
  const dispatch = useDispatch();
  const {
    sidebarCollapsed,
    isLoading,
    streamingMessageId,
    messages,
    currentChatId,
    selectedChat,
    chats,
  } = useSelector((state) => state.chat);

  /**
   * AbortController ref — created fresh for each message send.
   * Calling abortControllerRef.current.abort() cancels the fetch mid-stream.
   */
  const abortControllerRef = useRef(null);

  // ── Load sidebar chat list ──────────────────────────────────────────────────
  const loadChats = async () => {
    try {
      const res = await getChats();
      if (res.chats) dispatch(setChats(res.chats));
    } catch (err) {
      console.error("Failed to load chats:", err);
    }
  };

  useEffect(() => {
    InitializeSocket();
    loadChats();
  }, []);

  // ── Delete a chat ───────────────────────────────────────────────────────────
  const handleDeleteChat = async (chatId) => {
    try {
      await deleteChat(chatId);
      dispatch(deleteChatById(chatId));
      if (currentChatId === chatId) {
        dispatch(setCurrentChatId(null));
        dispatch(setMessages([]));
      }
    } catch (err) {
      console.error("Failed to delete chat:", err);
    }
  };

  // ── Select a chat and load its messages ─────────────────────────────────────
  const handleSelectChat = async (chatId) => {
    try {
      dispatch(setIsLoading(true));
      const res = await getChatMessages(chatId);
      if (res.messages) {
        dispatch(setMessages(res.messages));
        dispatch(setCurrentChatId(chatId));
      }
      const chat = chats.find((c) => c._id === chatId);
      dispatch(setSelectedChat(chat || null));
      if (window.innerWidth < 768 && !sidebarCollapsed) {
        dispatch(setSidebarCollapsedAction(true));
      }
    } catch (err) {
      console.error("Failed to load chat messages:", err);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  // ── Start a new chat session ────────────────────────────────────────────────
  const handleNewChat = () => {
    dispatch(setCurrentChatId(null));
    dispatch(setMessages([]));
    if (window.innerWidth < 768 && !sidebarCollapsed) {
      dispatch(setSidebarCollapsedAction(true));
    }
  };

  // ── Abort the current in-flight stream ─────────────────────────────────────
  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  // ── Send a message and stream the response ──────────────────────────────────
  const handleSend = async (text) => {
    if (!text.trim()) return;

    // Create a fresh AbortController for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const assistantMessageId = `stream-${Date.now()}`;
    let assistantContent = "";

    // 1. Immediately add the user message to state
    dispatch(addMessage({ id: `user-${Date.now()}`, role: "user", content: text }));

    // 2. Add an empty assistant placeholder that we'll fill chunk by chunk
    dispatch(addMessage({ id: assistantMessageId, role: "assistant", content: "", sources: [] }));
    dispatch(setStreamingMessageId(assistantMessageId));
    dispatch(setIsLoading(true));

    try {
      // 3. Open the SSE stream
      await streamMessage(
        text,
        currentChatId,
        {
          // Named event: server confirmed chat id + title
          onStart: ({ chat }) => {
            if (!currentChatId && chat?._id) {
              dispatch(setCurrentChatId(chat._id));
              loadChats(); // update sidebar title
            }
          },

          // Plain data token chunk: append to assistant message
          onChunk: ({ token }) => {
            assistantContent += token;
            dispatch(
              updateMessageById({
                id: assistantMessageId,
                changes: { content: assistantContent },
              })
            );
          },

          // Named event: stream finished, replace placeholder with persisted message
          onDone: ({ chat, aiMessage }) => {
            if (chat?._id) {
              dispatch(setCurrentChatId(chat._id));
            }
            dispatch(
              updateMessageById({
                id: assistantMessageId,
                changes: {
                  id: aiMessage?._id || assistantMessageId,
                  content:
                    aiMessage?.content ||
                    assistantContent ||
                    "I couldn't process that response.",
                  sources: aiMessage?.sources || [],
                },
              })
            );
            loadChats();
          },

          // Error chunk from server
          onError: ({ error }) => {
            throw new Error(error || "Streaming failed");
          },
        },
        // 4. Pass AbortController signal → fetch will throw AbortError on Stop
        controller.signal
      );
    } catch (error) {
      // AbortError just means the user hit Stop — leave partial content visible
      if (error.name !== "AbortError") {
        console.error("Error sending message:", error);
        dispatch(
          updateMessageById({
            id: assistantMessageId,
            changes: {
              content:
                error?.message ||
                "Sorry, I encountered an error communicating with the server.",
              sources: [],
            },
          })
        );
      }
    } finally {
      abortControllerRef.current = null;
      dispatch(setStreamingMessageId(null));
      dispatch(setIsLoading(false));
    }
  };

  // ── Sidebar collapsed toggle wrapper ───────────────────────────────────────
  const setSidebarCollapsedWrapper = (val) => {
    dispatch(
      setSidebarCollapsedAction(
        typeof val === "function" ? val(sidebarCollapsed) : val
      )
    );
  };

  return {
    sidebarCollapsed,
    setSidebarCollapsed: setSidebarCollapsedWrapper,
    isLoading,
    streamingMessageId,
    messages,
    currentChatId,
    selectedChat,
    chats,
    handleDeleteChat,
    handleSelectChat,
    handleNewChat,
    handleSend,
    handleStop, // ← "Stop generating" action
  };
}
