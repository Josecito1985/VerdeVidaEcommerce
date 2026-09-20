// src/controllers/order.controller.js
const OrderService = require('../services/order.service');
const asyncHandler = require('../utils/asyncHandler');

const OrderController = {
  mine: asyncHandler(async (req, res) => {
    res.json(await OrderService.listMine(req.user.id));
  }),

  listAdmin: asyncHandler(async (req, res) => {
    res.json(await OrderService.listAllAdmin());
  }),

  detail: asyncHandler(async (req, res) => {
    const order = await OrderService.getDetail(req.params.id, req.user.id, req.user.role);
    res.json(order);
  }),

  updateStatus: asyncHandler(async (req, res) => {
    const order = await OrderService.updateStatus(req.params.id, req.body.status);
    res.json(order);
  }),
};

module.exports = OrderController;
