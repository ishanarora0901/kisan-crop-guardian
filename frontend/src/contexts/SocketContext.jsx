import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [liveAlerts, setLiveAlerts] = useState([]);

  useEffect(() => {
    // Only connect if running locally on port 3000 or custom host
    let newSocket = null;
    try {
      newSocket = io(window.location.origin, {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 2,
        timeout: 3000,
        autoConnect: true,
      });

      newSocket.on('connect_error', () => {
        // Silently ignore socket connection errors in standalone demo mode
      });

      setSocket(newSocket);

      if (user?._id) {
        newSocket.emit('join_farmer_room', user._id);
      }

      newSocket.on('new_proactive_alert', (alert) => {
        setLiveAlerts((prev) => [alert, ...prev]);
      });
    } catch (e) {
      console.info('Socket init skipped in standalone mode');
    }

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket, liveAlerts, setLiveAlerts }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
