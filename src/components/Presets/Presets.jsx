// Presets.jsx

import React, { useState } from "react";

const Presets = ({ presets, savePreset, overwritePreset, clearAllPresets, loadPreset, setIsVolumeSelected }) => {
  const [addingPreset, setAddingPreset] = useState(false);

  const handlePresetClick = (index, preset) => {
    if (addingPreset && !preset) {
      savePreset();
      setAddingPreset(false);
    } else if (!preset) {
      alert('Preset empty, please select another or click Add Preset to save your current selection to this preset.');
    } else {
      setIsVolumeSelected(true);
      loadPreset(index);
    }
  };

  return (
    <div className="mt-4 grid grid-cols-4 gap-2 items-stretch">
      {presets.map((preset, index) => (
        <button
          key={index}
          className={`w-full h-12 p-2 border rounded-lg flex items-center justify-center text-xs md:text-sm ${preset ? "bg-green-500" : "bg-gray-300"} ${addingPreset && !preset ? "border-2 border-yellow-400" : ""}`}
          onClick={() => handlePresetClick(index, preset)}
          onContextMenu={(e) => {
            e.preventDefault();
            if (preset) {
              overwritePreset(index);
            }
          }}
        >
          {preset ? `Preset ${index + 1}` : "Empty"}
        </button>
      ))}
      <div className="col-span-4 mt-4 flex justify-between">
        <button
          className="bg-blue-500 text-white w-1/2 mr-2 h-12 p-2 border rounded-lg text-xs md:text-sm"
          onClick={() => setAddingPreset(!addingPreset)}
        >
          Add Preset
        </button>
        <button
          className="bg-red-500 text-white w-1/2 ml-2 h-12 p-2 border rounded-lg text-xs md:text-sm"
          onClick={clearAllPresets}
        >
          Clear All Presets
        </button>
      </div>
    </div>
  );
};

export default Presets;
