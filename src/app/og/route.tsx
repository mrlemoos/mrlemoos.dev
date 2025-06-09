import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

/**
 * A route that generates an image for the Open Graph protocol.
 *
 * @example
 * ```http
 * GET /og?title=Title%20of%20the%20post
 * ```
 */
export async function GET(req: NextRequest): Promise<Response> {
  try {
    const searchParams = req.nextUrl.searchParams;
    const title = searchParams.get("title") || "mrlemoos.dev";
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#000000",
            color: "#ffffff",
            fontFamily: "Space Mono",
          }}
        >
          <div
            style={{
              fontSize: 60,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              color: "white",
              marginTop: 30,
              padding: "0 120px",
              lineHeight: 1.4,
              whiteSpace: "pre-wrap",
              textAlign: "center",
              fontWeight: 700,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 30,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              color: "#9ca3af",
              marginTop: 30,
              padding: "0 120px",
              lineHeight: 1.4,
              whiteSpace: "pre-wrap",
              textAlign: "center",
              fontWeight: 400,
            }}
          >
            mrlemoos.dev
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Space Mono",
            data: await fetch(
              new URL(
                "https://raw.githubusercontent.com/googlefonts/spacemono/main/fonts/ttf/SpaceMono-Regular.ttf"
              )
            ).then((res) => res.arrayBuffer()),
            style: "normal",
            weight: 400,
          },
          {
            name: "Space Mono",
            data: await fetch(
              new URL(
                "https://raw.githubusercontent.com/googlefonts/spacemono/main/fonts/ttf/SpaceMono-Bold.ttf"
              )
            ).then((res) => res.arrayBuffer()),
            style: "normal",
            weight: 700,
          },
        ],
      }
    );
  } catch (e) {
    const error = e as Error;
    console.log(error.message);
    return new Response("Failed to generate the image", {
      status: 500,
    });
  }
}
