@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');
@import url('https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ═══════════════════════════════════════════════════
   DESIGN TOKENS
   Palette: cornsilk bg · black ink · red accent
═══════════════════════════════════════════════════ */
:root {
  /* ── Backgrounds ── */
  --bg:           #FFF8DC;   /* cornsilk */
  --bg-2:         #FFF0B3;   /* deeper cornsilk */
  --bg-3:         #F5E696;   /* pressed */
  --surface:      #FFFEF8;   /* near-white warm panel */
  --surface-2:    #FFFBEC;   /* panel variant */

  /* ── Ink — ALL ≥ 4.5:1 on cornsilk ──
     #0A0A0A on #FFF8DC = 19.1:1 ✓
     #2C2A26 on #FFF8DC = 13.8:1 ✓
     #5C5851 on #FFF8DC =  7.0:1 ✓
     #7A7570 on #FFF8DC =  4.8:1 ✓ (labels only)  */
  --ink:          #0A0A0A;
  --ink-2:        #2C2A26;
  --ink-3:        #5C5851;
  --ink-4:        #7A7570;
  --ink-5:        #B0A89E;   /* decorative only */

  /* ── Red — primary accent (replaces neon green from dark theme) ──
     #9B1C1C on #FFF8DC = 8.4:1 ✓ AA+
     #C0392B on #FFF8DC = 5.6:1 ✓ AA          */
  --red:          #C0392B;
  --red-bold:     #9B1C1C;
  --red-bright:   #E74C3C;
  --red-dim:      rgba(192,57,43,0.08);
  --red-tint:     rgba(192,57,43,0.14);
  --red-glow:     rgba(231,76,60,0.22);

  /* ── Green — profit signals only ── */
  --green:        #0D7A52;
  --green-bold:   #0A5E3F;
  --green-bright: #16A96E;
  --green-dim:    rgba(13,122,82,0.08);
  --green-tint:   rgba(13,122,82,0.14);
  --green-glow:   rgba(22,169,110,0.22);

  /* ── Amber ── */
  --amber:        #956D00;
  --amber-dim:    rgba(149,109,0,0.09);
  --cornsilk-mid: #EDD98A;
  --cornsilk-deep:#C9A84C;

  /* ── Blue ── */
  --blue:         #1A4E7A;
  --blue-dim:     rgba(26,78,122,0.08);

  /* ── Borders ── */
  --border:       rgba(10,10,10,0.10);
  --border-2:     rgba(10,10,10,0.17);
  --border-3:     rgba(10,10,10,0.26);
  --border-red:   rgba(192,57,43,0.24);
  --border-green: rgba(13,122,82,0.22);

  /* ── Fonts ── */
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body:    'Lora', Georgia, serif;
  --font-mono:    'IBM Plex Mono', 'Courier New', monospace;

  /* ── Shadows (warm-tinted) ── */
  --shadow-xs: 0 1px 2px rgba(10,10,10,0.07);
  --shadow-sm: 0 2px 8px rgba(10,10,10,0.09), 0 1px 2px rgba(10,10,10,0.05);
  --shadow-md: 0 4px 18px rgba(10,10,10,0.11), 0 2px 4px rgba(10,10,10,0.06);
  --shadow-lg: 0 8px 36px rgba(10,10,10,0.13), 0 4px 8px rgba(10,10,10,0.07);

  /* ── Radii ── */
  --radius-sm:   6px;
  --radius-md:   10px;
  --radius-lg:   16px;
  --radius-pill: 100px;

  /* ── Spacing ── */
  --space-1:  4px;  --space-2:  8px;  --space-3: 12px;
  --space-4: 16px;  --space-5: 20px;  --space-6: 24px;
  --space-8: 32px;  --space-10:40px;

  /* ── Touch / Layout ── */
  --touch-min:    44px;
  --nav-h:        56px;
  --bottom-nav-h: 60px;

  /* ── Transitions ── */
  --t-fast:   150ms cubic-bezier(0.4,0,0.2,1);
  --t-base:   220ms cubic-bezier(0.4,0,0.2,1);
  --t-slow:   380ms cubic-bezier(0.4,0,0.2,1);
  --t-spring: 320ms cubic-bezier(0.34,1.56,0.64,1);

  /* ── Legacy map — so old component vars still work ── */
  --color-bg:       var(--bg);
  --color-surface:  var(--surface);
  --color-surface-2:var(--surface-2);
  --color-border:   var(--border);
  --color-border-2: var(--border-2);
  --color-text:     var(--ink-2);
  --color-text-2:   var(--ink-3);
  --color-text-3:   var(--ink-4);
  --color-green:    var(--green);
  --color-red:      var(--red);
}

/* ═══════════════════════════════════════════════════
   BASE RESET
═══════════════════════════════════════════════════ */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0; padding: 0;
  -webkit-tap-highlight-color: transparent;
}
html {
  font-size: 16px;
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}
html, body {
  min-height: 100%; min-height: 100dvh;
  background: var(--bg);
  color: var(--ink-2);
  font-family: var(--font-body);
  line-height: 1.65;
  letter-spacing: 0.01em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1;
  overflow-x: hidden;
}
body { padding-bottom: env(safe-area-inset-bottom); }

::selection { background: var(--cornsilk-mid); color: var(--ink); }
:focus-visible { outline: 2px solid var(--red); outline-offset: 3px; border-radius: 3px; }

/* ═══════════════════════════════════════════════════
   TYPOGRAPHY
═══════════════════════════════════════════════════ */
h1,h2,h3,h4,h5,h6 {
  font-family: var(--font-display);
  font-feature-settings: 'kern' 1,'liga' 1,'dlig' 1;
  letter-spacing: -0.01em;
  line-height: 1.12;
  color: var(--ink);
}
h1 { font-size: clamp(1.75rem, 5vw,   4rem);    font-weight: 600; }
h2 { font-size: clamp(1.4rem,  3.5vw, 2.6rem);  font-weight: 500; }
h3 { font-size: clamp(1.1rem,  2.5vw, 1.8rem);  font-weight: 500; }
h4 { font-size: clamp(0.95rem, 2vw,   1.25rem); font-weight: 500; }

p, li, label, td, th {
  font-family: var(--font-body);
  color: var(--ink-2);
}
.font-display { font-family: var(--font-display) !important; }
.font-body    { font-family: var(--font-body)    !important; }
.font-mono    { font-family: var(--font-mono)    !important; }
.font-mono, code, kbd, pre {
  font-family: var(--font-mono);
  font-feature-settings: 'zero' 1,'tnum' 1;
  letter-spacing: 0;
}

/* Colour helpers */
.text-ink       { color: var(--ink); }
.text-secondary { color: var(--ink-3); }
.text-muted     { color: var(--ink-4); }
.text-green     { color: var(--green-bold); }
.text-red       { color: var(--red-bold); }
.text-amber     { color: var(--amber); }

/* ═══════════════════════════════════════════════════
   SCROLLBAR
═══════════════════════════════════════════════════ */
.scroll-hide::-webkit-scrollbar { display: none; }
.scroll-hide { -ms-overflow-style: none; scrollbar-width: none; }
.scroll-styled::-webkit-scrollbar       { width: 3px; height: 3px; }
.scroll-styled::-webkit-scrollbar-track { background: transparent; }
.scroll-styled::-webkit-scrollbar-thumb { background: var(--border-3); border-radius: 2px; }
.scroll-styled::-webkit-scrollbar-thumb:hover { background: var(--ink-4); }

/* ═══════════════════════════════════════════════════
   GLASS SURFACES
═══════════════════════════════════════════════════ */
.glass {
  background: rgba(255,254,248,0.84);
  backdrop-filter: blur(20px) saturate(130%);
  -webkit-backdrop-filter: blur(20px) saturate(130%);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
}
.glass-bright {
  background: rgba(255,254,248,0.97);
  backdrop-filter: blur(24px) saturate(150%);
  -webkit-backdrop-filter: blur(24px) saturate(150%);
  border: 1px solid var(--border-2);
  box-shadow: var(--shadow-md);
}
.glass-warm {
  background: rgba(255,248,220,0.90);
  backdrop-filter: blur(16px) saturate(120%);
  -webkit-backdrop-filter: blur(16px) saturate(120%);
  border: 1px solid rgba(192,57,43,0.10);
  box-shadow: var(--shadow-sm);
}

/* ═══════════════════════════════════════════════════
   TRADE ROOT — controls which layout is visible
═══════════════════════════════════════════════════ */
.trade-root {
  min-height: 100dvh;
  background: var(--bg);
  display: flex;
  flex-direction: column;
}

/* ── Desktop layout — hidden on mobile ── */
.trade-desktop-layout {
  display: none;
}
@media (min-width: 1024px) {
  .trade-desktop-layout {
    display: grid;
    grid-template-columns: 200px 1fr 300px;
    flex: 1;
    height: calc(100dvh - var(--nav-h));
    margin-top: var(--nav-h);
    overflow: hidden;
    border-top: 1px solid var(--border);
  }
  .trade-mobile-layout { display: none !important; }
}

/* ── Mobile layout — hidden on desktop ── */
.trade-mobile-layout {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: var(--nav-h);
  height: calc(100dvh - var(--nav-h));
  overflow: hidden;
  position: relative;
}
@media (min-width: 1024px) {
  .trade-mobile-layout { display: none; }
}

/* ═══════════════════════════════════════════════════
   MARKET HEADER (shared mobile + desktop)
═══════════════════════════════════════════════════ */
.trade-market-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  flex-shrink: 0;
  flex-wrap: wrap;
  min-height: 56px;
}

.trade-symbol-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 2px;
  min-height: var(--touch-min);
  border-radius: var(--radius-sm);
  transition: background var(--t-fast);
  flex-shrink: 0;
}
.trade-symbol-btn:hover { background: var(--bg-2); }

.trade-symbol-pair {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--ink);
  text-transform: uppercase;
}

.trade-price-block {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}

.trade-price-value {
  font-family: var(--font-mono);
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  font-weight: 700;
  color: var(--ink);
  font-feature-settings: 'tnum' 1;
  letter-spacing: -0.02em;
}

.trade-price-change {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: var(--radius-pill);
  letter-spacing: 0.03em;
}

/* Stats — hidden on small phones, show tablet+ */
.trade-stats-row {
  display: none;
  align-items: center;
  gap: var(--space-5);
  flex: 1;
}
@media (min-width: 640px) {
  .trade-stats-row { display: flex; }
}

.trade-stat-item { display: flex; flex-direction: column; gap: 1px; }

.trade-stat-label {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-4);
}

.trade-stat-value {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--ink-2);
  font-feature-settings: 'tnum' 1;
}

.trade-header-right {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-left: auto;
  flex-shrink: 0;
}

.trade-positions-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  background: var(--green-dim);
  border: 1px solid var(--border-green);
  border-radius: var(--radius-pill);
  font-family: var(--font-mono);
  font-size: 0.7rem;
}
.trade-positions-count { font-weight: 700; color: var(--green-bold); }
.trade-positions-label { color: var(--ink-3); }

.trade-ws-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border: 1px solid;
  border-radius: var(--radius-pill);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.05em;
}

/* ═══════════════════════════════════════════════════
   DESKTOP COLUMNS
═══════════════════════════════════════════════════ */
.trade-market-sidebar {
  border-right: 1px solid var(--border);
  background: var(--surface-2);
  overflow-y: auto;
  height: 100%;
}

.trade-center-col {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--surface);
  border-right: 1px solid var(--border);
}

.trade-chart-wrap {
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: hidden;
}

.trade-positions-wrap {
  border-top: 1px solid var(--border);
  overflow-x: auto;
  overflow-y: auto;
  max-height: 220px;
  flex-shrink: 0;
  background: var(--surface-2);
}

.trade-order-sidebar {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: var(--surface);
  height: 100%;
}

.trade-order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border);
  background: var(--bg-2);
  flex-shrink: 0;
}

.trade-order-title {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

/* ═══════════════════════════════════════════════════
   MOBILE PANELS + BOTTOM NAV
═══════════════════════════════════════════════════ */
.trade-mobile-panels {
  flex: 1;
  overflow: hidden;
  position: relative;
  /* Space for bottom nav */
  padding-bottom: calc(var(--bottom-nav-h) + env(safe-area-inset-bottom));
}

.trade-mobile-panel {
  display: none;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: var(--bg);
  position: absolute;
  inset: 0;
}
.trade-mobile-panel.active {
  display: flex;
  animation: fade-in 0.18s ease-out;
}

.trade-mobile-pnl-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--surface);
  border-top: 1px solid var(--border);
  flex-shrink: 0;
  flex-wrap: wrap;
}
.trade-mobile-pnl-label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-4);
}
.trade-mobile-pnl-value {
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 700;
  font-feature-settings: 'tnum' 1;
  letter-spacing: -0.01em;
}

/* ── Bottom Nav ── */
.bottom-nav {
  display: flex;
  position: fixed;
  bottom: 0; left: 0; right: 0;
  z-index: 90;
  background: rgba(255,254,248,0.98);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  border-top: 1px solid var(--border-2);
  box-shadow: 0 -2px 12px rgba(10,10,10,0.07);
  height: calc(var(--bottom-nav-h) + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
}

.bottom-nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  min-height: var(--touch-min);
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-4);
  cursor: pointer;
  border: none;
  background: none;
  transition: color var(--t-fast), background var(--t-fast);
  position: relative;
  padding: 0;
}
.bottom-nav-item .material-symbols-outlined { font-size: 22px; }
.bottom-nav-item.active { color: var(--red-bold); }
.bottom-nav-item:hover:not(.active) { color: var(--ink-2); background: var(--bg-2); }

@media (min-width: 1024px) {
  .bottom-nav { display: none; }
}

/* ═══════════════════════════════════════════════════
   BUTTONS — 44px touch targets everywhere
═══════════════════════════════════════════════════ */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: var(--touch-min);
  padding: 10px var(--space-5);
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.9375rem;
  letter-spacing: 0.02em;
  border-radius: var(--radius-sm);
  border: none;
  cursor: pointer;
  text-decoration: none;
  user-select: none;
  white-space: nowrap;
  transition: background var(--t-fast), box-shadow var(--t-fast), transform var(--t-fast), color var(--t-fast);
}
.btn:active        { transform: scale(0.98); }
.btn:disabled      { opacity: 0.45; cursor: not-allowed; pointer-events: none; }
.btn:focus-visible { outline: 2px solid var(--red); outline-offset: 3px; }

/* Primary — black bg, cornsilk text */
.btn-primary {
  background: var(--ink);
  color: var(--cornsilk-mid);
  box-shadow: var(--shadow-sm);
}
.btn-primary:hover { background: var(--ink-2); box-shadow: var(--shadow-md); transform: translateY(-1px); }

/* Secondary */
.btn-secondary {
  background: transparent;
  color: var(--ink-2);
  border: 1.5px solid var(--border-3);
}
.btn-secondary:hover { background: var(--bg-2); border-color: var(--red); color: var(--red-bold); }

/* Ghost */
.btn-ghost {
  background: transparent;
  color: var(--ink-3);
  min-height: var(--touch-min);
}
.btn-ghost:hover { background: var(--red-dim); color: var(--red-bold); }

/* Long — keeps green for profit signal clarity */
.btn-long {
  width: 100%; min-height: 52px;
  background: var(--green-dim);
  color: var(--green-bold);
  border: 1.5px solid var(--border-green);
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 0.875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: var(--radius-md);
}
.btn-long:hover {
  background: var(--green-tint);
  border-color: var(--green);
  box-shadow: 0 0 16px var(--green-glow);
  transform: translateY(-1px);
}

/* Short — red dominant */
.btn-short {
  width: 100%; min-height: 52px;
  background: var(--red-dim);
  color: var(--red-bold);
  border: 1.5px solid var(--border-red);
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 0.875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: var(--radius-md);
}
.btn-short:hover {
  background: var(--red-tint);
  border-color: var(--red);
  box-shadow: 0 0 16px var(--red-glow);
  transform: translateY(-1px);
}

.btn-long:active, .btn-short:active { transform: scale(0.98); }

.trade-action-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
  padding: var(--space-4);
}

/* ═══════════════════════════════════════════════════
   SIDE TABS — Long / Short toggle
═══════════════════════════════════════════════════ */
.side-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-bottom: 1px solid var(--border);
  background: var(--bg-2);
}
.side-tab {
  padding: var(--space-3) var(--space-4);
  min-height: var(--touch-min);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-align: center;
  cursor: pointer;
  border: none;
  background: transparent;
  color: var(--ink-4);
  border-bottom: 2px solid transparent;
  transition: all var(--t-fast);
}
.side-tab.long.active  { color: var(--green-bold); background: var(--green-dim); border-bottom-color: var(--green); }
.side-tab.short.active { color: var(--red-bold);   background: var(--red-dim);   border-bottom-color: var(--red); }
.side-tab:hover:not(.active) { color: var(--ink-2); background: var(--bg-3); }

/* ═══════════════════════════════════════════════════
   TRADING INPUT — 16px prevents iOS zoom
═══════════════════════════════════════════════════ */
.t-input {
  background: var(--bg-2);
  border: 1.5px solid var(--border-2);
  border-radius: var(--radius-sm);
  color: var(--ink);
  padding: 12px var(--space-3);
  width: 100%;
  min-height: var(--touch-min);
  font-family: var(--font-mono);
  font-size: 1rem;             /* 16px — no iOS zoom */
  font-weight: 400;
  font-feature-settings: 'tnum' 1;
  outline: none;
  caret-color: var(--red);
  -webkit-appearance: none;
  appearance: none;
  transition: border-color var(--t-fast), background var(--t-fast), box-shadow var(--t-fast);
}
.t-input:focus {
  background: var(--surface);
  border-color: var(--red);
  box-shadow: 0 0 0 3px var(--red-dim);
}
.t-input::placeholder { color: var(--ink-4); font-weight: 300; }
.t-input:disabled     { opacity: 0.45; cursor: not-allowed; }

.input-group   { display: flex; flex-direction: column; gap: var(--space-2); margin-bottom: var(--space-4); }
.input-label   { font-family: var(--font-mono); font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-3); }
.input-wrap    { position: relative; display: flex; align-items: center; }
.input-suffix  { position: absolute; right: var(--space-3); font-family: var(--font-mono); font-size: 0.75rem; font-weight: 600; color: var(--red-bold); pointer-events: none; letter-spacing: 0.05em; }

/* ═══════════════════════════════════════════════════
   CHIPS
═══════════════════════════════════════════════════ */
.chip {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 10px;
  border-radius: var(--radius-pill);
  font-family: var(--font-mono);
  font-size: 0.7rem; font-weight: 600;
  letter-spacing: 0.05em; text-transform: uppercase; line-height: 1.4;
}
.chip-green    { background: var(--green-dim);  border: 1px solid rgba(13,122,82,0.20);  color: var(--green-bold); }
.chip-red      { background: var(--red-dim);    border: 1px solid rgba(192,57,43,0.22);  color: var(--red-bold); }
.chip-amber    { background: var(--amber-dim);  border: 1px solid rgba(149,109,0,0.20);  color: var(--amber); }
.chip-blue     { background: var(--blue-dim);   border: 1px solid rgba(26,78,122,0.20);  color: var(--blue); }
.chip-cornsilk { background: rgba(237,217,138,0.20); border: 1px solid rgba(201,168,76,0.30); color: var(--amber); }

/* ═══════════════════════════════════════════════════
   ORDER BOOK
═══════════════════════════════════════════════════ */
.orderbook { font-family: var(--font-mono); font-size: 0.75rem; font-feature-settings: 'tnum' 1; }

.orderbook-header {
  display: grid; grid-template-columns: 1fr 1fr 1fr;
  padding: var(--space-2) var(--space-3);
  border-bottom: 1px solid var(--border);
}
.orderbook-header span {
  font-size: 0.65rem; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--ink-4); font-family: var(--font-mono);
}
.orderbook-header span:not(:first-child) { text-align: right; }

.orderbook-row {
  display: grid; grid-template-columns: 1fr 1fr 1fr;
  padding: 4px var(--space-3);
  position: relative; min-height: 28px;
  align-items: center; cursor: default;
  transition: background var(--t-fast);
}
.orderbook-row:hover { background: rgba(10,10,10,0.04); }
.orderbook-row::before {
  content: ''; position: absolute; top:0; bottom:0; right:0;
  width: var(--depth, 0%); pointer-events: none; border-radius: 2px 0 0 2px;
}
.orderbook-ask::before { background: var(--red-dim); }
.orderbook-bid::before { background: var(--green-dim); }
.orderbook-ask .price-col { color: var(--red-bold); font-weight: 600; }
.orderbook-bid .price-col { color: var(--green-bold); font-weight: 600; }
.size-col  { color: var(--ink-3); text-align: right; }
.total-col { color: var(--ink-4); text-align: right; }

.orderbook-spread {
  padding: var(--space-2) var(--space-3);
  border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center; gap: var(--space-2);
  font-family: var(--font-mono); font-size: 0.7rem; color: var(--ink-4);
}
.spread-value { color: var(--red); font-weight: 700; }

/* ═══════════════════════════════════════════════════
   POSITIONS TABLE
═══════════════════════════════════════════════════ */
.positions-wrap {
  overflow-x: auto; -webkit-overflow-scrolling: touch;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: var(--surface); box-shadow: var(--shadow-xs);
}
.positions-table {
  width: 100%; min-width: 560px;
  border-collapse: collapse;
  font-family: var(--font-mono); font-size: 0.8125rem; font-feature-settings: 'tnum' 1;
}
.positions-table th {
  padding: var(--space-3) var(--space-4);
  text-align: left; font-size: 0.65rem; font-weight: 600;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--ink-4); border-bottom: 1px solid var(--border);
  white-space: nowrap; background: var(--bg-2);
}
.positions-table td {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border);
  color: var(--ink-2); white-space: nowrap;
}
.tr-hover:hover td { background: rgba(192,57,43,0.04); transition: background var(--t-fast); }

/* Mobile position card */
.position-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: var(--space-4); box-shadow: var(--shadow-xs); }
.position-card-row { display: flex; justify-content: space-between; align-items: center; padding: var(--space-2) 0; border-bottom: 1px solid var(--border); font-family: var(--font-mono); font-size: 0.8125rem; }
.position-card-row:last-child { border-bottom: none; }
.position-card-key   { color: var(--ink-4); font-size: 0.7rem; letter-spacing: 0.06em; text-transform: uppercase; }
.position-card-value { color: var(--ink-2); font-weight: 600; }

/* ═══════════════════════════════════════════════════
   LEVERAGE SLIDER
═══════════════════════════════════════════════════ */
input[type="range"] {
  -webkit-appearance: none; appearance: none;
  height: 4px; width: 100%;
  background: var(--border-2);
  border-radius: 2px; outline: none; cursor: pointer;
  transition: background var(--t-fast);
}
input[type="range"]:hover { background: rgba(192,57,43,0.25); }
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 20px; height: 20px; border-radius: 50%;
  background: var(--surface); border: 2px solid var(--red);
  box-shadow: var(--shadow-sm); cursor: pointer;
  transition: transform var(--t-spring), box-shadow var(--t-fast);
}
input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 0 5px var(--red-dim), var(--shadow-sm);
}
input[type="range"]::-moz-range-thumb {
  width: 20px; height: 20px; border-radius: 50%;
  background: var(--surface); border: 2px solid var(--red);
  cursor: pointer; box-shadow: var(--shadow-sm);
}

.leverage-presets { display: flex; gap: var(--space-2); margin-top: var(--space-3); flex-wrap: wrap; }
.leverage-preset {
  flex: 1; min-width: 40px; min-height: 36px;
  border: 1px solid var(--border-2); border-radius: var(--radius-sm);
  background: transparent; color: var(--ink-3);
  font-family: var(--font-mono); font-size: 0.75rem; font-weight: 600;
  cursor: pointer; transition: all var(--t-fast);
  display: flex; align-items: center; justify-content: center;
}
.leverage-preset:hover, .leverage-preset.active {
  background: var(--red-dim); border-color: var(--border-red); color: var(--red-bold);
}

/* ═══════════════════════════════════════════════════
   ENCRYPTION / PRIVACY
═══════════════════════════════════════════════════ */
.enc-glow {
  box-shadow: inset 0 0 20px rgba(192,57,43,0.04), 0 0 0 1px rgba(192,57,43,0.22), var(--shadow-sm);
  animation: enc-pulse 3.5s ease-in-out infinite;
}
@keyframes enc-pulse {
  0%,100% { box-shadow: inset 0 0 20px rgba(192,57,43,0.04), 0 0 0 1px rgba(192,57,43,0.22), var(--shadow-sm); }
  50%      { box-shadow: inset 0 0 32px rgba(192,57,43,0.08), 0 0 0 1px rgba(231,76,60,0.35), var(--shadow-md); }
}

.mpc-badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 12px 4px 8px;
  background: var(--red-dim); border: 1px solid var(--border-red);
  border-radius: var(--radius-pill);
  font-family: var(--font-mono); font-size: 0.68rem;
  font-weight: 600; letter-spacing: 0.08em;
  color: var(--red-bold); text-transform: uppercase;
}

.live-dot {
  width: 7px; height: 7px; border-radius: 50%;
  flex-shrink: 0;
  animation: live-ping 1.8s ease-out infinite;
}
@keyframes live-ping {
  0%   { box-shadow: 0 0 0 0   rgba(192,57,43,0.30); opacity: 1; }
  60%  { box-shadow: 0 0 0 6px transparent;           opacity: 0.7; }
  100% { box-shadow: 0 0 0 0   transparent;           opacity: 1; }
}

.pnl-blur { filter: blur(5px); transition: filter var(--t-base); cursor: pointer; user-select: none; }
.pnl-blur:hover { filter: none; }

/* ═══════════════════════════════════════════════════
   MARKET LIST TABS (horizontal scroll mobile)
═══════════════════════════════════════════════════ */
.market-tabs {
  display: flex; overflow-x: auto; gap: var(--space-1);
  padding: var(--space-2) var(--space-4);
  border-bottom: 1px solid var(--border);
  -webkit-overflow-scrolling: touch; scrollbar-width: none;
}
.market-tabs::-webkit-scrollbar { display: none; }
.market-tab {
  flex-shrink: 0; padding: 6px 14px; min-height: 36px;
  border-radius: var(--radius-pill);
  font-family: var(--font-mono); font-size: 0.75rem; font-weight: 600;
  letter-spacing: 0.04em; color: var(--ink-3);
  background: transparent; border: 1px solid transparent;
  cursor: pointer; transition: all var(--t-fast); white-space: nowrap;
}
.market-tab:hover  { color: var(--red-bold); background: var(--red-dim); }
.market-tab.active { color: var(--red-bold); background: var(--red-dim); border-color: var(--border-red); }

/* ═══════════════════════════════════════════════════
   VISUAL DECORATORS
═══════════════════════════════════════════════════ */
.grad-text {
  background: linear-gradient(118deg, var(--ink) 0%, var(--red-bold) 50%, var(--red) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}

.hero-bg {
  background:
    radial-gradient(ellipse 70% 50% at 50% -5%,  rgba(255,248,220,0.90) 0%, transparent 70%),
    radial-gradient(ellipse 45% 35% at 85% 75%,  rgba(192,57,43,0.06)   0%, transparent 60%),
    radial-gradient(ellipse 45% 35% at 15% 55%,  rgba(26,78,122,0.04)   0%, transparent 60%),
    var(--bg);
}

.divider-warm {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--cornsilk-mid) 30%, var(--cornsilk-mid) 70%, transparent);
  opacity: 0.35;
}

.accent-bar { position: relative; }
.accent-bar::after {
  content: ''; position: absolute; bottom:0; left:0; right:0; height: 2px;
  background: linear-gradient(90deg, transparent, var(--red-bold), var(--red), var(--red-bold), transparent);
  opacity: 0.50;
}

.nav-active { color: var(--red-bold); position: relative; }
.nav-active::after {
  content: ''; position: absolute; bottom: -2px; left: 0; right: 0;
  height: 2px; background: var(--red-bold); border-radius: 1px;
}

.stat-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius-md); padding: var(--space-4) var(--space-5);
  box-shadow: var(--shadow-xs);
  transition: box-shadow var(--t-base), border-color var(--t-base);
}
.stat-card:hover { box-shadow: var(--shadow-md); border-color: var(--border-red); }

/* ═══════════════════════════════════════════════════
   MATERIAL SYMBOLS
═══════════════════════════════════════════════════ */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 24;
  user-select: none; vertical-align: middle; line-height: 1; color: inherit;
}
.icon-fill { font-variation-settings: 'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24; }
.icon-sm   { font-size: 18px; font-variation-settings: 'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 20; }

/* ═══════════════════════════════════════════════════
   TOOLTIP
═══════════════════════════════════════════════════ */
[data-tooltip] { position: relative; cursor: help; }
[data-tooltip]::after {
  content: attr(data-tooltip);
  position: absolute; bottom: calc(100% + 8px); left: 50%;
  transform: translateX(-50%) translateY(4px);
  background: var(--ink); color: var(--cornsilk-mid);
  font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.04em;
  padding: 6px 12px; border-radius: var(--radius-sm);
  white-space: normal; text-align: center; max-width: 240px;
  pointer-events: none; opacity: 0; z-index: 999;
  transition: opacity var(--t-fast), transform var(--t-fast);
}
[data-tooltip]:hover::after { opacity: 1; transform: translateX(-50%) translateY(0); }

/* ═══════════════════════════════════════════════════
   SKELETON
═══════════════════════════════════════════════════ */
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
}
.skeleton {
  background: linear-gradient(90deg, var(--bg-2) 25%, var(--bg-3) 50%, var(--bg-2) 75%);
  background-size: 800px 100%;
  animation: shimmer 1.4s ease-in-out infinite;
  border-radius: var(--radius-sm);
}

/* ═══════════════════════════════════════════════════
   ANIMATIONS
═══════════════════════════════════════════════════ */
@keyframes slide-up {
  from { transform: translateY(12px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
.animate-slide-up { animation: slide-up 0.22s cubic-bezier(0.4,0,0.2,1); }

@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.animate-fade-in { animation: fade-in 0.3s ease-out; }

/* ═══════════════════════════════════════════════════
   ACCESSIBILITY
═══════════════════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
@media (forced-colors: active) {
  .enc-glow, .live-dot, .btn-long, .btn-short { forced-color-adjust: none; }
}
@media print {
  .bottom-nav, .top-nav { display: none; }
  body { background: white; color: black; }
}
