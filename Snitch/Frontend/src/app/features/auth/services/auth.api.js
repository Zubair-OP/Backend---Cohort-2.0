import axios from "axios"
import { API_BASE_URL } from '../../../config/apiBaseUrl.js';

const API = axios.create({
    baseURL: `${API_BASE_URL}/api/auth`,
    withCredentials: true,
})

export async function Register(data) {
    try {
        const response = await API.post("/register", data)
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export async function Login(data) {
    try {
        const response = await API.post("/login",data)
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export async function Logout() {
    try {
        const response = await API.get("/logout")
        return response.data
    } catch (error) {
        throw error.response.data
    }
};


export async function Getme() {
    try {
        const response = await API.get("/get-me")
        return response.data
    } catch (error) {
        throw error.response.data
    }
}