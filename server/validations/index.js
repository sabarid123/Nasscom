const { body } = require('express-validator');

const registerValidation = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone').optional().trim(),
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const buyStockValidation = [
  body('stockId').isMongoId().withMessage('Valid stockId is required'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be an integer of at least 1'),
];

const sellStockValidation = [
  body('stockId').isMongoId().withMessage('Valid stockId is required'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be an integer of at least 1'),
];

const createStockValidation = [
  body('symbol').notEmpty().withMessage('Stock symbol is required').toUpperCase().trim(),
  body('companyName').notEmpty().withMessage('Company name is required').trim(),
  body('sector').notEmpty().withMessage('Sector is required').trim(),
  body('currentPrice').isFloat({ min: 0.01 }).withMessage('Current price must be greater than 0'),
];

module.exports = {
  registerValidation,
  loginValidation,
  buyStockValidation,
  sellStockValidation,
  createStockValidation,
};
