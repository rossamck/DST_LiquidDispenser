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
      />

    </div>
  );
};

export default SidePanel;
