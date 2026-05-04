/**
 * TradingPage.tsx — Full trading terminal (mobile-responsive rewrite)
 * Theme: Cornsilk · Red · Black — minimalist
 * Layout:
 *   Mobile:  TopBar → MarketStrip → PriceHeader → Chart → Tabs[Order|Positions|Markets] → BottomNav
 *   Desktop: [MarketList | Chart + Positions | TradingPanel]
 * Live data from Binance WebSocket. Real Arcium MPC on position open/close.
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

interface Props {
  market: string;
  onNavigate: (p: AppPage) => void;
  onMarketChange: (m: string) => void;
}

type MobileTab = "order" | "positions" | "markets";

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  bg:        "#0a0a0a",
  surface:   "#111111",
  surface2:  "#181818",
  border:    "#222222",
  cornsilk:  "#FFF8DC",
  cornMuted: "#C8C2A8",
  cornDim:   "#6B6655",
  red:       "#C0392B",
  redGlow:   "rgba(192,57,43,0.15)",
  redBorder: "rgba(192,57,43,0.3)",
};

export default function TradingPage({ market: initialMarket, onNavigate, onMarketChange }: Props) {
  const [selectedMarket, setSelectedMarket] = useState(initialMarket);
  const [mobileTab, setMobileTab]           = useState<MobileTab>("order");

  const { markets, wsConnected, getCandles } = useMarketData();
  const { positions, computationStatus, lastTxSig, openPosition, closePosition, updatePnl } = usePositions();

  const active        = markets[selectedMarket];
  const candles       = getCandles(selectedMarket);
  const prices        = Object.fromEntries(Object.entries(markets).map(([s, m]) => [s, m.price]));
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
    if (p >= 10000) return `$${p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (p >= 1)     return `$${p.toFixed(2)}`;
    return `$${p.toFixed(4)}`;
  }

  // ─── Atoms ────────────────────────────────────────────────────────────────

  const WsBadge = () => (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "3px 10px", borderRadius: 3,
      background: wsConnected ? "rgba(255,248,220,0.04)" : T.redGlow,
      border: `1px solid ${wsConnected ? "rgba(255,248,220,0.15)" : T.redBorder}`,
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: "50%", display: "inline-block",
        background: wsConnected ? T.cornsilk : T.red,
      }} />
      <span style={{
        fontFamily: "monospace", fontSize: 9, fontWeight: 700,
        textTransform: "uppercase" as const, letterSpacing: 1,
        color: wsConnected ? T.cornsilk : T.red,
      }}>
        {wsConnected ? "Binance Live" : "Connecting…"}
      </span>
    </div>
  );

  const MpcBadge = () => (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 8px", borderRadius: 3,
      background: T.redGlow, border: `1px solid ${T.redBorder}`,
      fontFamily: "monospace", fontSize: 8, fontWeight: 700,
      textTransform: "uppercase" as const, letterSpacing: 1, color: T.red,
    }}>
      ⬡ MPC Encrypted
    </div>
  );

  const ChangePill = ({ change }: { change: number }) => (
    <span style={{
      fontFamily: "monospace", fontSize: 10, fontWeight: 700,
      padding: "2px 8px", borderRadius: 3,
      color: change >= 0 ? T.cornsilk : T.red,
      background: change >= 0 ? "rgba(255,248,220,0.08)" : T.redGlow,
      border: `1px solid ${change >= 0 ? "rgba(255,248,220,0.2)" : T.redBorder}`,
    }}>
      {change >= 0 ? "+" : ""}{change.toFixed(2)}%
    </span>
  );

  // ─── Mobile sub-components ─────────────────────────────────────────────────

  const MarketStrip = () => (
    <div style={{
      display: "flex", overflowX: "auto", background: T.surface,
      borderBottom: `1px solid ${T.border}`,
      scrollbarWidth: "none" as const,
    }}>
      {Object.entries(markets).map(([sym, m]) => {
        const sel = sym === selectedMarket;
        return (
          <button key={sym} onClick={() => handleSelect(sym)} style={{
            flexShrink: 0, padding: "8px 14px", background: "none", border: "none",
            borderRight: `1px solid ${T.border}`,
            borderBottom: sel ? `2px solid ${T.cornsilk}` : "2px solid transparent",
            cursor: "pointer", textAlign: "left" as const,
          }}>
            <div style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700,
              color: sel ? T.cornsilk : T.cornMuted }}>
              {sym.replace("USDT", "")}
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 9, marginTop: 1,
              color: m.change >= 0 ? T.cornsilk : T.red }}>
              {m.change >= 0 ? "+" : ""}{m.change.toFixed(2)}%
            </div>
          </button>
        );
      })}
    </div>
  );

  const PriceHeaderBar = () => (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 16px", background: T.surface,
      borderBottom: `1px solid ${T.border}`, flexShrink: 0,
    }}>
      <div>
        <div style={{ fontFamily: "monospace", fontSize: 9, textTransform: "uppercase" as const,
          letterSpacing: 2, color: T.cornDim, marginBottom: 2 }}>
          {selectedMarket}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 700, color: T.cornsilk }}>
            {formatPrice(active?.price ?? 0)}
          </span>
          {active && <ChangePill change={active.change} />}
        </div>
      </div>
      <WsBadge />
    </div>
  );

  const StatsBar = () => (
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(4,1fr)",
      background: T.surface2, borderBottom: `1px solid ${T.border}`,
      padding: "6px 16px",
    }}>
      {active && [
        { l: "High",    v: formatPrice(active.high24h) },
        { l: "Low",     v: formatPrice(active.low24h) },
        { l: "Volume",  v: active.volume24h },
        { l: "Funding", v: `${active.fundingRate.toFixed(4)}%` },
      ].map((s) => (
        <div key={s.l}>
          <div style={{ fontFamily: "monospace", fontSize: 8, textTransform: "uppercase" as const,
            letterSpacing: 1, color: T.cornDim }}>{s.l}</div>
          <div style={{ fontFamily: "monospace", fontSize: 10, color: T.cornMuted, marginTop: 1 }}>{s.v}</div>
        </div>
      ))}
    </div>
  );

  const TABS: { id: MobileTab; label: string }[] = [
    { id: "order",     label: "Order" },
    { id: "positions", label: openPositions.length > 0 ? `Positions (${openPositions.length})` : "Positions" },
    { id: "markets",   label: "Markets" },
  ];

  const MobileTabBar = () => (
    <div style={{ display: "flex", background: T.surface, borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
      {TABS.map((t) => (
        <button key={t.id} onClick={() => setMobileTab(t.id)} style={{
          flex: 1, padding: "10px 4px", background: "none", border: "none",
          borderBottom: mobileTab === t.id ? `2px solid ${T.cornsilk}` : "2px solid transparent",
          fontFamily: "monospace", fontSize: 10, fontWeight: 700,
          textTransform: "uppercase" as const, letterSpacing: 1, cursor: "pointer",
          color: mobileTab === t.id ? T.cornsilk : T.cornDim,
        }}>
          {t.label}
        </button>
      ))}
    </div>
  );

  const BottomNav = () => (
    <div style={{ display: "flex", background: T.surface, borderTop: `1px solid ${T.border}`, flexShrink: 0 }}>
      {([
        { page: "trade",    icon: "candlestick_chart", label: "Trade" },
        { page: "markets",  icon: "bar_chart",         label: "Markets" },
        { page: "history",  icon: "receipt_long",      label: "History" },
        { page: "settings", icon: "tune",              label: "Settings" },
      ] as { page: AppPage; icon: string; label: string }[]).map((item) => {
        const active = item.page === "trade";
        return (
          <button key={item.page} onClick={() => onNavigate(item.page)} style={{
            flex: 1, background: "none", border: "none",
            display: "flex", flexDirection: "column" as const,
            alignItems: "center", justifyContent: "center",
            padding: "8px 4px 6px", gap: 3, cursor: "pointer",
          }}>
            <span className="material-symbols-outlined"
              style={{ fontSize: 18, color: active ? T.cornsilk : T.cornDim }}>
              {item.icon}
            </span>
            <span style={{
              fontFamily: "monospace", fontSize: 8,
              textTransform: "uppercase" as const, letterSpacing: 1,
              color: active ? T.cornsilk : T.cornDim,
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );

  // ─── Desktop header bar ────────────────────────────────────────────────────

  const DesktopMarketHeader = () => (
    <div style={{
      height: 56, display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "0 20px", flexShrink: 0,
      borderBottom: `1px solid ${T.border}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div>
          <div style={{ fontFamily: "monospace", fontSize: 9, textTransform: "uppercase" as const,
            letterSpacing: 2, color: T.cornDim, marginBottom: 2 }}>
            {selectedMarket}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 700, color: T.cornsilk }}>
              {formatPrice(active?.price ?? 0)}
            </span>
            {active && <ChangePill change={active.change} />}
          </div>
        </div>

        {active && (
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {[
              { l: "24h High", v: formatPrice(active.high24h) },
              { l: "24h Low",  v: formatPrice(active.low24h) },
              { l: "Volume",   v: active.volume24h },
              { l: "Funding",  v: `${active.fundingRate.toFixed(4)}%/hr` },
            ].map((s) => (
              <div key={s.l}>
                <div style={{ fontFamily: "monospace", fontSize: 8, textTransform: "uppercase" as const,
                  letterSpacing: 1, color: T.cornDim }}>{s.l}</div>
                <div style={{ fontFamily: "monospace", fontSize: 11, color: T.cornMuted, marginTop: 1 }}>{s.v}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {openPositions.length > 0 && (
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "4px 10px", borderRadius: 3,
            background: "rgba(255,248,220,0.04)",
            border: "1px solid rgba(255,248,220,0.15)",
          }}>
            <span className="material-symbols-outlined icon-fill"
              style={{ fontSize: 13, color: T.cornsilk }}>shield</span>
            <span style={{ fontFamily: "monospace", fontSize: 10 }}>
              <span style={{ color: T.cornsilk, fontWeight: 700 }}>{openPositions.length}</span>
              <span style={{ color: T.cornDim }}> active</span>
            </span>
          </div>
        )}
        <WsBadge />
      </div>
    </div>
  );

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        height: "100dvh", display: "flex", flexDirection: "column",
        overflow: "hidden", background: T.bg, color: T.cornsilk,
        fontFamily: "monospace",
      }}
    >
      {/* Desktop top nav */}
      <div className="hidden md:block">
        <Layout activePage="trade" onNavigate={onNavigate} />
      </div>

      {/* ── MOBILE LAYOUT ──────────────────────────────────────────────────── */}
      <div
        className="flex flex-col flex-1 overflow-hidden md:hidden"
        style={{ minHeight: 0 }}
      >
        {/* Top bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 14px", height: 44, background: T.surface,
          borderBottom: `1px solid ${T.border}`, flexShrink: 0,
        }}>
          <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700,
            letterSpacing: 3, color: T.cornsilk, textTransform: "uppercase" }}>
            ARCIUM
          </span>
          <WsBadge />
        </div>

        <MarketStrip />
        <PriceHeaderBar />
        <StatsBar />

        {/* Chart */}
        <div style={{ height: 160, flexShrink: 0, overflow: "hidden" }}>
          <PriceChart
            symbol={selectedMarket}
            price={active?.price ?? 0}
            change={active?.change ?? 0}
            candles={candles}
            unrealizedPnl={openPositions.length > 0 ? totalPnl : undefined}
            isLive={wsConnected && (active?.isLive ?? false)}
          />
        </div>

        <MobileTabBar />

        {/* Tab panels */}
        <div style={{ flex: 1, overflowY: "auto", background: T.bg, minHeight: 0 }}>

          {mobileTab === "order" && (
            <div style={{ padding: "14px 14px 32px" }}>
              <div style={{ marginBottom: 12 }}><MpcBadge /></div>
              <TradingPanel
                market={selectedMarket}
                currentPrice={active?.price ?? 0}
                computationStatus={computationStatus}
                lastTxSig={lastTxSig}
                onOpenPosition={openPosition}
              />
            </div>
          )}

          {mobileTab === "positions" && (
            <div style={{ padding: "10px 0" }}>
              {openPositions.length === 0 ? (
                <div style={{
                  textAlign: "center", padding: "40px 0",
                  fontFamily: "monospace", fontSize: 11, color: T.cornDim,
                }}>
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
          )}

          {mobileTab === "markets" && (
            <div>
              {Object.entries(markets).map(([sym, m]) => (
                <button key={sym} onClick={() => handleSelect(sym)} style={{
                  width: "100%", display: "flex", justifyContent: "space-between",
                  alignItems: "center", padding: "12px 16px", background: "none",
                  border: "none", borderBottom: `1px solid ${T.border}`, cursor: "pointer",
                  backgroundColor: sym === selectedMarket ? "rgba(255,248,220,0.03)" : "transparent",
                }}>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700,
                      color: sym === selectedMarket ? T.cornsilk : T.cornMuted }}>
                      {sym}
                    </div>
                    <div style={{ fontFamily: "monospace", fontSize: 9, color: T.cornDim, marginTop: 2 }}>
                      Vol {m.volume24h}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "monospace", fontSize: 12, color: T.cornsilk }}>
                      {formatPrice(m.price)}
                    </div>
                    <div style={{ fontFamily: "monospace", fontSize: 10, marginTop: 2,
                      color: m.change >= 0 ? T.cornsilk : T.red }}>
                      {m.change >= 0 ? "+" : ""}{m.change.toFixed(2)}%
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <BottomNav />
      </div>

      {/* ── DESKTOP LAYOUT ─────────────────────────────────────────────────── */}
      <main
        className="hidden md:flex flex-1 overflow-hidden mt-14"
        style={{ gap: 1, background: T.border }}
      >
        {/* Left: market list */}
        <MarketList
          markets={markets}
          selected={selectedMarket}
          onSelect={handleSelect}
          wsConnected={wsConnected}
        />

        {/* Center: chart + positions */}
        <section style={{
          flex: 1, display: "flex", flexDirection: "column",
          minWidth: 0, overflow: "hidden", background: T.surface,
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
          background: T.surface2, borderLeft: `1px solid ${T.border}`,
        }}>
          <div style={{
            padding: "12px 16px", borderBottom: `1px solid ${T.border}`,
            display: "flex", alignItems: "center",
            justifyContent: "space-between", flexShrink: 0,
          }}>
            <span style={{
              fontFamily: "monospace", fontSize: 10, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: 2, color: T.cornsilk,
            }}>
              Place Order
            </span>
            <MpcBadge />
          </div>

          <TradingPanel
            market={selectedMarket}
            currentPrice={active?.price ?? 0}
            computationStatus={computationStatus}
            lastTxSig={lastTxSig}
            onOpenPosition={openPosition}
          />
        </aside>
      </main>
    </div>
  );
}
