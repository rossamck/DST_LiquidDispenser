import React, { useState, useCallback } from 'react';
import Layout from './Lavout/Layout';

function App() {
  const [action, setAction] = useState(null);
  const [actionVersion, setActionVersion] = useState(0);

  const handleButtonClick = useCallback((newAction) => {
    setAction(newAction);
    setActionVersion((prevVersion) => prevVersion + 1);
    console.log(`Button ${newAction} clicked`);
    console.log(`actionVersion: ${actionVersion + 1}`);
  }, [actionVersion]);

  const resetAction = useCallback(() => {
    setAction(null);
  }, []);

  return (
    <div className="App">
      <Layout
        onButtonClick={handleButtonClick}
        currentAction={action}
        actionVersion={actionVersion}
        onActionComplete={resetAction}
      />
    </div>
  );
}

export default App;
