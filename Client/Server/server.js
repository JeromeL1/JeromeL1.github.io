// == Server Setup with Express and MongoDB ==
// This code sets up a basic Express server with MongoDB connection and middleware configuration.
// Importing dependencies
// This is a basic Express server setup with MongoDB connection and middleware configuration
// Ensure you have installed the required packages: express, mongoose, dotenv, cors
// == Server Setup with Express and MongoDB ==


// ===================================================
// 1. IMPORT ALL DEPENDENCIES
// ===================================================
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// ===================================================
// 2. INITIALIZE & CONFIGURE
// ===================================================
// Load environment variables from .env file
dotenv.config();
// Create an Express application
const app = express();
// Set the port for the server
const PORT = process.env.PORT || 5002;

// ===================================================
// 3. CONNECT TO DATABASE (will be moved later)
// ===================================================
// Note: In a real app (Day 4), this logic moves to a separate config/db.js file
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err.message);
        // Exit the process with failure code if we can't connect to the DB
        process.exit(1);
    });

// ===================================================
// 4. MIDDLEWARE
// ===================================================
// Enable CORS for all routes, allowing the React front-end to communicate with this server
app.use(cors());

// Enable Express to parse JSON data in the request body
// This replaces the old bodyParser.json()
app.use(express.json());

// Example of serving static files (if you had a 'public' folder for images, etc.)
// app.use(express.static('public')); // This is optional for now

// ===================================================
// 5. DEFINE ROUTES
// =_=================================================
// A simple test route to check if the server is running
app.get('/api', (req, res) => {
    // Send a JSON response
    res.json({ message: "Hello from the server! The API is running." });
});

// ===================================================
// 6. START THE SERVER
// ===================================================
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

