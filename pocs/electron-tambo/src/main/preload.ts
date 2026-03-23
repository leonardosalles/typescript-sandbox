import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  setVolume: (level: number) => ipcRenderer.invoke("system:set-volume", level),
  getVolume: () => ipcRenderer.invoke("system:get-volume"),
  openUrl: (url: string) => ipcRenderer.invoke("system:open-url", url),
  notify: (title: string, body: string) =>
    ipcRenderer.invoke("system:notify", title, body),
  getSystemInfo: () => ipcRenderer.invoke("system:info"),
  runCommand: (cmd: string) => ipcRenderer.invoke("system:run-command", cmd),
});
