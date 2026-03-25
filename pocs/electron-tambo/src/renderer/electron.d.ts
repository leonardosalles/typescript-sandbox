export {};

declare global {
  interface Window {
    electronAPI: {
      setVolume: (level: number) => Promise<{ success: boolean; volume?: number; error?: string }>;
      getVolume: () => Promise<{ success: boolean; volume?: number; error?: string }>;
      openUrl: (url: string) => Promise<{ success: boolean }>;
      notify: (title: string, body: string) => Promise<{ success: boolean }>;
      getSystemInfo: () => Promise<{ platform: string; arch: string; version: string; nodeVersion: string }>;
      runCommand: (cmd: string) => Promise<{ success: boolean; output?: string; error?: string }>;
      getBrightness: () => Promise<{ success: boolean; brightness?: number }>;
      setBrightness: (level: number) => Promise<{ success: boolean; brightness?: number; error?: string }>;
      clipboardRead: () => Promise<{ success: boolean; text: string }>;
      clipboardWrite: (text: string) => Promise<{ success: boolean }>;
      launchApp: (appName: string) => Promise<{ success: boolean; appName?: string; error?: string }>;
      listApps: () => Promise<{ success: boolean; apps: string[] }>;
    };
  }
}
