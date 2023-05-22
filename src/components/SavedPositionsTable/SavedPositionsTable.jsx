// SavedPositionsTable.jsx

import React, { useContext, useState, useEffect } from "react";
import ModulePositionsContext from "../../context/ModulePositionsContext";
import config from "../../configuration/ModuleConfig.json";

const SavedPositionsTable = () => {
  const { savedPositions } = useContext(ModulePositionsContext); // Consume savedPositions from the ModulePositionsContext

  const [modules, setModules] = useState([]);

  useEffect(() => {
    // Set modules state from the ModuleConfig.json data
    setModules(Object.entries(config).map(([name, moduleData]) => ({
      id: moduleData.moduleId,
      name: name
    })));
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Saved Positions:</h2>
      <table className="w-full table-auto border-collapse border border-gray-300 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-2 border-b border-gray-200 font-semibold text-left">Slot ID</th>
            <th className="py-3 px-2 border-b border-gray-200 font-semibold text-left">Module Name</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {savedPositions.map(({ slotId, moduleId }, index) => {
            const module = modules.find((m) => m.id === moduleId);
            if (!module) return null; // Skip rows where moduleId is null
            return (
              <tr key={slotId} className={`${index % 2 === 0 ? "bg-gray-50" : ""}`}>
                <td className="py-2 px-2 border-b border-gray-200">{slotId + 1}</td>
                <td className="py-2 px-2 border-b border-gray-200">{module.name}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SavedPositionsTable;

