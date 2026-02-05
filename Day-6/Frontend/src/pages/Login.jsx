import axios from 'axios';
import { Link } from 'react-router-dom';
import './Auth.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState([]);
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        const { email, password } = e.target.elements;
        axios.post('http://localhost:3000/api/users/login', {
            email: email.value,
            password: password.value
        }, {
            withCredentials: true
        })
            .then(response => {
                setLoginData([...loginData, response.data]);
                localStorage.setItem('isLoggedIn', 'true');
                navigate('/');
            })
            .catch(error => {
                console.error('Error:', error.response?.data || error.message);
                setLoginData([]);
                const errorMessage = error.response?.data?.message || 'Invalid credentials';
                setError(errorMessage);
            });
    }
    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Welcome Back</h2>
                    <p>Enter your credentials to access your account</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label className="input-label" htmlFor="email">Email</label>
                        <input type="email" id="email" className="input-field" placeholder="name@example.com" required />
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="password">Password</label>
                        <input type="password" id="password" className="input-field" placeholder="••••••••" required />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-actions">
                        <div className="remember-me">
                            <input type="checkbox" id="remember" />
                            <label htmlFor="remember">Remember me</label>
                        </div>
                        <a href="#" className="forgot-password">Forgot password?</a>
                    </div>

                    <button type="submit" className="btn btn-primary btn-full">Sign In</button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
