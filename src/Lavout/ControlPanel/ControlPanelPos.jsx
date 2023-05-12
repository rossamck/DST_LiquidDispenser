import React from "react";

const ControlPanelPos = ({ handleResetPositions }) => {
  return (
    <aside id="content" className="col-span-3 bg-gray-700 p-4 h-full">
      <div className="flex mx-2 mt-2 rounded-md bg-gray-800 relative tabs"></div>
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-white text-2xl mb-4">Position Control</h2>
        <div className="flex justify-center items-center">
          <button onClick={handleResetPositions} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Reset Positions
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ControlPanelPos;
