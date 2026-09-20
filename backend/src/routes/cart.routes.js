// src/routes/cart.routes.js
const router = require('express').Router();
const CartController = require('../controllers/cart.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware); // todo el carrito requiere sesión iniciada

router.get('/', CartController.get);
router.post('/items', CartController.addItem);
router.put('/items/:productId', CartController.updateItem);
router.delete('/items/:productId', CartController.removeItem);

module.exports = router;
