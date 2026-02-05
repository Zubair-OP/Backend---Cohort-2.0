import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import axios from 'axios';
import { useState } from 'react';
import { useModal } from '../context/ModalContext';

const Signup = () => {
    const navigate = useNavigate(); // Component level pe hook call karo
    const [formData, setFormData] = useState([]);
    const { showModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();

        const { fullname, email, password } = e.target.elements;

        axios.post('http://localhost:3000/api/users/register', {
            username: fullname.value,
            email: email.value,
            password: password.value
        })
            .then(response => {
                setFormData([...formData, response.data]);
                showModal('Success', 'Account created successfully! Please login.', 'success');
                setTimeout(() => navigate('/login'), 1000); // Wait for modal read
            })
            .catch(error => {
                console.log('Error:', error.response?.data || error.message);
                const errMsg = error.response?.data?.message || 'Registration failed. Please try again.';
                showModal('Registration Failed', errMsg, 'error');
            });
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Create an Account</h2>
                    <p>Join our community today</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label" htmlFor="fullname">Full Name</label>
                        <input type="text" id="fullname" name="fullname" className="input-field" placeholder="John Doe" required />
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" className="input-field" placeholder="name@example.com" required />
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" className="input-field" placeholder="Create a password" required />
                    </div>

                    <button type="submit" className="btn btn-primary btn-full">Sign Up</button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login" className="auth-link">Log in</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
