import React, { useState, useContext, useEffect, useCallback } from "react";
import { FiCheck } from "react-icons/fi";
import { WebSocketContext } from "../WebSocketContext/WebSocketContext";
import ConfigContext from "../../context/ModuleConfigContext";
import SelectedModulesContext from "../../context/SelectedModulesContext";

const ControlButtons = ({
  onButtonClick,
  onSelectWells,
  onSendWells,
  sendSelectionEnabled,
  selectedPlateId,
  setSelectedPlateId,
  isVolumeSelected,
  setIsVolumeSelected,
  setActiveWellPlate,
  setActiveSourceModule,
  setActiveWasteModule,
  activeWellPlate,
  activeSourceModule,
  activeWasteModule,
  
}) => {
  const [volume, setVolume] = useState("");
  const { sendMessage } = useContext(WebSocketContext);
  const [savedPositions, setSavedPositions] = useState([]);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const config = useContext(ConfigContext);
  const [selectedModules, setSelectedModules] = useContext(SelectedModulesContext);

  

  useEffect(() => {
    const savedPositionsData = localStorage.getItem("savedPositions");
    if (savedPositionsData) {
      const parsedPositions = JSON.parse(savedPositionsData);
      console.log("parsed positions: ", parsedPositions);
      setSavedPositions(parsedPositions);
    }
  }, []);

  useEffect(() => {
    // Print selectedModules when it updates
    console.log("Selected modules: ", selectedModules);
  }, [selectedModules]);

  const onSelectWellsClick = () => {
    if (volume <= 0) {
      alert("Please enter a positive volume.");
      return;
    }
    onSelectWells(volume);
    setIsVolumeSelected(true); // Set isVolumeSelected to true when volume is selected
  };

  const onSendWellsClick = () => {
    setIsVolumeSelected(false);
    onSendWells();
  };

  const onWellPlateButtonClick = (slotId, moduleId, moduleName) => {
    console.log(`Button clicked: Slot ID ${slotId + 1}, Module ID ${moduleId}, Module Name ${moduleName}`);
    setSelectedModules({
      ...selectedModules,
      wellPlate: { slotId, moduleId }
    });
    setSelectedPlateId(slotId);
    setActiveWellPlate(moduleId);  // Change this line
  };

  const onSourceButtonClick = (slotId, moduleId, moduleName) => {
    console.log(`Button clicked: Slot ID ${slotId + 1}, Module ID ${moduleId}, Module Name ${moduleName}`);
    setSelectedModules({
      ...selectedModules,
      source: { slotId, moduleId }
    });
    setActiveSourceModule(moduleId);
  };
  
  const onWasteButtonClick = (slotId, moduleId, moduleName) => {
    console.log(`Button clicked: Slot ID ${slotId + 1}, Module ID ${moduleId}, Module Name ${moduleName}`);
    setSelectedModules({
      ...selectedModules,
      waste: { slotId, moduleId }
    });
    setActiveWasteModule(moduleId);
  };
  

const filterPositions = useCallback((positions) => {
    return positions
      .map((position) => {
        const moduleConfigEntry = Object.entries(config.data).find(
          ([, module]) => module.moduleId === position.moduleId
        );
  
        if (moduleConfigEntry) {
          const [moduleName, moduleConfig] = moduleConfigEntry;
          if (moduleConfig.isWellPlate || moduleConfig.isSource || moduleConfig.isWaste) {
            return { ...position, moduleName, ...moduleConfig };
          }
        }
  
        return null;
      })
      .filter(Boolean);
  }, [config]); 


  useEffect(() => {
    if (savedPositions.length > 0) {
      const filtered = filterPositions(savedPositions);
      console.log("Filtered: ", filtered);
      setFilteredPositions(filtered);
    }
  }, [savedPositions, filterPositions]); 


  

  return (
    <div className="flex flex-col items-center justify-between h-full">
      <div className="number-input-select flex items-stretch">
        <div className="relative flex-grow flex-shrink-0">
          <NumberInput
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l-none rounded-r ml-0 flex items-center"
          onClick={onSelectWellsClick}
        >
          <FiCheck className="h-full" />
        </button>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
        onClick={() => {
          onButtonClick("clearWellsButton");
          setIsVolumeSelected(false);
        }}
      >
        Clear All Wells
      </button>

      <button
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 ${
          isVolumeSelected ? "" : "opacity-50 cursor-not-allowed"
        }`}
        onClick={isVolumeSelected ? onSendWellsClick : undefined}
        disabled={!isVolumeSelected}
      >
        Send Selection
      </button>

      <button
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
        onClick={() => sendMessage("emergencyStop")}
      >
        STOP
      </button>
      <hr className="border-gray-300 mt-4 w-full" />
    <div className="flex flex-col items-center justify-center">
      {filteredPositions.length > 0 ? (
        <>
                <h3 className="text-white font-bold mt-3 mb-3">
        Available Modules:
      </h3>
      <div className="flex">
        <ul className="mr-4">
          <h4 className="text-white font-bold mb-2">Well Plates:</h4>
          {filteredPositions.filter(pos => pos.isWellPlate).map((position, index) => (
  <li key={position.slotId}>
    <button
      className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2 w-full ${
        selectedModules.wellPlate && selectedModules.wellPlate.slotId === position.slotId ? "opacity-50" : ""
      }`}
      onClick={() =>
        onWellPlateButtonClick(
          position.slotId,
          position.moduleId,
          position.moduleName
        )
      }
    >
      {position.moduleName} ({position.slotId + 1})
    </button>
  </li>
))}
        </ul>
        <ul className="mr-4">
          <h4 className="text-white font-bold mb-2">Source Modules:</h4>
          <li>
    <button
        className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2 w-full ${
          selectedModules.source && selectedModules.source.slotId === -1 ? "opacity-50" : ""
        }`}
        onClick={() =>
          onSourceButtonClick(
            -1,
            3,
            "Default Source"
          )
        }
    >
      Default Source
    </button>
  </li>
          {filteredPositions.filter(pos => pos.isSource).map((position, index) => (
            <li key={position.slotId}>
<button
  className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2 w-full ${
    selectedModules.source && selectedModules.source.slotId === position.slotId ? "opacity-50" : ""
  }`}
  onClick={() =>
    onSourceButtonClick(
      position.slotId,
      position.moduleId,
      position.moduleName
    )
  }
>
  {position.moduleName} ({position.slotId + 1})
</button>

            </li>
          ))}
 
        </ul>
        <ul>
          <h4 className="text-white font-bold mb-2">Waste Modules:</h4>
          {filteredPositions.filter(pos => pos.isWaste).map((position, index) => (
            <li key={position.slotId}>
<button
  className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2 w-full ${
    selectedModules.waste && selectedModules.waste.slotId === position.slotId ? "opacity-50" : ""
  }`}
  onClick={() =>
    onWasteButtonClick(
      position.slotId,
      position.moduleId,
      position.moduleName
    )
  }
>
  {position.moduleName} ({position.slotId + 1})
</button>

              </li>
          ))}
          </ul>
          </div>
        </>
      ) : (
        <h3 className="text-white font-bold mt-3 mb-3">
          Please select modules before proceeding
        </h3>
      )}
    </div>
  </div>
);
};

export default ControlButtons;

const NumberInput = ({ value, onChange }) => {
  return (
    <div className="relative w-full">
      <input
        type="number"
        step="0.1"
        value={value}
        onChange={onChange}
        placeholder="Enter volume (μL)"
        className="border rounded px-3 py-2 pr-7"
      />
      <p className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-700">
        μL
      </p>
    </div>
  );
};
