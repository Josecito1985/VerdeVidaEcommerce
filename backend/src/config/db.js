// src/config/db.js
const mysql = require('mysql2/promise');
const env = require('./env');
const logger = require('../utils/logger');

const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Verificación de conexión al arrancar (no bloqueante)
pool.getConnection()
  .then((conn) => {
    logger.info(`Conectado a MySQL (${env.db.database}) en ${env.db.host}:${env.db.port}`);
    conn.release();
  })
  .catch((err) => {
    logger.error(`No se pudo conectar a la base de datos: ${err.message}`);
  });

module.exports = pool;
