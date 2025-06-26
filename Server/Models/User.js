/**
 * User Model
 * This file defines the schema and methods for the User model in MongoDB.
 * We use Mongoose to create a schema that enforces data structure and validation.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing

/**
 * User Schema Definition
 * Defines the structure and validation rules for user documents in MongoDB
 * 
 * Fields:
 * - username: Unique identifier for the user (like a handle)
 * - email: User's email address (unique, used for login)
 * - password: Hashed password (never stored in plain text)
 * - createdAt: Timestamp of account creation
 * 
 * Each field has validation rules:
 * - required: Field must be present
 * - unique: Value must be unique in the database
 * - trim: Removes whitespace from start and end
 * - minlength: Minimum length requirement
 * - match: Regular expression pattern to validate format
 */
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

/**
 * Pre-save Middleware
 * This runs before saving any user document to the database
 * It automatically hashes the password if it has been modified
 * 
 * How it works:
 * 1. Checks if password was modified
 * 2. Generates a salt (random string to make hash unique)
 * 3. Creates a hash of the password + salt
 * 4. Replaces the plain text password with the hash
 */
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }
    try {
        // Generate a salt with complexity factor of 10
        const salt = await bcrypt.genSalt(10);
        // Hash the password using the salt
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

/**
 * Instance Method: comparePassword
 * This method is available on any User document
 * Used to compare a plain text password with the hashed password
 * 
 * Example usage:
 * const user = await User.findOne({ email });
 * const isMatch = await user.comparePassword('plainTextPassword');
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        // bcrypt.compare handles comparing the hash with plain text
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

// Create the model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User; 