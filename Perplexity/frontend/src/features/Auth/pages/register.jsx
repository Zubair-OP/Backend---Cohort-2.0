import { useState } from 'react'
import { Link } from 'react-router'
import './auth.css'
import { useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [errorMessage, setErrorMessage] = useState('')

  const navigate = useNavigate()
  const { handleRegister, loading } = useAuth()

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    try {
      await handleRegister(formData.username, formData.email, formData.password)
      navigate('/login')
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Signup failed. Please try again.')
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join and get started</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label" htmlFor="register-username">Username</label>
          <input
            id="register-username"
            className="auth-input"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a username"
            required
          />

          <label className="auth-label" htmlFor="register-email">Email</label>
          <input
            id="register-email"
            className="auth-input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />

          <label className="auth-label" htmlFor="register-password">Password</label>
          <input
            id="register-password"
            className="auth-input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a strong password"
            required
          />

          {errorMessage && <p className="auth-error">{errorMessage}</p>}

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </section>
  )
}

export default Register
