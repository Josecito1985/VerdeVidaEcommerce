// src/services/payment.service.js
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const env = require('../config/env');

const client = new MercadoPagoConfig({ accessToken: env.mercadoPago.accessToken });

const PaymentService = {
  // Crea una preferencia de pago en Mercado Pago para los items de una orden ya creada.
  async createPreference({ orderId, items }) {
    const mpItems = items.map((it) => ({
      id: String(it.productId),
      title: it.name,
      quantity: Number(it.quantity),
      unit_price: Number(it.price),
      currency_id: 'ARS',
    }));

    const preference = await new Preference(client).create({
      body: {
        items: mpItems,
        back_urls: env.mercadoPago.backUrls,
        auto_return: 'approved',
        external_reference: String(orderId),
        notification_url: undefined, // se configura en el panel de MP o vía ngrok en desarrollo
      },
    });

    return {
      preferenceId: preference.id,
      initPoint: preference.init_point || preference.sandbox_init_point,
    };
  },

  async getPayment(paymentId) {
    return new Payment(client).get({ id: paymentId });
  },
};

module.exports = PaymentService;
