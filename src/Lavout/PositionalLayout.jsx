import React, { useState, useContext } from "react";
import Navbar from "./Navbar/Navbar";
import SidePanelPos from "./SidePanel/SidePanelPos";
import ContentPos from "./Content/ContentPos";
import StatusIndicator from "./StatusIndicator/StatusIndicator";
import InfoPanelPos from "./InfoPanel/InfoPanelPos";
import { WebSocketContext } from "../components/WebSocketContext/WebSocketContext";


const PositionalLayout = ({
  sidebarOpen,
  setSidebarOpen,
  receivedCoords,
  savedPositions,
  setSavedPositions,
  setSelectedPlateId,
}) => {
  const [resetPositions, setResetPositions] = useState(false);
  const [savePositions, setSavePositions] = useState(false);

  const { sendMessage } = useContext(WebSocketContext);

  const { status } = useContext(WebSocketContext);
  const isStatusConnected = status === 'connected';
  
  if (isStatusConnected && receivedCoords === null) {
    console.log("Status is connected and receivedCoords is null");
    sendMessage("getCurrentCoords");
  }

  const handleResetPositions = () => {
    setResetPositions(true);
    setSelectedPlateId(null);
  };

  
  const handleSavePositions = () => {
    setSavePositions(true);
  };

  return (
    <div className="relative flex flex-col min-h-screen">
      <div className="flex flex-col h-[calc(100vh - 3.75rem - 2rem)]">
        <div className="grid grid-cols-12 gap-2 w-full flex-grow bg-gray-950">
          <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="col-span-3">
            <InfoPanelPos 
            savedPositions={savedPositions}
            />
          </div>
          <div className="col-span-6 relative p-4 bg-blue-100 h-[calc(100vh-3.75rem)]">
            <ContentPos
              receivedCoords={receivedCoords}
              resetPositions={resetPositions}
              setResetPositions={setResetPositions}
              savePositions={savePositions}
              setSavePositions={setSavePositions}
              savedPositions={savedPositions}
              setSavedPositions={setSavedPositions}
              
            />
          </div>
          <div className="col-span-3 flex flex-col h-[calc(100vh-3.75rem)]">
            <SidePanelPos
              handleResetPositions={handleResetPositions}
              handleSavePositions={handleSavePositions}
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
};

export default PositionalLayout;
