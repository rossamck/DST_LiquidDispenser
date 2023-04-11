import React from "react";

const Presets = ({ presets, savePreset, overwritePreset, clearAllPresets, loadPreset }) => {
  return (
    <div className="mt-4 grid grid-cols-4 gap-2">
      {presets.map((preset, index) => (
        <button
          key={index}
          className={`w-full h-12 p-2 border rounded-lg ${preset ? "bg-green-500" : "bg-gray-300"}`}
          onClick={() => {
            if (preset) {
              loadPreset(index);
            } else {
              savePreset();
            }
          }}
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
        className="bg-blue-500 text-white w-1/2 mr-2 h-12 p-2 border rounded-lg"
        onClick={savePreset}
      >
        Add Preset
      </button>
      <button
        className="bg-red-500 text-white w-1/2 ml-2 h-12 p-2 border rounded-lg"
        onClick={clearAllPresets}
      >
        Clear All Presets
      </button>
    </div>
    </div>
  );
};

export default Presets;
