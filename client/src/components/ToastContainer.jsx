import React, { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

const ToastContainer = () => {
  const { toasts, removeToast } = useContext(NotificationContext);

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast show align-items-center text-white border-0 glass-card p-2`}
          style={{
            background:
              toast.type === 'success'
                ? 'rgba(16, 185, 129, 0.9)'
                : toast.type === 'danger'
                ? 'rgba(239, 68, 68, 0.9)'
                : 'rgba(59, 130, 246, 0.9)',
            minWidth: '280px',
          }}
        >
          <div className="d-flex justify-content-between align-items-center w-100 px-2">
            <div>
              <strong className="d-block">{toast.title}</strong>
              <small>{toast.message}</small>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white ms-3"
              onClick={() => removeToast(toast.id)}
            ></button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
