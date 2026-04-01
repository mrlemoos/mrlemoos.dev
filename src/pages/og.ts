import { ImageResponse } from "@vercel/og";
import type { APIRoute } from "astro";
import { createElement } from "react";
import { OgImage } from "@/lib/og-image";

export const prerender = false;

const INSTRUMENT_SERIF_TTF =
  "https://raw.githubusercontent.com/google/fonts/main/ofl/instrumentserif/InstrumentSerif-Regular.ttf";

async function loadFont(
  url: string,
  label: string
): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${label}: ${res.status}`);
  }
  return res.arrayBuffer();
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const title = url.searchParams.get("title") || "mrlemoos.dev";

    const [instrumentData, geistData] = await Promise.all([
      loadFont(INSTRUMENT_SERIF_TTF, "Instrument Serif"),
      loadFont(
        "https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/fonts/geist-sans/Geist-Medium.ttf",
        "Geist Sans"
      ),
    ]);

    return new ImageResponse(createElement(OgImage, { title }), {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Instrument Serif",
          data: instrumentData,
          style: "normal",
          weight: 400,
        },
        {
          name: "Geist Sans",
          data: geistData,
          style: "normal",
          weight: 500,
        },
      ],
    });
  } catch (e) {
    const error = e as Error;
    console.log(error.message);
    return new Response("Failed to generate the image", { status: 500 });
  }
};
