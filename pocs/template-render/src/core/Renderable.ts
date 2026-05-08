import type { Renderer } from "../renderers/Renderer.js";
import type { RenderContext } from "./RenderContext.js";

export interface Renderable {
  renderWith(renderer: Renderer, context: RenderContext): void;
}
