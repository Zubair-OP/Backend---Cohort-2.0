import { useContext } from "react";
import { authContext } from "../Authcontext.jsx";
import { login, register } from "../services/auth.api.js";

export function useAuth() {
    const { User, loading, setUser, setloading } = useContext(authContext);

    const handleRegister = async (name, email, password) => {
        try {
            setloading(true)
            const response = await register(name, email, password)
            setUser(response.user)
        } catch (error) {
            console.error("Register error:", error);
            throw error;
        } finally {
            setloading(false)
        }
    }

    const handleLogin = async (email, password) => {
        try {
            setloading(true)
            const response = await login(email, password)
            setUser(response.user)
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        } finally {
            setloading(false)
        }
    }

    return { User, loading, handleRegister, handleLogin };
}
