import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import axios from 'axios';

const Navbar = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check login status on mount
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedIn);
    }, [location]); // Re-check on navigation

    function HandleLogout() {
        axios.get('http://localhost:3000/api/users/logout', {
            withCredentials: true
        })
            .then(response => {
                console.log(response.data);
                localStorage.removeItem('isLoggedIn'); // Clear local state
                window.location.href = '/login';
            })
            .catch(error => {
                console.error("Logout error:", error);
            });
    }

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link to="/" className="navbar-logo">
                    Day<span className="text-highlight">Six</span>
                </Link>

                <div className="navbar-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <div className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>

                <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
                    <Link to="/albums" className={`nav-link ${location.pathname === '/albums' ? 'active' : ''}`}>Albums</Link>
                    <Link to="/create-post" className={`nav-link ${location.pathname === '/create-post' ? 'active' : ''}`}>Create Post</Link>
                    <Link to="/create-album" className={`nav-link ${location.pathname === '/create-album' ? 'active' : ''}`}>Create Album</Link>
                    <div className="nav-buttons">
                        {!isLoggedIn ? (
                            <>
                                <Link to="/login" className="btn btn-outline btn-sm">Log In</Link>
                                <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
                            </>
                        ) : (
                            <button onClick={HandleLogout} className="btn btn-outline btn-sm logout-btn">
                                <span className="material-icons logout-icon">logout</span>
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
