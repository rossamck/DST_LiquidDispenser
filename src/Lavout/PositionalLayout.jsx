import React, { useState } from "react";
import Navbar from "./Navbar/Navbar";
import SidePanelPos from "./SidePanel/SidePanelPos";
import ContentPos from "./Content/ContentPos";
import StatusIndicator from "./StatusIndicator/StatusIndicator";
import InfoPanelPos from "./InfoPanel/InfoPanelPos";

const PositionalLayout = ({
  sidebarOpen,
  setSidebarOpen,
  receivedCoords,
  savedPositions,
  setSavedPositions
  
}) => {
  const [resetPositions, setResetPositions] = useState(false);
  const [savePositions, setSavePositions] = useState(false);



  const handleResetPositions = () => {
    setResetPositions(true);
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
