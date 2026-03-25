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

ipcMain.handle("system:get-brightness", async () => {
  try {
    if (process.platform === "darwin") {
      const out = execSync("brightness -l 2>/dev/null || echo '0.5'")
        .toString()
        .trim();
      const match = out.match(/brightness\s+([\d.]+)/);
      const value = match ? parseFloat(match[1]) : 0.5;
      return { success: true, brightness: Math.round(value * 100) };
    }
    return { success: true, brightness: 50 };
  } catch {
    return { success: true, brightness: 50 };
  }
});

ipcMain.handle("system:set-brightness", async (_event, level: number) => {
  const pct = Math.max(0, Math.min(100, level));
  const normalized = (pct / 100).toFixed(2);
  try {
    if (process.platform === "darwin") {
      execSync(`brightness ${normalized} 2>/dev/null || true`);
    } else if (process.platform === "linux") {
      execSync(
        `xrandr --output $(xrandr | grep ' connected' | awk '{print $1}' | head -1) --brightness ${normalized} 2>/dev/null || true`,
      );
    }
    return { success: true, brightness: pct };
  } catch (err) {
    return { success: false, error: String(err) };
  }
});

ipcMain.handle("system:clipboard-read", async () => {
  const { clipboard } = await import("electron");
  const text = clipboard.readText();
  return { success: true, text };
});

ipcMain.handle("system:clipboard-write", async (_event, text: string) => {
  const { clipboard } = await import("electron");
  clipboard.writeText(text);
  return { success: true };
});

ipcMain.handle("system:launch-app", async (_event, appName: string) => {
  return new Promise((resolve) => {
    if (process.platform === "darwin") {
      exec(`open -a "${appName}"`, (err) => {
        if (err)
          resolve({ success: false, error: `Could not open "${appName}"` });
        else resolve({ success: true, appName });
      });
    } else if (process.platform === "linux") {
      exec(
        `gtk-launch "${appName.toLowerCase()}" 2>/dev/null || xdg-open "${appName}" 2>/dev/null`,
        (err) => {
          if (err) resolve({ success: false, error: String(err) });
          else resolve({ success: true, appName });
        },
      );
    } else if (process.platform === "win32") {
      exec(`start "" "${appName}"`, (err) => {
        if (err) resolve({ success: false, error: String(err) });
        else resolve({ success: true, appName });
      });
    } else {
      resolve({ success: false, error: "Platform not supported" });
    }
  });
});

ipcMain.handle("system:list-apps", async () => {
  if (process.platform === "darwin") {
    return new Promise((resolve) => {
      exec(`ls /Applications | grep .app | sed 's/.app//'`, (err, stdout) => {
        if (err) resolve({ success: false, apps: [] });
        else {
          const apps = stdout.trim().split("\n").filter(Boolean).slice(0, 30);
          resolve({ success: true, apps });
        }
      });
    });
  }
  return { success: true, apps: [] };
});
