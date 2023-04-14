// WebSocketContext.jsx

import { createContext, useEffect, useState, useCallback } from 'react';

const WebSocketContext = createContext();

const WebSocketProvider = ({ children, handleMessage }) => {
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState('not_connected');
  const [lastMessageTime, setLastMessageTime] = useState(null);

  const sendMessage = useCallback((message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  }, [socket]);

  const onMessage = useCallback((callback) => {
    if (socket) {
      socket.onmessage = (event) => {
        callback(event.data);
      };
    }
  }, [socket]);

  const connectWebSocket = useCallback(() => {
    const newSocket = new WebSocket('ws://192.168.0.183:81');
    newSocket.onopen = () => {
      setStatus('connected');
      newSocket.send('ping');
    };
    newSocket.onclose = () => {
      setStatus('not_connected');
      setTimeout(() => {
        connectWebSocket();
      }, 5000); // Reconnect after 5 seconds
    };
    newSocket.onerror = () => setStatus('not_connected');
    setSocket(newSocket);

    return () => {
      newSocket.onopen = null;
      newSocket.onclose = null;
      newSocket.onerror = null;
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    connectWebSocket();
  }, [connectWebSocket]);

  useEffect(() => {
    const pingInterval = setInterval(() => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        sendMessage('ping');
      }
    }, 5000); // Send "ping" every 5 seconds

    const checkTimeout = () => {
      if (lastMessageTime && Date.now() - lastMessageTime > 6000) { // 10 seconds timeout
        setStatus('not_connected');
      } else {
        setStatus('connected');
      }
    };

    const statusCheck = () => {
      setLastMessageTime(Date.now());
      checkTimeout();
    };

    if (socket) {
      socket.onmessage = (event) => {
        statusCheck();
        if (handleMessage) {
          handleMessage(event.data);
        }
      };
    }
    return () => {
      clearInterval(pingInterval);
      if (socket) {
        socket.onmessage = null;
      }
    };
  }, [socket, sendMessage, handleMessage, lastMessageTime]);

  return (
    <WebSocketContext.Provider value={{ socket, status, sendMessage, onMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export { WebSocketContext, WebSocketProvider };
