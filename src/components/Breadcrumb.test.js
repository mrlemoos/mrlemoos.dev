// @vitest-environment node
import { describe, expect, it } from "vitest";
import { renderAstroComponent } from "@/test-utils/render-astro.js";
import Breadcrumb from "./Breadcrumb.astro";

describe("Breadcrumb", () => {
  it("renders linked and current crumbs", async () => {
    const html = await renderAstroComponent(Breadcrumb, {
      props: {
        items: [
          { label: "Home", href: "/" },
          { label: "Blog" },
        ],
      },
    });

    expect(html).toContain('aria-label="Breadcrumb"');
    expect(html).toContain('href="/"');
    expect(html).toContain("Home");
    expect(html).toContain('aria-current="page"');
    expect(html).toContain("Blog");
  });
});
