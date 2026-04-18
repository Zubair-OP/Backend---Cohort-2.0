import { useState } from 'react'
import { Link } from 'react-router'
import { useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useSelector } from 'react-redux'
import './auth.css'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const { handleLogin } = useAuth()
  const { error, loading } = useSelector((state) => state.auth)

  const navigate = useNavigate()
  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const result = await handleLogin(formData.email, formData.password)
    if (result.success) {
      navigate('/')
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to continue</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label" htmlFor="login-email">Email</label>
          <input
            id="login-email"
            className="auth-input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />

          <label className="auth-label" htmlFor="login-password">Password</label>
          <input
            id="login-password"
            className="auth-input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-button" type="submit" disabled={loading}>
            Sign In
          </button>
        </form>

        <p className="auth-footer">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </section>
  )
}

export default Login
