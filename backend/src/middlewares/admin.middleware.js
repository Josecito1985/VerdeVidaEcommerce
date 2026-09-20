// src/middlewares/admin.middleware.js
// Debe usarse SIEMPRE después de authMiddleware (necesita req.user ya seteado).
const ApiError = require('../utils/ApiError');

function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return next(new ApiError(403, 'Acceso restringido a administradores'));
  }
  next();
}

module.exports = adminMiddleware;
