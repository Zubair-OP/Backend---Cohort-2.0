import axios from "axios"

const API = axios.create({
    baseURL: "http://localhost:3000/api/auth",
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
        const response = await API.post("/logout")
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