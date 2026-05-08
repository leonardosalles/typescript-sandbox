import type { Renderer } from "../renderers/Renderer.js";
import type { RenderContext } from "./RenderContext.js";
import type { Renderable } from "./Renderable.js";
import type { TableColumn } from "./TableColumn.js";

export class TableBlock implements Renderable {
  constructor(
    private readonly rowsPath: string,
    private readonly columns: TableColumn[],
  ) {}

  renderWith(renderer: Renderer, context: RenderContext): void {
    const rows = context.list(this.rowsPath).map((row) => {
      const rowContext = context.child(row);
      return this.columns.map((column) => rowContext.text(column.path));
    });

    renderer.table(
      this.columns.map((column) => column.header),
      rows,
    );
  }
}
