// JobLayout.jsx

import React, { useContext } from "react";
import Navbar from "./Navbar/Navbar";
import SidePanelJob from "./SidePanel/SidePanelJob";
import ContentJob from "./Content/ContentJob";
import StatusIndicator from "./StatusIndicator/StatusIndicator";
import InfoPanelJob from "./InfoPanel/InfoPanelJob";
import { WebSocketContext } from "../components/WebSocketContext/WebSocketContext";



const JobLayout = ({
  sidebarOpen,
  setSidebarOpen,
  receivedCoords,

  
}) => {
  
  const { sendMessage } = useContext(WebSocketContext);

  const { status } = useContext(WebSocketContext);
  const isStatusConnected = status === 'connected';
  
  if (isStatusConnected && receivedCoords === null) {
    console.log("Status is connected and receivedCoords is null");
    sendMessage("getCurrentCoords");
  }

  function getJobTitle(message) {
    if (message.includes("selectWells")) {
      return "Dispensing Wells";
    }
    if (message.includes("manualCoords:0,0,0")) {
      return "Reset Position";
    }
  }


  return (
    <div className="relative flex flex-col min-h-screen">
      <div className="flex flex-col h-[calc(100vh - 3.75rem - 2rem)]">
        <div className="grid grid-cols-12 gap-2 w-full flex-grow bg-gray-950">
          <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="col-span-3">
            <InfoPanelJob
            />
          </div>
          <div className="col-span-6 relative p-4 bg-blue-100 h-[calc(100vh-3.75rem)]">
            <ContentJob
            getJobTitle={getJobTitle}
                         
            />
          </div>
          <div className="col-span-3 flex flex-col h-[calc(100vh-3.75rem)]">
            <SidePanelJob
            getJobTitle={getJobTitle}
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

export default JobLayout;
