import { login, register,getCurrentUser } from '../services/Auth.api'
import { setError, setLoading ,setUser } from '../auth.slice'
import { useDispatch } from 'react-redux'

export function useAuth() {

    const dispatch = useDispatch()

    const handleRegister = async (username, email, password) => {
        try {
            dispatch(setLoading(true))
            const response = await register(username, email, password) 
        } catch (error) {
            dispatch(setError(error.message) || "Registration failed")
        }
         finally {
            dispatch(setLoading(false))
        }
    }

    const handleLogin = async (email, password) => {
        try {
            dispatch(setLoading(true))
            const response = await login(email, password)
            dispatch(setUser(response.user))
        } catch (error) {
            dispatch(setError(error.message) || "Login failed")
        }
         finally {
            dispatch(setLoading(false))
        }

    }

    const fetchCurrentUser = async () => {
        try {
            dispatch(setLoading(true))
            const response = await getCurrentUser()
            dispatch(setUser(response.user))
        } catch (error) {
            dispatch(setError(error.message) || "Failed to fetch current user")
        } finally {
            dispatch(setLoading(false))
        }
    }


    return { handleRegister, handleLogin, fetchCurrentUser }
}
