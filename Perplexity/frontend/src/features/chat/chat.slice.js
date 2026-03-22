import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarCollapsed: false,
  isLoading: false,
  messages: [],
  currentChatId: null,
  selectedChat: null,
  chats: []
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    deleteChatById: (state, action) => {
      state.chats = state.chats.filter((chat) => chat._id !== action.payload);
    }
  }
});

export const { 
  setSidebarCollapsed, 
  setIsLoading, 
  setMessages, 
  addMessage, 
  setCurrentChatId, 
  setSelectedChat, 
  setChats,
  deleteChatById
} = chatSlice.actions;

export default chatSlice.reducer;
