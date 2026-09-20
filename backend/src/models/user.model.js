// src/models/user.model.js
const pool = require('../config/db');

const UserModel = {
  async create({ name, email, passwordHash }) {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, passwordHash]
    );
    return { id: result.insertId, name, email, role: 'cliente' };
  },

  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async updateProfile(id, { name }) {
    await pool.query('UPDATE users SET name = ? WHERE id = ?', [name, id]);
    return this.findById(id);
  },
};

module.exports = UserModel;
