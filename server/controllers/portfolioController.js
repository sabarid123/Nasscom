const portfolioService = require('../services/portfolioService');
const ApiResponse = require('../utils/apiResponse');

class PortfolioController {
  async getPortfolio(req, res, next) {
    try {
      const summary = await portfolioService.getUserPortfolioSummary(req.user._id);
      res.status(200).json(new ApiResponse(200, summary, 'Portfolio summary retrieved'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PortfolioController();
