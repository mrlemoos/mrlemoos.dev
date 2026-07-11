// @vitest-environment jsdom
import { createElement } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OgImage } from "./og-image.tsx";

describe("OgImage", () => {
  it("renders the title and site label", () => {
    render(createElement(OgImage, { title: "Hello world" }));

    expect(screen.getByText("Hello world")).toBeInTheDocument();
    expect(screen.getByText("mrlemoos.dev")).toBeInTheDocument();
  });
});
