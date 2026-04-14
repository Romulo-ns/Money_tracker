import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "Money Tracker | Gestão Financeira";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: "linear-gradient(to bottom right, #09090b, #18181b)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Decorative background element */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: 200,
            background: "rgba(16, 185, 129, 0.1)",
            filter: "blur(60px)",
          }}
        />
        
        <div 
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 40,
            marginBottom: 40,
          }}
        >
          {/* Logo Container */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 120,
              height: 120,
              background: "#10b981",
              borderRadius: 24,
              boxShadow: "0 0 40px rgba(16, 185, 129, 0.3)",
            }}
          >
            <svg
              width="72"
              height="72"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
              <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
            </svg>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h1
              style={{
                fontSize: 90,
                fontWeight: 900,
                color: "white",
                margin: 0,
                padding: 0,
                lineHeight: 1,
                letterSpacing: "-0.05em",
              }}
            >
              Money Tracker
            </h1>
          </div>
        </div>

        <p
          style={{
            fontSize: 38,
            color: "#a1a1aa",
            textAlign: "center",
            maxWidth: 900,
            margin: 0,
            padding: 0,
            lineHeight: 1.4,
          }}
        >
          A plataforma definitiva para freelancers gerenciarem suas horas e ganhos.
        </p>

        {/* Footer brand */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#52525b",
            fontSize: 24,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
          }}
        >
          money-tracker-pro.vercel.app
        </div>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
