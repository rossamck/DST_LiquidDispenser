// JobLayout.jsx

import React, { useState } from "react";
import Navbar from "./Navbar/Navbar";
import SidePanelDev from "./SidePanel/SidePanelDev";
import ContentDev from "./Content/ContentDev";
import StatusIndicator from "./StatusIndicator/StatusIndicator";
import InfoPanelDev from "./InfoPanel/InfoPanelDev";
// import { WebSocketContext } from "../components/WebSocketContext/WebSocketContext";

const JobLayout = ({
  onButtonClick,
  sidebarOpen,
  setSidebarOpen,
  onAxesNetValuesUpdate,
  receivedCoords,

  
}) => {
  const [buttonPressCounts, setButtonPressCounts] = useState([]);
  const [axesNetValues, setAxesNetValues] = useState([]);

    // const { sendMessage } = useContext(WebSocketContext);



  return (
    <div className="relative flex flex-col min-h-screen">
      <div className="flex flex-col h-[calc(100vh - 3.75rem - 2rem)]">
        <div className="grid grid-cols-12 gap-2 w-full flex-grow bg-gray-950">
          <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="col-span-3">
            <InfoPanelDev
              buttonPressCounts={buttonPressCounts}
              axesNetValues={axesNetValues}

            />
          </div>
          <div className="col-span-6 relative p-4 bg-blue-100 h-[calc(100vh-3.75rem)]">
            <ContentDev
            receivedCoords={receivedCoords}

              
            />
          </div>
          <div className="col-span-3 flex flex-col h-[calc(100vh-3.75rem)]">
            <SidePanelDev
              // Pass all required props
              onButtonPressCountsUpdate={setButtonPressCounts}
              onAxesNetValuesUpdate={setAxesNetValues}
              receivedCoords={receivedCoords}


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
