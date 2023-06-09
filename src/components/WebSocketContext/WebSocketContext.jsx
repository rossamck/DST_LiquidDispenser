// WebSocketContext.jsx

import { createContext, useEffect, useState, useCallback, useContext} from 'react';
import JobQueueContext from '../../context/JobQueueContext';

const WebSocketContext = createContext();

const WebSocketProvider = ({ children, handleMessage }) => {
  const [config, setConfig] = useState(null); // Add this line to manage the fetched configuration

  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState('not_connected');
  const [lastMessageTime, setLastMessageTime] = useState(null);
  const [userWebSocketIP, setUserWebSocketIP] = useState(() => {
    return localStorage.getItem('userWebSocketIP') || null;
  });
  
  const jobQueue = useContext(JobQueueContext);


  useEffect(() => {
    fetch('/config.json') // Fetch the config.json file from the public folder
      .then((response) => response.json())
      .then((data) => setConfig(data));
  }, []);
  
  const updateWebSocketIP = useCallback(
    (newIP) => {
      localStorage.setItem('userWebSocketIP', newIP);
      setUserWebSocketIP(newIP);
    },
    []
  );
  
  const sendMessage = useCallback((message, addToQueue = false) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      if (addToQueue) {
        if (message.startsWith("selectWells:")) {
          console.log("VERY POG");
  
          // Extract the JSON data from the message
          const jsonData = message.substring("selectWells:".length);
          try {
            const dataArray = JSON.parse(jsonData);
            const numObjects = dataArray.length;
            console.log(`Number of objects in the array: ${numObjects}`);
  
            const jobId = jobQueue.generateJobId(); // Generate a new jobId here

            // Add a single job to the queue that includes all the actions
            jobQueue.addJob({
              action: () => {
                dataArray.forEach((object, index) => {
                  const objectMessage = JSON.stringify(object);
                  const prefixedMessage = `selectWell:${objectMessage}`;
                  const jobMessage = `jobId:${jobId} ${prefixedMessage}`;
                  console.log("Sending message:", jobMessage);
                  socket.send(jobMessage);
                });
      
                const endOfWellsMessage = `jobId:${jobId} endOfWells`;
                console.log("Sending endOfWells message:", endOfWellsMessage);
                socket.send(endOfWellsMessage);
              },
              message: message,
              id: jobId // Pass the jobId into the addJob method
            });
          } catch (error) {
            console.error("Invalid JSON data:", error);
          }
  
          return; // Exit the function after defining the separate action
        }
  
        const jobId = jobQueue.jobId; // Capture the jobId at this moment
        jobQueue.addJob({
          action: () => {
            // Use the captured jobId in the message
            const jobMessage = `jobId:${jobId} ${message}`;
            console.log("Jobmessage = ", jobMessage);
            socket.send(jobMessage);
          },
          message: message
        });
      } else {
        socket.send(message);
      }
    }
  }, [socket, jobQueue]);
  
  
  
  
  
  


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
