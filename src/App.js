// App.js

import React, { useState, useCallback } from 'react';
import Layout from './Lavout/Layout';
import DevLayout from './Lavout/DevLayout';

import { WebSocketProvider } from './components/WebSocketContext/WebSocketContext';
import './components/scrollbar/scrollbar.css'
import Sidebar from './components/SideBar/SideBar';

function App() {
  const [action, setAction] = useState(null);
  const [actionVersion, setActionVersion] = useState(0);
  const [actionVolume, setActionVolume] = useState(null);
  const [startDispensingEnabled, setStartDispensingEnabled] = useState(false);
  const [sendSelectionEnabled, setSendSelectionEnabled] = useState(true);
  const [dispensingWell, setDispensingWell] = useState(null);
  const [completedWells, setCompletedWells] = useState([]);
  const [activeLayout, setActiveLayout] = useState("Layout1"); // Add this line to manage the active layout
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [receivedCoords, setReceivedCoords] = useState(null);




  React.useEffect(() => {
    document.title = "Liquid Dispenser Client";
  }, []);

  
  const handleButtonClick = useCallback((newAction, volume) => {
    return new Promise((resolve) => {
      setAction(newAction);
      setActionVolume(volume);
      setActionVersion((prevVersion) => prevVersion + 1);
      console.log(`Button ${newAction} clicked`);
      console.log(`actionVersion: ${actionVersion + 1}`);
      resolve();
    });
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
    } else if (message.startsWith('receivedCoordspos:')) {
      console.log("Coords");
      const posStr = message.split(':')[1];
      const posValues = posStr.split(',');
      const xPos = parseFloat(posValues[0].split('=')[1]);
      const yPos = parseFloat(posValues[1].split('=')[1]);
      const zPos = parseFloat(posValues[2].split('=')[1]);
      const pipVal = parseInt(posValues[3].split('=')[1]);
      console.log("Received Coords:", {xPos, yPos, zPos, pipVal});

      console.log(`Received positional data: X=${xPos}, Y=${yPos}, Z=${zPos}, PIP=${pipVal}`);
      setReceivedCoords({xPos, yPos, zPos, pipVal});
      console.log("Received Coords props:", receivedCoords);


      // You can now use the positional data as needed in your application
    } else {
      // Handle the default case (if the message doesn't match any of the cases)
    }
  }
};


  
  

// ...
return (
  <WebSocketProvider handleMessage={handleMessage}>
    <div className="App">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setActiveLayout={setActiveLayout} // Pass the state setter function as a prop
      />
      
      {activeLayout === "Layout1" && (
      
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
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          receivedCoords={receivedCoords}

        />
      )}
        {activeLayout === "DevLayout" && (
          <DevLayout
            // Pass all required props to DevLayout component
            receivedCoords={receivedCoords}

          />
        )}
      {/* Add more layout components here with their respective conditions */}
    </div>
  </WebSocketProvider>
);
}

export default App;
