// SidePanel.jsx

import React, { useState } from "react";
import ControlButtons from "../../components/ControlButtons/ControlButtons";
import clsx from "clsx";
import "./SidePanel.css";
import Presets from "../../components/Presets/Presets";

const SidePanel = ({
  onButtonClick,
  onSendWells,
  savePreset,
  overwritePreset,
  clearAllPresets,
  loadPreset,
  presets,
  startDispensingEnabled,
  setStartDispensingEnabled,
  sendSelectionEnabled,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabSelect = (index) => {
    setActiveTab(index);
  };

  const tabs = [
    {
      label: "Controls",
      content: (
        <div className="mt-4">
          <ControlButtons
            onButtonClick={onButtonClick}
            onSelectWells={(volume) => onButtonClick("selectWellsButton", volume)}
            onSendWells={onSendWells}
            startDispensingEnabled={startDispensingEnabled}
            setStartDispensingEnabled={setStartDispensingEnabled}
            sendSelectionEnabled={sendSelectionEnabled}
          />
        </div>
      ),
      margin: "ml-2", // 20px left margin
    },
    {
      label: "Presets",
      content: (
        <Presets
          presets={presets}
          savePreset={savePreset}
          overwritePreset={overwritePreset}
          clearAllPresets={clearAllPresets}
          loadPreset={loadPreset}
        />
      ),
      margin: "mx-auto", // Centered horizontally
    },
    {
      label: "Options",
      content: <p>Content for the third tab goes here</p>,
      margin: "mr-2", // 20px right margin
    },
  ];
  

  return (
    <aside id="content" className="col-span-3 bg-gray-700 p-4 h-1/2">
      <div className="flex mx-2 mt-2 rounded-md bg-gray-800 relative tabs">
        {tabs.map((tab, index) => (
 <button
 key={index}
 onClick={() => handleTabSelect(index)}
 className={clsx(
   "tabs-item custom-tab-width relative z-10 flex items-center justify-center py-1 my-2 text-center rounded-md text-sm cursor-pointer select-none focus:outline-none text-white",
   {
     active: activeTab === index,
     [tab.margin]: true, // Add margin class based on tab config
   }
 )}
>
 {tab.label}
</button>


        ))}
        <span
          className={clsx("tab-item-animate rounded-md bg-white", {
            active: activeTab === 0,
          })}
        ></span>
      </div>
      <div>{tabs[activeTab].content}</div>
    </aside>
  );
};

export default SidePanel;