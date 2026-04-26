import {Register, Login,Logout,Getme} from '../services/auth.Api';
import { useDispatch } from 'react-redux';
import { setUser,setLoading,setError } from '../state/auth.slice';

export function useAuth() {     
    const dispatch = useDispatch();

    async function handleRegister(data) {
            const response = await Register(data)
            dispatch(setUser(response.user))
            return response
        }

    async function handleLogin(data) {
            const response = await Login(data)
            dispatch(setUser(response.user))
            return response.user
        }
    
    async function handleLogout() {
            const response = await Logout()
            dispatch(setUser(null))
            return response
        }

    async function handleGetme() {
        try {             
             dispatch(setLoading(true))
             const response = await Getme()
             dispatch(setUser(response.user))
        } catch (error) {
            dispatch(setError(error.message))
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
