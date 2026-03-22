import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InitializeSocket } from "../services/chat.socket";
import { sendMessage, getChats, getChatMessages, deleteChat } from "../services/api.services";
import { 
  setSidebarCollapsed as setSidebarCollapsedAction, 
  setIsLoading, 
  setMessages, 
  addMessage, 
  setCurrentChatId, 
  setSelectedChat, 
  setChats,
  deleteChatById
} from "../../chat.slice";

export function useChat() {
  const dispatch = useDispatch();
  const { 
    sidebarCollapsed, 
    isLoading, 
    messages, 
    currentChatId, 
    selectedChat, 
    chats 
  } = useSelector((state) => state.chat);

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

  const handleNewChat = () => {
    dispatch(setCurrentChatId(null));
    dispatch(setMessages([]));
    if (window.innerWidth < 768 && !sidebarCollapsed) {
      dispatch(setSidebarCollapsedAction(true));
    }
  };

  const handleSend = async (text) => {
    if (!text.trim()) return;
    
    dispatch(addMessage({ role: "user", content: text }));
    dispatch(setIsLoading(true));

    try {
      const response = await sendMessage(text, currentChatId);
      
      if (!currentChatId && response.chat?._id) {
        dispatch(setCurrentChatId(response.chat._id));
        loadChats(); // Triggers a new API call to refresh the list, which updates state inside it
      }
      
      dispatch(addMessage({
        role: "assistant",
        content: response.aiMessage?.content || "I couldn't process that response (missing content).",
      }));
    } catch (error) {
      console.error("Error sending message:", error);
      dispatch(addMessage({
        role: "assistant",
        content: "Sorry, I encountered an error communicating with the server.",
      }));
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const setSidebarCollapsedWrapper = (val) => {
    dispatch(setSidebarCollapsedAction(typeof val === "function" ? val(sidebarCollapsed) : val));
  };

  return { 
    sidebarCollapsed, 
    setSidebarCollapsed: setSidebarCollapsedWrapper,
    isLoading, 
    messages, 
    currentChatId, 
    selectedChat, 
    chats,
    handleDeleteChat, 
    handleSelectChat, 
    handleNewChat, 
    handleSend 
  }
}