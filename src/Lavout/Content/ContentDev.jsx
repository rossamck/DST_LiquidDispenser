// ContentDev.jsx
import React, { useRef } from "react";
import MotorPositionXYVisual from "../../components/MotorPositionVisual/MotorPositionXYVisual";
import MotorPositionZVisual from "../../components/MotorPositionVisual/MotorPositionZVisual";
import useResizeObserver from "../../hooks/useResizeObserver";

const ContentDev = ({ receivedCoords }) => {
  const contentRef = useRef();
  const dimensions = useResizeObserver(contentRef);
  const xysize = dimensions?.width ? dimensions.width * 0.65 : 500; // default to 500 if width is not available
  const zsize = dimensions?.width ? dimensions.width * 0.3 : 500; // default to 500 if width is not available

  return (
    <div
      ref={contentRef}
      className="relative"
      style={{ width: '100%' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <MotorPositionXYVisual receivedCoords={receivedCoords} size={xysize} />
        <MotorPositionZVisual receivedCoords={receivedCoords} size={zsize} />
      </div>
    </div>
  );
};


export default ContentDev;
