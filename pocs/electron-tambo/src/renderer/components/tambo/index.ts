import { z } from "zod/v4";
import { VolumeControl } from "./VolumeControl";
import { SystemInfo } from "./SystemInfo";
import { Notifier } from "./Notifier";
import { OpenUrl } from "./OpenUrl";

export const tamboComponents = [
  {
    name: "VolumeControl",
    description:
      "Controls the system audio volume. Use when the user wants to change, set, increase, decrease, or mute the volume.",
    component: VolumeControl,
    propsSchema: z.object({
      targetVolume: z
        .number()
        .min(0)
        .max(100)
        .describe("Volume level from 0 to 100"),
      action: z
        .enum(["set", "mute", "unmute", "increase", "decrease"])
        .describe("The volume action to perform"),
    }),
  },
  {
    name: "SystemInfo",
    description:
      "Shows system information such as OS, architecture, Electron version, Node version, and platform details.",
    component: SystemInfo,
    propsSchema: z.object({
      showDetails: z
        .boolean()
        .optional()
        .describe("Whether to show extended details"),
    }),
  },
  {
    name: "Notifier",
    description:
      "Sends a native OS desktop notification with a title and message. Use when the user asks to show a notification or reminder.",
    component: Notifier,
    propsSchema: z.object({
      title: z.string().describe("Notification title"),
      body: z.string().describe("Notification body/message"),
    }),
  },
  {
    name: "OpenUrl",
    description:
      "Opens a URL in the default system browser. Use when the user asks to open a website or link.",
    component: OpenUrl,
    propsSchema: z.object({
      url: z.string().describe("The full URL to open (must include https://)"),
      label: z.string().optional().describe("Friendly label for the URL"),
    }),
  },
];
