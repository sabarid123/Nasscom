import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import { useNotification } from '../hooks/useNotification';
import Modal from '../components/Modal';

const IpoMutualFunds = () => {
  const { addToast } = useNotification();
  const [activeTab, setActiveTab] = useState('ipo'); // ipo | mf
  const [selectedIpo, setSelectedIpo] = useState(null);
  const [selectedMf, setSelectedMf] = useState(null);
  const [ipoLots, setIpoLots] = useState(1);
  const [mfAmount, setMfAmount] = useState(5000);
  const [modalOpen, setModalOpen] = useState(false);

  const ipos = [
    { id: '1', name: 'Hyundai Motor India Ltd.', symbol: 'HYUNDAI', priceRange: '₹1,860 - ₹1,960', lotSize: 7, minInvestment: 13720, dates: 'Open Now • Closes in 2 Days', status: 'OPEN', gmp: '+₹185 (9.5%)' },
    { id: '2', name: 'Swiggy Limited', symbol: 'SWIGGY', priceRange: '₹371 - ₹390', lotSize: 38, minInvestment: 14820, dates: 'Opens Next Week', status: 'UPCOMING', gmp: '+₹42 (10.7%)' },
    { id: '3', name: 'NTPC Green Energy Ltd.', symbol: 'NTPCGREEN', priceRange: '₹102 - ₹108', lotSize: 138, minInvestment: 14904, dates: 'Opens Soon', status: 'UPCOMING', gmp: '+₹15 (13.8%)' },
  ];

  const mutualFunds = [
    { id: '1', name: 'Parag Parikh Flexi Cap Fund Direct-Growth', category: 'Flexi Cap', return3Y: '24.5%', nav: '₹84.20', risk: 'VERY HIGH', rating: '5 ★' },
    { id: '2', name: 'Nippon India Small Cap Fund Direct-Growth', category: 'Small Cap', return3Y: '32.1%', nav: '₹172.40', risk: 'VERY HIGH', rating: '5 ★' },
    { id: '3', name: 'HDFC Index Fund Nifty 50 Plan Direct-Growth', category: 'Index Fund', return3Y: '18.2%', nav: '₹210.80', risk: 'MODERATE', rating: '4 ★' },
    { id: '4', name: 'SBI Bluechip Fund Direct-Growth', category: 'Large Cap', return3Y: '19.8%', nav: '₹98.50', risk: 'VERY HIGH', rating: '4 ★' },
  ];

  const handleApplyIpo = (e) => {
    e.preventDefault();
    if (!selectedIpo) return;
    const totalAmount = selectedIpo.minInvestment * ipoLots;
    addToast('success', 'IPO Application Submitted', `Applied for ${ipoLots} lot(s) of ${selectedIpo.name} for ${formatCurrency(totalAmount)}`);
    setModalOpen(false);
  };

  const handleInvestMf = (e) => {
    e.preventDefault();
    if (!selectedMf) return;
    addToast('success', 'Mutual Fund Investment Successful', `Invested ${formatCurrency(Number(mfAmount))} in ${selectedMf.name}`);
    setModalOpen(false);
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="glass-card p-4 mb-4 border border-secondary border-opacity-25">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h2 className="fw-bold text-light mb-1">IPOs & Mutual Funds</h2>
            <p className="text-muted mb-0">Apply for primary market IPOs & invest in top rated direct Mutual Funds with 0% commission.</p>
          </div>
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn px-4 fw-bold ${activeTab === 'ipo' ? 'btn-success' : 'btn-outline-secondary'}`}
              onClick={() => setActiveTab('ipo')}
            >
              <i className="bi bi-box-seam me-1"></i> Initial Public Offerings (IPOs)
            </button>
            <button
              type="button"
              className={`btn px-4 fw-bold ${activeTab === 'mf' ? 'btn-success' : 'btn-outline-secondary'}`}
              onClick={() => setActiveTab('mf')}
            >
              <i className="bi bi-pie-chart-fill me-1"></i> Mutual Funds
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: IPOs */}
      {activeTab === 'ipo' && (
        <div className="row g-4">
          {ipos.map((ipo) => (
            <div key={ipo.id} className="col-md-6 col-lg-4">
              <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between border border-secondary border-opacity-25 hover-shadow">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <span className={`badge ${ipo.status === 'OPEN' ? 'bg-success' : 'bg-secondary'} me-2`}>
                        {ipo.status}
                      </span>
                      <span className="badge bg-primary bg-opacity-25 text-primary">GMP {ipo.gmp}</span>
                      <h5 className="fw-bold text-light mt-2 mb-1">{ipo.name}</h5>
                      <small className="text-muted">{ipo.dates}</small>
                    </div>
                  </div>

                  <div className="bg-dark bg-opacity-50 p-3 rounded mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">Price Range</span>
                      <strong className="text-light">{ipo.priceRange}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">Min Investment (1 Lot)</span>
                      <strong className="text-success">{formatCurrency(ipo.minInvestment)}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted small">Lot Quantity</span>
                      <span className="text-light">{ipo.lotSize} Shares</span>
                    </div>
                  </div>
                </div>

                <button
                  className="btn btn-success fw-bold w-100"
                  onClick={() => {
                    setSelectedIpo(ipo);
                    setIpoLots(1);
                    setModalOpen(true);
                  }}
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Mutual Funds */}
      {activeTab === 'mf' && (
        <div className="row g-4">
          {mutualFunds.map((mf) => (
            <div key={mf.id} className="col-md-6">
              <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between border border-secondary border-opacity-25 hover-shadow">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <span className="badge bg-info bg-opacity-25 text-info me-2">{mf.category}</span>
                      <span className="badge bg-warning bg-opacity-25 text-warning">{mf.rating}</span>
                      <h5 className="fw-bold text-light mt-2 mb-1">{mf.name}</h5>
                    </div>
                    <div className="text-end">
                      <span className="text-muted small d-block">3Y Annualised Return</span>
                      <h4 className="fw-bold text-success mb-0">{mf.return3Y}</h4>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between text-muted small my-3 py-2 border-top border-bottom border-secondary border-opacity-25">
                    <span>NAV: <strong className="text-light">{mf.nav}</strong></span>
                    <span>Risk Level: <strong className="text-warning">{mf.risk}</strong></span>
                    <span>Min SIP: <strong className="text-light">₹500</strong></span>
                  </div>
                </div>

                <button
                  className="btn btn-outline-success fw-bold w-100"
                  onClick={() => {
                    setSelectedMf(mf);
                    setMfAmount(5000);
                    setModalOpen(true);
                  }}
                >
                  Invest Lumpsum / SIP
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for IPO / MF */}
      {modalOpen && (selectedIpo || selectedMf) && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selectedIpo ? 'IPO Application' : 'Mutual Fund Investment'}>
          {selectedIpo ? (
            <form onSubmit={handleApplyIpo}>
              <h5 className="fw-bold text-light mb-2">{selectedIpo.name}</h5>
              <p className="text-muted small mb-3">Cut-off Price: {selectedIpo.priceRange.split('-')[1]?.trim() || selectedIpo.priceRange}</p>

              <div className="mb-3">
                <label className="form-label text-muted small">Number of Lots (1 Lot = {selectedIpo.lotSize} Shares)</label>
                <input
                  type="number"
                  min="1"
                  className="form-control glass-input text-light text-center fw-bold"
                  value={ipoLots}
                  onChange={(e) => setIpoLots(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>

              <div className="glass-card p-3 mb-3 border border-secondary border-opacity-25">
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted small">Total Shares</span>
                  <strong className="text-light">{selectedIpo.lotSize * ipoLots}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted small">Total Payable Amount</span>
                  <strong className="text-success fs-5">{formatCurrency(selectedIpo.minInvestment * ipoLots)}</strong>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-success fw-bold">Submit Application</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleInvestMf}>
              <h5 className="fw-bold text-light mb-2">{selectedMf.name}</h5>
              <span className="badge bg-success mb-3">0% Commission Direct Plan</span>

              <div className="mb-3">
                <label className="form-label text-muted small">Investment Amount (₹ INR)</label>
                <input
                  type="number"
                  min="500"
                  step="500"
                  className="form-control glass-input text-light text-center fw-bold"
                  value={mfAmount}
                  onChange={(e) => setMfAmount(e.target.value)}
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-success fw-bold">Confirm Investment</button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};

export default IpoMutualFunds;
