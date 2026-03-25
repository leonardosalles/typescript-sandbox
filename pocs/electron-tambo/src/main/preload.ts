import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  setVolume: (level: number) => ipcRenderer.invoke("system:set-volume", level),
  getVolume: () => ipcRenderer.invoke("system:get-volume"),
  openUrl: (url: string) => ipcRenderer.invoke("system:open-url", url),
  notify: (title: string, body: string) =>
    ipcRenderer.invoke("system:notify", title, body),
  getSystemInfo: () => ipcRenderer.invoke("system:info"),
  runCommand: (cmd: string) => ipcRenderer.invoke("system:run-command", cmd),
  getBrightness: () => ipcRenderer.invoke("system:get-brightness"),
  setBrightness: (level: number) =>
    ipcRenderer.invoke("system:set-brightness", level),
  clipboardRead: () => ipcRenderer.invoke("system:clipboard-read"),
  clipboardWrite: (text: string) =>
    ipcRenderer.invoke("system:clipboard-write", text),
  launchApp: (appName: string) =>
    ipcRenderer.invoke("system:launch-app", appName),
  listApps: () => ipcRenderer.invoke("system:list-apps"),
});
