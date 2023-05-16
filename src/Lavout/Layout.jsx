// Layout.jsx

import React, { useState, useContext, useEffect } from "react";
import Navbar from "./Navbar/Navbar";
import SidePanel from "./SidePanel/SidePanel";
import Content from "./Content/Content";
import StatusIndicator from "./StatusIndicator/StatusIndicator";
import InfoPanel from "./InfoPanel/InfoPanel";
import { WebSocketContext } from "../components/WebSocketContext/WebSocketContext";
import ConfigContext from "../context/ModuleConfigContext";

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
  setActiveLayout,
  
}) => {


  const [allSelectedWells, setAllSelectedWells] = useState([]);
  const { sendMessage } = useContext(WebSocketContext);
  const [activeWellPlate, setActiveWellPlate] = useState("");
  const [activeSourceModule, setActiveSourceModule] = useState("");
  const [activeSourceModuleId, setActiveSourceModuleId] = useState("");

  const config = useContext(ConfigContext);
  
  useEffect(() => {
    console.log("Active Source Module:", activeSourceModule);
    console.log("TEST");
    if (activeSourceModule !== "") {
      const activeModule = config[activeSourceModule];
      const sourceModuleId = activeModule.moduleId;
      console.log(sourceModuleId);
      setActiveSourceModuleId(sourceModuleId)
    }
  }, [activeSourceModule, config]);
  

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

  // obtain the source for each group then get the coordinates from them


  const onSendWells = () => {
    setSendSelectionEnabled(false);
    console.log("All selected wells:", allSelectedWells);
    
    // Retrieve the corner coordinates based on the activeWellPlate
    const cornerCoordinates = config[activeWellPlate].cornerCoordinates;
    
    // Apply the transformation to each well
    const transformedWells = allSelectedWells.map(well => {
      const relX = well.xCoord;
      const relY = well.yCoord;
      const absX = relX + cornerCoordinates[selectedPlateId][0];
      const absY = (selectedPlateId === 0 || selectedPlateId === 1) ? -relY + cornerCoordinates[selectedPlateId][1] : relY + cornerCoordinates[selectedPlateId][1];
      return { ...well, xCoord: absX, yCoord: absY };
    });
    
    // Group wells by sourceIndex
    const groupedWells = transformedWells.reduce((groups, well) => {
      const sourceIndex = well.sourceIndex;
      if (!groups[sourceIndex]) {
        groups[sourceIndex] = [];
      }
      groups[sourceIndex].push(well);
      return groups;
    }, {});
    
    // Send each group separately
    Object.values(groupedWells).forEach((group, i, array) => {
      const wellsData = JSON.stringify(group);
      console.log("Sending data...", wellsData);
      sendMessage(`selectWells:${wellsData}`, true);
  
      console.log(wellsData);
      if (i === array.length - 1) {
        console.log("Last array");
        sendMessage(`manualCoords:0,0,0`, true);
      }
    });
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
          <div className="col-span-6 relative p-4 bg-blue-100" style={{ height: 'calc(100vh - 6.25rem)' }}>
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
              setActiveLayout={setActiveLayout}
              // activeWellPlate={"96 Well"}
              activeWellPlate={activeWellPlate}
              selectedSourceModuleId={activeSourceModuleId}

              
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
              setActiveWellPlate={setActiveWellPlate}
              setActiveSourceModule={setActiveSourceModule}
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
