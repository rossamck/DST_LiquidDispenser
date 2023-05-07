import React from "react";

const AxesNetValuesTable = ({ axesNetValues }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Axes Net Values:</h2>
      <table className="w-full table-auto border-collapse border border-gray-300 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-2 border-b border-gray-200 font-semibold text-left">Axis</th>
            <th className="py-3 px-2 border-b border-gray-200 font-semibold text-left">Value</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {Object.entries(axesNetValues).map(([key, value], index) => (
            <tr key={key} className={`${index % 2 === 0 ? "bg-gray-50" : ""}`}>
              <td className="py-2 px-2 border-b border-gray-200">{key}</td>
              <td className="py-2 px-2 border-b border-gray-200">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AxesNetValuesTable;
