import React, { createContext, useState, useContext, useEffect } from 'react';
import { SocketContext } from './SocketContext';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const { socket } = useContext(SocketContext);

  const addToast = (type, title, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, title, message }]);

    // Auto remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('notification', (data) => {
      addToast('info', data.title, data.message);
    });

    socket.on('trade_status', (data) => {
      const type = data.status === 'COMPLETED' ? 'success' : 'danger';
      addToast(type, `Trade ${data.type} Executed`, `Order for ${data.stockSymbol} was ${data.status.toLowerCase()}.`);
    });

    return () => {
      socket.off('notification');
      socket.off('trade_status');
    };
  }, [socket]);

  return (
    <NotificationContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </NotificationContext.Provider>
  );
};
