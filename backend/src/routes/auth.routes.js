// src/routes/auth.routes.js
const router = require('express').Router();
const AuthController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/me', authMiddleware, AuthController.me);
router.put('/me', authMiddleware, AuthController.updateProfile);

module.exports = router;
