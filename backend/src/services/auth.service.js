// src/services/auth.service.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );
}

const AuthService = {
  async register({ name, email, password }) {
    if (!name || !email || !password) {
      throw new ApiError(400, 'Nombre, email y contraseña son obligatorios');
    }
    if (!EMAIL_REGEX.test(email)) {
      throw new ApiError(400, 'El email no tiene un formato válido');
    }
    if (password.length < 6) {
      throw new ApiError(400, 'La contraseña debe tener al menos 6 caracteres');
    }

    const existing = await UserModel.findByEmail(email);
    if (existing) {
      throw new ApiError(409, 'Ya existe una cuenta registrada con ese email');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ name, email, passwordHash });
    return { user, token: signToken({ ...user, role: 'cliente' }) };
  },

  async login({ email, password }) {
    if (!email || !password) {
      throw new ApiError(400, 'Email y contraseña son obligatorios');
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new ApiError(401, 'Credenciales inválidas');
    }

    const passwordOk = await bcrypt.compare(password, user.password_hash);
    if (!passwordOk) {
      throw new ApiError(401, 'Credenciales inválidas');
    }

    const token = signToken(user);
    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  },

  async getProfile(userId) {
    const user = await UserModel.findById(userId);
    if (!user) throw new ApiError(404, 'Usuario no encontrado');
    return user;
  },

  async updateProfile(userId, { name }) {
    if (!name || name.trim().length < 2) {
      throw new ApiError(400, 'El nombre debe tener al menos 2 caracteres');
    }
    return UserModel.updateProfile(userId, { name: name.trim() });
  },
};

module.exports = AuthService;
