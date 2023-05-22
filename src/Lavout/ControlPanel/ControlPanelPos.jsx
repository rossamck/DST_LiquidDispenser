import React, { useState, useContext } from "react";
import { Modal } from 'react-responsive-modal';
import ConfigContext from "../../context/ModuleConfigContext";
import IsElectronContext from "../../context/IsElectronContext";

const ControlPanelPos = ({ handleResetPositions, handleSavePositions }) => {
  const config = useContext(ConfigContext);
  const isElectron = useContext(IsElectronContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [configText, setConfigText] = useState(JSON.stringify(config, null, 2));

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditConfig = () => {
    setConfigText(JSON.stringify(config.data, null, 2));
    handleOpenModal();
  };

  const handleConfigTextChange = (event) => {
    setConfigText(event.target.value);
  };

  const handleSaveConfig = () => {
    if (!window.require) return;
    const { ipcRenderer } = window.require('electron');
    try {
      const newConfig = JSON.parse(configText);
      ipcRenderer.invoke('edit-config', newConfig);
      handleCloseModal();
    } catch (error) {
      console.error("Invalid JSON", error);
    }
  };

  return (
    <aside id="content" className="col-span-3 bg-gray-700 p-4 h-full">
      <div className="flex mx-2 mt-2 rounded-md bg-gray-800 relative tabs"></div>
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-white text-2xl mb-4">Position Control</h2>
        <div className="flex justify-center items-center mb-4">
          <button onClick={handleResetPositions} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
            Reset Positions
          </button>
          <button onClick={handleSavePositions} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Save Positions
          </button>
        </div>
        {isElectron && (
          <div className="flex justify-center items-center">
            <button onClick={handleEditConfig} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Edit Config
            </button>
          </div>
        )}
      </div>
      <Modal 
        open={isModalOpen} 
        onClose={handleCloseModal}
        styles={{
          modal: {
            width: '90%', // Use 'width' instead of 'maxWidth'
            height: '90%',
            padding: '20px', // Add some padding to create extra space
          },
        }}
      >
        <textarea 
          value={configText} 
          onChange={handleConfigTextChange} 
          style={{ width: "100%", height: "80%" }} 
        />
        <button 
          onClick={handleSaveConfig} 
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Save
        </button>
      </Modal>
    </aside>
  );
};

export default ControlPanelPos;
