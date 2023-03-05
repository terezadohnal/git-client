import { contextBridge, ipcRenderer } from 'electron';
import { CHANELS } from '../constants';

// export type Channels = 'ipc-example';

const API = {
  ipcRenderer: {
    sendMessage: (args: string) => {
      ipcRenderer.send('message', args);
    },

    cloneRepository: (args: { remote: string; target: string }) =>
      ipcRenderer.invoke(CHANELS.CLONE, args),

    openDialog: () => ipcRenderer.invoke(CHANELS.OPEN_FILE),

    fetchDirectoryStatus: (args: { path: string }) =>
      ipcRenderer.invoke(CHANELS.FETCH_DIRECTORY_STATUS, args),

    getCommitDiff: (args: {
      path: string;
      commitHash: string;
      previousCommitHash: string;
    }) => ipcRenderer.invoke(CHANELS.GET_COMMIT_DIFF, args),

    commit: (args: {
      path: string;
      files: string | Set<React.Key> | null;
      message: string;
    }) => ipcRenderer.invoke(CHANELS.COMMIT, args),

    getRemote: (args: { path: string }) =>
      ipcRenderer.invoke(CHANELS.GET_REMOTES, args),

    addRemote: (args: {
      path: string;
      remoteName: string;
      remoteUrl: string;
    }) => ipcRenderer.invoke(CHANELS.ADD_REMOTE, args),

    push: (args: { path: string; remoteName: string; branch: string }) =>
      ipcRenderer.invoke(CHANELS.PUSH, args),

    pull: (args: { path: string; remoteName: string; branch: string }) =>
      ipcRenderer.invoke(CHANELS.PULL, args),
  },
};

contextBridge.exposeInMainWorld('electron', API);

export type ElectronHandler = typeof API;
