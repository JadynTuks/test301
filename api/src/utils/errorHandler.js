// src/utils/errorHandler.js
export const errorHandler = (err, req, res, next) => {
    console.error(`❌ Error: ${err.message}`);
    
    // Check if headers have already been sent
    if (res.headersSent) {
      return next(err);
    }
    
    // Determine status code
    const statusCode = err.statusCode || 500;
    
    // Send error response
    res.status(statusCode).json({
      error: true,
      message: err.message || "Internal Server Error",
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
  };