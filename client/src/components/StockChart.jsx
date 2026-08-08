import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StockChart = ({ historicalData = [], symbol = 'STOCK', color = '#00d09c' }) => {
  const [timeframe, setTimeframe] = useState('1D');

  // Filter historical data based on timeframe selector
  let displayData = historicalData;
  if (timeframe === '1D' && historicalData.length > 5) {
    displayData = historicalData.slice(-5);
  } else if (timeframe === '1W' && historicalData.length > 10) {
    displayData = historicalData.slice(-10);
  }

  const labels = displayData.map((item, idx) => {
    if (!item.timestamp) return `T-${idx}`;
    const date = new Date(item.timestamp);
    return `${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`;
  });

  const prices = displayData.map((item) => item.price);

  const data = {
    labels: labels.length > 0 ? labels : ['09:15', '10:30', '11:45', '13:00', '14:15', '15:30'],
    datasets: [
      {
        label: `${symbol} Price (₹)`,
        data: prices.length > 0 ? prices : [2900, 2920, 2915, 2940, 2935, 2950],
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, color === '#ef4444' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(0, 208, 156, 0.3)');
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          return gradient;
        },
        borderColor: color,
        borderWidth: 2,
        tension: 0.2,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#1e293b',
        titleColor: '#f8fafc',
        bodyColor: '#00d09c',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: (context) => `Price: ₹${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#94a3b8',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#94a3b8',
          callback: (value) => `₹${value}`,
        },
      },
    },
  };

  return (
    <div>
      {/* Timeframe Selector */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="btn-group btn-group-sm" role="group">
          {['1D', '1W', '1M', '1Y', 'ALL'].map((tf) => (
            <button
              key={tf}
              type="button"
              className={`btn ${timeframe === tf ? 'btn-success fw-bold' : 'btn-outline-secondary text-muted'}`}
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
        <small className="text-muted">Interactive Chart</small>
      </div>

      <div style={{ height: '320px', width: '100%' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default StockChart;

