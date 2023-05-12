import React from "react";

const PositionsContext = React.createContext({
  savedPositions: [],
  setSavedPositions: () => {},
});

export default PositionsContext;
