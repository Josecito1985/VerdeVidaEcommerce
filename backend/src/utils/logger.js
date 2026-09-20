// src/utils/logger.js
// Logger simple con timestamp y niveles. Reemplazable por winston/pino sin tocar el resto del código.
function timestamp() {
  return new Date().toISOString();
}

module.exports = {
  info: (msg) => console.log(`[INFO]  ${timestamp()} - ${msg}`),
  warn: (msg) => console.warn(`[WARN]  ${timestamp()} - ${msg}`),
  error: (msg) => console.error(`[ERROR] ${timestamp()} - ${msg}`),
};
