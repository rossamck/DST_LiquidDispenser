import React, { useContext } from "react";
import AxisContext from "../../AxisContext";

const MotorPositionXYVisual = ({ receivedCoords, size = 500 }) => {
  const axisLimits = useContext(AxisContext);
  const radius = 8;

  const svgSize = size + 2 * radius;

  // ratio to scale position of the circle
  const xRatio = size / (axisLimits.x.max - axisLimits.x.min);
  const yRatio = size / (axisLimits.y.max - axisLimits.y.min);

  const xPos = (receivedCoords.xPos - axisLimits.x.min) * xRatio + radius;
  // flip the y-axis
  const yPos = svgSize - (receivedCoords.yPos - axisLimits.y.min) * yRatio - radius;

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
      <circle cx={xPos} cy={yPos} r={radius} fill="red" />
    </svg>
  );
};

export default MotorPositionXYVisual;
