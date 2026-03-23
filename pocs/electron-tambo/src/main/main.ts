import { app, BrowserWindow, ipcMain, shell } from "electron";
import path from "path";
import { execSync, exec } from "child_process";

const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 600,
    minHeight: 500,
    titleBarStyle: "hiddenInset",
    backgroundColor: "#0d0d0f",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, "../../public/icon.png"),
  });

  if (isDev) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}

ipcMain.handle("system:set-volume", async (_event, level: number) => {
  const vol = Math.max(0, Math.min(100, level));
  try {
    if (process.platform === "darwin") {
      execSync(`osascript -e "set volume output volume ${vol}"`);
    } else if (process.platform === "linux") {
      execSync(`amixer -D pulse sset Master ${vol}%`);
    } else if (process.platform === "win32") {
      execSync(
        `powershell -Command "(New-Object -ComObject WScript.Shell).SendKeys([char]174)"`,
      );
    }
    return { success: true, volume: vol };
  } catch (err) {
    return { success: false, error: String(err) };
  }
});

ipcMain.handle("system:get-volume", async () => {
  try {
    if (process.platform === "darwin") {
      const out = execSync(
        `osascript -e "output volume of (get volume settings)"`,
      )
        .toString()
        .trim();
      return { success: true, volume: parseInt(out) };
    }
    return { success: true, volume: 50 };
  } catch (err) {
    return { success: false, error: String(err) };
  }
});

ipcMain.handle("system:open-url", async (_event, url: string) => {
  await shell.openExternal(url);
  return { success: true };
});

ipcMain.handle("system:notify", async (_event, title: string, body: string) => {
  const { Notification } = await import("electron");
  new Notification({ title, body }).show();
  return { success: true };
});

ipcMain.handle("system:info", async () => {
  return {
    platform: process.platform,
    arch: process.arch,
    version: process.versions.electron,
    nodeVersion: process.versions.node,
  };
});

const ALLOWED_COMMANDS = ["date", "whoami", "hostname", "uptime"];
ipcMain.handle("system:run-command", async (_event, cmd: string) => {
  if (!ALLOWED_COMMANDS.includes(cmd.split(" ")[0])) {
    return { success: false, error: "Command not allowed" };
  }
  return new Promise((resolve) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) resolve({ success: false, error: stderr });
      else resolve({ success: true, output: stdout.trim() });
    });
  });
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
