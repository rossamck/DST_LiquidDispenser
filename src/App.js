// App.js

import React, { useState, useCallback } from "react";
import Layout from "./Lavout/Layout";
import DevLayout from "./Lavout/DevLayout";
import PositionalLayout from "./Lavout/PositionalLayout";
import JobLayout from "./Lavout/JobLayout";
import AxisContext from "./AxisContext";
import ModulePositionsContext from "./context/ModulePositionsContext";
import JobQueue from "./components/JobQueue/JobQueue";
import JobQueueContext from "./context/JobQueueContext";
import SelectedModulesContext from "./context/SelectedModulesContext";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { WebSocketProvider } from "./components/WebSocketContext/WebSocketContext";
import "./components/scrollbar/scrollbar.css";
import Sidebar from "./components/SideBar/SideBar";
import ConfigContext from "./context/ModuleConfigContext";

// import config from "./configuration/ModuleConfig.json";
import getConfig from "./configuration/configprovider";

function App() {
  const [action, setAction] = useState(null);
  const [actionVersion, setActionVersion] = useState(0);
  const [actionVolume, setActionVolume] = useState(null);
  const [startDispensingEnabled, setStartDispensingEnabled] = useState(false);
  const [sendSelectionEnabled, setSendSelectionEnabled] = useState(true);
  const [dispensingWell, setDispensingWell] = useState(null);
  const [completedWells, setCompletedWells] = useState([]);
  const [activeLayout, setActiveLayout] = useState("Home"); // Add this line to manage the active layout
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [receivedCoords, setReceivedCoords] = useState(null);
  const [savedPositions, setSavedPositions] = useState([]);
  const [selectedPlateId, setSelectedPlateId] = useState(null);

  const jobQueue = React.useRef(new JobQueue()).current;


  const [config, setConfig] = useState(null);

  React.useEffect(() => {
    getConfig().then((loadedConfig) => setConfig(loadedConfig));
  }, []);
  

  const axisLimits = {
    x: { min: 0, max: 2100 },
    y: { min: 0, max: 2400 },
    z: { min: 0, max: 500 },
    pip: { min: 0, max: 1000 },
  };

  React.useEffect(() => {
    document.title = "Liquid Dispenser Client";
  }, []);

  const initialSelectedModules = {
    wellPlate: null,
    source: null,
    waste: null
  };

  const [selectedModules, setSelectedModules] = useState(initialSelectedModules);


  const reloadPage = () => {
    window.location.reload();
  };

  const handleButtonClick = useCallback(
    (newAction, volume) => {
      return new Promise((resolve) => {
        setAction(newAction);
        setActionVolume(volume);
        setActionVersion((prevVersion) => prevVersion + 1);
        console.log(`Button ${newAction} clicked`);
        console.log(`actionVersion: ${actionVersion + 1}`);
        resolve();
      });
    },
    [actionVersion]
  );

  const resetAction = useCallback(() => {
    setAction(null);
  }, []);

  // Handle messages received from ESP8266
  const handleMessage = (message) => {
    if (message === "pong") {
      // Do nothing for 'pong' messages (useful for debugging)
    } else {
      console.log("Received message:", message);

      if (message === "update_status") {
        // Perform the action for updating the status column in the well information table
      } 
      else if (message.startsWith("jobId:")) {
        const jobId = parseInt(message.split(":")[1]);
        console.log(`Received test jobId: ${jobId}`);
        // Do something with the jobId
        jobQueue.jobCompleted(jobId);
      } 
      else if (message === "ready") {
        // Update start dispensing button
        console.log("Update dispensing button");
        setStartDispensingEnabled(true);
      } 
      else if (message.startsWith("dispensefinished:")) {
        // Perform another action based on the message content
        const jobId = message.split(":")[1];
        // console.log("Job finished: ", jobId);
        jobQueue.jobCompleted(jobId);
      } 
      else if (message.startsWith("dispensingWell:")) {
        const wellId = message.split(":")[1];
        console.log("wellid = ", wellId);
        setDispensingWell(wellId);
      } 
      else if (message.startsWith("completedWell:")) {
        const wellId = message.split(":")[1];
        setCompletedWells((prevCompletedWells) => [
          ...prevCompletedWells,
          wellId,
        ]);
      } 
      else if (message.startsWith("receivedCoordspos:")) {
        const posStr = message.split(":")[1];
        const posValues = posStr.split(",");
        const xPos = parseFloat(posValues[0].split("=")[1]);
        const yPos = parseFloat(posValues[1].split("=")[1]);
        const zPos = parseFloat(posValues[2].split("=")[1]);
        const pipVal = parseInt(posValues[3].split("=")[1]);

        console.log(
          `Received positional data: X=${xPos}, Y=${yPos}, Z=${zPos}, PIP=${pipVal}`
        );
        setReceivedCoords({ xPos, yPos, zPos, pipVal });

      } 
      else if (message.startsWith("pipetteClickedpos:")) {
        const posStr = message.split(":")[1];
        const posValues = posStr.split(",");
        const xPos = parseFloat(posValues[0].split("=")[1]);
        const yPos = parseFloat(posValues[1].split("=")[1]);
        const zPos = parseFloat(posValues[2].split("=")[1]);
        const pipVal = parseInt(posValues[3].split("=")[1]);

        console.log(
          `Received positional data: X=${xPos}, Y=${yPos}, Z=${zPos}, PIP=${pipVal}`
        );
        setReceivedCoords({ xPos, yPos, zPos, pipVal });

        // You can now use the positional data as needed in your application
      } 
      else if (message.startsWith("ZMovedpos:")) {
        const posStr = message.split(":")[1];
        const posValues = posStr.split(",");
        const xPos = parseFloat(posValues[0].split("=")[1]);
        const yPos = parseFloat(posValues[1].split("=")[1]);
        const zPos = parseFloat(posValues[2].split("=")[1]);
        const pipVal = parseInt(posValues[3].split("=")[1]);

        console.log(
          `Received positional data: X=${xPos}, Y=${yPos}, Z=${zPos}, PIP=${pipVal}`
        );
        setReceivedCoords({ xPos, yPos, zPos, pipVal });

        // You can now use the positional data as needed in your application
      } 
      else {
        console.log("Received default message:", message);

        // Handle the default case (if the message doesn't match any of the cases)
      }
    }
  };

  if (!config) {
    // Config has not been loaded yet
    return "Waiting for config...";
  }
  


  return (
    <ConfigContext.Provider value={config.data}>
    <JobQueueContext.Provider value={jobQueue}>
        <AxisContext.Provider value={axisLimits}>
          <WebSocketProvider handleMessage={handleMessage}>
          <SelectedModulesContext.Provider value={[selectedModules, setSelectedModules]}>

            <ModulePositionsContext.Provider
              value={{ savedPositions, setSavedPositions }} // Provide savedPositions and setSavedPositions through the ModulePositionsContext
            >
              <div className="App">
                <Sidebar
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                  setActiveLayout={setActiveLayout}
                  activeLayout={activeLayout}
                  reloadPage={reloadPage}
                />

                {activeLayout === "Home" && (
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
                    savedPositions={savedPositions}
                    selectedPlateId={selectedPlateId}
                    setSelectedPlateId={setSelectedPlateId}
                    setActiveLayout={setActiveLayout}
                  />
                )}
                {activeLayout === "DevLayout" && (
                  <DevLayout
                    // Pass all required props to DevLayout component
                    receivedCoords={receivedCoords}
                  />
                )}
                {activeLayout === "PositionalLayout" && (
                  <DndProvider backend={HTML5Backend}>
                    <PositionalLayout
                      // Pass all required props to DevLayout component
                      receivedCoords={receivedCoords}
                      savedPositions={savedPositions}
                      setSavedPositions={setSavedPositions}
                      setSelectedPlateId={setSelectedPlateId}
                    />
                  </DndProvider>
                )}
                {/* Add more layout components here with their respective conditions */}
                {activeLayout === "JobLayout" && (
                  <JobLayout
                    // Pass all required props to DevLayout component
                    receivedCoords={receivedCoords}
                  />
                )}
              </div>
            </ModulePositionsContext.Provider>
            </SelectedModulesContext.Provider>

          </WebSocketProvider>
        </AxisContext.Provider>
      </JobQueueContext.Provider>
    </ConfigContext.Provider>
  );
}

export default App;
