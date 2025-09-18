const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的 API 到渲染进程
contextBridge.exposeInMainWorld('electron', {
  // 窗口控制
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
    toggleFullScreen: () => ipcRenderer.invoke('window:toggle-fullscreen'),
    isMaximized: () => ipcRenderer.invoke('window:is-maximized'),
  },

  // 应用信息
  getVersion: () => ipcRenderer.invoke('app:get-version'),

  // 文件系统
  fs: {
    readFile: (path) => ipcRenderer.invoke('fs:read-file', path),
    writeFile: (path, data) => ipcRenderer.invoke('fs:write-file', path, data),
    exists: (path) => ipcRenderer.invoke('fs:exists', path),
  },

  // 数据库操作
  db: {
    createDocument: (doc) => ipcRenderer.invoke('db:create-document', doc),
    updateDocument: (id, updates) => ipcRenderer.invoke('db:update-document', id, updates),
    getDocument: (id) => ipcRenderer.invoke('db:get-document', id),
    getAllDocuments: () => ipcRenderer.invoke('db:get-all-documents'),
    searchDocuments: (query) => ipcRenderer.invoke('db:search-documents', query),
  },

  // 系统操作
  system: {
    openExternal: (url) => ipcRenderer.invoke('system:open-external', url),
    showItemInFolder: (path) => ipcRenderer.invoke('system:show-item-in-folder', path),
  },

  // 事件监听
  on: (channel, callback) => {
    const validChannels = ['theme-changed', 'file-changed', 'update-available'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },

  // 移除事件监听
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});