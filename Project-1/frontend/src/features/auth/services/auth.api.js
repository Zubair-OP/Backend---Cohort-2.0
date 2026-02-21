import axios from "axios";


const Api = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true
})

export async function register(name, email, password) {
    try {
        const response = await Api.post("/register", {
            name,
            email,
            password
        })
        return response.data
    } catch (error) {
        console.log("Error during registration:", error)
        throw error
    }
}

export async function login(name, password) {
    try {
        const response = await Api.post("/login", {
            name,
            password
        })
        return response.data
    } catch (error) {
        console.log("Error during logging in:", error)
        throw error
    }
}
