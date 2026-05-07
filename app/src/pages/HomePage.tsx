/**
 * HomePage.tsx — Full-screen Hyperspeed hero
 * Theme: Cornsilk · Crimson · Black
 * Layout: Hyperspeed canvas fills 100dvh, hero text floats above
 */

import Hyperspeed from "../components/Hyperspeed";
import type { AppPage } from "../App";

interface Props {
  onNavigate: (p: AppPage) => void;
}

// ─── Design tokens (same as TradingPage) ──────────────────────────────────────
const T = {
  cornsilk:    "#FFF8DC",
  cornsilkMid: "#EDD98A",
  red:         "#B71C1C",
  redBright:   "#D32F2F",
  redBorder:   "rgba(183,28,28,0.40)",
  redGlow:     "rgba(211,47,47,0.25)",
  ink:         "#0D0D0D",
};

export default function HomePage({ onNavigate }: Props) {
  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "100dvh",
      overflow: "hidden",
      background: T.ink,
    }}>

      {/* ── Hyperspeed canvas — fills full screen ────────────────────────── */}
      <Hyperspeed />

      {/* ── Gradient overlay — fade bottom for text legibility ──────────── */}
      <div style={{
        position: "absolute", inset: 0,
        background: `
          radial-gradient(ellipse 80% 60% at 50% 110%, rgba(183,28,28,0.18) 0%, transparent 70%),
          linear-gradient(to top, rgba(10,10,10,0.75) 0%, transparent 55%),
          linear-gradient(to bottom, rgba(10,10,10,0.45) 0%, transparent 35%)
        `,
        pointerEvents: "none",
        zIndex: 1,
      }} />

      {/* ── Hero content ────────────────────────────────────────────────── */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        zIndex: 2, padding: "0 20px",
        textAlign: "center",
      }}>

        {/* Eyebrow chip */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          padding: "4px 14px", borderRadius: 3, marginBottom: 24,
          background: "rgba(183,28,28,0.14)",
          border: `1px solid ${T.redBorder}`,
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: "50%",
            background: T.redBright, display: "inline-block",
            boxShadow: `0 0 8px ${T.redBright}`,
            animation: "hs-pulse 2s ease-in-out infinite",
          }} />
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: 2,
            color: T.redBright,
          }}>
            MPC-Encrypted Trading · Live
          </span>
        </div>

        {/* Wordmark */}
        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(3.5rem, 12vw, 8rem)",
          fontWeight: 600, fontStyle: "italic",
          letterSpacing: "-0.02em", lineHeight: 1,
          color: T.cornsilk,
          textShadow: `0 0 60px rgba(255,248,220,0.15), 0 2px 4px rgba(0,0,0,0.6)`,
          marginBottom: 16,
        }}>
          Arcium
        </h1>

        {/* Tagline */}
        <p style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "clamp(11px, 2vw, 14px)",
          fontWeight: 400, letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: T.cornsilkMid,
          opacity: 0.8,
          maxWidth: 420,
          lineHeight: 1.7,
          marginBottom: 40,
        }}>
          Private perpetuals · Encrypted positions · On-chain settlement
        </p>

        {/* CTA buttons */}
        <div style={{
          display: "flex", gap: 12, flexWrap: "wrap",
          justifyContent: "center",
        }}>
          {/* Primary — launch app */}
          <button
            onClick={() => onNavigate("trade")}
            style={{
              padding: "13px 32px",
              background: T.red,
              border: `1px solid ${T.redBright}`,
              borderRadius: 3,
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: 2,
              color: T.cornsilk,
              cursor: "pointer",
              boxShadow: `0 0 24px ${T.redGlow}`,
              transition: "all 180ms ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = T.redBright;
              (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 36px ${T.redGlow}`;
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = T.red;
              (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 24px ${T.redGlow}`;
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            }}
          >
            Launch App →
          </button>

          {/* Secondary — markets */}
          <button
            onClick={() => onNavigate("markets")}
            style={{
              padding: "13px 32px",
              background: "transparent",
              border: `1px solid rgba(255,248,220,0.25)`,
              borderRadius: 3,
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: 2,
              color: T.cornsilk,
              cursor: "pointer",
              opacity: 0.8,
              transition: "all 180ms ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,248,220,0.55)";
              (e.currentTarget as HTMLButtonElement).style.opacity = "1";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,248,220,0.25)";
              (e.currentTarget as HTMLButtonElement).style.opacity = "0.8";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            }}
          >
            View Markets
          </button>
        </div>
      </div>

      {/* ── Bottom hint ─────────────────────────────────────────────────────── */}
      <div style={{
        position: "absolute", bottom: 28, left: 0, right: 0,
        display: "flex", justifyContent: "center",
        zIndex: 2, pointerEvents: "none",
      }}>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 9, letterSpacing: 3,
          textTransform: "uppercase",
          color: T.cornsilk, opacity: 0.3,
        }}>
          Hold to accelerate
        </span>
      </div>

      {/* ── Keyframe for pulsing dot (injected once) ───────────────────────── */}
      <style>{`
        @keyframes hs-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px #D32F2F; }
          50%       { opacity: 0.5; box-shadow: 0 0 3px #D32F2F; }
        }
      `}</style>
    </div>
  );
}
