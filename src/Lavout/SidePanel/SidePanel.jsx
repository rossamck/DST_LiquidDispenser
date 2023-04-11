// SidePanel.jsx

import React from 'react';
import ControlButtons from '../../components/ControlButtons/ControlButtons';

const SidePanel = ({ onButtonClick, onSendWells }) => {
    return (
      <aside id="content" className="col-span-3 bg-orange-300 p-4 h-1/2">
        <ControlButtons
          onButtonClick={onButtonClick}
          onSelectWells={(volume) => onButtonClick("selectWellsButton", volume)}
          onSendWells={onSendWells}
        />
        Aside content
      </aside>
    );
  };
  

export default SidePanel;


