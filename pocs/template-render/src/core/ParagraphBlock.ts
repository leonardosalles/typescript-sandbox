import type { Renderer } from "../renderers/Renderer.js";
import type { RenderContext } from "./RenderContext.js";
import type { Renderable } from "./Renderable.js";
import type { TextExpression } from "./TextExpression.js";

export class ParagraphBlock implements Renderable {
  constructor(private readonly expression: TextExpression) {}

  renderWith(renderer: Renderer, context: RenderContext): void {
    renderer.paragraph(this.expression.evaluate(context));
  }
}
