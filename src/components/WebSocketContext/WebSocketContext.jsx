// WebSocketContext.jsx

import { createContext, useEffect, useState, useCallback } from 'react';

const WebSocketContext = createContext();

const WebSocketProvider = ({ children, handleMessage }) => {
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState('not_connected');

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
    const newSocket = new WebSocket('ws://192.168.0.165:81');
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

  // Periodically send "ping" messages and check WebSocket connection status
  useEffect(() => {
    const pingInterval = setInterval(() => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        sendMessage('ping');
      }
    }, 5000); // Send "ping" every 5 seconds

    const statusCheck = (event) => {
      if (event.data === 'pong') {
        setStatus('connected');
      } else {
        setStatus('not_connected');
      }
    };

    if (socket) {
      socket.onmessage = (event) => {
        statusCheck(event);
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
  }, [socket, sendMessage, handleMessage]);

  return (
    <WebSocketContext.Provider value={{ socket, status, sendMessage, onMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export { WebSocketContext, WebSocketProvider };
