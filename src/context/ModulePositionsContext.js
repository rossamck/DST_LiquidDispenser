import React from "react";

const ModulePositionsContext = React.createContext({
  savedPositions: [],
  setSavedPositions: () => {},
});

export default ModulePositionsContext;
