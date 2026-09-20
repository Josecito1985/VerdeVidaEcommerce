// src/controllers/cart.controller.js
const CartService = require('../services/cart.service');
const asyncHandler = require('../utils/asyncHandler');

const CartController = {
  get: asyncHandler(async (req, res) => {
    res.json(await CartService.getCart(req.user.id));
  }),

  addItem: asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    res.json(await CartService.addItem(req.user.id, productId, quantity));
  }),

  updateItem: asyncHandler(async (req, res) => {
    const { quantity } = req.body;
    res.json(await CartService.updateItem(req.user.id, req.params.productId, quantity));
  }),

  removeItem: asyncHandler(async (req, res) => {
    res.json(await CartService.removeItem(req.user.id, req.params.productId));
  }),
};

module.exports = CartController;
