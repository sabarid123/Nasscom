import React, { createContext, useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [liveStockUpdates, setLiveStockUpdates] = useState({});
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || (window.location.port === '5173' ? 'http://localhost:5000' : window.location.origin);
    const newSocket = io(socketUrl, {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on('stock_price_update', (stockData) => {
      setLiveStockUpdates((prev) => ({
        ...prev,
        [stockData.symbol]: stockData,
      }));
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && user) {
      socket.emit('join_user', user._id);
    }
  }, [socket, user]);

  return (
    <SocketContext.Provider value={{ socket, liveStockUpdates }}>
      {children}
    </SocketContext.Provider>
  );
};
