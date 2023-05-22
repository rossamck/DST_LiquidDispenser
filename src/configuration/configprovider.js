// configProvider.js

import defaultConfig from "./ModuleConfig.json";

const getConfig = () => {
    // Check if running in Electron
    if (window && window.process && window.process.type) {
      console.log("Running in electron!");
      const { ipcRenderer } = window.require("electron");
      return ipcRenderer.invoke('read-config').then(result => ({
        data: result.data,
        path: result.path,
      }));
    } 
  
    else {
    // Default to returning the JSON config
    console.log("Running in browser!");

    console.log("Default config = ", defaultConfig);
    
    // Return a Promise that resolves with the defaultConfig
    return Promise.resolve({
      data: defaultConfig,
      path: null,
    });    }
  };
  

export default getConfig;
