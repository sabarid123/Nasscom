const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/tradeController');
const { protect } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');
const { buyStockValidation, sellStockValidation } = require('../validations');

router.use(protect);

router.post('/buy', buyStockValidation, validate, tradeController.buyStock);
router.post('/sell', sellStockValidation, validate, tradeController.sellStock);
router.get('/transactions', tradeController.getTransactions);
router.delete('/transactions/clear-all', tradeController.clearAllTransactions);
router.delete('/transactions/:id', tradeController.deleteTransaction);

module.exports = router;
