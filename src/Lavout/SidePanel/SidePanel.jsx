import React from "react";
import ControlPanel from "../ControlPanel/ControlPanel";

const SidePanel = ({
  onButtonClick,
  onSendWells,
  savePreset,
  overwritePreset,
  clearAllPresets,
  loadPreset,
  presets,
  startDispensingEnabled,
  setStartDispensingEnabled,
  sendSelectionEnabled,
  selectedPlateId,
  setSelectedPlateId,
  setActiveWellPlate,
  setActiveSourceModule,
  setActiveWasteModule,
  activeSourceModule,
  activeWasteModule,
  activeWellPlate,
}) => {
  return (
    <div className="col-span-3 flex flex-col h-full">
      <ControlPanel
        className="flex-1"
        onButtonClick={onButtonClick}
        onSendWells={onSendWells}
        savePreset={savePreset}
        overwritePreset={overwritePreset}
        clearAllPresets={clearAllPresets}
        loadPreset={loadPreset}
        presets={presets}
        startDispensingEnabled={startDispensingEnabled}
        setStartDispensingEnabled={setStartDispensingEnabled}
        sendSelectionEnabled={sendSelectionEnabled}
        selectedPlateId={selectedPlateId}
        setSelectedPlateId={setSelectedPlateId}
        setActiveWellPlate={setActiveWellPlate}
        setActiveSourceModule={setActiveSourceModule}
        setActiveWasteModule={setActiveWasteModule}
        activeWellPlate={activeWellPlate}
        activeSourceModule={activeSourceModule}
        activeWasteModule={activeWasteModule}
      />
    </div>
  );
};

export default SidePanel;
