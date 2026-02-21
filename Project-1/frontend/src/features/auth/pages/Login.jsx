import React from 'react'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

const Login = () => {

    const { loginUser,loading } = useAuth()

    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    if(loading){
        return <div className="loading">Loading...</div>
    }

    const handleSubmit = (e) =>{
        e.preventDefault()
        loginUser(name , password)
        navigate("/")
    }
  return (
    <main>
        <div className="form-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name='name' placeholder='Enter your Name' onInput={(e)=> setName(e.target.value)}/>
                <input type="password" name='password' placeholder='Enter a password' onInput={(e)=> setPassword(e.target.value)}/>
                <button>Login</button>
            </form>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    </main>
  )
}

export default Login