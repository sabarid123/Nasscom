import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
);

export const PortfolioChart = ({ holdings = [] }) => {
  if (!holdings || holdings.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <i className="bi bi-pie-chart fs-1 d-block mb-2"></i>
        No holdings to display asset allocation.
      </div>
    );
  }

  const labels = holdings.map((h) => h.symbol);
  const dataValues = holdings.map((h) => h.currentValue);

  const colors = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ec4899',
    '#8b5cf6',
    '#06b6d4',
    '#f97316',
    '#64748b',
    '#84cc16',
    '#a855f7',
  ];

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: colors.slice(0, holdings.length),
        borderColor: 'rgba(30, 41, 59, 0.8)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          font: { family: 'Outfit', size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: $${context.parsed.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div style={{ height: '260px', width: '100%' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export const PortfolioLineChart = ({ totalCurrentValue = 0, totalInvested = 0 }) => {
  const baseValue = totalInvested > 0 ? totalInvested : 50000;
  const currValue = totalCurrentValue > 0 ? totalCurrentValue : baseValue;

  // Build a 7-day trend curve
  const labels = ['Day -6', 'Day -5', 'Day -4', 'Day -3', 'Day -2', 'Yesterday', 'Today'];
  const step = (currValue - baseValue) / 6;
  const dataPoints = labels.map((_, i) =>
    Number((baseValue + step * i + (Math.random() * 200 - 100)).toFixed(2))
  );
  dataPoints[6] = currValue; // Ensure current total value is exact on latest point

  const isProfit = currValue >= baseValue;
  const strokeColor = isProfit ? '#10b981' : '#ef4444';

  const data = {
    labels,
    datasets: [
      {
        label: 'Portfolio Valuation ($)',
        data: dataPoints,
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 260);
          gradient.addColorStop(
            0,
            isProfit ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)'
          );
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          return gradient;
        },
        borderColor: strokeColor,
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#1e293b',
        titleColor: '#f8fafc',
        bodyColor: '#10b981',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: (context) => `Valuation: $${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: {
          color: '#94a3b8',
          callback: (value) => `$${value.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div style={{ height: '260px', width: '100%' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default PortfolioChart;
