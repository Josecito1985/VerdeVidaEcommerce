// src/services/product.service.js
const ProductModel = require('../models/product.model');
const CategoryModel = require('../models/category.model');
const ApiError = require('../utils/ApiError');

const ProductService = {
  async list({ category, search }) {
    return ProductModel.findAllActive({ categorySlug: category, search });
  },

  async listAdmin() {
    return ProductModel.findAllAdmin();
  },

  async getById(id) {
    const product = await ProductModel.findById(id);
    if (!product) throw new ApiError(404, 'Producto no encontrado');
    return product;
  },

  async create(data) {
    this._validate(data);
    const category = await CategoryModel.findById(data.categoryId);
    if (!category) throw new ApiError(400, 'La categoría indicada no existe');

    return ProductModel.create(data);
  },

  async update(id, data) {
    await this.getById(id); // 404 si no existe
    this._validate(data);
    const category = await CategoryModel.findById(data.categoryId);
    if (!category) throw new ApiError(400, 'La categoría indicada no existe');

    return ProductModel.update(id, data);
  },

  async remove(id) {
    await this.getById(id);
    return ProductModel.remove(id);
  },

  _validate({ name, price, stock }) {
    if (!name || name.trim().length < 2) {
      throw new ApiError(400, 'El nombre del producto es obligatorio');
    }
    if (price === undefined || Number(price) <= 0) {
      throw new ApiError(400, 'El precio debe ser un número mayor a 0');
    }
    if (stock === undefined || Number(stock) < 0) {
      throw new ApiError(400, 'El stock no puede ser negativo');
    }
  },
};

module.exports = ProductService;
