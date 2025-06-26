/**
 * Navigation Component
 * Renders different navigation items based on authentication state
 * Handles logout functionality
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="nav-container">
            <ul className="nav-list">
                <div className="nav-left">
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                </div>

                <div className="nav-right">
                    {isAuthenticated ? (
                        <>
                            <div className="user-info">
                                <span>Welcome, {user.username}!</span>
                            </div>
                            <button onClick={handleLogout} className="logout-button">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/login">Login</Link>
                            </li>
                            <li>
                                <Link to="/register">Register</Link>
                            </li>
                        </>
                    )}
                </div>
            </ul>
        </nav>
    );
};

export default Navigation; 