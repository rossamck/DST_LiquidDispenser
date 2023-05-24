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

ipcMain.handle('edit-config', async (event, newConfig) => {
  let userDataConfigPath = path.join(app.getPath('userData'), 'ModuleConfig.json');
  
  // Write new config to the file
  fs.writeFileSync(userDataConfigPath, JSON.stringify(newConfig, null, 2), 'utf-8');
});

ipcMain.handle('perform-reload', async () => {
  console.log("Running reload!");

  if (win) {
    win.webContents.executeJavaScript(`
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = 0;
      overlay.style.left = 0;
      overlay.style.right = 0;
      overlay.style.bottom = 0;
      overlay.style.background = '#ADD8E6';
      overlay.style.opacity = 0;
      overlay.style.transition = 'opacity 0.3s ease-in-out';
      overlay.style.display = 'flex';
      overlay.style.justifyContent = 'center';
      overlay.style.alignItems = 'center';
      overlay.style.zIndex = 9999999;
      overlay.id = 'reload-overlay';

      const loader = document.createElement('div');
      loader.style.border = '16px solid #f3f3f3';
      loader.style.borderRadius = '50%';
      loader.style.borderTop = '16px solid #3498db';
      loader.style.width = '120px';
      loader.style.height = '120px';
      loader.style.animation = 'spin 2s linear infinite';

      const style = document.createElement('style');
      style.textContent = \`@keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }\`;
      document.head.appendChild(style);

      overlay.appendChild(loader);
      document.body.appendChild(overlay);

      setTimeout(() => {
        overlay.style.opacity = 1;
      }, 1);

      void 0;
    `).catch(error => console.error('Error executing JavaScript:', error));
    
    setTimeout(() => {
      win.reload();
    }, 500);
  } else {
    console.error('Window is not defined!');
  }
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
