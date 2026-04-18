import { login, register,getCurrentUser } from '../services/Auth.api'
import { setError, setLoading ,setUser } from '../auth.slice'
import { useDispatch } from 'react-redux'

export function useAuth() {

    const dispatch = useDispatch()

    const handleRegister = async (username, email, password) => {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const response = await register(username, email, password)
            return { success: true, data: response }
        } catch (error) {
            dispatch(setError(error.message || "Registration failed"))
            return { success: false, error: error.message || "Registration failed" }
        }
         finally {
            dispatch(setLoading(false))
        }
    }

    const handleLogin = async (email, password) => {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const response = await login(email, password)
            dispatch(setUser(response.user))
            return { success: true, data: response }
        } catch (error) {
            dispatch(setUser(null))
            dispatch(setError(error.message || "Login failed"))
            return { success: false, error: error.message || "Login failed" }
        }
         finally {
            dispatch(setLoading(false))
        }

    }

    const fetchCurrentUser = async () => {
        try {
            dispatch(setLoading(true))
            const response = await getCurrentUser()
            dispatch(setUser(response.user || null))
            dispatch(setError(null))
        } catch (error) {
            dispatch(setUser(null))
            dispatch(setError(error.message || "Failed to fetch current user"))
        } finally {
            dispatch(setLoading(false))
        }
    }


    return { handleRegister, handleLogin, fetchCurrentUser }
}
