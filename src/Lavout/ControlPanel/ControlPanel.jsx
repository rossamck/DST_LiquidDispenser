import React, { useState, useContext } from "react";
import ControlButtons from "../../components/ControlButtons/ControlButtons";
import clsx from "clsx";
import "./ControlPanel.css";
import Presets from "../../components/Presets/Presets";
import IPAddressForm from "../../components/IPAddressForm/IPAddressForm";
import { WebSocketContext } from "../../components/WebSocketContext/WebSocketContext";


const ControlPanel = ({
  className,
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
  selectedPlateId,
  setSelectedPlateId,
  setActiveWellPlate,
  setActiveSourceModule,
  setActiveWasteModule,
  activeWellPlate,
  activeSourceModule,
  activeWasteModule,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isVolumeSelected, setIsVolumeSelected] = useState(false);
  const { sendMessage } = useContext(WebSocketContext);

  const handleCalibrateZAxis = () => {
    console.log("calibrate z");
    sendMessage(`moveToLimit:Z`, true);
  }

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
            selectedPlateId={selectedPlateId}
            setSelectedPlateId={setSelectedPlateId}
            isVolumeSelected={isVolumeSelected}
            setIsVolumeSelected={setIsVolumeSelected}
            setActiveWellPlate={setActiveWellPlate}
            setActiveSourceModule={setActiveSourceModule}
            setActiveWasteModule={setActiveWasteModule}
            activeWellPlate={activeWellPlate}
            activeSourceModule={activeSourceModule}
            activeWasteModule={activeWasteModule}
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
          setIsVolumeSelected={setIsVolumeSelected}
        />
      ),
      margin: "mx-auto", // Centered horizontally
    },
    {
      label: "Options",
      content: (
        <div className="mt-4">
          <IPAddressForm />
        </div>
      ),
      margin: "mr-2", // 20px right margin
    },
  ];

  return (
    <aside id="content" className="col-span-3 bg-gray-700 p-4 h-full">
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

      {activeTab === 2 && (
        <div className="mt-4">
          <button className="mt-4 p-2 w-24 rounded bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-800 focus:outline-none"
            onClick={() => handleCalibrateZAxis()}>
            Calibrate Z Axis
          </button>
        </div>
      )}
    </aside>
  );
};

export default ControlPanel;