import React from 'react';



const InfoPanelPos = ({ buttonPressCounts, axesNetValues }) => {
  return (
    <div className="p-4 bg-white overflow-y-hidden custom-info-panel" style={{ height: "100%" }}>
      <h2 className="text-xl font-semibold mb-4 ital underline underline-offset-8">Position Settings</h2>
      <div className="w-full h-[calc(100vh-10.75rem)] flex-col pb-8 overflow-y-scroll">
      </div>
    </div>
  );
};

export default InfoPanelPos;
