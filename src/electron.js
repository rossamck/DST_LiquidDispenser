const express = require('express');
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const fs = require('fs');
const path = require('path');

ipcMain.handle('read-config', async (event, args) => {
  console.log("Testing handle!");
  
  let configPath;

  if (app.isPackaged) {
    // If running from a package, use the resources directory in the ASAR
    configPath = path.join(process.resourcesPath, 'app.asar', 'build', 'ModuleConfig.json');
  } else {
    // If running in development, use the local path
    configPath = path.join(__dirname, 'src/configuration/ModuleConfig.json');
  }

  // Check if the config file exists
  if (!fs.existsSync(configPath)) {
    throw new Error(`Config file not found: ${configPath}`);
  }

  // Read the config file
  const rawData = fs.readFileSync(configPath);
  const data = JSON.parse(rawData);

  return data;
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
  win.webContents.send('ready');

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
