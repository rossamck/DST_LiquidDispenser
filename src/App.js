// App.js

import React, { useState, useCallback } from 'react';
import Layout from './Lavout/Layout';
import { WebSocketProvider } from './components/WebSocketContext/WebSocketContext';

function App() {
  const [action, setAction] = useState(null);
  const [actionVersion, setActionVersion] = useState(0);
  const [actionVolume, setActionVolume] = useState(null);
  const [startDispensingEnabled, setStartDispensingEnabled] = useState(false);
  const [sendSelectionEnabled, setSendSelectionEnabled] = useState(true);
  const [dispensingWell, setDispensingWell] = useState(null);
  const [completedWells, setCompletedWells] = useState([]);




  React.useEffect(() => {
    document.title = "Liquid Dispenser Client";
  }, []);

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
// Handle messages received from ESP8266
const handleMessage = (message) => {
  if (message === 'pong') {
    // Do nothing for 'pong' messages (useful for debugging)
  } else {
    console.log('Received message:', message);

    if (message === 'update_status') {
      // Perform the action for updating the status column in the well information table
    } else if (message === 'ready') {
      // Update start dispensing button
      console.log("Update dispensing button");
      setStartDispensingEnabled(true);
    } else if (message === 'dispensefinished') {
      // Perform another action based on the message content
      setSendSelectionEnabled(true);
    } else if (message.startsWith('dispensingWell:')) {
      console.log("YEET");
      console.log("wellid = ");
      const wellId = message.split(':')[1];
      console.log(wellId);
      setDispensingWell(wellId);
    } else if (message.startsWith('completedWell:')) {
      const wellId = message.split(':')[1];
      console.log('Completed well:', wellId);
      setCompletedWells((prevCompletedWells) => [...prevCompletedWells, wellId]);
    } else {
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
        startDispensingEnabled={startDispensingEnabled}
        setStartDispensingEnabled={setStartDispensingEnabled}
        sendSelectionEnabled={sendSelectionEnabled}
        setSendSelectionEnabled={setSendSelectionEnabled}
        dispensingWell={dispensingWell}
        setDispensingWell={setDispensingWell}
        completedWells={completedWells}
        setCompletedWells={setCompletedWells}
        // allSelectedWells={allSelectedWells}
      />
    </div>
  </WebSocketProvider>
);
// ...
}

export default App;
