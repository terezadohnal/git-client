import { contextBridge, ipcRenderer } from 'electron';

export type Channels = 'ipc-example';

const API = {
  ipcRenderer: {
    //   sendMessage(channel: Channels, args: unknown[]) {
    //     ipcRenderer.send(channel, args);
    //   },
    //   on(channel: Channels, func: (...args: unknown[]) => void) {
    //     const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
    //       func(...args);
    //     ipcRenderer.on(channel, subscription);

    //     return () => {
    //       ipcRenderer.removeListener(channel, subscription);
    //     };
    //   },
    //   once(channel: Channels, func: (...args: unknown[]) => void) {
    //     ipcRenderer.once(channel, (_event, ...args) => func(...args));
    //   },
    // },
    sendMessage: (args: string) => {
      ipcRenderer.send('message', args);
    },

    cloneRepository: (args: string) => ipcRenderer.invoke('clone', args),
  },
};

contextBridge.exposeInMainWorld('electron', API);

export type ElectronHandler = typeof API;
