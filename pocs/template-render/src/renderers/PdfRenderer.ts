import type { Renderer } from "./Renderer.js";

export class PdfRenderer implements Renderer {
  private readonly lines: PdfLine[] = [];
  private templateName = "template";

  begin(templateName: string): void {
    this.templateName = templateName;
    this.lines.length = 0;
  }

  heading(level: number, text: string): void {
    this.lines.push({ text, size: level === 1 ? 20 : 16, gapAfter: 8 });
  }

  paragraph(text: string): void {
    this.lines.push({ text, size: 11, gapAfter: 6 });
  }

  table(headers: string[], rows: string[][]): void {
    this.lines.push({ text: headers.join(" | "), size: 10, gapAfter: 4 });
    for (const row of rows) {
      this.lines.push({ text: row.join(" | "), size: 10, gapAfter: 3 });
    }
    this.lines.push({ text: "", size: 10, gapAfter: 8 });
  }

  finish(): Uint8Array {
    return new TinyPdfDocument(this.templateName, this.lines).toBytes();
  }
}

type PdfLine = {
  text: string;
  size: number;
  gapAfter: number;
};

class TinyPdfDocument {
  constructor(
    private readonly title: string,
    private readonly lines: PdfLine[],
  ) {}

  toBytes(): Uint8Array {
    const content = this.contentStream();
    const objects = [
      "<< /Type /Catalog /Pages 2 0 R >>",
      "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
      "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
      `<< /Length ${byteLength(content)} >>\nstream\n${content}\nendstream`,
      `<< /Title (${escapePdf(this.title)}) >>`,
    ];

    let pdf = "%PDF-1.4\n";
    const offsets = [0];

    objects.forEach((object, index) => {
      offsets.push(byteLength(pdf));
      pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });

    const xrefStart = byteLength(pdf);
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += "0000000000 65535 f \n";
    for (const offset of offsets.slice(1)) {
      pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
    }
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info 6 0 R >>\n`;
    pdf += `startxref\n${xrefStart}\n%%EOF`;

    return new TextEncoder().encode(pdf);
  }

  private contentStream(): string {
    const commands = ["BT", "50 792 Td"];
    let currentY = 792;

    for (const line of this.lines) {
      const nextY = currentY - line.size - line.gapAfter;
      commands.push(`/F1 ${line.size} Tf`);
      commands.push(`1 0 0 1 50 ${nextY} Tm`);
      commands.push(`(${escapePdf(line.text)}) Tj`);
      currentY = nextY;
    }

    commands.push("ET");
    return commands.join("\n");
  }
}

function escapePdf(value: string): string {
  return value.replace(/[\\()]/g, (char) => `\\${char}`);
}

function byteLength(value: string): number {
  return new TextEncoder().encode(value).byteLength;
}
