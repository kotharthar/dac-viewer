const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

app.name = 'DAC Viewer';

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle('read-file', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'All Supported Files', extensions: ['mmd', 'txt', 'puml', 'plantuml'] },
      { name: 'Mermaid Files', extensions: ['mmd', 'txt'] },
      { name: 'PlantUML Files', extensions: ['puml', 'plantuml'] }
    ],
  });
  if (canceled) {
    return null;
  } else {
    const content = fs.readFileSync(filePaths[0], 'utf-8');
    return { path: filePaths[0], content };
  }
});

ipcMain.handle('save-file', async (event, { path: filePath, content }) => {
  if (filePath) {
    fs.writeFileSync(filePath, content);
    return { path: filePath };
  } else {
    const { canceled, filePath: savePath } = await dialog.showSaveDialog({
      filters: [
        { name: 'Mermaid Files', extensions: ['mmd'] },
        { name: 'PlantUML Files', extensions: ['puml'] }
      ],
    });
    if (canceled) {
      return null;
    } else {
      fs.writeFileSync(savePath, content);
      return { path: savePath };
    }
  }
});

ipcMain.handle('capture-page', async (event, { x, y, width, height }) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  const rect = {
    x: Math.round(x),
    y: Math.round(y),
    width: Math.round(width),
    height: Math.round(height)
  };

  const image = await win.webContents.capturePage(rect);
  const pngData = image.toPNG();

  const { canceled, filePath } = await dialog.showSaveDialog({
    filters: [{ name: 'Image', extensions: ['png'] }]
  });

  if (canceled) return null;

  fs.writeFileSync(filePath, pngData);
  return { path: filePath };
});
