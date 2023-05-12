import React from "react";
import ControlPanelPos from "../ControlPanel/ControlPanelPos";

const SidePanelPos = ({
  handleResetPositions,
  handleSavePositions

}) => {


    
    
  return (
    <div className="col-span-3 flex flex-col h-full">
      <ControlPanelPos
      handleResetPositions={handleResetPositions}
      handleSavePositions={handleSavePositions}
      />

    </div>
  );
};

export default SidePanelPos;
