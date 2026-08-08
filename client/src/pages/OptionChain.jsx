import React, { useState } from 'react';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { useNotification } from '../hooks/useNotification';
import Modal from '../components/Modal';

const OptionChain = () => {
  const { addToast } = useNotification();
  const [selectedAsset, setSelectedAsset] = useState('NIFTY 50');
  const [expiry, setExpiry] = useState('28-AUG-2026');
  const [selectedOption, setSelectedOption] = useState(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderLots, setOrderLots] = useState(1);
  const [tradeType, setTradeType] = useState('BUY');

  const spotPrices = {
    'NIFTY 50': 24350.40,
    'BANKNIFTY': 51820.15,
    'RELIANCE': 2950.50,
    'TCS': 4180.25,
  };

  const lotSizes = {
    'NIFTY 50': 25,
    'BANKNIFTY': 15,
    'RELIANCE': 250,
    'TCS': 175,
  };

  const spot = spotPrices[selectedAsset] || 24350.40;
  const lotSize = lotSizes[selectedAsset] || 25;

  // Generate 7 strike prices around spot
  const strikes = [];
  const step = selectedAsset === 'BANKNIFTY' ? 100 : selectedAsset === 'NIFTY 50' ? 50 : 20;
  const baseStrike = Math.round(spot / step) * step;

  for (let i = -3; i <= 3; i++) {
    const strike = baseStrike + i * step;
    const isITMCall = strike < spot;
    const isITMPut = strike > spot;

    const callPrice = Number((Math.max(15, (spot - strike) + 120 + i * -15)).toFixed(2));
    const callChange = Number(((Math.random() * 8 - 3)).toFixed(2));
    const putPrice = Number((Math.max(15, (strike - spot) + 120 + i * 15)).toFixed(2));
    const putChange = Number(((Math.random() * 8 - 3)).toFixed(2));

    strikes.push({
      strike,
      call: { price: callPrice, change: callChange, oi: (15.4 + Math.abs(i) * 2.1).toFixed(1) + 'L', iv: (14.2 + i * 0.5).toFixed(1), isITM: isITMCall },
      put: { price: putPrice, change: putChange, oi: (18.1 + Math.abs(i) * 1.8).toFixed(1) + 'L', iv: (13.8 - i * 0.4).toFixed(1), isITM: isITMPut },
    });
  }

  const handleOpenTrade = (optionData, type) => {
    setSelectedOption(optionData);
    setTradeType(type);
    setOrderLots(1);
    setOrderModalOpen(true);
  };

  const handleExecuteOptionTrade = (e) => {
    e.preventDefault();
    if (!selectedOption) return;
    const totalCost = Number((selectedOption.price * lotSize * orderLots).toFixed(2));
    addToast(
      'success',
      `F&O ${tradeType} Order Placed`,
      `Successfully ${tradeType === 'BUY' ? 'bought' : 'sold'} ${orderLots} lot(s) of ${selectedAsset} ${selectedOption.strike} ${selectedOption.optionType} for ${formatCurrency(totalCost)}`
    );
    setOrderModalOpen(false);
  };

  return (
    <div className="container py-4">
      {/* Header Banner */}
      <div className="glass-card p-4 mb-4 border border-secondary border-opacity-25">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-info text-dark fw-bold">F&O OPTIONS</span>
              <h2 className="fw-bold text-light mb-0">Futures & Options Option Chain</h2>
            </div>
            <p className="text-muted mb-0">Live Derivatives, Implied Volatility (IV), Open Interest (OI) & Options Trading.</p>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="glass-card px-3 py-2 border border-secondary border-opacity-25 text-end">
              <span className="text-muted small d-block">Spot Price</span>
              <strong className="text-success fs-5">{formatCurrency(spot)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Asset & Expiry Filters */}
      <div className="glass-card p-3 mb-4 border border-secondary border-opacity-25">
        <div className="row g-3 align-items-center">
          <div className="col-md-4">
            <label className="form-label text-muted small mb-1">Underlying Asset</label>
            <select
              className="form-select glass-input text-light"
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
            >
              <option value="NIFTY 50" className="bg-dark">NIFTY 50 (Lot Size: 25)</option>
              <option value="BANKNIFTY" className="bg-dark">BANK NIFTY (Lot Size: 15)</option>
              <option value="RELIANCE" className="bg-dark">RELIANCE (Lot Size: 250)</option>
              <option value="TCS" className="bg-dark">TCS (Lot Size: 175)</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label text-muted small mb-1">Expiry Date</label>
            <select
              className="form-select glass-input text-light"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
            >
              <option value="28-AUG-2026" className="bg-dark">28-AUG-2026 (Weekly Expiry)</option>
              <option value="25-SEP-2026" className="bg-dark">25-SEP-2026 (Monthly Expiry)</option>
            </select>
          </div>

          <div className="col-md-4 text-md-end">
            <span className="badge bg-secondary p-2 me-2">Lot Size: {lotSize}</span>
            <span className="badge bg-success p-2">NSE LIVE TICK</span>
          </div>
        </div>
      </div>

      {/* Option Chain Table */}
      <div className="glass-card p-3 border border-secondary border-opacity-25 overflow-x-auto">
        <table className="table table-dark table-hover align-middle text-center mb-0" style={{ fontSize: '0.88rem' }}>
          <thead>
            <tr className="border-bottom border-secondary">
              <th colSpan="4" className="bg-success bg-opacity-25 text-success py-2">CALL OPTIONS (CE)</th>
              <th className="bg-dark py-2 text-warning">STRIKE</th>
              <th colSpan="4" className="bg-danger bg-opacity-25 text-danger py-2">PUT OPTIONS (PE)</th>
            </tr>
            <tr className="text-muted small border-bottom border-secondary border-opacity-50">
              <th>OI (Lakhs)</th>
              <th>IV (%)</th>
              <th>LTP (₹)</th>
              <th>Action</th>
              <th className="text-warning">STRIKE PRICE</th>
              <th>Action</th>
              <th>LTP (₹)</th>
              <th>IV (%)</th>
              <th>OI (Lakhs)</th>
            </tr>
          </thead>
          <tbody>
            {strikes.map((row) => (
              <tr key={row.strike} className={row.strike === baseStrike ? 'border border-warning border-2' : ''}>
                {/* CE Data */}
                <td className={row.call.isITM ? 'bg-success bg-opacity-10 text-light' : 'text-muted'}>{row.call.oi}</td>
                <td className={row.call.isITM ? 'bg-success bg-opacity-10 text-light' : 'text-muted'}>{row.call.iv}%</td>
                <td className={`fw-bold ${row.call.isITM ? 'bg-success bg-opacity-10 text-success' : 'text-light'}`}>
                  ₹{row.call.price}
                  <small className={row.call.change >= 0 ? 'text-success d-block' : 'text-danger d-block'} style={{ fontSize: '0.72rem' }}>
                    {formatPercent(row.call.change)}
                  </small>
                </td>
                <td className={row.call.isITM ? 'bg-success bg-opacity-10' : ''}>
                  <div className="btn-group btn-group-sm">
                    <button
                      className="btn btn-sm btn-success px-2 py-0"
                      onClick={() => handleOpenTrade({ ...row.call, strike: row.strike, optionType: 'CALL (CE)' }, 'BUY')}
                    >
                      B
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger px-2 py-0"
                      onClick={() => handleOpenTrade({ ...row.call, strike: row.strike, optionType: 'CALL (CE)' }, 'SELL')}
                    >
                      S
                    </button>
                  </div>
                </td>

                {/* Strike Price */}
                <td className="fw-bold bg-dark text-warning fs-6">
                  {row.strike}
                  {row.strike === baseStrike && <span className="badge bg-warning text-dark ms-1 small" style={{ fontSize: '0.65rem' }}>ATM</span>}
                </td>

                {/* PE Data */}
                <td className={row.put.isITM ? 'bg-danger bg-opacity-10' : ''}>
                  <div className="btn-group btn-group-sm">
                    <button
                      className="btn btn-sm btn-success px-2 py-0"
                      onClick={() => handleOpenTrade({ ...row.put, strike: row.strike, optionType: 'PUT (PE)' }, 'BUY')}
                    >
                      B
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger px-2 py-0"
                      onClick={() => handleOpenTrade({ ...row.put, strike: row.strike, optionType: 'PUT (PE)' }, 'SELL')}
                    >
                      S
                    </button>
                  </div>
                </td>
                <td className={`fw-bold ${row.put.isITM ? 'bg-danger bg-opacity-10 text-danger' : 'text-light'}`}>
                  ₹{row.put.price}
                  <small className={row.put.change >= 0 ? 'text-success d-block' : 'text-danger d-block'} style={{ fontSize: '0.72rem' }}>
                    {formatPercent(row.put.change)}
                  </small>
                </td>
                <td className={row.put.isITM ? 'bg-danger bg-opacity-10 text-light' : 'text-muted'}>{row.put.iv}%</td>
                <td className={row.put.isITM ? 'bg-danger bg-opacity-10 text-light' : 'text-muted'}>{row.put.oi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* F&O Order Modal */}
      {selectedOption && (
        <Modal isOpen={orderModalOpen} onClose={() => setOrderModalOpen(false)} title="F&O Option Order">
          <form onSubmit={handleExecuteOptionTrade}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <span className={`badge ${tradeType === 'BUY' ? 'bg-success' : 'bg-danger'} text-uppercase me-2`}>
                  {tradeType}
                </span>
                <span className="fw-bold text-light fs-5">
                  {selectedAsset} {selectedOption.strike} {selectedOption.optionType}
                </span>
              </div>
              <div className="text-end">
                <span className="fw-bold text-light fs-5">₹{selectedOption.price}</span>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-muted small">Number of Lots (Lot Size: {lotSize})</label>
              <input
                type="number"
                min="1"
                className="form-control glass-input text-light text-center fw-bold"
                value={orderLots}
                onChange={(e) => setOrderLots(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>

            <div className="glass-card p-3 mb-3 border border-secondary border-opacity-25">
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted small">Total Quantity</span>
                <strong className="text-light">{orderLots * lotSize} Shares</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted small">Total Premium Payable</span>
                <strong className="text-success fs-5">{formatCurrency(selectedOption.price * lotSize * orderLots)}</strong>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-secondary" onClick={() => setOrderModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className={`btn fw-bold ${tradeType === 'BUY' ? 'btn-success' : 'btn-danger'}`}>
                Place {tradeType} Order
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default OptionChain;
