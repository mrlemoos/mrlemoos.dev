import { ImageResponse } from "@vercel/og";
import type { APIRoute } from "astro";
import { createElement } from "react";
import { OgImage } from "@/lib/og-image";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const title = url.searchParams.get("title") || "mrlemoos.dev";

    return new ImageResponse(createElement(OgImage, { title }), {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Space Mono",
          data: await fetch(
            "https://raw.githubusercontent.com/googlefonts/spacemono/main/fonts/ttf/SpaceMono-Regular.ttf"
          ).then((res) => res.arrayBuffer()),
          style: "normal",
          weight: 400,
        },
        {
          name: "Space Mono",
          data: await fetch(
            "https://raw.githubusercontent.com/googlefonts/spacemono/main/fonts/ttf/SpaceMono-Bold.ttf"
          ).then((res) => res.arrayBuffer()),
          style: "normal",
          weight: 700,
        },
      ],
    });
  } catch (e) {
    const error = e as Error;
    console.log(error.message);
    return new Response("Failed to generate the image", { status: 500 });
  }
};
