// ControlButtons.jsx

import React, { useState } from 'react';

const ControlButtons = ({ onButtonClick, onSelectWells, onSendWells }) => {
  const [volume, setVolume] = useState('');

  const onSelectWellsClick = () => {
    if (volume <= 0) {
      alert('Please enter a positive volume.');
      return;
    }
    onSelectWells(volume);
  };


  const onSendWellsClick = () => {
    onSendWells();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex flex-row items-center">
        <div className="relative flex-grow flex-shrink-0">
          <NumberInput value={volume} onChange={(e) => setVolume(e.target.value)} />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
          onClick={onSelectWellsClick}
        >
          Select
        </button>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
        onClick={() => onButtonClick('clearWellsButton')}
      >
        Clear All Wells
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
        onClick={onSendWellsClick}
      >
        Send Selection
      </button>
    </div>
  );
};


export default ControlButtons;




const NumberInput = ({ value, onChange }) => {
  return (
    <div className="relative">
      <input
        type="number"
        step="0.1"
        value={value}
        onChange={onChange}
        placeholder="Enter volume (μL)"
        className="border rounded px-3 py-2 w-full pr-7"
      />
      <p className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-700">μL</p>
    </div>
  );
};
