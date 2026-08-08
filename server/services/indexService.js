class IndexService {
  constructor() {
    this.indices = [
      { symbol: 'NIFTY 50', name: 'NIFTY 50', value: 24350.40, change: 112.30, changePercent: 0.46 },
      { symbol: 'BANKNIFTY', name: 'BANK NIFTY', value: 51820.15, change: -145.20, changePercent: -0.28 },
      { symbol: 'SENSEX', name: 'BSE SENSEX', value: 79910.80, change: 320.50, changePercent: 0.40 },
      { symbol: 'FINNIFTY', name: 'NIFTY FIN SERVICE', value: 23410.60, change: 45.10, changePercent: 0.19 },
    ];
  }

  getIndices() {
    // Add realistic tiny fluctuations
    return this.indices.map((idx) => {
      const delta = (Math.random() * 2 - 1) * 2.5;
      const newValue = Number((idx.value + delta).toFixed(2));
      const newChange = Number((idx.change + delta).toFixed(2));
      const newPercent = Number(((newChange / (newValue - newChange)) * 100).toFixed(2));
      idx.value = newValue;
      idx.change = newChange;
      idx.changePercent = newPercent;
      return { ...idx };
    });
  }
}

module.exports = new IndexService();
