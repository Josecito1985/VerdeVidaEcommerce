// src/controllers/auth.controller.js
const AuthService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');

const AuthController = {
  register: asyncHandler(async (req, res) => {
    const { user, token } = await AuthService.register(req.body);
    res.status(201).json({ user, token });
  }),

  login: asyncHandler(async (req, res) => {
    const result = await AuthService.login(req.body);
    res.json(result);
  }),

  me: asyncHandler(async (req, res) => {
    const user = await AuthService.getProfile(req.user.id);
    res.json(user);
  }),

  updateProfile: asyncHandler(async (req, res) => {
    const user = await AuthService.updateProfile(req.user.id, req.body);
    res.json(user);
  }),
};

module.exports = AuthController;
