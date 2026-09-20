// src/models/cart.model.js
const pool = require('../config/db');

const CartModel = {
  // Devuelve el carrito del usuario, creándolo si todavía no existe.
  async getOrCreateCart(userId) {
    const [rows] = await pool.query('SELECT * FROM carts WHERE user_id = ?', [userId]);
    if (rows[0]) return rows[0];

    const [result] = await pool.query('INSERT INTO carts (user_id) VALUES (?)', [userId]);
    return { id: result.insertId, user_id: userId };
  },

  async getItems(cartId) {
    const [rows] = await pool.query(
      `SELECT ci.id, ci.quantity, p.id AS product_id, p.name, p.price, p.image, p.stock
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.cart_id = ?
       ORDER BY ci.id`,
      [cartId]
    );
    return rows;
  },

  async upsertItem(cartId, productId, quantity) {
    await pool.query(
      `INSERT INTO cart_items (cart_id, product_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [cartId, productId, quantity]
    );
  },

  async setItemQuantity(cartId, productId, quantity) {
    if (quantity <= 0) {
      return this.removeItem(cartId, productId);
    }
    await pool.query(
      'UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?',
      [quantity, cartId, productId]
    );
  },

  async removeItem(cartId, productId) {
    await pool.query('DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, productId]);
  },

  async clear(cartId, connection = pool) {
    await connection.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
  },
};

module.exports = CartModel;
