import {setUser, setLoading, setError } from "../state/auth.slice";
import { registerUser } from "../services/auth.api";
import { useDispatch } from "react-redux";

export const useAuth = () => {
    const dispatch = useDispatch();

    const handleRegister = async (email, contact, password, fullName, isSeller= false ) => {
        dispatch(setLoading(true));
            const response = await registerUser(email, contact, password, fullName, isSeller );
            dispatch(setUser(response.user));
        } 

        return {handleRegister}
    }