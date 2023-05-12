// Layout.jsx

import React, { useState, useContext } from "react";
import Navbar from "./Navbar/Navbar";
import SidePanel from "./SidePanel/SidePanel";
import Content from "./Content/Content";
import StatusIndicator from "./StatusIndicator/StatusIndicator";
import InfoPanel from "./InfoPanel/InfoPanel";
import { WebSocketContext } from "../components/WebSocketContext/WebSocketContext";

const Layout = ({
  onButtonClick,
  currentAction,
  actionVersion,
  onActionComplete,
  actionVolume,
  startDispensingEnabled,
  setStartDispensingEnabled,
  sendSelectionEnabled,
  setSendSelectionEnabled ,
  dispensingWell,
  setDispensingWell,
  completedWells,
  setCompletedWells,
  sidebarOpen,
  setSidebarOpen,
  receivedCoords,
  selectedPlateId,
  setSelectedPlateId,
  
}) => {
  
  const [allSelectedWells, setAllSelectedWells] = useState([]);
  const { sendMessage } = useContext(WebSocketContext);

  //preset stuff (move to own file)
  const [presets, setPresets] = useState(() => {
    const storedPresets = localStorage.getItem("presets");
    return storedPresets ? JSON.parse(storedPresets) : Array(16).fill(null);
  });

  const savePresets = (newPresets) => {
    localStorage.setItem("presets", JSON.stringify(newPresets));
    setPresets(newPresets);
  };

  const savePreset = () => {
    const firstEmptyIndex = presets.findIndex((preset) => preset === null);
    if (firstEmptyIndex !== -1) {
      const newPresets = [...presets];
      newPresets[firstEmptyIndex] = allSelectedWells;
      savePresets(newPresets);
    } else {
      alert("No empty preset slots available.");
    }
  };

  const overwritePreset = (index) => {
    if (window.confirm("Are you sure you want to overwrite this preset?")) {
      const newPresets = [...presets];
      newPresets[index] = allSelectedWells;
      savePresets(newPresets);
    }
  };

  const clearAllPresets = () => {
    if (window.confirm("Are you sure you want to clear all presets?")) {
      savePresets(Array(16).fill(null));
    }
  };

  const loadPreset = (index) => {
    onButtonClick("clearWellsButton", null).then(() => {
      const loadedPreset = presets[index];
      setAllSelectedWells(loadedPreset);
      console.log(loadedPreset);
      onWellPlateUpdate(loadedPreset);
    });
  };
  
  const { status } = useContext(WebSocketContext);
  const isStatusConnected = status === 'connected';
  
  if (isStatusConnected && receivedCoords === null) {
    console.log("Status is connected and receivedCoords is null");
    sendMessage("getCurrentCoords");
  }
  
  const onWellPlateUpdate = (selectedWells) => {
    // Define the functionality that should be triggered when well plate updates
    // For example, you can add a console.log statement to see the updated wells
    // console.log("Well plate updated:", selectedWells);
  };

  const onSendWells = () => {
    // send the selectedWells data as a JSON string
  
    // edit this to add to job queue
    
    setSendSelectionEnabled(false);
    
    console.log("All selected wells:", allSelectedWells);
    
    const wellsData = JSON.stringify(allSelectedWells);
    sendMessage(`selectWells:${wellsData}`);
    console.log("Sending data...");
    console.log(wellsData);
  };
  


  return (
    <div className="relative flex flex-col min-h-screen">
      <div className="flex flex-col h-[calc(100vh - 3.75rem - 2rem)]">
        <div className="grid grid-cols-12 gap-2 w-full flex-grow bg-gray-950">
          <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="col-span-3">
            <InfoPanel
              selectedWells={allSelectedWells}
              dispensingWell={dispensingWell}
              completedWells={completedWells}
              selectedPlateId={selectedPlateId} 
              />
          </div>
          <div className="col-span-6 relative p-4 bg-blue-100 h-[calc(100vh-3.75rem)]">
            <Content
              currentAction={currentAction}
              actionVolume={actionVolume}
              actionVersion={actionVersion}
              onActionComplete={onActionComplete}
              allSelectedWells={allSelectedWells}
              setAllSelectedWells={setAllSelectedWells}
              onWellPlateUpdate={onWellPlateUpdate}
              setCompletedWells={setCompletedWells}
              setDispensingWell={setDispensingWell}
              selectedPlateId={selectedPlateId}
              
            />
          </div>
          <div className="col-span-3 flex flex-col h-[calc(100vh-3.75rem)]">
            <SidePanel
              // Pass all required props
              onButtonClick={onButtonClick}
              onSendWells={onSendWells}
              savePreset={savePreset}
              overwritePreset={overwritePreset}
              clearAllPresets={clearAllPresets}
              loadPreset={loadPreset}
              presets={presets}
              startDispensingEnabled={startDispensingEnabled}
              setStartDispensingEnabled={setStartDispensingEnabled}
              sendSelectionEnabled={sendSelectionEnabled}
              selectedWells={allSelectedWells}
              dispensingWell={dispensingWell}
              completedWells={completedWells}
              selectedPlateId={selectedPlateId}
              setSelectedPlateId={setSelectedPlateId}
            />
          </div>
        </div>
      </div>
      <StatusIndicator
      sidebarOpen={sidebarOpen}
      receivedCoords={receivedCoords}
        />
    </div>
  );
  
}

export default Layout;
