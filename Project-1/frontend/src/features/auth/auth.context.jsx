import { createContext , useState } from "react";
import {login , register } from "./services/auth.api";


export const authContext = createContext()

export function AuthProvider({children}){

    const [User, setUser] = useState(null)
    const [loading, setloading] = useState(false)


    const loginUser = async (email , password) =>{
        try {
            setloading(true)
            const response = await login(email , password)
            setUser(response.user)
        } catch (error) {
            console.error("Login error:", error);
        } finally {
            setloading(false)
        }
    }

    const registerUser = async (name , email , password) =>{
        try {
            setloading(true)
            const response = await register(email, password , name);
            setUser(response.user)
        } catch (error) {
            console.error("Register error:", error);
        } finally {
            setloading(false)
        }
    }

    return (
    <authContext.Provider value={{User , loading , loginUser , registerUser}}>
        {children}
    </authContext.Provider>
)
}




export default AuthProvider

