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
        <div className="grid grid-cols-12 gap-2 w-full flex-grow bg-red-300">
          <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <Content
            sidebarOpen={sidebarOpen}
            currentAction={currentAction}
            actionVolume={actionVolume}
            actionVersion={actionVersion}
            onActionComplete={onActionComplete}
            allSelectedWells={allSelectedWells}
            setAllSelectedWells={setAllSelectedWells}
          />
          <div className="col-span-3">
            <SidePanel 
              onButtonClick={onButtonClick}
              onSendWells={onSendWells} />
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

