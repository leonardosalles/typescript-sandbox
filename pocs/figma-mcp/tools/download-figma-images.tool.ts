interface DownloadFigmaImagesToolInput {
  figmaUrl: string;
}

export default async function downloadFigmaImagesTool({
  figmaUrl,
}: DownloadFigmaImagesToolInput) {
  const match = figmaUrl.match(/file\/([a-zA-Z0-9]+)\/.*node-id=([0-9%:]+)/);
  if (!match) {
    return {
      content: [{ type: "text", text: "Invalid figma url." }],
    };
  }

  const [, fileId, nodeIdRaw] = match;
  const nodeId = decodeURIComponent(nodeIdRaw);

  const response = await fetch(
    `https://api.figma.com/v1/images/${fileId}?ids=${encodeURIComponent(
      nodeId
    )}&format=svg`,
    {
      headers: {
        "X-Figma-Token": process.env.FIGMA_API_TOKEN!,
      },
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    return {
      content: [{ type: "text", text: `Figma Error: ${errText}` }],
    };
  }

  const data = await response.json();

  const imageUrl = data.images[nodeId];

  if (!imageUrl) {
    return {
      content: [{ type: "text", text: "Cant download image." }],
    };
  }

  return {
    content: [{ type: "text", text: imageUrl }],
  };
}
