import type { Renderer } from "./Renderer.js";

export class HtmlRenderer implements Renderer {
  private templateName = "template";
  private readonly body: string[] = [];

  begin(templateName: string): void {
    this.templateName = templateName;
    this.body.length = 0;
  }

  heading(level: number, text: string): void {
    const safeLevel = Math.min(Math.max(level, 1), 6);
    this.body.push(`<h${safeLevel}>${escapeHtml(text)}</h${safeLevel}>`);
  }

  paragraph(text: string): void {
    this.body.push(`<p>${escapeHtml(text)}</p>`);
  }

  table(headers: string[], rows: string[][]): void {
    const headerCells = headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("");
    const rowCells = rows
      .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
      .join("");

    this.body.push(`<table><thead><tr>${headerCells}</tr></thead><tbody>${rowCells}</tbody></table>`);
  }

  finish(): string {
    return [
      "<!doctype html>",
      '<html lang="en">',
      "<head>",
      '<meta charset="utf-8">',
      `<title>${escapeHtml(this.templateName)}</title>`,
      "<style>body{font-family:Arial,sans-serif;line-height:1.4;margin:32px}table{border-collapse:collapse;width:100%;margin-top:16px}th,td{border:1px solid #bbb;padding:8px;text-align:left}th{background:#f4f4f4}</style>",
      "</head>",
      `<body>${this.body.join("\n")}</body>`,
      "</html>",
    ].join("\n");
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
}
