const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/', watchlistController.getWatchlist);
router.post('/add', watchlistController.addStock);
router.delete('/remove/:stockId', watchlistController.removeStock);

module.exports = router;
