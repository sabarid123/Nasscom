const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/', portfolioController.getPortfolio);

module.exports = router;
