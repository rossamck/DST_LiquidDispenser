const express = require('express');
const { app, BrowserWindow } = require('electron');

const server = express();
server.use(express.static(`${__dirname}/../build`));
server.listen(3000);

function createWindow() {
  let win = new BrowserWindow({
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

app.whenReady().then(createWindow);
