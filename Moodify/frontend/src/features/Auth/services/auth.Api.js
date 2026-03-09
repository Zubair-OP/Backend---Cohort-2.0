import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true,
});


export const register = async (username, email, password) => {
    try {
        const reponse = await API.post("/register", { username, email, password });
        return reponse.data;
    } catch (error) {
        console.log("Error during registration:", error)
        throw error
    }
}


export const login = async (email, password) => {
    try {
        const reponse = await API.post("/login", { email, password });
        return reponse.data;
    } catch (error) {
        console.log("Error during login:", error)
        throw error
    }
}

export const logout = async () => {
    try {
        const reponse = await API.get("/logout");
        return reponse.data;
    } catch (error) {
        console.log("Error during logout:", error)
        throw error
    }
}

export const getme = async () => {
    try {
        const reponse = await API.get("/me");
        return reponse.data;
    } catch (error) {
        console.log("Error during getme:", error)
        throw error
    }
}