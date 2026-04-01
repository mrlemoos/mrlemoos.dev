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
        backgroundColor: "#f4f4f5",
        color: "#18181b",
        fontFamily: "Instrument Serif",
      }}
    >
      <div
        style={{
          fontSize: 56,
          fontStyle: "normal",
          letterSpacing: "-0.03em",
          color: "#18181b",
          marginTop: 24,
          padding: "0 100px",
          lineHeight: 1.15,
          whiteSpace: "pre-wrap",
          textAlign: "center",
          fontWeight: 400,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 26,
          fontStyle: "normal",
          letterSpacing: "-0.02em",
          color: "#71717a",
          marginTop: 28,
          padding: "0 100px",
          lineHeight: 1.35,
          whiteSpace: "pre-wrap",
          textAlign: "center",
          fontFamily: "Geist Sans",
          fontWeight: 500,
        }}
      >
        mrlemoos.dev
      </div>
    </div>
  );
}
