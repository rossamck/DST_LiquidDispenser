// ContentPos.jsx
import React, { useRef } from "react";
import ModuleContainer from "../../components/PositionModules/ModuleContainer";

const ContentPos = ({
  resetPositions,
  setResetPositions,
  savePositions,
  setSavePositions,
  

}) => {
  
  const contentRef = useRef();

  

  return (
    <div
      ref={contentRef}
      className="relative"
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}
    >
      <div style={{ width: `100%`, height: '100%' }}>
        <ModuleContainer 
        resetPositions={resetPositions}
        setResetPositions={setResetPositions}
        savePositions={savePositions}
        setSavePositions={setSavePositions}
        />
      </div>
    </div>
  );
};

export default ContentPos;