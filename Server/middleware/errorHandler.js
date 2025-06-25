// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Default error status and message
    const status = err.status || 500;
    const message = err.message || 'Something went wrong!';

    // Specific error handling based on error type
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'error',
            message: 'Validation Error',
            details: err.errors
        });
    }

    if (err.name === 'MongoError' && err.code === 11000) {
        return res.status(409).json({
            status: 'error',
            message: 'Duplicate Key Error',
            details: err.keyValue
        });
    }

    // Default error response
    res.status(status).json({
        status: 'error',
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler; 