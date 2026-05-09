export interface Renderer {
  begin(templateName: string): void;
  heading(level: number, text: string): void;
  paragraph(text: string): void;
  table(headers: string[], rows: string[][]): void;
  finish(): string | Uint8Array;
}
