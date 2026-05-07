/**
 * HomePage.tsx — Landing page with hero slider, price marquee, and live market preview.
 * Hero: fullscreen slideable with Pexels perp-trading backgrounds + Ken Burns.
 * Marquee: fixed crypto price ticker at the very top (like reference screenshot).
 */

import { useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import Layout from "../components/Layout";
import { useMarketData } from "../hooks/useMarketData";
import { MARKETS } from "../lib/constants";
import type { AppPage } from "../App";

interface Props {
  onLaunchApp: () => void;
  onSelectMarket: (symbol: string) => void;
}

const PRIVACY_FEATURES = [
  {
    icon: "lock",
    title: "Encrypted Positions",
    desc: "Size, entry price, and leverage are encrypted with x25519 + RescueCipher before touching the blockchain.",
    color: "var(--color-green)",
  },
  {
    icon: "shield",
    title: "Private Liquidations",
    desc: "Liquidation thresholds computed inside Arcium MPC. Keepers only learn a boolean — not your prices.",
    color: "var(--color-blue)",
  },
  {
    icon: "visibility_off",
    title: "Confidential PnL",
    desc: "PnL calculated entirely in MPC and returned encrypted. Only you — with your private key — can decrypt.",
    color: "var(--color-purple)",
  },
  {
    icon: "group_off",
    title: "Anti Copy-Trading",
    desc: "Zero plaintext position data on-chain. Bots cannot shadow your trades.",
    color: "var(--color-green)",
  },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Encrypt Inputs", desc: "Browser generates ephemeral x25519 keypair. Position data encrypted with shared secret before leaving your device." },
  { step: "02", title: "Submit to Solana", desc: "Encrypted blobs stored on-chain. Anchor program queues computation to Arcium MPC network." },
  { step: "03", title: "MPC Computes", desc: "Arcium threshold MPC nodes execute the circuit on encrypted data. No node sees plaintext." },
  { step: "04", title: "Decrypt Locally", desc: "Encrypted result emitted in a Solana event. Your browser decrypts it with your private key only." },
];

// Hero slides — Pexels perp/trading images
const HERO_SLIDES = [
  {
    bg: "https://images.pexels.com/photos/6771985/pexels-photo-6771985.jpeg?auto=compress&cs=tinysrgb&w=1920",
    eyebrow: "GLOBAL INDICATORS",
    headline: ["TRADE PERPS.", "STAY INVISIBLE."],
    accent: 1, // which line gets grad-text
    sub: "Fully private perpetual futures powered by Arcium MPC. Execute institutional strategies without revealing your position.",
  },
  {
    bg: "https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=1920",
    eyebrow: "MPC-POWERED PRIVACY",
    headline: ["ZERO DATA.", "ON-CHAIN."],
    accent: 0,
    sub: "Your size, entry price, and leverage are encrypted before they ever touch the blockchain. Not even validators see your trades.",
  },
  {
    bg: "https://images.pexels.com/photos/6771900/pexels-photo-6771900.jpeg?auto=compress&cs=tinysrgb&w=1920",
    eyebrow: "INSTITUTIONAL GRADE",
    headline: ["BUILT FOR", "SPEED."],
    accent: 1,
    sub: "Sub-second order execution with 100x leverage. Private liquidations computed inside Arcium MPC — keepers only learn a boolean.",
  },
];

// Marquee ticker symbols
const TICKER_SYMBOLS = [
  { sym: "BTC", fallback: 67420 },
  { sym: "ETH", fallback: 3521 },
  { sym: "SOL", fallback: 142 },
  { sym: "BNB", fallback: 598 },
  { sym: "XRP", fallback: 0.62 },
  { sym: "ADA", fallback: 0.46 },
  { sym: "AVAX", fallback: 38.4 },
  { sym: "DOT", fallback: 7.8 },
  { sym: "MATIC", fallback: 0.89 },
  { sym: "LINK", fallback: 14.2 },
  { sym: "ATOM", fallback: 9.1 },
  { sym: "UNI", fallback: 6.7 },
];

export default function HomePage({ onLaunchApp, onSelectMarket }: Props) {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const { markets, wsConnected } = useMarketData();

  const [slide, setSlide] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [slideVisible, setSlideVisible] = useState(true);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-advance slides
  useEffect(() => {
    autoRef.current = setInterval(() => goTo((prev) => (prev + 1) % HERO_SLIDES.length), 6000);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, []);

  function goTo(indexOrFn: number | ((prev: number) => number)) {
    if (animating) return;
    setAnimating(true);
    setSlideVisible(false);
    setTimeout(() => {
      setSlide(typeof indexOrFn === "function" ? indexOrFn(slide) : indexOrFn);
      setSlideVisible(true);
      setAnimating(false);
    }, 450);
    // Reset auto timer
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => goTo((prev) => (prev + 1) % HERO_SLIDES.length), 6000);
  }

  function handleCTA() {
    if (!connected) { setVisible(true); } else { onLaunchApp(); }
  }

  function formatPrice(p: number, sym: string): string {
    if (p >= 10000) return `$${p.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    if (p >= 1) return `$${p.toFixed(2)}`;
    return `$${p.toFixed(4)}`;
  }

  function getTickerPrice(sym: string, fb: number): string {
    const key = `${sym}/USDC`;
    const p = markets[key]?.price ?? fb;
    if (p >= 10000) return `$${p.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    if (p >= 1) return `$${p.toFixed(2)}`;
    return `$${p.toFixed(4)}`;
  }

  function getTickerChange(sym: string): number {
    const key = `${sym}/USDC`;
    return markets[key]?.change ?? (Math.random() * 6 - 3);
  }

  const currentSlide = HERO_SLIDES[slide];

  return (
    <>
      {/* ── Injected styles ──────────────────────────────────────────────── */}
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes kenburns-0 {
          0%   { transform: scale(1)    translateX(0)     translateY(0); }
          100% { transform: scale(1.08) translateX(-1%)   translateY(-0.5%); }
        }
        @keyframes kenburns-1 {
          0%   { transform: scale(1)    translateX(0)     translateY(0); }
          100% { transform: scale(1.07) translateX(0.8%)  translateY(-1%); }
        }
        @keyframes kenburns-2 {
          0%   { transform: scale(1)    translateX(0)     translateY(0); }
          100% { transform: scale(1.09) translateX(-0.5%) translateY(0.5%); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes live-ping {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(1.5); }
        }

        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 40s linear infinite;
        }
        .marquee-track:hover { animation-play-state: paused; }

        .hero-slide-bg {
          position: absolute; inset: 0;
          background-size: cover;
          background-position: center;
          will-change: transform;
        }
        .hero-slide-bg.kb-0 { animation: kenburns-0 7s ease-out forwards; }
        .hero-slide-bg.kb-1 { animation: kenburns-1 7s ease-out forwards; }
        .hero-slide-bg.kb-2 { animation: kenburns-2 7s ease-out forwards; }

        .hero-content-enter .anim-eyebrow { animation: slide-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
        .hero-content-enter .anim-h1-0    { animation: slide-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.2s both; }
        .hero-content-enter .anim-h1-1    { animation: slide-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.3s both; }
        .hero-content-enter .anim-sub     { animation: slide-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.42s both; }
        .hero-content-enter .anim-btns    { animation: slide-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.52s both; }
        .hero-content-enter .anim-stats   { animation: slide-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.62s both; }

        .hero-content-exit  { opacity: 0; transform: translateY(-16px); transition: opacity 0.4s, transform 0.4s; }

        .slide-dot {
          width: 8px; height: 8px;
          border-radius: 9999px;
          background: rgba(255,255,255,0.3);
          transition: all 0.3s;
          cursor: pointer;
        }
        .slide-dot.active {
          background: #F5A623;
          width: 24px;
        }

        .ticker-item {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 0 24px;
          border-right: 1px solid rgba(255,255,255,0.08);
          white-space: nowrap;
        }

        .grad-text {
          background: linear-gradient(135deg, #F5A623 0%, #F7C948 60%, #E8873A 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .glass {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .enc-glow { box-shadow: 0 0 40px rgba(167,139,250,0.1), 0 0 80px rgba(34,211,165,0.05); }
        .chip-green { background: rgba(34,211,165,0.1); color: var(--color-green); border: 1px solid rgba(34,211,165,0.2); }
        .live-dot { display: inline-block; border-radius: 50%; background: var(--color-green); }
      `}</style>

      <div className="min-h-screen font-body" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>

        {/* ── Fixed Price Marquee ───────────────────────────────────────── */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            height: "36px",
            background: "rgba(5,5,8,0.92)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div className="marquee-track">
            {/* Double the array so it loops seamlessly */}
            {[...TICKER_SYMBOLS, ...TICKER_SYMBOLS].map((t, i) => {
              const change = getTickerChange(t.sym);
              const isUp = change >= 0;
              return (
                <span key={i} className="ticker-item">
                  <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em" }}>
                    {t.sym}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "11px", fontWeight: 700, color: "#fff" }}>
                    {getTickerPrice(t.sym, t.fallback)}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "10px", fontWeight: 600, color: isUp ? "#22D3A5" : "#F26B6B" }}>
                    {isUp ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
                  </span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Layout nav sits below marquee */}
        <div style={{ paddingTop: "36px" }}>
          <Layout activePage="home" onNavigate={(p) => p === "trade" && onLaunchApp()} />
        </div>

        {/* ── Hero Slider ───────────────────────────────────────────────── */}
        <section
          style={{
            position: "relative",
            minHeight: "100dvh",
            overflow: "hidden",
            marginTop: "-64px", // pull behind nav
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Background image with Ken Burns */}
          <div
            key={`bg-${slide}`}
            className={`hero-slide-bg kb-${slide}`}
            style={{ backgroundImage: `url(${currentSlide.bg})` }}
          />

          {/* Dark overlays */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.75) 100%)", zIndex: 1 }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 40%, rgba(0,0,0,0.5) 100%)", zIndex: 1 }} />
          {/* Subtle grid overlay on hero */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 1,
            backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />

          {/* Content */}
          <div
            key={`content-${slide}`}
            className={`hero-content-enter`}
            style={{
              position: "relative", zIndex: 10,
              width: "100%",
              maxWidth: "1100px",
              padding: "0 24px",
              paddingTop: "120px",
              paddingBottom: "120px",
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "0",
            }}
          >
            <div style={{ maxWidth: "680px" }}>
              {/* Eyebrow */}
              <div className="anim-eyebrow" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <div style={{ width: "32px", height: "2px", background: "#22D3A5" }} />
                <span style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  color: "rgba(255,255,255,0.6)",
                  textTransform: "uppercase",
                }}>
                  {currentSlide.eyebrow}
                </span>
              </div>

              {/* Headline */}
              <h1 style={{ margin: 0, lineHeight: 1, marginBottom: "24px" }}>
                <div
                  className={`anim-h1-0 font-display`}
                  style={{
                    fontSize: "clamp(52px, 8vw, 88px)",
                    fontWeight: 900,
                    letterSpacing: "-0.02em",
                    color: currentSlide.accent === 0 ? "transparent" : "#fff",
                    ...(currentSlide.accent === 0
                      ? { background: "linear-gradient(135deg, #F5A623, #F7C948, #E8873A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }
                      : {}),
                    lineHeight: 1,
                  }}
                >
                  {currentSlide.headline[0]}
                </div>
                <div
                  className={`anim-h1-1 font-display`}
                  style={{
                    fontSize: "clamp(52px, 8vw, 88px)",
                    fontWeight: 900,
                    letterSpacing: "-0.02em",
                    color: currentSlide.accent === 1 ? "transparent" : "#fff",
                    ...(currentSlide.accent === 1
                      ? { background: "linear-gradient(135deg, #F5A623, #F7C948, #E8873A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }
                      : {}),
                    lineHeight: 1.05,
                  }}
                >
                  {currentSlide.headline[1]}
                </div>
              </h1>

              {/* Sub */}
              <p className="anim-sub" style={{
                fontSize: "16px",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.65)",
                maxWidth: "480px",
                marginBottom: "36px",
              }}>
                {currentSlide.sub}
              </p>

              {/* CTA Buttons */}
              <div className="anim-btns" style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "48px" }}>
                <button
                  onClick={handleCTA}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "14px 32px",
                    borderRadius: "10px",
                    fontWeight: 700,
                    fontSize: "14px",
                    background: "#F5A623",
                    border: "none",
                    color: "#0a0a0f",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    letterSpacing: "0.04em",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#F7C948"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#F5A623"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  {connected ? "LAUNCH APP" : "EXPLORE"}
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_forward</span>
                </button>
                <button
                  onClick={() => connected ? onLaunchApp() : setVisible(true)}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "14px 32px",
                    borderRadius: "10px",
                    fontWeight: 700,
                    fontSize: "14px",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#fff",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    letterSpacing: "0.04em",
                    backdropFilter: "blur(8px)",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                >
                  SIGN IN
                </button>
              </div>

              {/* Stats */}
              <div className="anim-stats" style={{ display: "flex", flexWrap: "wrap", gap: "40px" }}>
                {[
                  { l: "Positions Encrypted", v: "100%" },
                  { l: "Plaintext On-chain",  v: "0 bytes" },
                  { l: "MPC Threshold",       v: "2-of-3" },
                ].map((m) => (
                  <div key={m.l}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 900, color: "#fff", lineHeight: 1 }}>{m.v}</div>
                    <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>{m.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Slide indicators + arrows */}
          <div style={{
            position: "absolute", bottom: "36px", left: "50%", transform: "translateX(-50%)",
            zIndex: 20, display: "flex", alignItems: "center", gap: "10px",
          }}>
            {HERO_SLIDES.map((_, i) => (
              <div
                key={i}
                className={`slide-dot${i === slide ? " active" : ""}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>

          {/* Scroll hint */}
          <div style={{
            position: "absolute", bottom: "36px", right: "24px", zIndex: 20,
            display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
          }}>
            <span className="material-symbols-outlined" style={{ color: "rgba(255,255,255,0.4)", fontSize: "20px", animation: "slide-up 1.5s ease-in-out infinite alternate" }}>keyboard_arrow_down</span>
          </div>
        </section>

        {/* ── How It Works ─────────────────────────────────────────────────── */}
        <section className="py-24 px-6" style={{ borderTop: "1px solid var(--color-border)" }}>
          <div className="max-w-[1100px] mx-auto">
            <div className="text-center mb-14">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
                style={{ background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.2)" }}
              >
                <span className="material-symbols-outlined icon-fill text-[12px]" style={{ color: "var(--color-blue)" }}>memory</span>
                <span className="font-mono text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--color-blue)" }}>Powered by Arcium MPC</span>
              </div>
              <h2 className="font-display text-4xl font-black text-white mb-3">How Privacy Works</h2>
              <p className="max-w-lg mx-auto" style={{ color: "var(--color-text-2)" }}>
                Every sensitive operation flows through Arcium's decentralized MPC network.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {HOW_IT_WORKS.map((step) => (
                <div
                  key={step.step}
                  className="glass p-5 rounded-xl transition-all hover:border-opacity-40"
                  style={{ border: "1px solid var(--color-border)" }}
                >
                  <div className="font-display text-4xl font-black mb-3" style={{ color: "rgba(167,139,250,0.2)" }}>{step.step}</div>
                  <h3 className="font-display text-base font-black text-white mb-2">{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-2)" }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Live Markets Preview ──────────────────────────────────────────── */}
        <section className="py-24 px-6" style={{ borderTop: "1px solid var(--color-border)" }}>
          <div className="max-w-[1100px] mx-auto">
            <div className="flex justify-between items-center mb-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-display text-3xl font-black text-white">Markets</h2>
                  {wsConnected && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md chip-green">
                      <span className="live-dot" style={{ width: 5, height: 5, animation: "live-ping 1.6s ease-out infinite" }} />
                      <span className="font-mono text-[8px] font-bold uppercase">Live</span>
                    </div>
                  )}
                </div>
                <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "var(--color-text-3)" }}>
                  Prices via Binance WebSocket
                </p>
              </div>
              <button
                onClick={onLaunchApp}
                className="font-mono text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 transition-all"
                style={{ color: "var(--color-green)" }}
              >
                View all
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MARKETS.slice(0, 6).map((m) => {
                const live = markets[m.symbol];
                const isUp = (live?.change ?? 0) >= 0;
                return (
                  <button
                    key={m.symbol}
                    onClick={() => onSelectMarket(m.symbol)}
                    className="glass p-4 rounded-xl text-left transition-all group"
                    style={{ border: "1px solid var(--color-border)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(34,211,165,0.2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(167,139,250,0.1)" }}>
                          <span className="material-symbols-outlined text-[16px]" style={{ color: "#A78BFA" }}>{m.icon}</span>
                        </div>
                        <div>
                          <div className="font-mono text-xs font-bold text-white">{m.symbol}</div>
                          <div className="font-mono text-[9px]" style={{ color: "var(--color-text-3)" }}>{m.label}</div>
                        </div>
                      </div>
                      <div className="chip-green px-2 py-0.5 rounded-full font-mono text-[8px] font-bold uppercase flex items-center gap-0.5">
                        <span className="material-symbols-outlined icon-fill text-[9px]">shield</span>
                        Private
                      </div>
                    </div>

                    <div className="font-display text-xl font-black text-white mb-0.5">
                      {formatPrice(live?.price ?? m.seedPrice, m.symbol)}
                    </div>
                    <div className="font-mono text-xs" style={{ color: isUp ? "var(--color-green)" : "var(--color-red)" }}>
                      {isUp ? "+" : ""}{(live?.change ?? 0).toFixed(2)}%
                    </div>

                    <div className="mt-3 pt-3 flex justify-between" style={{ borderTop: "1px solid var(--color-border)" }}>
                      <div>
                        <div className="font-mono text-[8px] uppercase tracking-wider" style={{ color: "var(--color-text-3)" }}>Volume</div>
                        <div className="font-mono text-xs" style={{ color: "var(--color-text)" }}>{live?.volume24h ?? "—"}</div>
                      </div>
                      <div>
                        <div className="font-mono text-[8px] uppercase tracking-wider" style={{ color: "var(--color-text-3)" }}>Funding</div>
                        <div className="font-mono text-xs" style={{ color: "var(--color-text)" }}>{(live?.fundingRate ?? 0.0082).toFixed(4)}%</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Privacy Features ─────────────────────────────────────────────── */}
        <section className="py-24 px-6" style={{ borderTop: "1px solid var(--color-border)", background: "rgba(0,0,0,0.2)" }}>
          <div className="max-w-[1100px] mx-auto">
            <h2 className="font-display text-3xl font-black text-white text-center mb-12">Privacy Guarantees</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRIVACY_FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="glass p-7 rounded-xl transition-all"
                  style={{ border: "1px solid var(--color-border)" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <span className="material-symbols-outlined icon-fill text-[20px]" style={{ color: f.color }}>{f.icon}</span>
                  </div>
                  <h3 className="font-display text-base font-black text-white mb-2">{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-2)" }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section className="py-28 px-6 relative overflow-hidden hero-bg" style={{ borderTop: "1px solid var(--color-border)" }}>
          <div className="max-w-[700px] mx-auto text-center relative z-10">
            <h2 className="font-display text-[48px] font-black text-white mb-5 leading-tight">
              Trade Without<br />
              <span className="grad-text">Fear of Exposure</span>
            </h2>
            <p className="mb-10 text-lg" style={{ color: "var(--color-text-2)" }}>
              Your positions, your secrets. Powered by Arcium MPC.
            </p>
            <button
              onClick={handleCTA}
              style={{
                fontWeight: 700,
                fontSize: "15px",
                padding: "16px 48px",
                borderRadius: "12px",
                background: "#F5A623",
                border: "none",
                color: "#0a0a0f",
                cursor: "pointer",
                transition: "all 0.2s",
                letterSpacing: "0.06em",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#F7C948"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#F5A623"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {connected ? "OPEN TRADING TERMINAL" : "CONNECT WALLET TO START"}
            </button>
          </div>
        </section>

      </div>
    </>
  );
}
