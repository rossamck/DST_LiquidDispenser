import React, { useState, useContext, useEffect } from "react";
import { FiCheck } from "react-icons/fi";
import { WebSocketContext } from "../WebSocketContext/WebSocketContext";

const ControlButtons = ({
  onButtonClick,
  onSelectWells,
  onSendWells,
  sendSelectionEnabled,
  selectedPlateId,
  setSelectedPlateId,
  isVolumeSelected,
  setIsVolumeSelected,
}) => {
  const [volume, setVolume] = useState("");
  const { sendMessage } = useContext(WebSocketContext);
  const [savedPositions, setSavedPositions] = useState([]);

  useEffect(() => {
    const savedPositionsData = localStorage.getItem("savedPositions");
    if (savedPositionsData) {
      const parsedPositions = JSON.parse(savedPositionsData);
      setSavedPositions(parsedPositions);
    }
  }, []);

// New useEffect hook
useEffect(() => {
    const filteredPositions = savedPositions.filter(
      (position) => position.moduleId === 1
    );
    if (filteredPositions.length > 0) {
      setSelectedPlateId(filteredPositions[0].slotId);
    }
  }, [savedPositions, setSelectedPlateId]);




  const onSelectWellsClick = () => {
    if (volume <= 0) {
      alert("Please enter a positive volume.");
      return;
    }
    onSelectWells(volume);
    setIsVolumeSelected(true);  // Set isVolumeSelected to true when volume is selected
  };

  const onSendWellsClick = () => {
    setIsVolumeSelected(false);
    onSendWells();
  };

  const onWellPlateButtonClick = (slotId, moduleId) => {
    console.log(`Button clicked: Slot ID ${slotId + 1}, Module ID ${moduleId}`);
    setSelectedPlateId(slotId); // Update selected well plate
  };

  const filteredPositions = savedPositions.filter(
    (position) => position.moduleId === 1
  );

  useEffect(() => {
    if (filteredPositions.length > 0) {
      // setSelectedPlateId(filteredPositions[0].slotId); // Default to first well plate
    }
  }, [filteredPositions]);

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
              Available Well Plates:
            </h3>

            <ul>
              {filteredPositions.map((position, index) => (
                <li key={position.slotId}>
                  <button
                    className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2 ${
                      position.slotId === selectedPlateId ? "opacity-50" : ""
                    }`}
                    onClick={() =>
                      onWellPlateButtonClick(position.slotId, position.moduleId)
                    }
                  >
                    Wellplate ({position.slotId + 1})
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <h3 className="text-white font-bold mt-3 mb-3">
          Please select a well plate position
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
