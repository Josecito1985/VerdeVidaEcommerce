// src/models/product.model.js
const pool = require('../config/db');

const ProductModel = {
  // Lista pública: solo productos activos, con nombre de categoría.
  async findAllActive({ categorySlug, search } = {}) {
    let sql = `
      SELECT p.*, c.name AS category_name, c.slug AS category_slug
      FROM products p
      JOIN categories c ON c.id = p.category_id
      WHERE p.active = TRUE
    `;
    const params = [];

    if (categorySlug) {
      sql += ' AND c.slug = ?';
      params.push(categorySlug);
    }
    if (search) {
      sql += ' AND p.name LIKE ?';
      params.push(`%${search}%`);
    }
    sql += ' ORDER BY p.name';

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  // Lista completa para administración (incluye inactivos).
  async findAllAdmin() {
    const [rows] = await pool.query(`
      SELECT p.*, c.name AS category_name
      FROM products p
      JOIN categories c ON c.id = p.category_id
      ORDER BY p.created_at DESC
    `);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create({ categoryId, name, description, price, image, stock }) {
    const [result] = await pool.query(
      `INSERT INTO products (category_id, name, description, price, image, stock)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [categoryId, name, description, price, image, stock]
    );
    return this.findById(result.insertId);
  },

  async update(id, { categoryId, name, description, price, image, stock, active }) {
    await pool.query(
      `UPDATE products
       SET category_id = ?, name = ?, description = ?, price = ?, image = ?, stock = ?, active = ?
       WHERE id = ?`,
      [categoryId, name, description, price, image, stock, active, id]
    );
    return this.findById(id);
  },

  async remove(id) {
    // Baja lógica: preferible a borrar, para no romper pedidos históricos que referencian el producto.
    await pool.query('UPDATE products SET active = FALSE WHERE id = ?', [id]);
  },

  async decrementStock(id, quantity, connection = pool) {
    await connection.query('UPDATE products SET stock = stock - ? WHERE id = ?', [quantity, id]);
  },
};

module.exports = ProductModel;
