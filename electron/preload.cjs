const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  readFile: () => ipcRenderer.invoke('read-file'),
  saveFile: (data) => ipcRenderer.invoke('save-file', data),
  saveFileAs: (data) => ipcRenderer.invoke('save-file-as', data),
  capturePage: (rect) => ipcRenderer.invoke('capture-page', rect)
});
