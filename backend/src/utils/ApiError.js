// src/utils/ApiError.js
// Error de aplicación con código HTTP asociado, para que el middleware de errores
// sepa qué status devolver sin adivinar.
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // distingue errores esperados de bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
