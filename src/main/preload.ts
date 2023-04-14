import { contextBridge, ipcRenderer } from 'electron';
import { CHANELS } from '../constants';

const API = {
  ipcRenderer: {
    sendMessage: (args: string) => {
      ipcRenderer.send('message', args);
    },

    cloneRepository: (args: { remote: string; target: string }) =>
      ipcRenderer.invoke(CHANELS.CLONE, args),

    openDialog: () => ipcRenderer.invoke(CHANELS.OPEN_FILE),

    isRepository: (args: { path: string }) =>
      ipcRenderer.invoke(CHANELS.IS_REPO, args),

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

    getRemoteBranches: (args: { path: string }) =>
      ipcRenderer.invoke(CHANELS.GET_REMOTE_BRANCHES, args),

    addRemote: (args: {
      path: string;
      remoteName: string;
      remoteUrl: string;
    }) => ipcRenderer.invoke(CHANELS.ADD_REMOTE, args),

    push: (args: { path: string; remoteName: string; branch: string }) =>
      ipcRenderer.invoke(CHANELS.PUSH, args),

    pull: (args: { path: string; remoteName: string; remoteBranch: string }) =>
      ipcRenderer.invoke(CHANELS.PULL, args),

    createBranch: (args: {
      path: string;
      name: string;
      commit?: string;
      checkout?: boolean;
    }) => ipcRenderer.invoke(CHANELS.CREATE_BRANCH, args),

    deleteBranch: (args: {
      path: string;
      branches: string | Set<React.Key> | null | string[];
    }) => ipcRenderer.invoke(CHANELS.DELETE_BRANCH, args),

    merge: (args: { path: string; branch: string; current: string }) =>
      ipcRenderer.invoke(CHANELS.MERGE, args),

    checkout: (args: { path: string; branch: string; isRemote: boolean }) =>
      ipcRenderer.invoke(CHANELS.CHECKOUT, args),

    // eslint-disable-next-line no-unused-vars
    onCommitOpen: (callback: (_: any, value: string) => void) =>
      ipcRenderer.on(CHANELS.HANDLE_REPO_ACTION, callback),
  },
};

contextBridge.exposeInMainWorld('electron', API);

export type ElectronHandler = typeof API;
