import { HeadingBlock, ParagraphBlock, TableBlock, TableColumn, TextExpression } from "./Blocks.js";
import { Template } from "./Template.js";

type MutableTable = {
  rowsPath: string;
  headers?: string[];
  columns?: string[];
};

export class TemplateParser {
  parse(name: string, source: string): Template {
    const blocks = [];
    const lines = source.split(/\r?\n/);
    let table: MutableTable | null = null;

    for (const [index, rawLine] of lines.entries()) {
      const lineNumber = index + 1;
      const line = rawLine.trim();

      if (line.length === 0) {
        continue;
      }

      if (table) {
        if (line === "@end") {
          blocks.push(this.closeTable(table, lineNumber));
          table = null;
          continue;
        }

        if (line.startsWith("headers:")) {
          table.headers = this.splitPipe(line.slice("headers:".length));
          continue;
        }

        if (line.startsWith("columns:")) {
          table.columns = this.splitPipe(line.slice("columns:".length));
          continue;
        }

        throw new Error(`Unknown table instruction at line ${lineNumber}: ${line}`);
      }

      if (line.startsWith("@table ")) {
        table = { rowsPath: line.slice("@table ".length).trim() };
        continue;
      }

      if (line.startsWith("#")) {
        const level = line.match(/^#+/)?.[0].length ?? 1;
        const text = line.slice(level).trim();
        blocks.push(new HeadingBlock(level, new TextExpression(text)));
        continue;
      }

      blocks.push(new ParagraphBlock(new TextExpression(line)));
    }

    if (table) {
      throw new Error(`Table "${table.rowsPath}" was not closed with @end.`);
    }

    return new Template(name, blocks);
  }

  private closeTable(table: MutableTable, lineNumber: number): TableBlock {
    if (!table.headers || !table.columns) {
      throw new Error(`Table ending at line ${lineNumber} must define headers and columns.`);
    }

    if (table.headers.length !== table.columns.length) {
      throw new Error(`Table "${table.rowsPath}" has ${table.headers.length} headers and ${table.columns.length} columns.`);
    }

    return new TableBlock(
      table.rowsPath,
      table.columns.map((column, index) => new TableColumn(table.headers![index], column)),
    );
  }

  private splitPipe(source: string): string[] {
    return source
      .split("|")
      .map((part) => part.trim())
      .filter(Boolean);
  }
}
