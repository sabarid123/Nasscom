const ApiError = require('../utils/apiError');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, err.errors || [], err.stack);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new ApiError(400, `Duplicate field value entered: ${field}`);
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    error = new ApiError(400, `Resource not found. Invalid ${err.path}`);
  }

  const response = {
    statusCode: error.statusCode,
    success: false,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  };

  logger.error(`[${req.method}] ${req.originalUrl} - Status ${error.statusCode}: ${error.message}`);

  res.status(error.statusCode).json(response);
};

const notFound = (req, res, next) => {
  const error = new ApiError(404, `Route Not Found - ${req.originalUrl}`);
  next(error);
};

module.exports = { errorHandler, notFound };
