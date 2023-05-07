import React from "react";

const MovementInfo = ({ buttonPressCounts }) => {
  const axisMapping = {
    up: "Y+",
    down: "Y-",
    left: "X-",
    right: "X+",
    pageUp: "Z+",
    pageDown: "Z-",
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Button Press Counts:</h2>
      <table className="w-full table-auto border-collapse border border-gray-300 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-2 border-b border-gray-200 font-semibold text-left">Axis</th>
            <th className="py-3 px-2 border-b border-gray-200 font-semibold text-left">Count</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {Object.entries(buttonPressCounts).map(([key, count], index) => (
            <tr key={key} className={`${index % 2 === 0 ? "bg-gray-50" : ""}`}>
              <td className="py-2 px-2 border-b border-gray-200">{axisMapping[key]}</td>
              <td className="py-2 px-2 border-b border-gray-200">{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MovementInfo;
