import { useState } from "react"
import { Link } from "react-router-dom"
import "../styles/form.scss"
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from "react-router"

const Register = () => {

    const navigate = useNavigate()
    const { registerUser , loading } = useAuth()


    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("") 
    
     if (loading) {
        return <div className="loading">Loading...</div>
    }


    const handelSubmit = async (e) =>{
        e.preventDefault();
        await registerUser(name ,email , password);
        navigate("/");
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