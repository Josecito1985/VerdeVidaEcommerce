// src/routes/order.routes.js
const router = require('express').Router();
const OrderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

router.use(authMiddleware);

router.get('/mine', OrderController.mine);
router.get('/admin', adminMiddleware, OrderController.listAdmin);
router.get('/:id', OrderController.detail);
router.patch('/:id/status', adminMiddleware, OrderController.updateStatus);

module.exports = router;
