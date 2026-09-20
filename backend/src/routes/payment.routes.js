// src/routes/payment.routes.js
const router = require('express').Router();
const PaymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/create-preference', authMiddleware, PaymentController.createPreference);
router.post('/webhook', PaymentController.webhook); // público: lo llama Mercado Pago

module.exports = router;
