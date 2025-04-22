import { ImageResponse } from "next/og";

export const size = {
  height: 64,
  width: 64,
};

export const contentType = "image/jpeg";

export default function Icon(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          fontWeight: 900,
          background: "#161616",
          color: "#efefef",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 18,
          position: "relative",
        }}
      >
        <span
          style={{ transform: "rotate(90deg)", position: "absolute", top: -8 }}
        >
          L
        </span>
        <span
          style={{
            transform: "rotate(-90deg)",
            position: "absolute",
            bottom: -8,
          }}
        >
          L
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
