import {Register, Login,Logout,Getme} from '../services/auth.Api';
import { useDispatch } from 'react-redux';
import { setUser,setLoading,setError } from '../state/auth.slice';

export function useAuth() {     
    const dispatch = useDispatch();

    const normalizeAuthError = (error, fallbackMessage) => {
        const fieldMap = {
            fullname: 'fullName',
            email: 'email',
            password: 'password',
            contact: 'contactNumber',
            isSeller: 'isSeller',
        };

        const fieldErrors = (error?.errors || []).reduce((acc, current) => {
            const fieldName = fieldMap[current.path] || current.path;

            if (fieldName && !acc[fieldName]) {
                acc[fieldName] = current.msg;
            }

            return acc;
        }, {});

        const firstFieldError = Object.values(fieldErrors)[0];

        const message =
            firstFieldError ||
            error?.message ||
            fallbackMessage;

        return {
            message,
            fieldErrors,
        };
    };

    const getErrorMessage = (error, fallbackMessage) => {
        if (typeof error === 'string') {
            return error;
        }

        return error?.message || fallbackMessage;
    };

    async function handleRegister(data) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const response = await Register(data)
            dispatch(setUser(response.user))
            return response
        } catch (error) {
            const normalizedError = normalizeAuthError(error, 'Registration failed.')
            dispatch(setError(normalizedError.message))
            throw normalizedError
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin(data) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const response = await Login(data)
            dispatch(setUser(response.user))
            return response.user
        } catch (error) {
            const normalizedError = normalizeAuthError(error, 'Login failed.')
            dispatch(setError(normalizedError.message))
            throw normalizedError
        } finally {
            dispatch(setLoading(false))
        }
    }
    
    async function handleLogout() {
        try {
            dispatch(setLoading(true))
            const response = await Logout()
            dispatch(setUser(null))
            return response
        } catch (error) {
            const message = getErrorMessage(error, 'Logout failed.')
            dispatch(setError(message))
            throw new Error(message)
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetme() {
        try {             
             dispatch(setLoading(true))
             dispatch(setError(null))
             const response = await Getme()
             dispatch(setUser(response.user))
        } catch (error) {
            dispatch(setError(getErrorMessage(error, 'Unable to fetch user session.')))
        } finally {
            dispatch(setLoading(false))
        }
    }

        return {
            handleRegister,
            handleLogin,
            handleLogout,
            handleGetme
        }
            
}
