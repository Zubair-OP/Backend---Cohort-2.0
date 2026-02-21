import { useState } from "react"
import { Link } from "react-router-dom"
import "../styles/form.scss"
import { useNavigate } from "react-router-dom"
import { useAuth } from '../hooks/useAuth'

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()
    const { loginUser, loading } = useAuth()

    if (loading) {
        return <div className="loading">Loading...</div>
    }


    const handelSubmit = (e) =>{
        e.preventDefault()

        loginUser(email, password)
        navigate("/")
    }
  return (
    <main>
        <div className="form-container">
            <h2>Login</h2>
            <form onSubmit={handelSubmit}>
                <input type="email" name="email" placeholder='Enter your email' onInput={(e)=> setEmail(e.target.value)}/>
                <input type="password" name="password" placeholder='Enter your password' onInput={(e)=> setPassword(e.target.value)}/>
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <Link className="toggleAuthForm" to="/register">Register</Link></p>
        </div>
    </main>
  )
}

export default Login