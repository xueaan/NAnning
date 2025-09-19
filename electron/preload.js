const { contextBridge, ipcRenderer } = require('electron');

const windowApi = {
  minimize: () => ipcRenderer.invoke('window:minimize'),
  maximize: () => ipcRenderer.invoke('window:maximize'),
  close: () => ipcRenderer.invoke('window:close'),
  toggleFullScreen: () => ipcRenderer.invoke('window:toggle-fullscreen'),
  isMaximized: () => ipcRenderer.invoke('window:is-maximized'),
  isFocused: () => ipcRenderer.invoke('window:is-focused'),
  onMaximizedChange: (callback) => {
    if (typeof callback !== 'function') {
      return () => {};
    }
    const channel = 'window:maximized-change';
    const listener = (_event, state) => callback(Boolean(state));
    ipcRenderer.on(channel, listener);
    return () => ipcRenderer.removeListener(channel, listener);
  },
  onFocusChange: (callback) => {
    if (typeof callback !== 'function') {
      return () => {};
    }
    const channel = 'window:focus-change';
    const listener = (_event, state) => callback(Boolean(state));
    ipcRenderer.on(channel, listener);
    return () => ipcRenderer.removeListener(channel, listener);
  }
};

const api = {
  window: windowApi,
  getVersion: () => ipcRenderer.invoke('app:get-version'),
  fs: {
    readFile: (path) => ipcRenderer.invoke('fs:read-file', path),
    writeFile: (path, data) => ipcRenderer.invoke('fs:write-file', path, data),
    exists: (path) => ipcRenderer.invoke('fs:exists', path)
  },
  db: {
    createDocument: (doc) => ipcRenderer.invoke('db:create-document', doc),
    updateDocument: (id, updates) => ipcRenderer.invoke('db:update-document', id, updates),
    getDocument: (id) => ipcRenderer.invoke('db:get-document', id),
    getAllDocuments: () => ipcRenderer.invoke('db:get-all-documents'),
    searchDocuments: (query) => ipcRenderer.invoke('db:search-documents', query)
  },
  system: {
    openExternal: (url) => ipcRenderer.invoke('system:open-external', url),
    showItemInFolder: (path) => ipcRenderer.invoke('system:show-item-in-folder', path)
  },
  on: (channel, callback) => {
    const validChannels = [
      'theme-changed',
      'file-changed',
      'update-available',
      'window:maximized-change',
      'window:focus-change'
    ];
    if (validChannels.includes(channel) && typeof callback === 'function') {
      const listener = (_event, ...args) => callback(...args);
      ipcRenderer.on(channel, listener);
      return () => ipcRenderer.removeListener(channel, listener);
    }
    return () => {};
  },
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
};

contextBridge.exposeInMainWorld('electron', api);
