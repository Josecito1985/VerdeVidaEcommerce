// src/routes/product.routes.js
const router = require('express').Router();
const ProductController = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

router.get('/', ProductController.list);
router.get('/admin', authMiddleware, adminMiddleware, ProductController.listAdmin);
router.get('/:id', ProductController.getById);
router.post('/', authMiddleware, adminMiddleware, ProductController.create);
router.put('/:id', authMiddleware, adminMiddleware, ProductController.update);
router.delete('/:id', authMiddleware, adminMiddleware, ProductController.remove);

module.exports = router;
