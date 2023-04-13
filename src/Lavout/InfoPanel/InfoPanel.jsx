// InfoPanel.jsx

import React from 'react';
import WellStatusTable from '../../components/WellStatusTable/WellStatusTable';

const InfoPanel = ({ className, selectedWells, dispensingWell, completedWells }) => {
  
  return (
    <aside className={`p-4 bg-white overflow-y-hidden ${className} custom-info-panel`} style={{ height: "100%" }}>
    <h2 className="text-xl font-semibold mb-4">Well Information</h2>
    <div className="w-full h-[calc(100vh-10.75rem)] flex-col pb-8"> 
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
