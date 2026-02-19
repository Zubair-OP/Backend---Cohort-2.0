import { useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import "../styles/form.scss"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handelSubmit = (e) =>{
        e.preventDefault()

        axios.post("http://localhost:3000/api/auth/login", {
            email,
            password
        },{
            withCredentials:true
        }).then(res => {
            console.log(res.data)
        }).catch(err => {
            console.log(err)
        })
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