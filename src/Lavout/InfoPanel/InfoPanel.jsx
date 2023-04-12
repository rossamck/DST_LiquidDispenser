// InfoPanel.jsx

import React from 'react';
import WellStatusTable from '../../components/WellStatusTable/WellStatusTable';

const InfoPanel = ({ selectedWells, dispensingWell, completedWells }) => {
    return (
      <aside className="h-64 p-4 bg-white overflow-hidden">
        <h2 className="text-xl font-semibold mb-4">Well Information</h2>
        <div className="w-full max-h-[calc(100%-2rem)] overflow-y-auto">
          <WellStatusTable
            selectedWells={selectedWells}
            dispensingWell={dispensingWell}
            completedWells={completedWells}
         />
        </div>
      </aside>
    );
  };

export default InfoPanel;


