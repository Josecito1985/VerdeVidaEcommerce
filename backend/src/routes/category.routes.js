// src/routes/category.routes.js
const router = require('express').Router();
const CategoryController = require('../controllers/category.controller');

router.get('/', CategoryController.list);

module.exports = router;
