import { z } from "zod";
import { FastMCP } from "fastmcp";
import downloadFigmaImagesTool from "tools/download-figma-images.tool";

const mcp = new FastMCP({
  name: "figma-mcp-server",
  version: "1.0.0",
});

mcp.addTool({
  name: "download-figma-image",
  description: "Retrieve an SVG link from Figma",
  parameters: z.object({
    figmaUrl: z.string(),
  }),
  execute: async (args) => {
    return downloadFigmaImagesTool({ figmaUrl: args.figmaUrl });
  },
});

mcp.start();
