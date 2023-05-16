import React, { useState, useEffect, useCallback } from 'react';
import WellPlate from "../../components/WellPlate/WellPlate";
import LiquidSource from "../../components/LiquidSource/LiquidSource";

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
  selectedPlateId,
  setActiveLayout,
  activeWellPlate,
}) => {
  const WELL_PLATE_WIDTH = '100%';
  const colourIndexPairs = [
    { color: "bg-pink-300", index: 1, highlightedColor: "bg-pink-100" },
    { color: "bg-green-300", index: 2, highlightedColor: "bg-green-100" },
    { color: "bg-blue-300", index: 3, highlightedColor: "bg-blue-100" },
    { color: "bg-red-300", index: 4, highlightedColor: "bg-red-100" },
    { color: "bg-teal-300", index: 5, highlightedColor: "bg-teal-100" },
    { color: "bg-yellow-300", index: 6, highlightedColor: "bg-yellow-100" },
    { color: "bg-purple-300", index: 7, highlightedColor: "bg-purple-100" },
    { color: "bg-orange-300", index: 8, highlightedColor: "bg-orange-100" },
  ];

  const [selectedColorIndex, setSelectedColorIndex] = useState(colourIndexPairs[0]);

  const handlePositionClick = useCallback(() => {
    setActiveLayout("PositionalLayout");
  }, [setActiveLayout]);

  useEffect(() => {
    if (selectedPlateId === null) {
      console.log("NULL!!22");
    }
    console.log("Selected Plate ID:", selectedPlateId);
  }, [selectedPlateId]);

  const handleLiquidSourceSelect = (index) => {
    const selectedColourIndexPair = colourIndexPairs.find(pair => pair.index === index) ?? null;
    setSelectedColorIndex(selectedColourIndexPair);
    if (selectedColourIndexPair !== null) {
      console.log(`Selected color: ${selectedColourIndexPair.color}`);
      console.log(`Selected index: ${selectedColourIndexPair.index}`);
    }
    // Implement the logic to update selected wells with the selected liquid source color
  }

  useEffect(() => {
    console.log(`Plate ID updated: ${selectedPlateId}`);
  }, [selectedPlateId]);

  return (
    <div
      className="relative"
      style={{
        paddingBottom: "2rem",
      }}
    >
    {activeWellPlate !== '' && selectedPlateId !== null ? (
        <>
          <WellPlate
            plateType={activeWellPlate} // update
            currentAction={currentAction}
            actionVolume={actionVolume}
            actionVersion={actionVersion}
            onActionComplete={onActionComplete}
            allSelectedWells={allSelectedWells}
            setAllSelectedWells={setAllSelectedWells}
            onWellPlateUpdate={onWellPlateUpdate}
            setCompletedWells={setCompletedWells}
            setDispensingWell={setDispensingWell}
            selectedColorIndex={selectedColorIndex}
            colourIndexPairs={colourIndexPairs}
            selectedPlateId={selectedPlateId}
          />
          <div className="mt-4">
            <LiquidSource
              colourIndexPairs={colourIndexPairs}
              wellPlateWidth={WELL_PLATE_WIDTH}
              selectedColorIndex={selectedColorIndex}
              onSelect={handleLiquidSourceSelect}
            />
          </div>
        </>
      ) : (
<div
  style={{ height: '80vh' }}
  className="flex justify-center items-center text-center text-gray-400 font-bold text-3xl underline cursor-pointer"
  onClick={handlePositionClick}
>
  Please select a well plate position
</div>      )}
    </div>
  );
  
};

export default Content;


