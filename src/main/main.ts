/* eslint-disable global-require */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { simpleGit } from 'simple-git';
import fs from 'fs';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('message', (event, arg) => {
  console.log(arg);
});

ipcMain.handle('clone', async (event, arg) => {
  const git = simpleGit();
  try {
    const dir = '/Users/tereza/Downloads/repo';
    let filesLength = 0;
    fs.readdir(dir, (_, files) => {
      filesLength = files.length;
    });
    if (filesLength === 0) {
      await git.clone(`${arg.repoPath}`, arg.path);
      return 'Repository cloned';
    }
    throw new Error('Directory is not empty');
  } catch (err) {
    return err;
  }
});

const handleFileOpen = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory'],
  });
  if (canceled) {
    return null;
  }
  return filePaths[0];
};

ipcMain.on('clone-repository', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `Repository URL: ${pingPong}`;
  const git = simpleGit();
  try {
    const dir = '/Users/tereza/Downloads/repo';
    let filesLength = 0;
    fs.readdir(dir, (err, files) => {
      filesLength = files.length;
      if (err) {
        console.log(err);
      }
    });
    if (filesLength > 0) {
      await git.clone(`${arg}`, '/Users/tereza/Downloads/repo');
      await git.log();
      event.reply('clone-repository', msgTemplate('Repository cloned'));
    } else {
      event.reply('clone-repository', msgTemplate('Directory is not empty'));
    }
  } catch (err) {
    console.log(err);
    event.reply(
      'clone-repository',
      msgTemplate('Repository not cloned, something went wrong')
    );
  }
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  // eslint-disable-next-line promise/always-return
  .then(() => {
    ipcMain.handle('dialog:openFile', handleFileOpen);
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch((e) => console.log(e));
