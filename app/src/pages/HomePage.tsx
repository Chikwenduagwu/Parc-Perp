/**
 * HomePage.tsx — Dark monochrome landing
 * Palette: #000000 bg · #FFFFFF ink · grayscale accents · green for profit signals
 * Hero: full-bleed Hyperspeed with white + red car lights
 */

import { useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import Layout from "../components/Layout";
import Hyperspeed from "../components/Hyperspeed";
import { useMarketData } from "../hooks/useMarketData";
import { MARKETS } from "../lib/constants";
import type { AppPage } from "../App";

const SPEED_OPTS = {
  distortion:                   "turbulentDistortion",
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
  lightStickWidth:              [0.12, 0.5],
  lightStickHeight:             [1.3, 1.7],
  movingAwaySpeed:              [60, 80],
  movingCloserSpeed:            [-120, -160],
  carLightsLength:              [400 * 0.03, 400 * 0.2],
  carLightsRadius:              [0.05, 0.14],
  carWidthPercentage:           [0.3, 0.5],
  carShiftX:                    [-0.8, 0.8],
  carFloorSeparation:           [0, 5],
  colors: {
    roadColor:     0x080808,
    islandColor:   0x0a0a0a,
    background:    0x000000,
    shouldderLines:0x111111,
    brokenLines:   0x111111,
    leftCars:      [0xffffff, 0xe0e0e0, 0xcccccc],
    rightCars:     [0xcc0000, 0x990000, 0x660000],
    sticks:        0xffffff,
  },
};

const PRIVACY_FEATURES = [
  {
    n: "01",
    title: "Encrypted Positions",
    desc: "Size, entry price, and leverage are encrypted with x25519 + RescueCipher before touching the blockchain. Zero plaintext on-chain.",
  },
  {
    n: "02",
    title: "Private Liquidations",
    desc: "Liquidation thresholds computed entirely inside Arcium MPC. Keepers learn only a boolean — never your prices or leverage.",
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
  {
    step: "01",
    title: "Encrypt Inputs",
    desc: "Browser generates ephemeral x25519 keypair. Position data encrypted with shared secret before leaving your device.",
  },
  {
    step: "02",
    title: "Submit to Solana",
    desc: "Encrypted blobs stored on-chain via Anchor program. Computation queued to Arcium MPC network.",
  },
  {
    step: "03",
    title: "MPC Computes",
    desc: "Arcium threshold nodes execute the circuit on encrypted data. No single node sees plaintext.",
  },
  {
    step: "04",
    title: "Decrypt Locally",
    desc: "Encrypted result emitted in a Solana event. Your browser decrypts it. Nobody else can.",
  },
];

interface Props {
  onLaunchApp:    () => void;
  onSelectMarket: (symbol: string) => void;
}

export default function HomePage({ onLaunchApp, onSelectMarket }: Props) {
  const { connected }            = useWallet();
  const { setVisible }           = useWalletModal();
  const { markets, wsConnected } = useMarketData();
  const speedOpts                = useMemo(() => SPEED_OPTS, []);

  function handleCTA() {
    if (!connected) setVisible(true);
    else onLaunchApp();
  }

  function fmt(p: number): string {
    if (!p) return "—";
    if (p >= 10000) return `$${p.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    if (p >= 1)     return `$${p.toFixed(2)}`;
    return `$${p.toFixed(4)}`;
  }

  return (
    <div className="hp-root">
      <Layout activePage="home" onNavigate={(p) => p === "trade" && onLaunchApp()} />

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="hp-hero">
        <div className="hp-hero-canvas" aria-hidden="true">
          <Hyperspeed effectOptions={speedOpts} />
        </div>
        <div className="hp-hero-vignette" aria-hidden="true" />

        <div className="hp-hero-content">
          {/* Eyebrow */}
          <div className="hp-eyebrow">
            <span className="hp-eyebrow-dot" />
            <span>Powered by Arcium MPC · Live on Solana</span>
          </div>

          {/* Headline */}
          <h1 className="hp-headline">
            <span className="hp-headline-line hp-headline-white">Trade perps.</span>
            <span className="hp-headline-line hp-headline-outline">Stay invisible.</span>
          </h1>

          {/* Sub */}
          <p className="hp-sub">
            Private perpetual futures. Positions, liquidations, and PnL compute
            inside <span className="hp-sub-accent">Arcium MPC</span> — only your
            result reaches the chain.
          </p>

          {/* CTAs */}
          <div className="hp-ctas">
            <button className="hp-cta-primary" onClick={handleCTA}>
              {connected ? "Launch Terminal" : "Connect Wallet"}
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                arrow_forward
              </span>
            </button>
            <a
              href="https://docs.arcium.com"
              target="_blank"
              rel="noreferrer"
              className="hp-cta-ghost"
            >
              Read Docs
            </a>
          </div>

          {/* Stats */}
          <div className="hp-stats">
            {[
              { v: "100%",    l: "Positions encrypted" },
              { v: "0 bytes", l: "Plaintext on-chain"  },
              { v: "2-of-3",  l: "MPC threshold"       },
            ].map((s) => (
              <div className="hp-stat" key={s.l}>
                <span className="hp-stat-value">{s.v}</span>
                <span className="hp-stat-label">{s.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="hp-scroll-cue" aria-hidden="true">
          <span className="hp-scroll-line" />
          <span className="hp-scroll-text">scroll</span>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section className="hp-section hp-section-dark">
        <div className="hp-container">
          <div className="hp-section-header">
            <span className="hp-label-tag">Arcium MPC</span>
            <h2 className="hp-section-title">How privacy works</h2>
          </div>
          <div className="hp-steps-grid">
            {HOW_IT_WORKS.map((s) => (
              <div className="hp-step" key={s.step}>
                <div className="hp-step-num">{s.step}</div>
                <h3 className="hp-step-title">{s.title}</h3>
                <p className="hp-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          LIVE MARKETS
      ══════════════════════════════════════ */}
      <section className="hp-section hp-section-deep">
        <div className="hp-container">
          <div className="hp-section-header hp-section-header-row">
            <div>
              <div className="hp-live-row">
                <h2 className="hp-section-title">Markets</h2>
                {wsConnected && (
                  <div className="hp-live-badge">
                    <span
                      className="live-dot"
                      style={{ background: "var(--green)" }}
                    />
                    <span>Live</span>
                  </div>
                )}
              </div>
              <p className="hp-section-sub">Prices via Binance WebSocket</p>
            </div>
            <button className="hp-link-btn" onClick={onLaunchApp}>
              View all
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 14 }}
              >
                arrow_forward
              </span>
            </button>
          </div>

          <div className="hp-markets-grid">
            {MARKETS.slice(0, 6).map((m) => {
              const live = markets[m.symbol];
              const isUp = (live?.change ?? 0) >= 0;
              return (
                <button
                  key={m.symbol}
                  className="hp-market-card"
                  onClick={() => onSelectMarket(m.symbol)}
                >
                  <div className="hp-market-top">
                    <div className="hp-market-icon">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 16, color: "var(--ink-4)" }}
                      >
                        {m.icon}
                      </span>
                    </div>
                    <div className="hp-market-pair">
                      <span className="hp-market-symbol">{m.symbol}</span>
                      <span className="hp-market-name">{m.label}</span>
                    </div>
                    <div className="hp-market-private">
                      <span
                        className="material-symbols-outlined icon-fill icon-sm"
                        style={{ color: "var(--ink-4)" }}
                      >
                        shield
                      </span>
                      <span>Private</span>
                    </div>
                  </div>

                  <div className="hp-market-price">
                    {fmt(live?.price ?? m.seedPrice)}
                  </div>
                  <div
                    className="hp-market-change"
                    style={{
                      color: isUp ? "var(--green)" : "#E05C5C",
                    }}
                  >
                    {isUp ? "▲" : "▼"} {Math.abs(live?.change ?? 0).toFixed(2)}%
                  </div>

                  <div className="hp-market-footer">
                    <div className="hp-market-meta">
                      <span className="hp-market-meta-label">24h Vol</span>
                      <span className="hp-market-meta-value">
                        {live?.volume24h ?? "—"}
                      </span>
                    </div>
                    <div className="hp-market-meta">
                      <span className="hp-market-meta-label">Funding</span>
                      <span className="hp-market-meta-value">
                        {(live?.fundingRate ?? 0.0082).toFixed(4)}%
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PRIVACY GUARANTEES
      ══════════════════════════════════════ */}
      <section className="hp-section hp-section-dark">
        <div className="hp-container">
          <div className="hp-section-header">
            <span className="hp-label-tag">Guarantees</span>
            <h2 className="hp-section-title">What stays private</h2>
          </div>
          <div className="hp-features-grid">
            {PRIVACY_FEATURES.map((f) => (
              <div className="hp-feature" key={f.n}>
                <div className="hp-feature-num">{f.n}</div>
                <div className="hp-feature-body">
                  <h3 className="hp-feature-title">{f.title}</h3>
                  <p className="hp-feature-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════ */}
      <section className="hp-cta-section">
        <div className="hp-cta-inner">
          <p className="hp-cta-eyebrow">Ready?</p>
          <h2 className="hp-cta-headline">
            Trade without<br />fear of exposure.
          </h2>
          <p className="hp-cta-sub">
            Your positions. Your secrets.<br />
            Powered by Arcium MPC.
          </p>
          <button className="hp-cta-final" onClick={handleCTA}>
            {connected ? "Open Trading Terminal" : "Connect Wallet to Start"}
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 16 }}
            >
              arrow_forward
            </span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="hp-footer">
        <div className="hp-footer-inner">
          <span className="hp-footer-brand">StealthPerp</span>
          <span className="hp-footer-sep" />
          <span className="hp-footer-meta">
            Encrypted by Arcium · Built on Solana
          </span>
          <div className="hp-footer-links">
            <a
              href="https://docs.arcium.com"
              target="_blank"
              rel="noreferrer"
            >
              Docs
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
