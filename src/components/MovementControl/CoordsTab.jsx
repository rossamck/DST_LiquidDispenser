// CoordsTab.jsx
import React, { useState } from 'react';

const CoordsTab = ({ onCoordinateSubmit }) => {
  const [xCoordinate, setXCoordinate] = useState(0);
  const [yCoordinate, setYCoordinate] = useState(0);

  return (
    <div className="text-center mt-4">
      <h2 className="text-white mb-2">Co-ordinate Entry</h2>
      <div className="flex justify-center flex-col">
        <div className="flex justify-center items-center mb-4">
          <div className="flex items-center">
            <label htmlFor="xCoordinate" className="mr-2 text-white">
              X:
            </label>
            <input
              type="number"
              id="xCoordinate"
              value={xCoordinate}
              onChange={(e) => setXCoordinate(parseInt(e.target.value) || 0)}
              className="border border-gray-300 p-1 rounded w-16"
            />
          </div>
          <div className="flex items-center ml-4">
            <label htmlFor="yCoordinate" className="mr-2 text-white">
              Y:
            </label>
            <input
              type="number"
              id="yCoordinate"
              value={yCoordinate}
              onChange={(e) => setYCoordinate(parseInt(e.target.value) || 0)}
              className="border border-gray-300 p-1 rounded w-16"
            />
          </div>
        </div>
        <div className="flex justify-center">
          <button
            className="mt-4 p-2 w-24 rounded bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-800 focus:outline-none"
            onClick={() => onCoordinateSubmit(xCoordinate, yCoordinate)}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoordsTab;
