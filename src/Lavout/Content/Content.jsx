// Content.jsx

import React from "react";
import WellPlate from "../../components/WellPlate/WellPlate";

const Content = ({
  sidebarOpen,
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
  const contentStyle = {
    marginLeft: sidebarOpen ? "16rem" : "0",
    width: sidebarOpen ? "calc(100% - 16rem)" : "100%",
    transition: "margin-left 500ms ease, width 500ms ease",
  };

  // const [allSelectedWells, setAllSelectedWells] = useState([]); //MOVE THIS UP

  return (
    <div
      id="content"
      className="col-span-9 bg-green-300 h-[calc(100vh-3.75rem)] p-4"
      style={contentStyle}
    >
      {/* ... */}
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
      {/* ... */}
    </div>
  );
};

export default Content;
