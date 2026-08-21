import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [liveAlerts, setLiveAlerts] = useState([]);

  useEffect(() => {
    const newSocket = io(window.location.origin, {
      transports: ['websocket', 'polling'],
    });

    setSocket(newSocket);

    if (user?._id) {
      newSocket.emit('join_farmer_room', user._id);
    }

    newSocket.on('new_proactive_alert', (alert) => {
      setLiveAlerts((prev) => [alert, ...prev]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket, liveAlerts, setLiveAlerts }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
