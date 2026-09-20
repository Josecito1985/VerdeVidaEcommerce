// src/utils/asyncHandler.js
// Envuelve controladores async para no repetir try/catch en cada uno:
// cualquier error cae directo en el middleware de errores central.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
