const express = require('express');
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const fs = require('fs-extra');
const path = require('path');

ipcMain.handle('read-config', async (event, args) => {
  console.log("Testing handle!");
  
  let userDataConfigPath = path.join(app.getPath('userData'), 'ModuleConfig.json');
  console.log("User data config file path:", userDataConfigPath);

  // Check if the config file exists in user data directory
  if (!fs.existsSync(userDataConfigPath)) {
    console.log("Config file not found in user data directory. Copying from app resources...");

    let appConfigPath;
    
    if (app.isPackaged) {
      // If running from a package, use the resources directory in the ASAR
      console.log("Running as packaged app");
      appConfigPath = path.join(process.resourcesPath, 'app.asar', 'build', 'configuration', 'ModuleConfig.json');
    } else {
      // If running in development, use the local path
      console.log("Running in dev mode");
      appConfigPath = path.join(__dirname, 'src/configuration/ModuleConfig.json');
    }

    console.log("App config file path:", appConfigPath);
  
    // Check if the config file exists in app resources
    if (!fs.existsSync(appConfigPath)) {
      throw new Error(`Config file not found in app resources: ${appConfigPath}`);
    }
    
    console.log("Config file exists in app resources!");
    
    // Copy the config file from app resources to user data directory
    fs.copySync(appConfigPath, userDataConfigPath);
    console.log("Config file copied successfully!");
  }

  console.log("Reading config file from user data directory...");

  // Read the config file
  const rawData = fs.readFileSync(userDataConfigPath);
  const data = JSON.parse(rawData);

  console.log("Config file loaded successfully!");

  return { data, path: userDataConfigPath };
});

const server = express();
server.use(express.static(`${__dirname}/../build`));
server.listen(3000);

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.maximize();
  win.loadURL('http://localhost:3000');
}

app.whenReady().then(() => {
  // Emit 'ready' event when Electron app is ready
  autoUpdater.checkForUpdatesAndNotify();
  createWindow();
});

autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update available',
    message: 'A new version of the app is available. Do you want to update now?',
    buttons: ['Update', 'Later']
  }).then(result => {
    let buttonIndex = result.response;
    if (buttonIndex === 0) {
      autoUpdater.downloadUpdate();
    }
  });
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update ready',
    message: 'Install and restart now?',
    buttons: ['Yes', 'Later']
  }).then(result => {
    let buttonIndex = result.response;
    if (buttonIndex === 0) {
      autoUpdater.quitAndInstall(false, true);
    }
  });
});
