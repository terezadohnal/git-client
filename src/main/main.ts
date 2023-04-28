/* eslint-disable global-require */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { SimpleGit, simpleGit, CommitResult } from 'simple-git';
import fs from 'fs';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { CHANELS } from '../constants';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.handle(CHANELS.CLONE, async (event, arg) => {
  const git: SimpleGit = simpleGit();
  try {
    const dir = arg.target;
    let filesLength = 0;
    fs.readdir(dir, (_, files) => {
      filesLength = files.length;
    });
    if (filesLength === 0) {
      await git.clone(`${arg.remote}`, arg.target);
      return 'Repository cloned';
    }
    throw new Error('Directory is not empty');
  } catch (err: any) {
    throw new Error(err);
  }
});

ipcMain.handle(CHANELS.FETCH_DIRECTORY_STATUS, async (_, arg) => {
  const git: SimpleGit = simpleGit({ baseDir: arg.path, trimmed: false });
  try {
    const isRepo = await git.checkIsRepo();
    if (isRepo) {
      const status = await git.status();
      const logOfCommits = await git.log({
        format: {
          hash: '%H',
          parentHashes: '%P',
          author_email: '%ae',
          author_name: '%an',
          message: '%s',
          date: '%ai',
          tree: '%T',
          refs: '%D',
        },
        maxCount: 1000, // enables faster loading of bigger repositories
        '--all': null,
      });
      const branches = await git.branchLocal();

      if (mainWindow) {
        mainWindow.setTitle(arg.path);
      }

      return JSON.stringify({
        status: status ?? null,
        commits: logOfCommits ? logOfCommits.all : null,
        branches: branches ?? null,
      });
    }
    return 'Not a repository';
  } catch (err: any) {
    throw new Error(err);
  }
});

ipcMain.handle(CHANELS.GET_COMMIT_DIFF, async (_, arg) => {
  const git: SimpleGit = simpleGit({ baseDir: arg.path });
  try {
    const options = arg.previousCommitHash
      ? [arg.commitHash, arg.previousCommitHash]
      : [`${arg.commitHash}^!`];
    const diff = await git.diff(options);
    const diffSummary = await git.diffSummary();

    return JSON.stringify({
      diffSummary: diffSummary ?? null,
      diff: diff ?? null,
    });
  } catch (error: any) {
    throw new Error(error);
  }
});

ipcMain.handle(CHANELS.GET_DIFF, async (_, arg) => {
  const git: SimpleGit = simpleGit({ baseDir: arg.path });
  try {
    const diff = await git.diff([arg.file]);
    return JSON.stringify({
      diff: diff ?? null,
    });
  } catch (error: any) {
    throw new Error(error);
  }
});

ipcMain.handle(CHANELS.COMMIT, async (_, args) => {
  const git: SimpleGit = simpleGit({ baseDir: args.path });
  const files =
    args.files !== 'all'
      ? Array.from(args.files).map((key: any) => key.toString())
      : '.';
  try {
    await git.add(files);
    const commitResponse: CommitResult = await git.commit(args.message);
    return commitResponse;
  } catch (e: any) {
    throw new Error(e);
  }
});

ipcMain.handle(CHANELS.GET_REMOTES, async (_, args) => {
  const git: SimpleGit = simpleGit({ baseDir: args.path });
  try {
    return await git.getRemotes(true);
  } catch (e: any) {
    throw new Error(e);
  }
});

ipcMain.handle(CHANELS.GET_REMOTE_BRANCHES, async (_, args) => {
  const git: SimpleGit = simpleGit({ baseDir: args.path });
  try {
    const response = await git.branch(['-r']);
    return response;
  } catch (e: any) {
    throw new Error(e);
  }
});

ipcMain.handle(CHANELS.ADD_REMOTE, async (_, args) => {
  const git: SimpleGit = simpleGit({ baseDir: args.path });
  try {
    return await git.addRemote(args.remoteName, args.remoteUrl);
  } catch (e: any) {
    throw new Error(e);
  }
});

ipcMain.handle(CHANELS.PUSH, async (_, args) => {
  const git: SimpleGit = simpleGit({ baseDir: args.path });
  try {
    return await git.push(args.remoteName, args.branch, ['-u']);
  } catch (e: any) {
    throw new Error(e);
  }
});

ipcMain.handle(CHANELS.PULL, async (_, args) => {
  const git: SimpleGit = simpleGit({ baseDir: args.path });
  try {
    const splittedRemote = args.remoteBranch.split('/');
    const remoteBranch = splittedRemote[splittedRemote.length - 1];
    return await git.pull(args.remoteName, remoteBranch);
  } catch (e: any) {
    throw new Error(e);
  }
});

ipcMain.handle(CHANELS.CREATE_BRANCH, async (_, args) => {
  const git: SimpleGit = simpleGit({ baseDir: args.path });
  try {
    if (args.commit) {
      return await git.checkoutBranch(args.name, args.commit);
    }
    return await git.checkoutLocalBranch(args.name);
  } catch (e: any) {
    throw new Error(e);
  }
});

ipcMain.handle(CHANELS.DELETE_BRANCH, async (_, args) => {
  const git: SimpleGit = simpleGit({ baseDir: args.path });
  const branches =
    args.branches !== 'all'
      ? Array.from(args.branches).map((key: any) => key.toString())
      : args.branches;
  try {
    return await git.deleteLocalBranches(branches);
  } catch (e: any) {
    throw new Error(e);
  }
});

ipcMain.handle(CHANELS.MERGE, async (_, args) => {
  const git: SimpleGit = simpleGit({ baseDir: args.path });
  try {
    return await git.merge([
      args.branch,
      `-m 'Merge ${args.branch} to ${args.current}'`,
    ]);
  } catch (e: any) {
    throw new Error(e);
  }
});

ipcMain.handle(CHANELS.CHECKOUT, async (_, args) => {
  const git: SimpleGit = simpleGit({ baseDir: args.path });
  console.log(args);
  try {
    const options = args.isRemote ? ['-b', args.branch] : [];
    return await git.checkout(args.branch, options);
  } catch (e: any) {
    throw new Error(e);
  }
});

ipcMain.handle(CHANELS.IS_REPO, async (_, args) => {
  const git: SimpleGit = simpleGit({ baseDir: args.path });
  try {
    return await git.checkIsRepo();
  } catch (e: any) {
    throw new Error(e);
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

ipcMain.handle(CHANELS.OPEN_FILE, handleFileOpen);

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
    icon: getAssetPath('Gitee.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      devTools: false,
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

  mainWindow.on('focus', () => {
    if (!mainWindow) throw new Error('"mainWindow" is not defined');
    mainWindow.webContents.send(CHANELS.ON_APP_FOCUS);
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
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch((e) => console.log(e));
