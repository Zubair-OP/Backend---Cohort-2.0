import { useState } from 'react'
import '../Style/login.css'
import FormGroup from '../components/FormGroup'
import { Link } from 'react-router'
import { useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'


const Login = () => {

    const { handleLogin} = useAuth()

    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('')
        try {
            await handleLogin({ email, password });
            navigate('/')
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed. Please try again.')
        }
    }

    return (
        <main className='login-page'>
            <div className='login-container'>
                <div className='login-header'>
                    <h1>Login</h1>
                </div>
                <div className='login-form'>
                    {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <FormGroup value={email} onChange={(e) => setemail(e.target.value)} label="Email" placeholder="Enter your email" />
                        <FormGroup value={password} label="Password" onChange={(e) => setpassword(e.target.value)} placeholder="Enter your password" />
                        <button type='submit'>Login</button>
                    </form>
                    <p>Don't have an account? <Link to="/register">Register</Link></p>
                </div>
            </div>
        </main>
    )
}

export default Login