// src/middlewares/notFound.middleware.js
const ApiError = require('../utils/ApiError');

function notFoundMiddleware(req, res, next) {
  next(new ApiError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
}

module.exports = notFoundMiddleware;
