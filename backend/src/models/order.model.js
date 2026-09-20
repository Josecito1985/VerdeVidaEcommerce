// src/models/order.model.js
const pool = require('../config/db');

const OrderModel = {
  async create(connection, { userId, total, status = 'pending' }) {
    const [result] = await connection.query(
      'INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)',
      [userId, total, status]
    );
    return result.insertId;
  },

  async addItems(connection, orderId, items) {
    const values = items.map((it) => [orderId, it.productId, it.name, it.quantity, it.price]);
    await connection.query(
      'INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES ?',
      [values]
    );
  },

  async setMercadoPagoId(orderId, preferenceId) {
    await pool.query('UPDATE orders SET mercado_pago_id = ? WHERE id = ?', [preferenceId, orderId]);
  },

  async updateStatusByExternalReference(orderId, status, paymentId) {
    await pool.query(
      'UPDATE orders SET status = ?, payment_id = ? WHERE id = ?',
      [status, paymentId, orderId]
    );
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async findByUser(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  },

  async findAllAdmin() {
    const [rows] = await pool.query(`
      SELECT o.*, u.name AS customer_name, u.email AS customer_email
      FROM orders o
      JOIN users u ON u.id = o.user_id
      ORDER BY o.created_at DESC
    `);
    return rows;
  },

  async getItems(orderId) {
    const [rows] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
    return rows;
  },

  async updateStatus(orderId, status) {
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
  },
};

module.exports = OrderModel;
