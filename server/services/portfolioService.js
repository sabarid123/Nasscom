const portfolioRepository = require('../repository/portfolioRepository');
const userRepository = require('../repository/userRepository');

class PortfolioService {
  async getUserPortfolioSummary(userId) {
    const user = await userRepository.findById(userId);
    const portfolio = await portfolioRepository.findEnrichedByUserId(userId);

    let totalInvested = 0;
    let totalCurrentValue = 0;
    let todayChange = 0;
    const enrichedHoldings = [];

    if (portfolio && portfolio.holdings) {
      for (const item of portfolio.holdings) {
        if (!item.stockId) continue;

        const stock = item.stockId;
        const qty = item.quantity;
        const avgPrice = item.averagePrice;
        const currentPrice = stock.currentPrice || avgPrice;
        const openPrice = stock.openPrice || currentPrice;

        const invested = Number((qty * avgPrice).toFixed(2));
        const currentValue = Number((qty * currentPrice).toFixed(2));
        const profitLoss = Number((currentValue - invested).toFixed(2));
        const profitLossPercent = invested > 0 ? Number(((profitLoss / invested) * 100).toFixed(2)) : 0;
        const dayGain = Number((qty * (currentPrice - openPrice)).toFixed(2));

        totalInvested += invested;
        totalCurrentValue += currentValue;
        todayChange += dayGain;

        enrichedHoldings.push({
          stockId: stock._id,
          symbol: stock.symbol,
          companyName: stock.companyName,
          sector: stock.sector,
          quantity: qty,
          averagePrice: avgPrice,
          currentPrice: currentPrice,
          openPrice: openPrice,
          invested: invested,
          currentValue: currentValue,
          profitLoss: profitLoss,
          profitLossPercent: profitLossPercent,
          todayGain: dayGain,
        });
      }
    }

    totalInvested = Number(totalInvested.toFixed(2));
    totalCurrentValue = Number(totalCurrentValue.toFixed(2));
    const totalProfitLoss = Number((totalCurrentValue - totalInvested).toFixed(2));
    const totalProfitLossPercent =
      totalInvested > 0 ? Number(((totalProfitLoss / totalInvested) * 100).toFixed(2)) : 0;
    todayChange = Number(todayChange.toFixed(2));

    return {
      walletBalance: user ? user.walletBalance : 0,
      totalInvested,
      totalCurrentValue,
      totalProfitLoss,
      totalProfitLossPercent,
      todayChange,
      totalNetWorth: Number((user ? user.walletBalance + totalCurrentValue : totalCurrentValue).toFixed(2)),
      holdings: enrichedHoldings,
    };
  }
}

module.exports = new PortfolioService();
