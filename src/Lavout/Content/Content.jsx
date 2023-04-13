// Content.jsx

import React from "react";
import WellPlate from "../../components/WellPlate/WellPlate";

const Content = ({
  currentAction,
  actionVersion,
  onActionComplete,
  actionVolume,
  allSelectedWells,
  setAllSelectedWells,
  onWellPlateUpdate,
  setCompletedWells,
  setDispensingWell,
}) => {
  return (
    <div
      className="relative"
      style={{
        paddingBottom: "2rem",
      }}
    >
      <WellPlate
        currentAction={currentAction}
        actionVolume={actionVolume}
        actionVersion={actionVersion}
        onActionComplete={onActionComplete}
        allSelectedWells={allSelectedWells}
        setAllSelectedWells={setAllSelectedWells}
        onWellPlateUpdate={onWellPlateUpdate}
        setCompletedWells={setCompletedWells}
        setDispensingWell={setDispensingWell}
      />
    </div>
  );
};


export default Content;
