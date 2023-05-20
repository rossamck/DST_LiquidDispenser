const express = require('express');
const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');

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
