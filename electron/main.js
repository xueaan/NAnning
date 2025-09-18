const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const database = require('./services/database');

let mainWindow;

const isDev = process.env.NODE_ENV !== 'production';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    frame: false, // 无边框窗口
    transparent: true, // 透明背景
    hasShadow: true,
    vibrancy: 'under-window', // macOS 毛玻璃效果
    visualEffectState: 'active',
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false
    },
    backgroundColor: '#00000000', // 完全透明
    show: false // 先不显示，等待ready
  });

  // 窗口准备好后显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // 加载应用
  if (isDev) {
    // 直接加载已经运行的 Next.js 服务器
    mainWindow.loadURL('http://localhost:3004');
    // 开发环境下打开 DevTools，但不影响内容安全策略
    mainWindow.webContents.once('dom-ready', () => {
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../out/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // 初始化数据库
  database.init();

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // 关闭数据库连接
    database.close();
    app.quit();
  }
});

// IPC 处理器

// 窗口控制
ipcMain.handle('window:minimize', () => {
  mainWindow.minimize();
});

ipcMain.handle('window:maximize', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.restore();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.handle('window:close', () => {
  mainWindow.close();
});

ipcMain.handle('window:toggle-fullscreen', () => {
  mainWindow.setFullScreen(!mainWindow.isFullScreen());
});

ipcMain.handle('window:is-maximized', () => {
  return mainWindow.isMaximized();
});

// 应用信息
ipcMain.handle('app:get-version', () => {
  return app.getVersion();
});

// 数据库操作
ipcMain.handle('db:create-document', async (event, doc) => {
  try {
    const result = database.createDocument(doc);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db:update-document', async (event, id, updates) => {
  try {
    const result = database.updateDocument(id, updates);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db:get-document', async (event, id) => {
  try {
    const doc = database.getDocument(id);
    return { success: true, data: doc };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db:get-all-documents', async () => {
  try {
    const docs = database.getAllDocuments();
    return { success: true, data: docs };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db:search-documents', async (event, query) => {
  try {
    const results = database.searchDocuments(query);
    return { success: true, data: results };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// 文件系统操作
ipcMain.handle('fs:read-file', async (event, filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return { success: true, data: content };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('fs:write-file', async (event, filePath, content) => {
  try {
    await fs.writeFile(filePath, content, 'utf-8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('fs:exists', async (event, filePath) => {
  try {
    await fs.access(filePath);
    return { success: true, exists: true };
  } catch {
    return { success: true, exists: false };
  }
});