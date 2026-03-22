import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
});

export const sendMessage = async (message, chatId) => {
    const response = await API.post("/chats/message", { message, chat: chatId });
    return response.data;
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
    const response = await API.get("/auth/logout")
    return response.data
}