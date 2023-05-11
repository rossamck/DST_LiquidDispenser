import React from "react";
import ControlPanelDev from "../ControlPanel/ControlPanelDev";

const SidePanelDev = ({
  onButtonPressCountsUpdate,
  onAxesNetValuesUpdate,
  receivedCoords,

}) => {


    
    
  return (
    <div className="col-span-3 flex flex-col h-full">
      <ControlPanelDev
        className="flex-1"
        onButtonPressCountsUpdate={onButtonPressCountsUpdate}
        onAxesNetValuesUpdate={onAxesNetValuesUpdate}
        receivedCoords={receivedCoords}


      />

    </div>
  );
};

export default SidePanelDev;
