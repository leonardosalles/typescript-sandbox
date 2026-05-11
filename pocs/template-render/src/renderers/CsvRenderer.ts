import type { Renderer } from "./Renderer.js";

export class CsvRenderer implements Renderer {
  private readonly rows: string[][] = [];

  begin(templateName: string): void {
    this.rows.length = 0;
    this.rows.push(["template", templateName]);
  }

  heading(level: number, text: string): void {
    this.rows.push([`h${level}`, text]);
  }

  paragraph(text: string): void {
    this.rows.push(["paragraph", text]);
  }

  table(headers: string[], rows: string[][]): void {
    this.rows.push([]);
    this.rows.push(headers);
    this.rows.push(...rows);
  }

  finish(): string {
    return this.rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
  }
}

function escapeCsv(value: string): string {
  if (!/[",\n\r]/.test(value)) {
    return value;
  }

  return `"${value.replace(/"/g, '""')}"`;
}
