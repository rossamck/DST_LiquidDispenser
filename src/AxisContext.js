import React from "react";

const AxisContext = React.createContext({
  x: { min: 0, max: 2100 },
  y: { min: 0, max: 2400 },
  z: { min: 0, max: 500 },
  pip: { min: 0, max: 500 },
});

export default AxisContext;
