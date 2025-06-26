/**
 * Authentication Context
 * Provides authentication state and methods throughout the React application
 * Uses Context API to avoid prop drilling
 */

import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is logged in on mount
    useEffect(() => {
        checkAuth();
    }, []);

    // Verify token and get user data
    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:5002/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.data.user);
            } else {
                localStorage.removeItem('token');
            }
        } catch (err) {
            console.error('Auth check failed:', err);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    // Login user
    const login = async (email, password) => {
        try {
            setError(null);
            const response = await fetch('http://localhost:5002/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('token', data.data.token);
            setUser(data.data.user);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // Register user
    const register = async (username, email, password) => {
        try {
            setError(null);
            const response = await fetch('http://localhost:5002/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            localStorage.setItem('token', data.data.token);
            setUser(data.data.user);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // Logout user
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    // Get auth token
    const getToken = () => {
        return localStorage.getItem('token');
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        getToken,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 