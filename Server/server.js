/**
 * Main Server Application
 * This is the entry point for the Express server application.
 * It sets up the server, connects to MongoDB, and configures middleware and routes.
 */

// ===================================================
// 1. IMPORT DEPENDENCIES
// ===================================================
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./Routes/authRoutes');

// ===================================================
// 2. LOAD ENVIRONMENT VARIABLES
// ===================================================
/**
 * dotenv loads environment variables from .env file
 * Required variables:
 * - PORT: Server port number
 * - MONGO_URI: MongoDB connection string
 * - JWT_SECRET: Secret key for JWT signing
 */
dotenv.config();

// ===================================================
// 3. CREATE EXPRESS APPLICATION
// ===================================================
const app = express();
const PORT = process.env.PORT || 5002;

// ===================================================
// 4. CONFIGURE MIDDLEWARE
// ===================================================
/**
 * Middleware Configuration:
 * - cors: Enables Cross-Origin Resource Sharing
 * - express.json: Parses JSON request bodies
 * - express.urlencoded: Parses URL-encoded bodies
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===================================================
// 5. DATABASE CONNECTION
// ===================================================
/**
 * MongoDB Connection
 * Establishes connection to MongoDB using mongoose
 * Exits process if connection fails
 */
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    });

// ===================================================
// 6. CONFIGURE ROUTES
// ===================================================
/**
 * API Routes:
 * - /api/auth/*: Authentication routes (login, register, etc.)
 * - /health: Server health check endpoint
 * - /api: Basic API test endpoint
 */

// Mount authentication routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is healthy' });
});

// Basic API test endpoint
app.get('/api', (req, res) => {
    res.json({ message: "Hello from the server! The API is running." });
});

// ===================================================
// 7. ERROR HANDLING
// ===================================================
/**
 * Error Handling Middleware:
 * 1. Catch 404 errors for undefined routes
 * 2. Global error handler for all other errors
 */
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use(errorHandler);

// ===================================================
// 8. START SERVER
// ===================================================
/**
 * Server Startup
 * Listens on specified port and logs startup information
 */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

