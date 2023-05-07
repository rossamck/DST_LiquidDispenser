// WebSocketContext.jsx

import { createContext, useEffect, useState, useCallback } from 'react';

const WebSocketContext = createContext();

const WebSocketProvider = ({ children, handleMessage }) => {
  const [config, setConfig] = useState(null); // Add this line to manage the fetched configuration

  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState('not_connected');
  const [lastMessageTime, setLastMessageTime] = useState(null);
  const [userWebSocketIP, setUserWebSocketIP] = useState(null); // Add this line to manage the user-specified IP address

  

  useEffect(() => {
    fetch('/config.json') // Fetch the config.json file from the public folder
      .then((response) => response.json())
      .then((data) => setConfig(data));
  }, []);
  
  const updateWebSocketIP = useCallback(
    (newIP) => {
      setUserWebSocketIP(newIP);
    },
    []
  );

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
    if (!config) return; // Don't attempt to connect if the config hasn't been fetched yet

    const ip = userWebSocketIP || config.websocketIP;

    const newSocket = new WebSocket(`ws://${ip}:81`);
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
  }, [config, userWebSocketIP]);

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
    <WebSocketContext.Provider value={{ socket, status, sendMessage, onMessage, updateWebSocketIP  }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export { WebSocketContext, WebSocketProvider };
