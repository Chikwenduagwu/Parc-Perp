/**
 * TradingPage.tsx — Private perpetuals terminal
 * Fixed: layout vars now match index.css tokens
 * Palette: #000000 bg · #FFFFFF ink · grayscale accent · green profit signals
 * Mobile-first: bottom tab nav, single-panel architecture
 */

import { useEffect, useState, useCallback } from "react";
import Layout from "../components/Layout";
import MarketList from "../components/MarketList";
import TradingPanel from "../components/TradingPanel";
import PositionTable from "../components/PositionTable";
import PriceChart from "../components/PriceChart";
import { usePositions } from "../hooks/usePositions";
import { useMarketData } from "../hooks/useMarketData";
import type { AppPage } from "../App";

interface Props {
  market:         string;
  onNavigate:     (p: AppPage) => void;
  onMarketChange: (m: string) => void;
}

type MobileTab = "chart" | "trade" | "positions" | "markets";

export default function TradingPage({
  market: initialMarket,
  onNavigate,
  onMarketChange,
}: Props) {
  const [selectedMarket, setSelectedMarket] = useState(initialMarket);
  const [mobileTab, setMobileTab]           = useState<MobileTab>("chart");

  const { markets, wsConnected, getCandles } = useMarketData();
  const {
    positions,
    computationStatus,
    lastTxSig,
    openPosition,
    closePosition,
    updatePnl,
  } = usePositions();

  const active  = markets[selectedMarket];
  const candles = getCandles(selectedMarket);

  /* Stable prices map — avoid infinite re-render */
  const prices = Object.fromEntries(
    Object.entries(markets).map(([s, m]) => [s, m.price])
  );

  /* updatePnl only when prices actually change */
  useEffect(() => {
    updatePnl(prices);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(prices)]);

  const openPositions = positions.filter((p) => p.status === "open");
  const totalPnl      = openPositions.reduce((s, p) => s + p.unrealizedPnl, 0);

  const handleSelect = useCallback(
    (sym: string) => {
      setSelectedMarket(sym);
      onMarketChange(sym);
      setMobileTab("chart");
    },
    [onMarketChange]
  );

  function formatPrice(p: number): string {
    if (!p) return "—";
    if (p >= 10000)
      return `$${p.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    if (p >= 1) return `$${p.toFixed(2)}`;
    return `$${p.toFixed(4)}`;
  }

  const isUp   = (active?.change ?? 0) >= 0;
  const chgClr = isUp ? "var(--green)" : "#E05C5C";
  const chgBg  = isUp ? "var(--green-dim)" : "rgba(224,92,92,0.10)";
  const chgBdr = isUp ? "var(--border-green)" : "rgba(224,92,92,0.22)";

  /* ── Shared market header ── */
  const MarketHeader = () => (
    <div className="trade-market-header">
      {/* Symbol selector */}
      <button
        className="trade-symbol-btn"
        onClick={() => setMobileTab("markets")}
        aria-label="Change market"
      >
        <span className="trade-symbol-pair">{selectedMarket}</span>
        <span
          className="material-symbols-outlined icon-sm"
          style={{ color: "var(--ink-4)" }}
        >
          unfold_more
        </span>
      </button>

      {/* Price + change */}
      <div className="trade-price-block">
        <span className="trade-price-value">
          {formatPrice(active?.price ?? 0)}
        </span>
        {active && (
          <span
            className="trade-price-change"
            style={{ color: chgClr, background: chgBg, border: `1px solid ${chgBdr}` }}
          >
            {isUp ? "+" : ""}{active.change.toFixed(2)}%
          </span>
        )}
      </div>

      {/* Stats — hidden on small phones */}
      {active && (
        <div className="trade-stats-row">
          {[
            { l: "24h High", v: formatPrice(active.high24h) },
            { l: "24h Low",  v: formatPrice(active.low24h)  },
            { l: "Volume",   v: active.volume24h             },
            { l: "Funding",  v: `${active.fundingRate.toFixed(4)}%` },
          ].map((s) => (
            <div className="trade-stat-item" key={s.l}>
              <span className="trade-stat-label">{s.l}</span>
              <span className="trade-stat-value">{s.v}</span>
            </div>
          ))}
        </div>
      )}

      {/* Right badges */}
      <div className="trade-header-right">
        {openPositions.length > 0 && (
          <div className="trade-positions-badge">
            <span
              className="material-symbols-outlined icon-fill icon-sm"
              style={{ color: "var(--green)" }}
            >
              shield
            </span>
            <span className="trade-positions-count">{openPositions.length}</span>
            <span className="trade-positions-label">active</span>
          </div>
        )}

        {/* WS status */}
        <div
          className="trade-ws-badge"
          style={{
            borderColor: wsConnected
              ? "rgba(76,175,80,0.25)"
              : "rgba(255,255,255,0.12)",
            background: wsConnected
              ? "var(--green-dim)"
              : "rgba(255,255,255,0.04)",
          }}
        >
          <span
            className="live-dot"
            style={{
              background: wsConnected ? "var(--green)" : "var(--ink-5)",
            }}
          />
          <span
            style={{
              color: wsConnected ? "var(--green)" : "var(--ink-4)",
              fontSize: "0.68rem",
              fontFamily: "var(--font-mono)",
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}
          >
            {wsConnected ? "Live" : "…"}
          </span>
        </div>
      </div>
    </div>
  );

  /* ── Order panel header (reused in both layouts) ── */
  const OrderHeader = () => (
    <div className="trade-order-header">
      <span className="trade-order-title">Place Order</span>
      <div className="mpc-badge">
        <span className="material-symbols-outlined icon-fill icon-sm">
          shield
        </span>
        MPC Encrypted
      </div>
    </div>
  );

  return (
    <div className="trade-root">
      <Layout activePage="trade" onNavigate={onNavigate} />

      {/* ════════════════════════════════════════
          DESKTOP LAYOUT  ≥ 1024px
      ════════════════════════════════════════ */}
      <main className="trade-desktop-layout">
        {/* Left: market list */}
        <aside className="trade-market-sidebar scroll-styled">
          <MarketList
            markets={markets}
            selected={selectedMarket}
            onSelect={handleSelect}
            wsConnected={wsConnected}
          />
        </aside>

        {/* Center: header + chart + positions */}
        <section className="trade-center-col">
          <MarketHeader />
          <div className="trade-chart-wrap">
            <PriceChart
              symbol={selectedMarket}
              price={active?.price ?? 0}
              change={active?.change ?? 0}
              candles={candles}
              unrealizedPnl={openPositions.length > 0 ? totalPnl : undefined}
              isLive={wsConnected && (active?.isLive ?? false)}
            />
          </div>
          <div className="trade-positions-wrap scroll-styled">
            <PositionTable
              positions={positions}
              currentPrices={prices}
              onClose={closePosition}
            />
          </div>
        </section>

        {/* Right: order panel */}
        <aside className="trade-order-sidebar scroll-styled">
          <OrderHeader />
          <TradingPanel
            market={selectedMarket}
            currentPrice={active?.price ?? 0}
            computationStatus={computationStatus}
            lastTxSig={lastTxSig}
            onOpenPosition={openPosition}
          />
        </aside>
      </main>

      {/* ════════════════════════════════════════
          MOBILE LAYOUT  < 1024px
      ════════════════════════════════════════ */}
      <main className="trade-mobile-layout">
        {/* Always-visible market header */}
        <MarketHeader />

        {/* Tab panels */}
        <div className="trade-mobile-panels">

          {/* Chart panel */}
          <div className={`trade-mobile-panel${mobileTab === "chart" ? " active" : ""}`}>
            <div className="trade-chart-wrap">
              <PriceChart
                symbol={selectedMarket}
                price={active?.price ?? 0}
                change={active?.change ?? 0}
                candles={candles}
                unrealizedPnl={openPositions.length > 0 ? totalPnl : undefined}
                isLive={wsConnected && (active?.isLive ?? false)}
              />
            </div>
            {openPositions.length > 0 && (
              <div className="trade-mobile-pnl-bar">
                <span className="trade-mobile-pnl-label">Unrealized PnL</span>
                <span
                  className="trade-mobile-pnl-value"
                  style={{ color: totalPnl >= 0 ? "var(--green)" : "#E05C5C" }}
                >
                  {totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)}
                </span>
                <button
                  className="btn btn-ghost"
                  style={{
                    fontSize: "0.75rem",
                    minHeight: "32px",
                    padding: "4px 12px",
                    color: "var(--ink-3)",
                  }}
                  onClick={() => setMobileTab("positions")}
                >
                  View positions
                  <span
                    className="material-symbols-outlined icon-sm"
                    style={{ marginLeft: 4 }}
                  >
                    chevron_right
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Trade panel */}
          <div className={`trade-mobile-panel${mobileTab === "trade" ? " active" : ""}`}>
            <OrderHeader />
            <div
              className="scroll-styled"
              style={{ overflowY: "auto", flex: 1 }}
            >
              <TradingPanel
                market={selectedMarket}
                currentPrice={active?.price ?? 0}
                computationStatus={computationStatus}
                lastTxSig={lastTxSig}
                onOpenPosition={openPosition}
              />
            </div>
          </div>

          {/* Positions panel */}
          <div className={`trade-mobile-panel${mobileTab === "positions" ? " active" : ""}`}>
            <div className="trade-order-header">
              <span className="trade-order-title">
                Positions
                {openPositions.length > 0 && (
                  <span
                    className="chip chip-white"
                    style={{ marginLeft: 8 }}
                  >
                    {openPositions.length}
                  </span>
                )}
              </span>
            </div>
            <div
              className="scroll-styled"
              style={{ overflowY: "auto", flex: 1 }}
            >
              <PositionTable
                positions={positions}
                currentPrices={prices}
                onClose={closePosition}
              />
            </div>
          </div>

          {/* Markets panel */}
          <div className={`trade-mobile-panel${mobileTab === "markets" ? " active" : ""}`}>
            <div className="trade-order-header">
              <span className="trade-order-title">Markets</span>
              <div
                className="trade-ws-badge"
                style={{
                  borderColor: wsConnected
                    ? "rgba(76,175,80,0.25)"
                    : "rgba(255,255,255,0.10)",
                  background: wsConnected
                    ? "var(--green-dim)"
                    : "rgba(255,255,255,0.03)",
                }}
              >
                <span
                  className="live-dot"
                  style={{
                    background: wsConnected ? "var(--green)" : "var(--ink-5)",
                  }}
                />
                <span
                  style={{
                    color: wsConnected ? "var(--green)" : "var(--ink-4)",
                    fontSize: "0.68rem",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                  }}
                >
                  {wsConnected ? "Live" : "Connecting"}
                </span>
              </div>
            </div>
            <div
              className="scroll-styled"
              style={{ overflowY: "auto", flex: 1 }}
            >
              <MarketList
                markets={markets}
                selected={selectedMarket}
                onSelect={handleSelect}
                wsConnected={wsConnected}
              />
            </div>
          </div>
        </div>

        {/* ── Bottom Navigation ── */}
        <nav
          className="bottom-nav"
          role="navigation"
          aria-label="Trading navigation"
        >
          {(
            [
              { tab: "chart",     icon: "candlestick_chart", label: "Chart"     },
              { tab: "trade",     icon: "swap_vert",          label: "Trade"     },
              { tab: "positions", icon: "folder_open",        label: "Positions" },
              { tab: "markets",   icon: "bar_chart",          label: "Markets"   },
            ] as { tab: MobileTab; icon: string; label: string }[]
          ).map(({ tab, icon, label }) => (
            <button
              key={tab}
              className={`bottom-nav-item${mobileTab === tab ? " active" : ""}`}
              onClick={() => setMobileTab(tab)}
              aria-label={label}
              aria-current={mobileTab === tab ? "page" : undefined}
            >
              <span className="material-symbols-outlined">{icon}</span>
              {label}

              {/* Badge for open positions count */}
              {tab === "positions" && openPositions.length > 0 && (
                <span
                  aria-label={`${openPositions.length} open positions`}
                  style={{
                    position:     "absolute",
                    top:          "6px",
                    right:        "calc(50% - 20px)",
                    background:   "var(--green)",
                    color:        "#000",
                    fontSize:     "0.55rem",
                    fontFamily:   "var(--font-mono)",
                    fontWeight:   700,
                    padding:      "1px 5px",
                    borderRadius: "100px",
                    lineHeight:   1.4,
                    minWidth:     "16px",
                    textAlign:    "center",
                  }}
                >
                  {openPositions.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
   }
     
