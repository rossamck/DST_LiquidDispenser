import React from 'react';

const ControlButtons = ({ onButtonClick }) => {
  return (
    <div className="flex flex-col items-center">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => onButtonClick('selectWellsButton')}>
        Select Wells
      </button>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2" onClick={() => onButtonClick('clearWellsButton')}>
        Clear All Wells
      </button>
    </div>
  );
}

export default ControlButtons;
