import React, { useContext } from "react";
import AxisContext from "../../AxisContext";

const MotorPositionZVisual = ({ receivedCoords, size = 500 }) => {
  const axisLimits = useContext(AxisContext);
  const radius = 8;

  const svgSize = size + 2 * radius;

  // ratio to scale position of the circle
  const zRatio = size / (axisLimits.z.max - axisLimits.z.min);

  const zPos = (receivedCoords.zPos - axisLimits.z.min) * zRatio + radius;

  return (
    <svg width={svgSize} height={svgSize}>
      <rect
        x={radius}
        y={radius}
        width={size}
        height={size}
        stroke="black"
        strokeWidth={3}
        fill="transparent"
      />
      <circle cx={radius} cy={zPos} r={radius} fill="blue" />
    </svg>
  );
};

export default MotorPositionZVisual;
