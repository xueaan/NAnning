const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const database = require('./services/database');

let mainWindow;

const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';
const isWindows = process.platform === 'win32';

if (isWindows) {
  app.setAppUserModelId('com.nanning.app');
}

// Enforce single instance
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

function createWindow() {
  const windowOptions = {
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    hasShadow: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: !isDev
    },
    show: false
  };

  if (isMac) {
    Object.assign(windowOptions, {
      transparent: true,
      vibrancy: 'under-window',
      visualEffectState: 'active',
      titleBarStyle: 'hiddenInset',
      backgroundColor: '#00000000'
    });
  } else {
    windowOptions.backgroundColor = '#111111';
  }

  mainWindow = new BrowserWindow(windowOptions);

  const emitMaximizeState = () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('window:maximized-change', mainWindow.isMaximized());
    }
  };

  const emitFocusState = (focused) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('window:focus-change', Boolean(focused));
    }
  };

  mainWindow.on('maximize', emitMaximizeState);
  mainWindow.on('unmaximize', emitMaximizeState);
  mainWindow.on('enter-full-screen', emitMaximizeState);
  mainWindow.on('leave-full-screen', emitMaximizeState);
  mainWindow.on('focus', () => emitFocusState(true));
  mainWindow.on('blur', () => emitFocusState(false));

  // Show window only when the renderer is ready
  mainWindow.once('ready-to-show', () => {
    emitMaximizeState();
    emitFocusState(mainWindow.isFocused());
    mainWindow.show();
  });

  if (isDev) {
    // Connect to the running Next.js dev server
    mainWindow.loadURL('http://localhost:3004');
    mainWindow.webContents.once('dom-ready', () => {
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../out/index.html'));
  }

  // Redirect attempts to open new windows externally
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
  mainWindow.webContents.on('will-navigate', (event, url) => {
    const devOrigin = 'http://localhost:3004';
    const isAllowed = isDev ? url.startsWith(devOrigin) : url.startsWith('file://');
    if (!isAllowed) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function resolveUserDataPath(targetPath) {
  const userDataPath = path.resolve(app.getPath('userData'));

  if (typeof targetPath !== 'string') {
    throw new Error('Invalid path');
  }

  const sanitizedPath = targetPath.trim();

  if (sanitizedPath.length === 0) {
    throw new Error('Invalid path');
  }

  const candidatePath = path.resolve(
    path.isAbsolute(sanitizedPath) ? sanitizedPath : path.join(userDataPath, sanitizedPath)
  );

  const normalizedBase = path.normalize(userDataPath);
  const normalizedCandidate = path.normalize(candidatePath);
  const baseForComparison = isWindows ? normalizedBase.toLowerCase() : normalizedBase;
  const candidateForComparison = isWindows ? normalizedCandidate.toLowerCase() : normalizedCandidate;
  const relative = path.relative(baseForComparison, candidateForComparison);

  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error('Access denied');
  }

  return normalizedCandidate;
}

app.whenReady().then(() => {
  // Initialize the local database before creating windows
  try {
    database.init();
  } catch (error) {
    console.error('Failed to initialize database:', error);
    app.quit();
    return;
  }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on('second-instance', (_event, _argv, _cwd) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
});

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});


app.on('before-quit', () => {
  database.close();
});

// IPC wiring

// Window controls

ipcMain.handle('window:minimize', () => {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return false;
  }
  mainWindow.minimize();
  return true;
});

ipcMain.handle('window:maximize', () => {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return false;
  }
  if (mainWindow.isMaximized()) {
    mainWindow.restore();
  } else {
    mainWindow.maximize();
  }
  return mainWindow.isMaximized();
});

ipcMain.handle('window:close', () => {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return false;
  }
  mainWindow.close();
  return true;
});

ipcMain.handle('window:toggle-fullscreen', () => {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return false;
  }
  mainWindow.setFullScreen(!mainWindow.isFullScreen());
  return mainWindow.isFullScreen();
});

ipcMain.handle('window:is-maximized', () => {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return false;
  }
  return mainWindow.isMaximized();
});

ipcMain.handle('window:is-focused', () => {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return false;
  }
  return mainWindow.isFocused();
});

// App info
ipcMain.handle('app:get-version', () => {
  return app.getVersion();
});

// Database methods
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
    const results = database.searchDocumentsFts(query);
    return { success: true, data: results };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// File system helpers
ipcMain.handle('fs:read-file', async (_event, filePath) => {
  try {
    const target = resolveUserDataPath(filePath);
    const content = await fs.readFile(target, 'utf-8');
    return { success: true, data: content };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('fs:write-file', async (_event, filePath, content) => {
  try {
    const target = resolveUserDataPath(filePath);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, content, 'utf-8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('fs:exists', async (_event, filePath) => {
  try {
    const target = resolveUserDataPath(filePath);
    await fs.access(target);
    return { success: true, exists: true };
  } catch (error) {
    const code = typeof error === 'object' && error ? error.code : undefined;
    if (error && (error.message === 'Access denied' || code === 'ENOENT' || code === 'EACCES' || code === 'EPERM')) {
      return { success: true, exists: false };
    }
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, exists: false, error: message };
  }
});

// System actions
ipcMain.handle('system:open-external', async (event, url) => {
  try {
    await shell.openExternal(url);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('system:show-item-in-folder', async (event, filePath) => {
  try {
    shell.showItemInFolder(path.resolve(filePath));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Theme management
ipcMain.handle('theme:save', async (event, theme) => {
  try {
    const result = database.saveTheme(theme);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('theme:get', async (event, id) => {
  try {
    const theme = database.getTheme(id);
    return { success: true, data: theme };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('theme:get-all', async () => {
  try {
    const themes = database.getAllThemes();
    return { success: true, data: themes };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('theme:delete', async (event, id) => {
  try {
    const result = database.deleteTheme(id);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

