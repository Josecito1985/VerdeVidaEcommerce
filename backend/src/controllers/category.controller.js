// src/controllers/category.controller.js
const CategoryService = require('../services/category.service');
const asyncHandler = require('../utils/asyncHandler');

const CategoryController = {
  list: asyncHandler(async (req, res) => {
    res.json(await CategoryService.list());
  }),
};

module.exports = CategoryController;
