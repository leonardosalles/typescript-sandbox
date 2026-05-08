import type { Renderer } from "../renderers/Renderer.js";
import type { RenderContext } from "./RenderContext.js";
import type { Renderable } from "./Renderable.js";
import type { TextExpression } from "./TextExpression.js";

export class HeadingBlock implements Renderable {
  constructor(
    private readonly level: number,
    private readonly expression: TextExpression,
  ) {}

  renderWith(renderer: Renderer, context: RenderContext): void {
    renderer.heading(this.level, this.expression.evaluate(context));
  }
}
