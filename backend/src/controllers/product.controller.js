// src/controllers/product.controller.js
const ProductService = require('../services/product.service');
const asyncHandler = require('../utils/asyncHandler');

const ProductController = {
  list: asyncHandler(async (req, res) => {
    const { category, search } = req.query;
    const products = await ProductService.list({ category, search });
    res.json(products);
  }),

  listAdmin: asyncHandler(async (req, res) => {
    const products = await ProductService.listAdmin();
    res.json(products);
  }),

  getById: asyncHandler(async (req, res) => {
    const product = await ProductService.getById(req.params.id);
    res.json(product);
  }),

  create: asyncHandler(async (req, res) => {
    const product = await ProductService.create(req.body);
    res.status(201).json(product);
  }),

  update: asyncHandler(async (req, res) => {
    const product = await ProductService.update(req.params.id, req.body);
    res.json(product);
  }),

  remove: asyncHandler(async (req, res) => {
    await ProductService.remove(req.params.id);
    res.status(204).send();
  }),
};

module.exports = ProductController;
