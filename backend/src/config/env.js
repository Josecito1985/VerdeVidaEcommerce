// src/config/env.js
require('dotenv').config();

const required = ['DB_HOST', 'DB_USER', 'DB_NAME', 'JWT_SECRET', 'MP_ACCESS_TOKEN'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  // No frenamos el proceso en desarrollo, pero avisamos fuerte.
  console.warn(`⚠️  Variables de entorno faltantes: ${missing.join(', ')}. Revisá tu archivo .env`);
}

module.exports = {
  port: process.env.PORT || 4000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  mercadoPago: {
    accessToken: process.env.MP_ACCESS_TOKEN,
    backUrls: {
      success: process.env.MP_BACK_URL_SUCCESS,
      failure: process.env.MP_BACK_URL_FAILURE,
      pending: process.env.MP_BACK_URL_PENDING,
    },
  },
};
