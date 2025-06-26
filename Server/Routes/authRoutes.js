/**
 * Authentication Routes
 * Defines all authentication-related endpoints for the API
 * 
 * Route Structure:
 * /api/auth/register - Create new user account
 * /api/auth/login - Authenticate existing user
 * /api/auth/me - Get current user info (protected)
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

/**
 * Public Routes
 * These routes don't require authentication
 * 
 * POST /register
 * - Creates new user account
 * - Expects: { username, email, password }
 * - Returns: { user, token }
 * 
 * POST /login
 * - Authenticates existing user
 * - Expects: { email, password }
 * - Returns: { user, token }
 */
router.post('/register', authController.register);
router.post('/login', authController.login);

/**
 * Protected Routes
 * These routes require a valid JWT token in the Authorization header
 * Format: Authorization: Bearer <token>
 * 
 * GET /me
 * - Returns current user's information
 * - Requires: Valid JWT token
 * - Returns: { user }
 */
router.get('/me', auth, authController.getCurrentUser);

module.exports = router; 