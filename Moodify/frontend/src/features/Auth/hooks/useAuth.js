import { useContext, useEffect } from "react";
import { AuthContext } from "../Auth.context.jsx";
import { register, login, logout, getme } from "../services/auth.Api.js";

export const useAuth = () => {
    const { user, setuser, loading, setloading } = useContext(AuthContext);

    const handleRegister = async (username, email, password) => {
        try {
            setloading(true)
            const res = await register(username, email, password);
            setuser(res.user)

        } catch (error) {
            console.log(error);
            throw error
        } finally {
            setloading(false)
        }
    }

    const handleLogin = async ({ email, password }) => {
        try {
            setloading(true)
            const res = await login(email, password);
            setuser(res.user)
        } catch (error) {
            console.log(error)
            throw error
        } finally {
            setloading(false)
        }
    }

    const HandleLogout = async () => {
        try {
            const res = await logout()
            setuser(null)
        } catch (error) {
            console.log(error)
        } finally {
            setloading(false)
        }
    }

    const HandlegetMe = async () => {
        try {
            const res = await getme();
            setuser(res.user)
        } catch (error) {
            console.log(error)
        } finally {
            setloading(false)
        }
    }

    return ({
        HandleLogout, handleLogin, HandlegetMe, handleRegister, user, loading
    })

}

