/**
 * Authentication Controller
 * Handles user registration, login, and user information retrieval
 * This controller implements the core authentication functionality for the application
 */

const User = require('../Models/User');
const jwt = require('jsonwebtoken');

/**
 * JWT Token Generator
 * Creates a signed JWT token containing the user's ID
 * 
 * @param {string} userId - MongoDB _id of the user
 * @returns {string} Signed JWT token
 * 
 * Token Structure:
 * - Payload: { userId }
 * - Expiration: 7 days
 * - Signed with JWT_SECRET from environment variables
 */
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d' // Token expires in 7 days
    });
};

/**
 * User Registration Handler
 * Creates a new user account and returns a JWT token
 * 
 * Request body should contain:
 * @param {string} username - Desired username
 * @param {string} email - User's email address
 * @param {string} password - User's password (will be hashed)
 * 
 * Steps:
 * 1. Check if username or email already exists
 * 2. Create new user document
 * 3. Save user to database (password is automatically hashed)
 * 4. Generate JWT token
 * 5. Return user data and token
 */
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check for existing user to prevent duplicates
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'User with this email or username already exists'
            });
        }

        // Create new user instance
        const user = new User({
            username,
            email,
            password // Will be hashed by pre-save middleware
        });

        // Save user to database
        await user.save();

        // Generate authentication token
        const token = generateToken(user._id);

        // Return success response with user data and token
        res.status(201).json({
            status: 'success',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                },
                token
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

/**
 * User Login Handler
 * Authenticates user credentials and returns a JWT token
 * 
 * Request body should contain:
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * 
 * Steps:
 * 1. Find user by email
 * 2. Verify password using comparePassword method
 * 3. Generate new JWT token
 * 4. Return user data and token
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        // Generate new authentication token
        const token = generateToken(user._id);

        // Return success response
        res.json({
            status: 'success',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                },
                token
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

/**
 * Get Current User Handler
 * Returns the authenticated user's information
 * This route is protected by the auth middleware
 * 
 * No request body needed - uses req.user set by auth middleware
 * 
 * Usage:
 * - Called after user is authenticated
 * - Used to get current user's profile
 * - Requires valid JWT token in Authorization header
 */
exports.getCurrentUser = async (req, res) => {
    try {
        // req.user is set by auth middleware
        const user = req.user;
        res.json({
            status: 'success',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
}; 