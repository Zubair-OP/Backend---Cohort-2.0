import { useContext } from "react";
import { authContext } from "../auth.context.jsx";
import { login, register } from "../services/auth.api.js";


export function useAuth() {
    const { User, loading, setUser, setloading } = useContext(authContext)

    const loginUser = async (name, password) => {
        try {
            setloading(true)
            const response = await login(name, password)
            setUser(response.user)
        } catch (error) {
            console.error("Login error:", error);
        } finally {
            setloading(false)
        }
    }

    const registerUser = async (name, email, password) => {
        try {
            setloading(true)
            const response = await register(name, email, password);
            setUser(response.user)
        } catch (error) {
            console.error("Register error:", error);
        } finally {
            setloading(false)
        }
    }

    return { User, loading, loginUser, registerUser }
}