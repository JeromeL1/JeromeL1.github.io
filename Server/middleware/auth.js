/**
 * Authentication Middleware
 * This middleware validates JWT tokens and protects routes that require authentication
 * 
 * How JWT (JSON Web Token) works:
 * 1. When users log in, they receive a token
 * 2. They send this token with subsequent requests in the Authorization header
 * 3. This middleware validates the token and attaches the user to the request
 * 
 * Usage example in routes:
 * router.get('/protected-route', auth, (req, res) => {
 *   // Access authenticated user via req.user
 * });
 */

const jwt = require('jsonwebtoken');
const User = require('../Models/User');

/**
 * Authentication Middleware Function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * Steps:
 * 1. Extract token from Authorization header
 * 2. Verify token using JWT_SECRET
 * 3. Find user in database
 * 4. Attach user and token to request object
 * 
 * Error Handling:
 * - Returns 401 if token is missing or invalid
 * - Returns 401 if user no longer exists in database
 */
const auth = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        // Format: "Bearer <token>"
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error('No token provided');
        }

        // Verify token and decode its payload
        // This will throw an error if token is invalid or expired
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user by ID (stored in token)
        // This ensures the user still exists and hasn't been deleted
        const user = await User.findOne({ _id: decoded.userId });
        
        if (!user) {
            throw new Error('User not found');
        }

        // Attach user and token to request object
        // This makes them available in route handlers
        req.user = user;
        req.token = token;
        
        // Continue to the next middleware or route handler
        next();
    } catch (error) {
        // Return unauthorized status if anything goes wrong
        res.status(401).json({ 
            status: 'error',
            message: 'Please authenticate.' 
        });
    }
};

module.exports = auth; 