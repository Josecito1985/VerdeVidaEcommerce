// src/services/cart.service.js
const CartModel = require('../models/cart.model');
const ProductModel = require('../models/product.model');
const ApiError = require('../utils/ApiError');

function serialize(items) {
  const total = items.reduce((sum, it) => sum + Number(it.price) * it.quantity, 0);
  return { items, total: Number(total.toFixed(2)) };
}

const CartService = {
  async getCart(userId) {
    const cart = await CartModel.getOrCreateCart(userId);
    const items = await CartModel.getItems(cart.id);
    return serialize(items);
  },

  async addItem(userId, productId, quantity = 1) {
    if (!productId || quantity < 1) {
      throw new ApiError(400, 'Producto y cantidad válidos son obligatorios');
    }
    const product = await ProductModel.findById(productId);
    if (!product || !product.active) throw new ApiError(404, 'Producto no disponible');
    if (product.stock < quantity) throw new ApiError(400, 'No hay stock suficiente');

    const cart = await CartModel.getOrCreateCart(userId);
    await CartModel.upsertItem(cart.id, productId, quantity);
    return this.getCart(userId);
  },

  async updateItem(userId, productId, quantity) {
    if (quantity < 0) throw new ApiError(400, 'La cantidad no puede ser negativa');
    const cart = await CartModel.getOrCreateCart(userId);
    await CartModel.setItemQuantity(cart.id, productId, quantity);
    return this.getCart(userId);
  },

  async removeItem(userId, productId) {
    const cart = await CartModel.getOrCreateCart(userId);
    await CartModel.removeItem(cart.id, productId);
    return this.getCart(userId);
  },
};

module.exports = CartService;
