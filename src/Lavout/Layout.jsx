// Layout.jsx

import React, { useState, useContext } from 'react';
import Navbar from './Navbar/Navbar';
import SidePanel from './SidePanel/SidePanel';
import Content from './Content/Content';
import InfoPanel from './InfoPanel/InfoPanel';
import StatusIndicator from './StatusIndicator/StatusIndicator';
import { WebSocketContext } from '../components/WebSocketContext/WebSocketContext';

const Layout = ({ onButtonClick, currentAction, actionVersion, onActionComplete, actionVolume }) => {

  const [allSelectedWells, setAllSelectedWells] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { sendMessage } = useContext(WebSocketContext);

  //preset stuff (move to own file)
  const [presets, setPresets] = useState(() => {
    const storedPresets = localStorage.getItem('presets');
    return storedPresets ? JSON.parse(storedPresets) : Array(16).fill(null);
  });
  
  const savePresets = (newPresets) => {
    localStorage.setItem('presets', JSON.stringify(newPresets));
    setPresets(newPresets);
  };

  const savePreset = () => {
    const firstEmptyIndex = presets.findIndex((preset) => preset === null);
    if (firstEmptyIndex !== -1) {
      const newPresets = [...presets];
      newPresets[firstEmptyIndex] = allSelectedWells;
      savePresets(newPresets);
    } else {
      alert('No empty preset slots available.');
    }
  };
  
  const overwritePreset = (index) => {
    if (window.confirm('Are you sure you want to overwrite this preset?')) {
      const newPresets = [...presets];
      newPresets[index] = allSelectedWells;
      savePresets(newPresets);
    }
  };
  
  const clearAllPresets = () => {
    if (window.confirm('Are you sure you want to clear all presets?')) {
      savePresets(Array(16).fill(null));
    }
  };
  
  const loadPreset = (index) => {
    const loadedPreset = presets[index];
    setAllSelectedWells(loadedPreset);
    console.log(loadedPreset);
    onWellPlateUpdate(loadedPreset); // Add this line
  };
  
  const onWellPlateUpdate = (selectedWells) => {
    // Define the functionality that should be triggered when well plate updates
    // For example, you can add a console.log statement to see the updated wells
    // console.log("Well plate updated:", selectedWells);
  }; 
  

  const onSendWells = () => {
    // You can send the selectedWells data as a JSON string
    const wellsData = JSON.stringify(allSelectedWells);
    sendMessage(`selectWells:${wellsData}`);
    console.log('Sending data...');
    console.log(wellsData);
  };
//   console.log("test2");
//   console.log(allSelectedWells);

  return (
    <div className="relative h-full">
      <div className="flex flex-col h-full">
        <div className="grid grid-cols-12 gap-2 w-full flex-grow bg-gray-950">
          <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <Content
            sidebarOpen={sidebarOpen}
            currentAction={currentAction}
            actionVolume={actionVolume}
            actionVersion={actionVersion}
            onActionComplete={onActionComplete}
            allSelectedWells={allSelectedWells}
            setAllSelectedWells={setAllSelectedWells}
            onWellPlateUpdate={onWellPlateUpdate}
          />
          <div className="col-span-3">
          <SidePanel
  onButtonClick={onButtonClick}
  onSendWells={onSendWells}
  savePreset={savePreset}
  overwritePreset={overwritePreset}
  clearAllPresets={clearAllPresets}
  loadPreset={loadPreset}
  presets={presets}
/>

            <InfoPanel 
              selectedWells={allSelectedWells}
               />
          </div>
        </div>
        </div>
      <StatusIndicator />
    </div>
  );
};

export default Layout;

