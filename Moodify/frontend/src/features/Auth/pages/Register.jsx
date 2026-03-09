import { useState } from 'react'
import '../Style/register.css'
import FormGroup from '../components/FormGroup'
import { Link } from 'react-router'
import { useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Register = () => {

    const { handleRegister } = useAuth()

    const [username, setusername] = useState('')
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('')
        try {
            await handleRegister(username, email, password)
            navigate('/')
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed. Please try again.')
        }
    }


    return (
        <main>
            <div className="register-page">
                <div className="register-container">
                    <div className="register-header">
                        <h1>Register</h1>
                    </div>
                    <div className="register-form">
                        {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <FormGroup value={username} onChange={(e) => setusername(e.target.value)} label="Name" placeholder="Enter your name" />
                            <FormGroup value={email} onChange={(e) => setemail(e.target.value)} label="Email" placeholder="Enter your email" />
                            <FormGroup value={password} onChange={(e) => setpassword(e.target.value)} label="Password" placeholder="Enter your password" />
                            <button type="submit">Register</button>
                        </form>
                        <p>Already have an account? <Link to="/login">Login</Link></p>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Register