// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new ApiError(401, 'No se envió un token de autenticación'));
  }

  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, env.jwt.secret);
    next();
  } catch (err) {
    next(new ApiError(401, 'Token inválido o expirado'));
  }
}

module.exports = authMiddleware;
