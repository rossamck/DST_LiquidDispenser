import React from 'react';

import MovementInfo from '../../components/MovementInfo/MovementInfo';
import AxesNetValuesTable from '../../components/MovementInfo/AxesNetValuesTable';


const InfoPanelDev = ({ buttonPressCounts, axesNetValues }) => {
  return (
    <div className="p-4 bg-white overflow-y-hidden custom-info-panel" style={{ height: "100%" }}>
      <h2 className="text-xl font-semibold mb-4 ital underline underline-offset-8">Movement Info</h2>
      <div className="w-full h-[calc(100vh-10.75rem)] flex-col pb-8 overflow-y-scroll">
        <MovementInfo buttonPressCounts={buttonPressCounts} />
        <AxesNetValuesTable axesNetValues={axesNetValues} />
      </div>
    </div>
  );
};

export default InfoPanelDev;
