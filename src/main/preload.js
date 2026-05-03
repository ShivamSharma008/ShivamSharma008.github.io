const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ster', {
  getDefaultTester: () => ipcRenderer.invoke('app:getDefaultTester'),
  startSession: (meta) => ipcRenderer.invoke('session:start', meta),
  capture: () => ipcRenderer.invoke('session:capture'),
  updateStep: (id, patch) => ipcRenderer.invoke('session:updateStep', id, patch),
  deleteStep: (id) => ipcRenderer.invoke('session:deleteStep', id),
  getSession: () => ipcRenderer.invoke('session:get'),
  endSession: () => ipcRenderer.invoke('session:end'),
  onUpdate: (cb) => ipcRenderer.on('session:update', (_e, payload) => cb(payload))
});

