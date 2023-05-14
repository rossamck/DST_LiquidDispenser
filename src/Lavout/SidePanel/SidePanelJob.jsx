import React from "react";
import ControlPanelJob from "../ControlPanel/ControlPanelJob";

const SidePanelJob = ({
  receivedCoords,
  getJobTitle,

}) => {


    
    
  return (
    <div className="col-span-3 flex flex-col h-full">
      <ControlPanelJob
        receivedCoords={receivedCoords}
        getJobTitle={getJobTitle}


      />

    </div>
  );
};

export default SidePanelJob;
