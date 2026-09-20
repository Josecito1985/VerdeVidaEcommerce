// server.js — punto de entrada del servidor
const app = require('./src/app');
const env = require('./src/config/env');
const logger = require('./src/utils/logger');

app.listen(env.port, () => {
  logger.info(`Verde Vida backend escuchando en el puerto ${env.port}`);
});
