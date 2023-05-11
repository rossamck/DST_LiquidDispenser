import React from 'react';

const LimitTab = ({ moveToLimit, isMoving }) => (
  <div className="text-center mt-4">
    <h2 className="text-white mb-2">Move to limit</h2>
    <div className="flex justify-center space-x-4">
      <button
        className="p-2 w-12 rounded bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-800 focus:outline-none"
        onClick={() => moveToLimit("X")}
        disabled={isMoving}
      >
        X
      </button>
      <button
        className="p-2 w-12 rounded bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-800 focus:outline-none"
        onClick={() => moveToLimit("Y")}
        disabled={isMoving}
      >
        Y
      </button>
      <button
        className="p-2 w-12 rounded bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-800 focus:outline-none"
        onClick={() => moveToLimit("Z")}
        disabled={isMoving}
      >
        Z
      </button>
    </div>
  </div>
);

export default LimitTab;
