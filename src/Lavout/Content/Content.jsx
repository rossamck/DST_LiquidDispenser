import React, { useState, useEffect, useCallback, useContext } from 'react';
import WellPlate from "../../components/WellPlate/WellPlate";
import LiquidSource from "../../components/LiquidSource/LiquidSource";
import ConfigContext from "../../context/ModuleConfigContext";


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
  selectedSourceModuleId,
}) => {
  const WELL_PLATE_WIDTH = '100%';
  const config = useContext(ConfigContext);
  const [activeSourceModule, setActiveSourceModule] = useState(null);

  

  const colourIndexPairs = activeSourceModule?.liquidSources || [];


  const [selectedColorIndex, setSelectedColorIndex] = useState(colourIndexPairs[0]);

  useEffect(() => {
    console.log("Active Well Plate new:", activeWellPlate);
  }, [activeWellPlate]);

  const handlePositionClick = useCallback(() => {
    setActiveLayout("PositionalLayout");
  }, [setActiveLayout]);

  useEffect(() => {
    if (selectedPlateId === null) {
      console.log("No plate selected!");
    }
    console.log("Selected Plate ID:", selectedPlateId);
  }, [selectedPlateId]);

  useEffect(() => {
    if (selectedSourceModuleId) {
      const sourceModule = Object.values(config).find((module) => module.moduleId === selectedSourceModuleId);
      setActiveSourceModule(sourceModule);
    }
  }, [config, selectedSourceModuleId]);

   

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
            activeWellPlate={activeWellPlate} // update
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
              rows={activeSourceModule?.rows}
              cols={activeSourceModule?.cols}
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


