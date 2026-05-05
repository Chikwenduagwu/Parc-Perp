/**
 * TradingPage.tsx — Polished trading terminal
 * Theme: Cornsilk background · Crimson red · Ink black
 * Mobile: TopBar → MarketStrip → PriceHeader → StatsBar → Chart → Tabs[Order|Positions|Markets] → BottomNav(Home|Markets)
 * Desktop: [MarketList | Chart + Positions | TradingPanel]
 */

import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import MarketList from "../components/MarketList";
import TradingPanel from "../components/TradingPanel";
import PositionTable from "../components/PositionTable";
import PriceChart from "../components/PriceChart";
import { usePositions } from "../hooks/usePositions";
import { useMarketData } from "../hooks/useMarketData";
import type { AppPage } from "../App";

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  market: string;
  onNavigate: (p: AppPage) => void;
  onMarketChange: (m: string) => void;
}

type MobileTab = "order" | "positions" | "markets";

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  // Backgrounds — warm cornsilk paper
  bg:          "#FFF8DC",
  bgPaper:     "#FDF5CC",
  bgDeep:      "#F5EDB0",
  surface:     "#FFFEF7",
  surfaceCard: "#FFFCF0",

  // Ink
  ink:         "#0D0D0D",
  ink2:        "#1A1A1A",
  ink3:        "#3D3830",
  ink4:        "#7A7264",
  ink5:        "#B8B09E",

  // Red — primary accent
  red:         "#B71C1C",
  redBright:   "#D32F2F",
  redDeep:     "#7F0000",
  redDim:      "rgba(183,28,28,0.08)",
  redTint:     "rgba(183,28,28,0.15)",
  redBorder:   "rgba(183,28,28,0.25)",
  redGlow:     "rgba(211,47,47,0.20)",

  // Cornsilk tones — decorative
  gold:        "#C9963A",
  goldDim:     "rgba(201,150,58,0.12)",
  goldBorder:  "rgba(201,150,58,0.30)",

  // Status
  green:       "#1B6B45",
  greenBright: "#2E9E67",
  greenDim:    "rgba(27,107,69,0.10)",
  greenBorder: "rgba(27,107,69,0.25)",

  // Borders on cornsilk
  border:      "rgba(13,13,13,0.10)",
  border2:     "rgba(13,13,13,0.16)",
  border3:     "rgba(13,13,13,0.24)",
};

// ─── Tiny style helpers ───────────────────────────────────────────────────────
const mono: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };
const serif: React.CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const row = (extra?: React.CSSProperties): React.CSSProperties => ({
  display: "flex", alignItems: "center", ...extra,
});
const col = (extra?: React.CSSProperties): React.CSSProperties => ({
  display: "flex", flexDirection: "column", ...extra,
});

export default function TradingPage({
  market: initialMarket,
  onNavigate,
  onMarketChange,
}: Props) {
  const [selectedMarket, setSelectedMarket] = useState(initialMarket);
  const [mobileTab, setMobileTab]           = useState<MobileTab>("order");
  const [direction, setDirection]           = useState<"long" | "short">("long");

  const { markets, wsConnected, getCandles } = useMarketData();
  const {
    positions, computationStatus, lastTxSig,
    openPosition, closePosition, updatePnl,
  } = usePositions();

  const active        = markets[selectedMarket];
  const candles       = getCandles(selectedMarket);
  const prices        = Object.fromEntries(
    Object.entries(markets).map(([s, m]) => [s, m.price])
  );
  const openPositions = positions.filter((p) => p.status === "open");
  const totalPnl      = openPositions.reduce((s, p) => s + p.unrealizedPnl, 0);

  useEffect(() => { updatePnl(prices); }, [JSON.stringify(prices)]);

  function handleSelect(sym: string) {
    setSelectedMarket(sym);
    onMarketChange(sym);
    setMobileTab("order");
  }

  function formatPrice(p: number): string {
    if (!p) return "—";
    if (p >= 10000)
      return `$${p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (p >= 1) return `$${p.toFixed(2)}`;
    return `$${p.toFixed(4)}`;
  }

  function formatPnl(v: number): string {
    return `${v >= 0 ? "+" : ""}$${Math.abs(v).toFixed(2)}`;
  }

  // ─── Atoms ──────────────────────────────────────────────────────────────────

  /** WebSocket live/connecting badge */
  const WsBadge = () => (
    <div style={{
      ...row({ gap: 6 }),
      padding: "3px 10px", borderRadius: 3,
      background: wsConnected ? "rgba(27,107,69,0.08)" : "rgba(201,150,58,0.10)",
      border: `1px solid ${wsConnected ? T.greenBorder : T.goldBorder}`,
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: "50%", display: "inline-block",
        background: wsConnected ? T.green : T.gold,
        boxShadow: wsConnected ? `0 0 6px ${T.greenBright}` : `0 0 6px ${T.gold}`,
      }} />
      <span style={{
        ...mono, fontSize: 9, fontWeight: 700,
        textTransform: "uppercase", letterSpacing: 1,
        color: wsConnected ? T.green : T.gold,
      }}>
        {wsConnected ? "Live" : "Connecting…"}
      </span>
    </div>
  );

  /** MPC encrypted shield badge */
  const MpcBadge = () => (
    <div style={{
      ...row({ gap: 5 }),
      padding: "3px 10px", borderRadius: 3,
      background: T.redDim, border: `1px solid ${T.redBorder}`,
      ...mono, fontSize: 8, fontWeight: 700,
      textTransform: "uppercase", letterSpacing: 1, color: T.red,
    }}>
      <span className="material-symbols-outlined icon-fill" style={{ fontSize: 11 }}>shield</span>
      MPC Secured
    </div>
  );

  /** Price change pill */
  const ChangePill = ({ change, size = 10 }: { change: number; size?: number }) => (
    <span style={{
      ...mono, fontSize: size, fontWeight: 700,
      padding: "2px 8px", borderRadius: 2,
      color: change >= 0 ? T.green : T.red,
      background: change >= 0 ? T.greenDim : T.redDim,
      border: `1px solid ${change >= 0 ? T.greenBorder : T.redBorder}`,
    }}>
      {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
    </span>
  );

  // ─── Mobile: Horizontal market strip ────────────────────────────────────────

  const MarketStrip = () => (
    <div style={{
      display: "flex", overflowX: "auto",
      background: T.bgPaper, borderBottom: `1px solid ${T.border}`,
      scrollbarWidth: "none",
    }}>
      {Object.entries(markets).map(([sym, m]) => {
        const sel = sym === selectedMarket;
        return (
          <button key={sym} onClick={() => handleSelect(sym)} style={{
            flexShrink: 0, padding: "8px 16px", background: "none", border: "none",
            borderBottom: sel ? `2px solid ${T.red}` : "2px solid transparent",
            borderRight: `1px solid ${T.border}`,
            cursor: "pointer", textAlign: "left",
            background: sel ? T.redDim : "transparent",
          }}>
            <div style={{
              ...mono, fontSize: 10, fontWeight: 700,
              color: sel ? T.red : T.ink3,
            }}>
              {sym.replace("USDT", "")} <span style={{ fontWeight: 400, color: T.ink5 }}>/ USDT</span>
            </div>
            <div style={{
              ...mono, fontSize: 9, marginTop: 2,
              color: m.change >= 0 ? T.green : T.red,
            }}>
              {m.change >= 0 ? "+" : ""}{m.change.toFixed(2)}%
            </div>
          </button>
        );
      })}
    </div>
  );

  // ─── Mobile: Price header ────────────────────────────────────────────────────

  const PriceHeaderBar = () => (
    <div style={{
      ...row({ justifyContent: "space-between", flexWrap: "wrap", gap: 12 }),
      padding: "12px 16px", background: T.surface,
      borderBottom: `1px solid ${T.border}`, flexShrink: 0,
    }}>
      <div>
        <div style={{ ...mono, fontSize: 9, textTransform: "uppercase",
          letterSpacing: 2, color: T.ink4, marginBottom: 3 }}>
          {selectedMarket}
        </div>
        <div style={row({ gap: 10 })}>
          <span style={{
            ...mono, fontSize: 22, fontWeight: 700, color: T.ink,
            letterSpacing: "-0.03em",
          }}>
            {formatPrice(active?.price ?? 0)}
          </span>
          {active && <ChangePill change={active.change} />}
        </div>
      </div>
      <WsBadge />
    </div>
  );

  // ─── Mobile: Stats bar ──────────────────────────────────────────────────────

  const StatsBar = () => (
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(4,1fr)",
      background: T.bgDeep, borderBottom: `1px solid ${T.border}`,
      padding: "7px 16px",
    }}>
      {active && [
        { l: "High",    v: formatPrice(active.high24h) },
        { l: "Low",     v: formatPrice(active.low24h) },
        { l: "Volume",  v: active.volume24h },
        { l: "Funding", v: `${active.fundingRate.toFixed(4)}%` },
      ].map((s) => (
        <div key={s.l}>
          <div style={{ ...mono, fontSize: 8, textTransform: "uppercase",
            letterSpacing: 1, color: T.ink4 }}>{s.l}</div>
          <div style={{ ...mono, fontSize: 10, color: T.ink2, marginTop: 1 }}>{s.v}</div>
        </div>
      ))}
    </div>
  );

  // ─── Mobile: Tab bar ────────────────────────────────────────────────────────

  const TABS: { id: MobileTab; label: string; count?: number }[] = [
    { id: "order",     label: "Order" },
    { id: "positions", label: "Positions", count: openPositions.length || undefined },
    { id: "markets",   label: "Markets" },
  ];

  const MobileTabBar = () => (
    <div style={{
      display: "flex", background: T.bgPaper,
      borderBottom: `1px solid ${T.border}`, flexShrink: 0,
    }}>
      {TABS.map((t) => {
        const active = mobileTab === t.id;
        return (
          <button key={t.id} onClick={() => setMobileTab(t.id)} style={{
            flex: 1, padding: "11px 4px", background: "none", border: "none",
            borderBottom: active ? `2px solid ${T.red}` : "2px solid transparent",
            ...mono, fontSize: 10, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: 1, cursor: "pointer",
            color: active ? T.red : T.ink4,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            {t.label}
            {t.count != null && (
              <span style={{
                background: T.red, color: "#FFF8DC",
                borderRadius: 10, fontSize: 8, fontWeight: 700,
                padding: "1px 5px", lineHeight: 1.5,
              }}>{t.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );

  // ─── Mobile: Order panel ────────────────────────────────────────────────────

  const MobileOrderPanel = () => (
    <div style={{ padding: "16px 16px 32px" }}>
      {/* MPC badge */}
      <div style={{ marginBottom: 14 }}><MpcBadge /></div>

      {/* Direction toggle */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        border: `1px solid ${T.border}`, borderRadius: 6,
        overflow: "hidden", marginBottom: 16,
      }}>
        {(["long", "short"] as const).map((dir) => (
          <button key={dir} onClick={() => setDirection(dir)} style={{
            padding: "10px 0", border: "none", cursor: "pointer",
            ...mono, fontSize: 11, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: 1,
            background: direction === dir
              ? (dir === "long" ? T.greenDim : T.redDim)
              : "transparent",
            color: direction === dir
              ? (dir === "long" ? T.green : T.red)
              : T.ink4,
            borderBottom: direction === dir
              ? `2px solid ${dir === "long" ? T.green : T.red}`
              : "2px solid transparent",
            transition: "all 150ms ease",
          }}>
            {dir === "long" ? "▲ Long" : "▼ Short"}
          </button>
        ))}
      </div>

      {/* Inputs */}
      {[
        { label: "Size (USDT)", placeholder: "0.00", suffix: "USDT" },
        { label: "Leverage", placeholder: "1×", suffix: "×" },
      ].map((field) => (
        <div key={field.label} style={{ marginBottom: 14 }}>
          <div style={{
            ...mono, fontSize: 9, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: 1,
            color: T.ink4, marginBottom: 5,
          }}>
            {field.label}
          </div>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder={field.placeholder}
              style={{
                width: "100%",
                background: T.bgPaper,
                border: `1.5px solid ${T.border2}`,
                borderRadius: 4,
                padding: "11px 40px 11px 12px",
                ...mono, fontSize: 15, color: T.ink,
                outline: "none",
              }}
            />
            <span style={{
              position: "absolute", right: 12, top: "50%",
              transform: "translateY(-50%)",
              ...mono, fontSize: 10, fontWeight: 700, color: T.red,
            }}>{field.suffix}</span>
          </div>
        </div>
      ))}

      {/* Leverage quick chips */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
        {["1×", "5×", "10×", "25×", "50×"].map((lev) => (
          <button key={lev} style={{
            padding: "5px 12px",
            border: `1px solid ${T.border2}`,
            borderRadius: 3, background: "transparent",
            ...mono, fontSize: 9, fontWeight: 700, color: T.ink3,
            cursor: "pointer",
          }}>{lev}</button>
        ))}
      </div>

      {/* Summary row */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 10, marginBottom: 18,
        padding: "12px 14px",
        background: T.bgDeep, borderRadius: 5,
        border: `1px solid ${T.border}`,
      }}>
        {[
          { l: "Entry", v: formatPrice(active?.price ?? 0) },
          { l: "Est. Liq.", v: "—" },
          { l: "Margin", v: "—" },
          { l: "Notional", v: "—" },
        ].map((s) => (
          <div key={s.l}>
            <div style={{ ...mono, fontSize: 8, textTransform: "uppercase",
              letterSpacing: 1, color: T.ink4 }}>{s.l}</div>
            <div style={{ ...mono, fontSize: 11, color: T.ink2, marginTop: 2 }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <TradingPanel
        market={selectedMarket}
        currentPrice={active?.price ?? 0}
        computationStatus={computationStatus}
        lastTxSig={lastTxSig}
        onOpenPosition={openPosition}
      />
    </div>
  );

  // ─── Mobile: Positions panel ─────────────────────────────────────────────────

  const MobilePositionsPanel = () => (
    <div style={{ padding: "12px 16px 32px" }}>
      {/* PnL summary pill */}
      {openPositions.length > 0 && (
        <div style={{
          ...row({ gap: 8, justifyContent: "space-between" }),
          padding: "10px 14px", borderRadius: 6, marginBottom: 14,
          background: totalPnl >= 0 ? T.greenDim : T.redDim,
          border: `1px solid ${totalPnl >= 0 ? T.greenBorder : T.redBorder}`,
        }}>
          <span style={{ ...mono, fontSize: 9, textTransform: "uppercase",
            letterSpacing: 1, color: T.ink4 }}>Total Unrealized PnL</span>
          <span style={{
            ...mono, fontSize: 13, fontWeight: 700,
            color: totalPnl >= 0 ? T.green : T.red,
          }}>{formatPnl(totalPnl)}</span>
        </div>
      )}

      {openPositions.length === 0 ? (
        <div style={{
          ...col({ alignItems: "center" }), padding: "40px 0",
          ...mono, fontSize: 11, color: T.ink5,
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 32, color: T.ink5, marginBottom: 8 }}>
            candlestick_chart
          </span>
          No open positions
        </div>
      ) : (
        <PositionTable
          positions={positions}
          currentPrices={prices}
          onClose={closePosition}
        />
      )}
    </div>
  );

  // ─── Mobile: Markets panel ────────────────────────────────────────────────────

  const MobileMarketsPanel = () => (
    <div>
      {/* Header */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr auto",
        padding: "7px 16px", background: T.bgDeep,
        borderBottom: `1px solid ${T.border}`,
      }}>
        {["Pair", "Price", "24h"].map((h) => (
          <div key={h} style={{
            ...mono, fontSize: 8, textTransform: "uppercase",
            letterSpacing: 1, color: T.ink4,
            textAlign: h === "Pair" ? "left" : "right",
          }}>{h}</div>
        ))}
      </div>

      {Object.entries(markets).map(([sym, m]) => {
        const sel = sym === selectedMarket;
        return (
          <button key={sym} onClick={() => handleSelect(sym)} style={{
            width: "100%", display: "grid",
            gridTemplateColumns: "1fr 1fr auto",
            alignItems: "center", padding: "13px 16px",
            background: sel ? T.redDim : "transparent",
            border: "none", borderBottom: `1px solid ${T.border}`,
            borderLeft: sel ? `3px solid ${T.red}` : "3px solid transparent",
            cursor: "pointer", gap: 4,
          }}>
            <div style={{ textAlign: "left" }}>
              <div style={{
                ...mono, fontSize: 11, fontWeight: 700,
                color: sel ? T.red : T.ink,
              }}>
                {sym.replace("USDT", "")}
                <span style={{ fontWeight: 400, color: T.ink4, fontSize: 9 }}>/USDT</span>
              </div>
              <div style={{ ...mono, fontSize: 9, color: T.ink5, marginTop: 1 }}>
                Vol {m.volume24h}
              </div>
            </div>
            <div style={{
              textAlign: "right",
              ...mono, fontSize: 12, fontWeight: 700, color: T.ink,
            }}>
              {formatPrice(m.price)}
            </div>
            <div style={{ textAlign: "right" }}>
              <ChangePill change={m.change} size={9} />
            </div>
          </button>
        );
      })}
    </div>
  );

  // ─── Mobile: 2-item bottom nav ────────────────────────────────────────────────

  const BottomNav = () => (
    <div style={{
      display: "flex", background: T.ink, borderTop: `1px solid rgba(255,248,220,0.08)`,
      flexShrink: 0,
      paddingBottom: "env(safe-area-inset-bottom)",
    }}>
      {[
        { page: "home" as AppPage,    icon: "home",       label: "Home" },
        { page: "markets" as AppPage, icon: "bar_chart",  label: "Markets" },
      ].map((item) => (
        <button
          key={item.page}
          onClick={() => onNavigate(item.page)}
          style={{
            flex: 1, background: "none", border: "none",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "10px 4px 8px", gap: 4, cursor: "pointer",
            minHeight: 56,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 22, color: T.bg }}>
            {item.icon}
          </span>
          <span style={{
            ...mono, fontSize: 9, textTransform: "uppercase",
            letterSpacing: 1, color: T.bg, opacity: 0.8,
          }}>
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );

  // ─── Desktop: Market header bar ───────────────────────────────────────────────

  const DesktopMarketHeader = () => (
    <div style={{
      height: 56, ...row({ justifyContent: "space-between" }),
      padding: "0 20px", flexShrink: 0,
      borderBottom: `1px solid ${T.border}`,
      background: T.surface,
    }}>
      {/* Left: symbol + price + stats */}
      <div style={row({ gap: 28 })}>
        <div>
          <div style={{ ...mono, fontSize: 9, textTransform: "uppercase",
            letterSpacing: 2, color: T.ink4, marginBottom: 2 }}>
            {selectedMarket}
          </div>
          <div style={row({ gap: 10 })}>
            <span style={{
              ...mono, fontSize: 18, fontWeight: 700, color: T.ink,
              letterSpacing: "-0.02em",
            }}>
              {formatPrice(active?.price ?? 0)}
            </span>
            {active && <ChangePill change={active.change} />}
          </div>
        </div>

        {active && (
          <div style={row({ gap: 22 })}>
            {[
              { l: "24h High", v: formatPrice(active.high24h) },
              { l: "24h Low",  v: formatPrice(active.low24h) },
              { l: "Volume",   v: active.volume24h },
              { l: "Funding",  v: `${active.fundingRate.toFixed(4)}%/hr` },
            ].map((s) => (
              <div key={s.l}>
                <div style={{ ...mono, fontSize: 8, textTransform: "uppercase",
                  letterSpacing: 1, color: T.ink4 }}>{s.l}</div>
                <div style={{ ...mono, fontSize: 11, color: T.ink2, marginTop: 1 }}>{s.v}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: active positions + WS */}
      <div style={row({ gap: 12 })}>
        {openPositions.length > 0 && (
          <div style={{
            ...row({ gap: 6 }), padding: "4px 10px", borderRadius: 3,
            background: totalPnl >= 0 ? T.greenDim : T.redDim,
            border: `1px solid ${totalPnl >= 0 ? T.greenBorder : T.redBorder}`,
          }}>
            <span className="material-symbols-outlined icon-fill"
              style={{ fontSize: 12, color: totalPnl >= 0 ? T.green : T.red }}>
              trending_up
            </span>
            <span style={{ ...mono, fontSize: 10 }}>
              <span style={{ color: totalPnl >= 0 ? T.green : T.red, fontWeight: 700 }}>
                {formatPnl(totalPnl)}
              </span>
              <span style={{ color: T.ink4 }}> · {openPositions.length} open</span>
            </span>
          </div>
        )}
        <WsBadge />
      </div>
    </div>
  );

  // ─── Desktop: Order sidebar header ────────────────────────────────────────────

  const OrderSidebarHeader = () => (
    <div style={{
      padding: "12px 16px",
      borderBottom: `1px solid ${T.border}`,
      ...row({ justifyContent: "space-between" }), flexShrink: 0,
      background: T.bgPaper,
    }}>
      <div style={{ ...row({ gap: 8 }) }}>
        {(["long", "short"] as const).map((dir) => (
          <button key={dir} onClick={() => setDirection(dir)} style={{
            padding: "5px 14px", border: "none", borderRadius: 3, cursor: "pointer",
            ...mono, fontSize: 10, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: 1,
            background: direction === dir
              ? (dir === "long" ? T.greenDim : T.redDim)
              : "transparent",
            color: direction === dir
              ? (dir === "long" ? T.green : T.red)
              : T.ink4,
            border: `1px solid ${direction === dir
              ? (dir === "long" ? T.greenBorder : T.redBorder)
              : T.border}`,
            transition: "all 150ms",
          }}>
            {dir === "long" ? "▲ Long" : "▼ Short"}
          </button>
        ))}
      </div>
      <MpcBadge />
    </div>
  );

  // ─── Render ────────────────────────────────────────────────────────────────────

  return (
    <div style={{
      height: "100dvh", display: "flex", flexDirection: "column",
      overflow: "hidden", background: T.bg, color: T.ink,
      fontFamily: "'IBM Plex Mono', monospace",
    }}>

      {/* Desktop top nav */}
      <div className="hidden md:block">
        <Layout activePage="trade" onNavigate={onNavigate} />
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          MOBILE LAYOUT
          ════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col flex-1 overflow-hidden md:hidden" style={{ minHeight: 0 }}>

        {/* Top bar */}
        <div style={{
          ...row({ justifyContent: "space-between" }),
          padding: "0 16px", height: 46,
          background: T.ink, flexShrink: 0,
        }}>
          {/* Wordmark */}
          <span style={{
            ...serif, fontSize: 18, fontWeight: 600,
            letterSpacing: 3, color: T.bg,
            fontStyle: "italic",
          }}>
            Arcium
          </span>

          <div style={row({ gap: 8 })}>
            {openPositions.length > 0 && (
              <div style={{
                ...row({ gap: 5 }), padding: "3px 8px", borderRadius: 3,
                background: "rgba(255,248,220,0.10)",
                border: "1px solid rgba(255,248,220,0.20)",
              }}>
                <span className="material-symbols-outlined icon-fill"
                  style={{ fontSize: 11, color: T.bg }}>shield</span>
                <span style={{ ...mono, fontSize: 9, color: T.bg, opacity: 0.9 }}>
                  {openPositions.length} active
                </span>
              </div>
            )}
            <WsBadge />
          </div>
        </div>

        {/* Market strip */}
        <MarketStrip />

        {/* Price header */}
        <PriceHeaderBar />

        {/* Stats row */}
        <StatsBar />

        {/* Chart */}
        <div style={{ height: 155, flexShrink: 0, overflow: "hidden",
          borderBottom: `1px solid ${T.border}` }}>
          <PriceChart
            symbol={selectedMarket}
            price={active?.price ?? 0}
            change={active?.change ?? 0}
            candles={candles}
            unrealizedPnl={openPositions.length > 0 ? totalPnl : undefined}
            isLive={wsConnected && (active?.isLive ?? false)}
          />
        </div>

        {/* Tab bar */}
        <MobileTabBar />

        {/* Tab panels */}
        <div style={{ flex: 1, overflowY: "auto", background: T.bg, minHeight: 0 }}>
          {mobileTab === "order"     && <MobileOrderPanel />}
          {mobileTab === "positions" && <MobilePositionsPanel />}
          {mobileTab === "markets"   && <MobileMarketsPanel />}
        </div>

        {/* Bottom nav — Home + Markets only */}
        <BottomNav />
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          DESKTOP LAYOUT
          ════════════════════════════════════════════════════════════════════ */}
      <main
        className="hidden md:flex flex-1 overflow-hidden mt-14"
        style={{ gap: 1, background: T.border }}
      >
        {/* Left: market list */}
        <div style={{ background: T.surface, flexShrink: 0, overflowY: "auto" }}>
          <MarketList
            markets={markets}
            selected={selectedMarket}
            onSelect={handleSelect}
            wsConnected={wsConnected}
          />
        </div>

        {/* Center: chart + positions */}
        <section style={{
          flex: 1, display: "flex", flexDirection: "column",
          minWidth: 0, overflow: "hidden", background: T.bg,
        }}>
          <DesktopMarketHeader />

          <PriceChart
            symbol={selectedMarket}
            price={active?.price ?? 0}
            change={active?.change ?? 0}
            candles={candles}
            unrealizedPnl={openPositions.length > 0 ? totalPnl : undefined}
            isLive={wsConnected && (active?.isLive ?? false)}
          />

          <PositionTable
            positions={positions}
            currentPrices={prices}
            onClose={closePosition}
          />
        </section>

        {/* Right: order panel */}
        <aside style={{
          width: 288, display: "flex", flexDirection: "column",
          height: "100%", flexShrink: 0,
          background: T.surface, borderLeft: `1px solid ${T.border}`,
        }}>
          <OrderSidebarHeader />

          <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
            {/* Inputs */}
            {[
              { label: "Size (USDT)", placeholder: "0.00", suffix: "USDT" },
              { label: "Leverage",    placeholder: "1×",   suffix: "×" },
            ].map((field) => (
              <div key={field.label} style={{ marginBottom: 14 }}>
                <div style={{
                  ...mono, fontSize: 9, fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: 1,
                  color: T.ink4, marginBottom: 5,
                }}>
                  {field.label}
                </div>
                <div style={{ position: "relative" }}>
                  <input type="text" placeholder={field.placeholder} style={{
                    width: "100%", background: T.bgPaper,
                    border: `1.5px solid ${T.border2}`, borderRadius: 4,
                    padding: "10px 40px 10px 12px",
                    ...mono, fontSize: 15, color: T.ink, outline: "none",
                  }} />
                  <span style={{
                    position: "absolute", right: 10, top: "50%",
                    transform: "translateY(-50%)",
                    ...mono, fontSize: 9, fontWeight: 700, color: T.red,
                  }}>{field.suffix}</span>
                </div>
              </div>
            ))}

            {/* Leverage chips */}
            <div style={{ display: "flex", gap: 5, marginBottom: 16, flexWrap: "wrap" }}>
              {["1×", "5×", "10×", "25×", "50×"].map((lev) => (
                <button key={lev} style={{
                  padding: "4px 10px", border: `1px solid ${T.border2}`,
                  borderRadius: 3, background: "transparent",
                  ...mono, fontSize: 9, fontWeight: 700, color: T.ink3,
                  cursor: "pointer",
                }}>{lev}</button>
              ))}
            </div>

            {/* Summary */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: 8, marginBottom: 16,
              padding: "10px 12px", background: T.bgDeep,
              borderRadius: 4, border: `1px solid ${T.border}`,
            }}>
              {[
                { l: "Entry",    v: formatPrice(active?.price ?? 0) },
                { l: "Est. Liq", v: "—" },
                { l: "Margin",   v: "—" },
                { l: "Notional", v: "—" },
              ].map((s) => (
                <div key={s.l}>
                  <div style={{ ...mono, fontSize: 8, textTransform: "uppercase",
                    letterSpacing: 1, color: T.ink4 }}>{s.l}</div>
                  <div style={{ ...mono, fontSize: 11, color: T.ink2, marginTop: 1 }}>{s.v}</div>
                </div>
              ))}
            </div>

            <TradingPanel
              market={selectedMarket}
              currentPrice={active?.price ?? 0}
              computationStatus={computationStatus}
              lastTxSig={lastTxSig}
              onOpenPosition={openPosition}
            />
          </div>
        </aside>
      </main>
    </div>
  );
}
