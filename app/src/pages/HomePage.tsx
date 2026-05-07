/**
 * HomePage.tsx — Full-screen Hyperspeed hero + sections
 * Fixed:
 *  • Props aligned to app's onNavigate(AppPage) pattern
 *  • No Solana wallet imports (crashes if adapter not configured)
 *  • Hyperspeed effectOptions uses correct color key (shoulderLines not shouldderLines)
 *  • All hp-* styles defined inline via <style> tag — no missing CSS classes
 *  • Markets section guards against missing fields with optional chaining
 *  • Layout not used (causes activePage type mismatch)
 *  • MARKETS import replaced with inline fallback so missing export won't crash
 */

import { useMemo } from "react";
import Hyperspeed from "../components/Hyperspeed";
import { useMarketData } from "../hooks/useMarketData";
import type { AppPage } from "../App";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Props {
  onNavigate:     (p: AppPage) => void;
  onSelectMarket: (symbol: string) => void;
}

// ─── Hyperspeed config — preset "two" ─────────────────────────────────────────
const SPEED_OPTS = {
  length:                       400,
  roadWidth:                    10,
  islandWidth:                  2,
  lanesPerRoad:                 4,
  fov:                          90,
  fovSpeedUp:                   150,
  speedUp:                      2,
  carLightsFade:                0.4,
  totalSideLightSticks:         20,
  lightPairsPerRoadWay:         40,
  shoulderLinesWidthPercentage: 0.05,
  brokenLinesWidthPercentage:   0.1,
  brokenLinesLengthPercentage:  0.5,
  lightStickWidth:              [0.12, 0.5] as [number, number],
  lightStickHeight:             [1.3, 1.7]  as [number, number],
  movingAwaySpeed:              [60, 80]    as [number, number],
  movingCloserSpeed:            [-120, -160] as [number, number],
  carLightsLength:              [400 * 0.03, 400 * 0.2] as [number, number],
  carLightsRadius:              [0.05, 0.14] as [number, number],
  carWidthPercentage:           [0.3, 0.5]  as [number, number],
  carShiftX:                    [-0.8, 0.8] as [number, number],
  carFloorSeparation:           [0, 5]      as [number, number],
  colors: {
    roadColor:     0x080808,
    islandColor:   0x0a0a0a,
    background:    0x000000,
    shoulderLines: 0x111111,   // ← fixed (was "shouldderLines")
    brokenLines:   0x111111,
    leftCars:      [0xffffff, 0xe0e0e0, 0xcccccc],
    rightCars:     [0xcc0000, 0x990000, 0x660000],
    sticks:        0xffffff,
  },
};

// ─── Static content ───────────────────────────────────────────────────────────
const PRIVACY_FEATURES = [
  {
    n: "01",
    title: "Encrypted Positions",
    desc: "Size, entry price, and leverage are encrypted with x25519 + RescueCipher before touching the blockchain.",
  },
  {
    n: "02",
    title: "Private Liquidations",
    desc: "Liquidation thresholds computed entirely inside Arcium MPC. Keepers learn only a boolean — never your prices.",
  },
  {
    n: "03",
    title: "Confidential PnL",
    desc: "PnL calculated in MPC and returned encrypted. Only you — with your private key — can decrypt the result.",
  },
  {
    n: "04",
    title: "Anti Copy-Trading",
    desc: "Zero plaintext position data on-chain. Bots and copy-traders see nothing. Your strategy stays yours.",
  },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Encrypt Inputs",    desc: "Browser generates ephemeral x25519 keypair. Position data encrypted with shared secret before leaving your device." },
  { step: "02", title: "Submit to Solana",  desc: "Encrypted blobs stored on-chain via Anchor program. Computation queued to Arcium MPC network." },
  { step: "03", title: "MPC Computes",      desc: "Arcium threshold nodes execute the circuit on encrypted data. No single node sees plaintext." },
  { step: "04", title: "Decrypt Locally",   desc: "Encrypted result emitted in a Solana event. Your browser decrypts it. Nobody else can." },
];

// Fallback market list in case constants import isn't available
const FALLBACK_MARKETS = [
  { symbol: "BTCUSDT",  label: "Bitcoin",  seedPrice: 97000 },
  { symbol: "ETHUSDT",  label: "Ethereum", seedPrice: 3200  },
  { symbol: "SOLUSDT",  label: "Solana",   seedPrice: 182   },
  { symbol: "ARBUSDT",  label: "Arbitrum", seedPrice: 1.04  },
  { symbol: "BNBUSDT",  label: "BNB",      seedPrice: 610   },
  { symbol: "AVAXUSDT", label: "Avalanche",seedPrice: 38    },
];

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  bg:        "#000000",
  surface:   "#0a0a0a",
  surface2:  "#111111",
  border:    "rgba(255,255,255,0.08)",
  border2:   "rgba(255,255,255,0.14)",
  white:     "#ffffff",
  white2:    "#cccccc",
  white3:    "#888888",
  white4:    "#444444",
  red:       "#cc0000",
  redBright: "#ff3333",
  redDim:    "rgba(204,0,0,0.12)",
  redBorder: "rgba(204,0,0,0.35)",
  green:     "#22d3a5",
  greenDim:  "rgba(34,211,165,0.10)",
  mono:      "'IBM Plex Mono', monospace",
  serif:     "'Cormorant Garamond', Georgia, serif",
};

// ─── Reusable inline style blocks ─────────────────────────────────────────────
const S = {
  section: (bg = T.bg): React.CSSProperties => ({
    background: bg, padding: "80px 0", borderTop: `1px solid ${T.border}`,
  }),
  container: (): React.CSSProperties => ({
    maxWidth: 1100, margin: "0 auto", padding: "0 24px",
  }),
  sectionHeader: (): React.CSSProperties => ({
    marginBottom: 48,
  }),
  labelTag: (): React.CSSProperties => ({
    display: "inline-block",
    fontFamily: T.mono, fontSize: 10, fontWeight: 700,
    textTransform: "uppercase", letterSpacing: 2,
    color: T.red, background: T.redDim, border: `1px solid ${T.redBorder}`,
    padding: "3px 10px", borderRadius: 2, marginBottom: 14,
  }),
  sectionTitle: (): React.CSSProperties => ({
    fontFamily: T.serif, fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
    fontWeight: 500, fontStyle: "italic", color: T.white,
    margin: 0, lineHeight: 1.1,
  }),
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function HomePage({ onNavigate, onSelectMarket }: Props) {
  const speedOpts                = useMemo(() => SPEED_OPTS, []);
  const { markets, wsConnected } = useMarketData();

  // Safe price format
  function fmt(p: number): string {
    if (!p || isNaN(p)) return "—";
    if (p >= 10000) return `$${p.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    if (p >= 1)     return `$${p.toFixed(2)}`;
    return `$${p.toFixed(4)}`;
  }

  return (
    <div style={{ background: T.bg, color: T.white, minHeight: "100dvh", overflowX: "hidden" }}>

      {/* ════════════════════════════════════════
          HERO — full-screen Hyperspeed
      ════════════════════════════════════════ */}
      <section style={{ position: "relative", width: "100%", height: "100dvh", overflow: "hidden" }}>

        {/* Canvas */}
        <Hyperspeed effectOptions={speedOpts} />

        {/* Overlay gradients */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
          background: `
            radial-gradient(ellipse 70% 50% at 50% 100%, rgba(204,0,0,0.15) 0%, transparent 70%),
            linear-gradient(to top,    rgba(0,0,0,0.80) 0%,  transparent 50%),
            linear-gradient(to bottom, rgba(0,0,0,0.55) 0%,  transparent 40%)
          `,
        }} />

        {/* Hero content */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 2,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "0 20px",
        }}>

          {/* Eyebrow */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "4px 14px", borderRadius: 2, marginBottom: 28,
            background: T.redDim, border: `1px solid ${T.redBorder}`,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: T.redBright, display: "inline-block",
              boxShadow: `0 0 8px ${T.redBright}`,
              animation: "hsPulse 2s ease-in-out infinite",
            }} />
            <span style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: 2, color: T.redBright }}>
              Powered by Arcium MPC · Live on Solana
            </span>
          </div>

          {/* Headline */}
          <h1 style={{ margin: "0 0 8px", lineHeight: 1 }}>
            <span style={{
              display: "block",
              fontFamily: T.serif,
              fontSize: "clamp(3.5rem, 11vw, 8rem)",
              fontWeight: 600, fontStyle: "italic",
              color: T.white,
              textShadow: "0 2px 30px rgba(255,255,255,0.08)",
            }}>
              Trade perps.
            </span>
            <span style={{
              display: "block",
              fontFamily: T.serif,
              fontSize: "clamp(3.5rem, 11vw, 8rem)",
              fontWeight: 600, fontStyle: "italic",
              color: "transparent",
              WebkitTextStroke: `1.5px ${T.white}`,
              textShadow: "none",
            }}>
              Stay invisible.
            </span>
          </h1>

          {/* Sub */}
          <p style={{
            fontFamily: T.mono, fontSize: "clamp(11px, 1.8vw, 13px)",
            fontWeight: 400, color: T.white2, opacity: 0.75,
            maxWidth: 460, lineHeight: 1.75, letterSpacing: "0.04em",
            margin: "18px 0 36px",
          }}>
            Private perpetual futures. Positions, liquidations, and PnL compute
            inside <span style={{ color: T.redBright, fontWeight: 600 }}>Arcium MPC</span> — only
            your result reaches the chain.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 44 }}>
            <button
              onClick={() => onNavigate("trade")}
              style={{
                padding: "13px 32px", background: T.red,
                border: `1px solid ${T.redBright}`, borderRadius: 2,
                fontFamily: T.mono, fontSize: 11, fontWeight: 700,
                textTransform: "uppercase", letterSpacing: 2,
                color: T.white, cursor: "pointer",
                boxShadow: "0 0 24px rgba(204,0,0,0.30)",
                transition: "all 180ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = T.redBright;
                e.currentTarget.style.transform  = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = T.red;
                e.currentTarget.style.transform  = "translateY(0)";
              }}
            >
              Launch Terminal →
            </button>
            <a
              href="https://docs.arcium.com"
              target="_blank"
              rel="noreferrer"
              style={{
                padding: "13px 32px", background: "transparent",
                border: `1px solid ${T.border2}`, borderRadius: 2,
                fontFamily: T.mono, fontSize: 11, fontWeight: 700,
                textTransform: "uppercase", letterSpacing: 2,
                color: T.white2, cursor: "pointer",
                textDecoration: "none",
                transition: "all 180ms ease",
                display: "inline-flex", alignItems: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
                e.currentTarget.style.color = T.white;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = T.border2;
                e.currentTarget.style.color = T.white2;
              }}
            >
              Read Docs
            </a>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 40, flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { v: "100%",    l: "Positions encrypted" },
              { v: "0 bytes", l: "Plaintext on-chain"  },
              { v: "2-of-3",  l: "MPC threshold"       },
            ].map((s) => (
              <div key={s.l} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: T.mono, fontSize: 20, fontWeight: 700, color: T.white }}>{s.v}</div>
                <div style={{ fontFamily: T.mono, fontSize: 9, textTransform: "uppercase",
                  letterSpacing: 2, color: T.white3, marginTop: 4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{
          position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
          zIndex: 2, display: "flex", flexDirection: "column",
          alignItems: "center", gap: 6, pointerEvents: "none",
        }}>
          <div style={{
            width: 1, height: 32, background: `linear-gradient(to bottom, transparent, ${T.white3})`,
            animation: "hsScroll 2s ease-in-out infinite",
          }} />
          <span style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: 3,
            textTransform: "uppercase", color: T.white3, opacity: 0.5 }}>scroll</span>
        </div>
      </section>

      {/* ════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════ */}
      <section style={S.section(T.surface)}>
        <div style={S.container()}>
          <div style={S.sectionHeader()}>
            <div style={S.labelTag()}>Arcium MPC</div>
            <h2 style={S.sectionTitle()}>How privacy works</h2>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 1, background: T.border,
          }}>
            {HOW_IT_WORKS.map((s) => (
              <div key={s.step} style={{
                background: T.surface, padding: "28px 24px",
              }}>
                <div style={{ fontFamily: T.mono, fontSize: 10, color: T.red,
                  letterSpacing: 2, marginBottom: 12 }}>{s.step}</div>
                <h3 style={{ fontFamily: T.mono, fontSize: 13, fontWeight: 700,
                  color: T.white, marginBottom: 10, letterSpacing: 0.5 }}>{s.title}</h3>
                <p style={{ fontFamily: T.mono, fontSize: 11, color: T.white3,
                  lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          LIVE MARKETS
      ════════════════════════════════════════ */}
      <section style={S.section(T.bg)}>
        <div style={S.container()}>
          {/* Header row */}
          <div style={{
            ...S.sectionHeader(),
            display: "flex", alignItems: "flex-end",
            justifyContent: "space-between", flexWrap: "wrap", gap: 16,
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <h2 style={S.sectionTitle()}>Markets</h2>
                {wsConnected && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "2px 8px", borderRadius: 2,
                    background: T.greenDim, border: `1px solid rgba(34,211,165,0.25)`,
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%",
                      background: T.green, display: "inline-block",
                      boxShadow: `0 0 6px ${T.green}` }} />
                    <span style={{ fontFamily: T.mono, fontSize: 9, color: T.green,
                      fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Live</span>
                  </div>
                )}
              </div>
              <p style={{ fontFamily: T.mono, fontSize: 10, color: T.white4,
                margin: 0, letterSpacing: 1, textTransform: "uppercase" }}>
                Prices via Binance WebSocket
              </p>
            </div>
            <button
              onClick={() => onNavigate("trade")}
              style={{
                fontFamily: T.mono, fontSize: 10, fontWeight: 700,
                textTransform: "uppercase", letterSpacing: 2,
                color: T.white2, background: "none", border: `1px solid ${T.border}`,
                padding: "6px 14px", borderRadius: 2, cursor: "pointer",
                transition: "all 150ms",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.white2; e.currentTarget.style.color = T.white; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.white2; }}
            >
              View all →
            </button>
          </div>

          {/* Market grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 1, background: T.border,
          }}>
            {FALLBACK_MARKETS.map((m) => {
              const live = markets?.[m.symbol];
              const price = live?.price ?? m.seedPrice;
              const change = live?.change ?? 0;
              const isUp = change >= 0;

              return (
                <button key={m.symbol} onClick={() => onSelectMarket(m.symbol)} style={{
                  background: T.surface, padding: "20px",
                  border: "none", cursor: "pointer", textAlign: "left",
                  transition: "background 150ms",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = T.surface2; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = T.surface; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between",
                    alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                      <div style={{ fontFamily: T.mono, fontSize: 12, fontWeight: 700,
                        color: T.white, letterSpacing: 0.5 }}>
                        {m.symbol.replace("USDT", "")}
                        <span style={{ color: T.white4, fontWeight: 400 }}>/USDT</span>
                      </div>
                      <div style={{ fontFamily: T.mono, fontSize: 9, color: T.white4,
                        marginTop: 3, textTransform: "uppercase", letterSpacing: 1 }}>
                        {m.label}
                      </div>
                    </div>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 3,
                      fontFamily: T.mono, fontSize: 8, color: T.white4,
                      border: `1px solid ${T.border}`, padding: "2px 6px", borderRadius: 2,
                    }}>
                      <span className="material-symbols-outlined icon-fill"
                        style={{ fontSize: 10 }}>shield</span>
                      Private
                    </div>
                  </div>

                  <div style={{ fontFamily: T.mono, fontSize: 16, fontWeight: 700,
                    color: T.white, letterSpacing: "-0.02em", marginBottom: 6 }}>
                    {fmt(price)}
                  </div>

                  <div style={{
                    fontFamily: T.mono, fontSize: 11, fontWeight: 600,
                    color: isUp ? T.green : T.redBright,
                  }}>
                    {isUp ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
                  </div>

                  {live && (
                    <div style={{
                      display: "flex", justifyContent: "space-between",
                      marginTop: 12, paddingTop: 12,
                      borderTop: `1px solid ${T.border}`,
                    }}>
                      {[
                        { l: "Vol",     v: live.volume24h ?? "—" },
                        { l: "Funding", v: `${(live.fundingRate ?? 0).toFixed(4)}%` },
                      ].map((stat) => (
                        <div key={stat.l}>
                          <div style={{ fontFamily: T.mono, fontSize: 8,
                            textTransform: "uppercase", letterSpacing: 1,
                            color: T.white4, marginBottom: 2 }}>{stat.l}</div>
                          <div style={{ fontFamily: T.mono, fontSize: 10,
                            color: T.white2 }}>{stat.v}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          PRIVACY GUARANTEES
      ════════════════════════════════════════ */}
      <section style={S.section(T.surface)}>
        <div style={S.container()}>
          <div style={S.sectionHeader()}>
            <div style={S.labelTag()}>Guarantees</div>
            <h2 style={S.sectionTitle()}>What stays private</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1, background: T.border }}>
            {PRIVACY_FEATURES.map((f) => (
              <div key={f.n} style={{
                background: T.surface,
                display: "flex", alignItems: "flex-start", gap: 24,
                padding: "24px 28px",
              }}>
                <div style={{ fontFamily: T.mono, fontSize: 10, color: T.red,
                  letterSpacing: 2, flexShrink: 0, paddingTop: 3 }}>{f.n}</div>
                <div>
                  <h3 style={{ fontFamily: T.mono, fontSize: 13, fontWeight: 700,
                    color: T.white, marginBottom: 8, letterSpacing: 0.5 }}>{f.title}</h3>
                  <p style={{ fontFamily: T.mono, fontSize: 11, color: T.white3,
                    lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════ */}
      <section style={{
        background: T.bg, padding: "100px 24px",
        textAlign: "center", borderTop: `1px solid ${T.border}`,
      }}>
        <p style={{ fontFamily: T.mono, fontSize: 10, textTransform: "uppercase",
          letterSpacing: 3, color: T.red, marginBottom: 18 }}>Ready?</p>
        <h2 style={{
          fontFamily: T.serif, fontSize: "clamp(2rem, 6vw, 4rem)",
          fontWeight: 500, fontStyle: "italic",
          color: T.white, lineHeight: 1.1, marginBottom: 18,
        }}>
          Trade without<br />fear of exposure.
        </h2>
        <p style={{ fontFamily: T.mono, fontSize: 12, color: T.white3,
          lineHeight: 1.8, marginBottom: 40 }}>
          Your positions. Your secrets.<br />Powered by Arcium MPC.
        </p>
        <button
          onClick={() => onNavigate("trade")}
          style={{
            padding: "15px 40px", background: T.red,
            border: `1px solid ${T.redBright}`, borderRadius: 2,
            fontFamily: T.mono, fontSize: 12, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: 2,
            color: T.white, cursor: "pointer",
            boxShadow: "0 0 30px rgba(204,0,0,0.25)",
            transition: "all 180ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background  = T.redBright;
            e.currentTarget.style.transform   = "translateY(-2px)";
            e.currentTarget.style.boxShadow   = "0 0 50px rgba(204,0,0,0.40)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background  = T.red;
            e.currentTarget.style.transform   = "translateY(0)";
            e.currentTarget.style.boxShadow   = "0 0 30px rgba(204,0,0,0.25)";
          }}
        >
          Open Trading Terminal →
        </button>
      </section>

      {/* ════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════ */}
      <footer style={{
        background: T.surface, borderTop: `1px solid ${T.border}`,
        padding: "24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: T.serif, fontSize: 16, fontStyle: "italic",
            fontWeight: 600, color: T.white }}>StealthPerp</span>
          <span style={{ width: 1, height: 14, background: T.border2, display: "inline-block" }} />
          <span style={{ fontFamily: T.mono, fontSize: 9, color: T.white4,
            textTransform: "uppercase", letterSpacing: 1 }}>
            Encrypted by Arcium · Built on Solana
          </span>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {[
            { label: "Docs",   href: "https://docs.arcium.com" },
            { label: "GitHub", href: "https://github.com" },
          ].map((lnk) => (
            <a key={lnk.label} href={lnk.href} target="_blank" rel="noreferrer"
              style={{ fontFamily: T.mono, fontSize: 10, color: T.white3,
                textDecoration: "none", letterSpacing: 1,
                textTransform: "uppercase",
                transition: "color 150ms",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = T.white; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = T.white3; }}
            >
              {lnk.label}
            </a>
          ))}
        </div>
      </footer>

      {/* ── Global keyframes injected once ───────────────────────────────── */}
      <style>{`
        @keyframes hsPulse {
          0%, 100% { opacity: 1;   box-shadow: 0 0 8px #ff3333; }
          50%       { opacity: 0.4; box-shadow: 0 0 3px #ff3333; }
        }
        @keyframes hsScroll {
          0%   { opacity: 0; transform: scaleY(0); transform-origin: top; }
          50%  { opacity: 1; transform: scaleY(1); }
          100% { opacity: 0; transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
