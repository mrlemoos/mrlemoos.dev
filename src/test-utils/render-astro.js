import { experimental_AstroContainer as AstroContainer } from "astro/container";

/** Render an Astro component to HTML for unit tests. Requires `@vitest-environment node`. */
export async function renderAstroComponent(Component, options = {}) {
  const container = await AstroContainer.create();
  return container.renderToString(Component, options);
}
