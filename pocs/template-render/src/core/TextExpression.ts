import type { RenderContext } from "./RenderContext.js";

export class TextExpression {
  private static readonly placeholder = /\{\{\s*([\w.]+)\s*\}\}/g;

  constructor(private readonly source: string) {}

  evaluate(context: RenderContext): string {
    return this.source.replace(TextExpression.placeholder, (_, path: string) => context.text(path));
  }
}
