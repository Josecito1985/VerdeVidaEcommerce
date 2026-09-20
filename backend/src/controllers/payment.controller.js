// src/controllers/payment.controller.js
const OrderService = require('../services/order.service');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../utils/logger');

const PaymentController = {
  // Genera la orden a partir del carrito actual y devuelve el link de pago de Mercado Pago.
  createPreference: asyncHandler(async (req, res) => {
    const result = await OrderService.checkout(req.user.id);
    res.json(result);
  }),

  // Webhook público que Mercado Pago llama cuando cambia el estado de un pago.
  webhook: asyncHandler(async (req, res) => {
    const { type, data } = req.body;
    logger.info(`Webhook Mercado Pago recibido: type=${type} id=${data?.id}`);

    if (type === 'payment' && data?.id) {
      await OrderService.handlePaymentNotification(data.id);
    }
    res.sendStatus(200);
  }),
};

module.exports = PaymentController;
