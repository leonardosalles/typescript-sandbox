import { z } from "zod/v4";
import { VolumeControl } from "./VolumeControl";
import { SystemInfo } from "./SystemInfo";
import { Notifier } from "./Notifier";
import { OpenUrl } from "./OpenUrl";
import { BrightnessControl } from "./BrightnessControl";
import { ClipboardManager } from "./ClipboardManager";
import { AppLauncher } from "./AppLauncher";

export const tamboComponents = [
  {
    name: "VolumeControl",
    description: "Controls the system audio volume. Use when the user wants to change, set, increase, decrease, or mute the volume.",
    component: VolumeControl,
    propsSchema: z.object({
      targetVolume: z.number().min(0).max(100).describe("Volume level from 0 to 100"),
      action: z.enum(["set", "mute", "unmute", "increase", "decrease"]).describe("The volume action to perform"),
    }),
  },
  {
    name: "SystemInfo",
    description: "Shows system information such as OS, architecture, Electron version, Node version, and platform details.",
    component: SystemInfo,
    propsSchema: z.object({
      showDetails: z.boolean().optional().describe("Whether to show extended details"),
    }),
  },
  {
    name: "Notifier",
    description: "Sends a native OS desktop notification with a title and message. Use when the user asks to show a notification or reminder.",
    component: Notifier,
    propsSchema: z.object({
      title: z.string().describe("Notification title"),
      body: z.string().describe("Notification body/message"),
    }),
  },
  {
    name: "OpenUrl",
    description: "Opens a URL in the default system browser. Use when the user asks to open a website or link.",
    component: OpenUrl,
    propsSchema: z.object({
      url: z.string().describe("The full URL to open (must include https://)"),
      label: z.string().optional().describe("Friendly label for the URL"),
    }),
  },
  {
    name: "BrightnessControl",
    description: "Adjusts the screen brightness. Use when the user wants to change, increase, decrease or set the screen brightness.",
    component: BrightnessControl,
    propsSchema: z.object({
      targetBrightness: z.number().min(0).max(100).describe("Brightness level from 0 to 100"),
      action: z.enum(["set", "increase", "decrease"]).describe("The brightness action to perform"),
    }),
  },
  {
    name: "ClipboardManager",
    description: "Reads the current clipboard content or writes text to the clipboard. Use when the user wants to read, copy, paste or manage clipboard content.",
    component: ClipboardManager,
    propsSchema: z.object({
      action: z.enum(["read", "write"]).describe("Whether to read from or write to the clipboard"),
      text: z.string().optional().describe("Text to write to clipboard (required for write action)"),
    }),
  },
  {
    name: "AppLauncher",
    description: "Launches a native application installed on the system. Use when the user wants to open, launch or start an app like Safari, Spotify, VSCode, Finder, etc.",
    component: AppLauncher,
    propsSchema: z.object({
      appName: z.string().describe("The name of the application to launch (e.g. 'Spotify', 'Safari', 'Visual Studio Code')"),
      showSuggestions: z.boolean().optional().describe("Whether to show other installed apps as suggestions"),
    }),
  },
];
