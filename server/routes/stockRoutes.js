const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validationMiddleware');
const { createStockValidation } = require('../validations');

router.get('/indices', stockController.getIndices);
router.get('/', stockController.getStocks);
router.get('/:id', stockController.getStockById);

// Admin stock CRUD operations
router.post('/', protect, authorize('ADMIN'), createStockValidation, validate, stockController.createStock);
router.put('/:id', protect, authorize('ADMIN'), stockController.updateStock);
router.delete('/:id', protect, authorize('ADMIN'), stockController.deleteStock);

module.exports = router;
