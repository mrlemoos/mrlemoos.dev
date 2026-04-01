/** OG image markup for @vercel/og (React elements). */
export function OgImage({ title }: { title: string }) {
  return (
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
  );
}
