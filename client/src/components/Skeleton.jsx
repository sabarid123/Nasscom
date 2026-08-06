import React from 'react';

const Skeleton = ({ height = '20px', width = '100%', borderRadius = '8px', className = '' }) => {
  return (
    <div
      className={`skeleton-pulse ${className}`}
      style={{
        height,
        width,
        borderRadius,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeletonPulse 1.5s infinite ease-in-out',
      }}
    >
      <style>{`
        @keyframes skeletonPulse {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export default Skeleton;
