import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL, SOCKET_EVENTS } from '../utils/constants.js';
import { useAuth } from './AuthContext.jsx';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const socketRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && user && !socketRef.current) {
      // Initialize socket connection
      const newSocket = io(SOCKET_URL, {
        auth: {
          token: localStorage.getItem('token'),
        },
        transports: ['websocket'],
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      // Connection events
      newSocket.on('connect', () => {
        console.log('✅ Socket connected');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });

      // User status events
      newSocket.on(SOCKET_EVENTS.USER_ONLINE, (data) => {
        setOnlineUsers((prev) => new Set([...prev, data.userId]));
      });

      newSocket.on(SOCKET_EVENTS.USER_OFFLINE, (data) => {
        setOnlineUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(data.userId);
          return newSet;
        });
      });

      return () => {
        newSocket.close();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      };
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, user]);

  const joinRoom = (chatId) => {
    if (socket && isConnected) {
      socket.emit(SOCKET_EVENTS.JOIN_ROOM, chatId);
    }
  };

  const sendMessage = (chatId, content) => {
    if (socket && isConnected) {
      socket.emit(SOCKET_EVENTS.SEND_MESSAGE, { chatId, content });
    }
  };

  const typing = (chatId) => {
    if (socket && isConnected) {
      socket.emit(SOCKET_EVENTS.TYPING, { chatId });
    }
  };

  const stopTyping = (chatId) => {
    if (socket && isConnected) {
      socket.emit(SOCKET_EVENTS.STOP_TYPING, { chatId });
    }
  };

  const markMessageSeen = (chatId, messageId) => {
    if (socket && isConnected) {
      socket.emit(SOCKET_EVENTS.MESSAGE_SEEN, { chatId, messageId });
    }
  };

  const value = {
    socket,
    isConnected,
    onlineUsers,
    joinRoom,
    sendMessage,
    typing,
    stopTyping,
    markMessageSeen,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};




