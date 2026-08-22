import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import './auth.css'
import { useAuth } from '../hooks/useAuth'
import { useSelector } from 'react-redux'

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' })
  const { handleRegister } = useAuth()
  const { error, loading } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await handleRegister(formData.username, formData.email, formData.password)
    if (result.success) {
      setFormData({ username: '', email: '', password: '' })
      navigate('/')
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">P</div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Join and start exploring</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
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
              autoComplete="username"
            />
          </div>

          <div className="auth-field">
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
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
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
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-surface-0/30 border-t-surface-0 rounded-full animate-spin" />
                Creating account...
              </span>
            ) : (
              "Create account"
            )}
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
