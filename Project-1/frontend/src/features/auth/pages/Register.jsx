import { useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import "../styles/form.scss"

const Register = () => {
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")  
    const handelSubmit = (e) =>{
        e.preventDefault()

        axios.post("http://localhost:3000/api/auth/register", {
            name,
            password,
            email
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
            <h2>Register</h2>
            <form onSubmit={handelSubmit}>
                <input type="text" name="name" placeholder='Enter your name' onInput={(e)=> setName(e.target.value)}/>
                <input type="password" name="password" placeholder='Enter a password' onInput={(e)=> setPassword(e.target.value)}/>
                <input type="email" name="email" placeholder='Enter a email' onInput={(e)=> setEmail(e.target.value)}/>
                <button>Register</button>
            </form>
            <p>Already have an account? <Link className="toggleAuthForm" to="/login">Login</Link></p>
        </div>
    </main>
  )
}

export default Register