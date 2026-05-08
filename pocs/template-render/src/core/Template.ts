import type { Renderer } from "../renderers/Renderer.js";
import { RenderContext, type DataRecord } from "./RenderContext.js";
import type { Renderable } from "./Renderable.js";

export class Template implements Renderable {
  constructor(
    public readonly name: string,
    private readonly blocks: Renderable[],
  ) {}

  render(renderer: Renderer, data: DataRecord): string | Uint8Array {
    renderer.begin(this.name);
    this.renderWith(renderer, new RenderContext(data));
    return renderer.finish();
  }

  renderWith(renderer: Renderer, context: RenderContext): void {
    for (const block of this.blocks) {
      block.renderWith(renderer, context);
    }
  }
}
