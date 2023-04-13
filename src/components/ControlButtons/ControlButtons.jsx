import React, { useState, useContext } from "react";
import { FiCheck } from "react-icons/fi";
import { WebSocketContext } from "../WebSocketContext/WebSocketContext";

const ControlButtons = ({
  onButtonClick,
  onSelectWells,
  onSendWells,
  startDispensingEnabled,
  setStartDispensingEnabled,
  sendSelectionEnabled,
}) => {
  const [volume, setVolume] = useState("");
  const { sendMessage } = useContext(WebSocketContext);

  const onStartDispensingClick = () => {
    // Start dispensing process
    setStartDispensingEnabled(false);
    sendMessage("startDispensing");
    console.log("Start dispensing");
  };

  const onSelectWellsClick = () => {
    if (volume <= 0) {
      alert("Please enter a positive volume.");
      return;
    }
    onSelectWells(volume);
  };

  const onSendWellsClick = () => {
    onSendWells();
  };

  return (
    <div className="flex flex-col items-center">
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
        onClick={() => onButtonClick("clearWellsButton")}
      >
        Clear All Wells
      </button>

      <button
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 ${
          sendSelectionEnabled ? "" : "opacity-50 cursor-not-allowed"
        }`}
        onClick={sendSelectionEnabled ? onSendWellsClick : undefined}
        disabled={!sendSelectionEnabled}
      >
        Send Selection
      </button>
      <button
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 ${
          startDispensingEnabled ? "" : "opacity-50 cursor-not-allowed"
        }`}
        onClick={startDispensingEnabled ? onStartDispensingClick : undefined}
        disabled={!startDispensingEnabled}
      >
        Start Dispensing
      </button>
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




