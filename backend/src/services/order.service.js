// src/services/order.service.js
const pool = require('../config/db');
const CartModel = require('../models/cart.model');
const ProductModel = require('../models/product.model');
const OrderModel = require('../models/order.model');
const PaymentService = require('./payment.service');
const ApiError = require('../utils/ApiError');

const OrderService = {
  // Toma el carrito actual del usuario, crea la orden + items en una transacción,
  // descuenta stock, y genera la preferencia de pago de Mercado Pago.
  async checkout(userId) {
    const cart = await CartModel.getOrCreateCart(userId);
    const cartItems = await CartModel.getItems(cart.id);

    if (cartItems.length === 0) {
      throw new ApiError(400, 'El carrito está vacío');
    }

    for (const item of cartItems) {
      if (item.quantity > item.stock) {
        throw new ApiError(400, `No hay stock suficiente de "${item.name}"`);
      }
    }

    const total = cartItems.reduce((s, it) => s + Number(it.price) * it.quantity, 0);

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const orderId = await OrderModel.create(connection, { userId, total, status: 'pending' });

      await OrderModel.addItems(
        connection,
        orderId,
        cartItems.map((it) => ({
          productId: it.product_id,
          name: it.name,
          quantity: it.quantity,
          price: it.price,
        }))
      );

      for (const item of cartItems) {
        await ProductModel.decrementStock(item.product_id, item.quantity, connection);
      }

      await CartModel.clear(cart.id, connection);

      await connection.commit();

      const { preferenceId, initPoint } = await PaymentService.createPreference({
        orderId,
        items: cartItems.map((it) => ({
          productId: it.product_id,
          name: it.name,
          quantity: it.quantity,
          price: it.price,
        })),
      });

      await OrderModel.setMercadoPagoId(orderId, preferenceId);

      return { orderId, total, initPoint };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  async listMine(userId) {
    return OrderModel.findByUser(userId);
  },

  async listAllAdmin() {
    return OrderModel.findAllAdmin();
  },

  async getDetail(orderId, requesterId, requesterRole) {
    const order = await OrderModel.findById(orderId);
    if (!order) throw new ApiError(404, 'Pedido no encontrado');
    if (requesterRole !== 'admin' && order.user_id !== requesterId) {
      throw new ApiError(403, 'No podés ver este pedido');
    }
    const items = await OrderModel.getItems(orderId);
    return { ...order, items };
  },

  async updateStatus(orderId, status) {
    const valid = ['pending', 'approved', 'rejected', 'cancelled'];
    if (!valid.includes(status)) throw new ApiError(400, 'Estado de pedido inválido');
    const order = await OrderModel.findById(orderId);
    if (!order) throw new ApiError(404, 'Pedido no encontrado');
    await OrderModel.updateStatus(orderId, status);
    return OrderModel.findById(orderId);
  },

  // Llamado desde el webhook de Mercado Pago cuando llega la notificación de un pago.
  async handlePaymentNotification(paymentId) {
    const payment = await PaymentService.getPayment(paymentId);
    const orderId = payment.external_reference;
    if (!orderId) return;

    const statusMap = { approved: 'approved', rejected: 'rejected', in_process: 'pending' };
    const newStatus = statusMap[payment.status] || 'pending';

    await OrderModel.updateStatusByExternalReference(orderId, newStatus, String(paymentId));
  },
};

module.exports = OrderService;
