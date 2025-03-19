// const { contextBridge, ipcRenderer } = require('electron');

// contextBridge.exposeInMainWorld('api', {
//   startServer: () => ipcRenderer.invoke('start-server')
// });

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  startServer: (dbConfig) => ipcRenderer.invoke('start-server', dbConfig)
});
