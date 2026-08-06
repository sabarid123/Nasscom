const watchlistRepository = require('../repository/watchlistRepository');
const ApiResponse = require('../utils/apiResponse');

class WatchlistController {
  async getWatchlist(req, res, next) {
    try {
      const watchlist = await watchlistRepository.findByUserId(req.user._id);
      res.status(200).json(new ApiResponse(200, watchlist, 'Watchlist retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async addStock(req, res, next) {
    try {
      const { stockId } = req.body;
      const watchlist = await watchlistRepository.addStock(req.user._id, stockId);
      res.status(200).json(new ApiResponse(200, watchlist, 'Stock added to watchlist'));
    } catch (error) {
      next(error);
    }
  }

  async removeStock(req, res, next) {
    try {
      const { stockId } = req.params;
      const watchlist = await watchlistRepository.removeStock(req.user._id, stockId);
      res.status(200).json(new ApiResponse(200, watchlist, 'Stock removed from watchlist'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WatchlistController();
