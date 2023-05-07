import React from "react";
import ControlPanelDev from "../ControlPanel/ControlPanelDev";

const SidePanelDev = ({
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
  onButtonPressCountsUpdate,
  onAxesNetValuesUpdate

}) => {


    
    
  return (
    <div className="col-span-3 flex flex-col h-full">
      <ControlPanelDev
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
        onButtonPressCountsUpdate={onButtonPressCountsUpdate}
        onAxesNetValuesUpdate={onAxesNetValuesUpdate}

      />

    </div>
  );
};

export default SidePanelDev;
