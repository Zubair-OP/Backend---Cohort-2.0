import { createContext, useState, useEffect } from "react";
import { getme } from "./services/auth.Api.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setuser] = useState(null);
    const [loading, setloading] = useState(true);

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await getme();
                setuser(res.user);
            } catch (error) {
                console.log(error);
            } finally {
                setloading(false);
            }
        };
        fetchMe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setuser, loading, setloading }}>
            {children}
        </AuthContext.Provider>
    )
}
