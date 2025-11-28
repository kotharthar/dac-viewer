const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  readFile: () => ipcRenderer.invoke('read-file'),
  saveFile: (data) => ipcRenderer.invoke('save-file', data),
  capturePage: (rect) => ipcRenderer.invoke('capture-page', rect)
});
