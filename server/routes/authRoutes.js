const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');
const { registerValidation, loginValidation } = require('../validations');
const { authLimiter } = require('../middlewares/rateLimiter');

router.post('/register', authLimiter, registerValidation, validate, authController.register);
router.post('/login', authLimiter, loginValidation, validate, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.put('/change-password', protect, authController.changePassword);
router.get('/me', protect, authController.getMe);

module.exports = router;
