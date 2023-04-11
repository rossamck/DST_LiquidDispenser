// App.js

import React, { useState, useCallback } from 'react';
import Layout from './Lavout/Layout';
import { WebSocketProvider } from './components/WebSocketContext/WebSocketContext';

function App() {
  const [action, setAction] = useState(null);
  const [actionVersion, setActionVersion] = useState(0);
  const [actionVolume, setActionVolume] = useState(null);


  const handleButtonClick = useCallback((newAction, volume) => {
    setAction(newAction);
    setActionVolume(volume); // Add this line
    setActionVersion((prevVersion) => prevVersion + 1);
    console.log(`Button ${newAction} clicked`);
    console.log(`actionVersion: ${actionVersion + 1}`);
  }, [actionVersion]);
  

  const resetAction = useCallback(() => {
    setAction(null);
  }, []);

  // Handle messages received from ESP8266
  const handleMessage = (message) => {
    if (message === 'pong') {
      // Do nothing for 'pong' messages (useful for debugging)
    } else {
      console.log('Received message:', message);
      
      // Use a switch statement to handle different messages
      switch (message) {
        case 'update_status':
          // Perform the action for updating the status column in the well information table
          break;
        case 'ready':
          //Update start dispensing button
          console.log("Starting dispensing!");
          break;
        case 'some_other_action':
          // Perform another action based on the message content
          break;
        // Add more cases for different messages as needed
        default:
          // Handle the default case (if the message doesn't match any of the cases)
      }
    }
  };
  
  

// ...
return (
  <WebSocketProvider handleMessage={handleMessage}>
    <div className="App">
      <Layout
        onButtonClick={handleButtonClick}
        currentAction={action}
        actionVolume={actionVolume}
        actionVersion={actionVersion}
        onActionComplete={resetAction}
        // allSelectedWells={allSelectedWells}
      />
    </div>
  </WebSocketProvider>
);
// ...
}

export default App;
