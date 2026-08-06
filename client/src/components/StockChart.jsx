import React from 'react';
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

const StockChart = ({ historicalData = [], symbol = 'STOCK', color = '#10b981' }) => {
  const labels = historicalData.map((item, idx) => {
    if (!item.timestamp) return `T-${idx}`;
    const date = new Date(item.timestamp);
    return `${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`;
  });

  const prices = historicalData.map((item) => item.price);

  const data = {
    labels: labels.length > 0 ? labels : ['10:00', '11:00', '12:00', '13:00', '14:00'],
    datasets: [
      {
        label: `${symbol} Price ($)`,
        data: prices.length > 0 ? prices : [100, 102, 101, 105, 104],
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, color === '#10b981' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)');
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          return gradient;
        },
        borderColor: color,
        borderWidth: 2,
        tension: 0.3,
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
        bodyColor: '#3b82f6',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
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
          callback: (value) => `$${value}`,
        },
      },
    },
  };

  return (
    <div style={{ height: '320px', width: '100%' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default StockChart;
