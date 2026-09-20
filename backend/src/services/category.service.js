// src/services/category.service.js
const CategoryModel = require('../models/category.model');

const CategoryService = {
  async list() {
    return CategoryModel.findAll();
  },
};

module.exports = CategoryService;
