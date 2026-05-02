# 🔐 Stealth Perps — Deployment Guide

> **Stack:** Anchor + Arcium MPC on Solana Devnet · Express on Render · React/Vite on Vercel
> **Pre-built Program ID:** `57dAxRF57a33kHwa51Xhd4eNjLg7vc7Q1phfMKS4xtfy`
> No Supabase. No database. No user data stored anywhere.

---

## Deployment Order

Complete these phases in exact order — each phase produces values needed by the next.

- [ ] **Phase 0** — Create `.gitignore` and push to a new GitHub repo
- [ ] **Phase 1** — Publish `.arcis` circuit files to GitHub Releases
- [ ] **Phase 2** — Update `Arcium.toml` with GitHub release URLs
- [ ] **Phase 3** — Register circuits with Arcium MPC in Gitpod
- [ ] **Phase 4** — Deploy backend to Render
- [ ] **Phase 5** — Deploy frontend to Vercel
- [ ] **Phase 6** — Cross-link Render ↔ Vercel URLs

---

## Phase 0 — New Repo Setup

You downloaded the zip manually so you need to initialize a fresh git repo and push to GitHub before anything else.

### 1. Unzip and initialize git

```bash
unzip private-perps-main.zip
cd private-perps-main

git init
git branch -M main
```

### 2. Create `.gitignore`

Delete the existing `.gitignore` and replace it with this:

```gitignore
# ── Rust / Anchor ──
target/
.anchor/
test-ledger/
.anchor/test-ledger/
*.so
*.d.ts.map

# ── Node ──
node_modules/
**/node_modules/
dist/
app/dist/
app/node_modules/
server/dist/
server/node_modules/

# ── Environment files — NEVER commit these ──
.env
.env.local
.env.production
.env.development
**/.env
**/.env.local

# ── Solana wallet keys — NEVER commit these ──
id.json
*.keypair.json
wallet.json

# ── OS / Editor ──
.DS_Store
Thumbs.db
.vscode/
.idea/
*.swp
*.swo

# ── Build artifacts (keep .arcis — needed for GitHub Release) ──
build/*.ir
build/*.hash
build/*.weight
build/*.idarc
build/*.profile.json

# ── Logs ──
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

> ⚠️ `build/*.arcis` is intentionally **not ignored** — those files must stay in the repo so you can attach them to your GitHub Release in Phase 1.

### 3. Push to a new GitHub repo

Go to [github.com/new](https://github.com/new) and create an empty repo (no README, no `.gitignore`). Then:

```bash
git add .
git commit -m "initial commit: stealth perps"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

---

## Phase 1 — Publish Circuit Files to GitHub Releases

Your `.arcis` files live in `build/`. They need a public URL so Arcium MPC can fetch them during circuit registration.

### 1. Confirm your files exist

```bash
ls build/*.arcis

# Should show:
#   build/apply_funding.arcis
#   build/calculate_pnl.arcis
#   build/check_liquidation.arcis
#   build/open_position.arcis
```

### 2. Create a GitHub Release

- Go to: `github.com/YOUR_USERNAME/YOUR_REPO_NAME/releases/new`
- **Tag:** `v1.0.0`
- **Title:** `Circuit Files`
- Attach **only these four files** from `build/`:
  - `apply_funding.arcis`
  - `calculate_pnl.arcis`
  - `check_liquidation.arcis`
  - `open_position.arcis`
- Click **Publish release**

> ⚠️ Do NOT attach `.ir`, `.idarc`, `.profile.json`, `.ts`, or `.weight` files — only the four `.arcis` files.

---

## Phase 2 — Update Arcium.toml

Replace the `[circuits]` section in `Arcium.toml` with your new GitHub release URLs:

```toml
[circuits]
open_position     = "https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/releases/download/v1.0.0/open_position.arcis"
check_liquidation = "https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/releases/download/v1.0.0/check_liquidation.arcis"
calculate_pnl     = "https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/releases/download/v1.0.0/calculate_pnl.arcis"
apply_funding     = "https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/releases/download/v1.0.0/apply_funding.arcis"
```

Also make sure both `Anchor.toml` and `Arcium.toml` have the correct program ID under `[programs.devnet]`:

```toml
# Anchor.toml
[programs.devnet]
stealth_perps = "57dAxRF57a33kHwa51Xhd4eNjLg7vc7Q1phfMKS4xtfy"

# Arcium.toml
[programs.devnet]
stealth_perps = "57dAxRF57a33kHwa51Xhd4eNjLg7vc7Q1phfMKS4xtfy"
```

Commit and push:

```bash
git add Arcium.toml Anchor.toml
git commit -m "chore: circuit URLs to GitHub releases, remove supabase"
git push
```

---

## Phase 3 — Register Circuits with Arcium MPC

Open your repo in Gitpod — it pre-installs Rust, Anchor 0.32, and the Arcium CLI.

> Open Gitpod: `gitpod.io/#https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`

### 1. Point Solana CLI at devnet

```bash
solana config set --url devnet
```

### 2. Create and fund your wallet

```bash
# Create wallet
solana-keygen new --outfile ~/.config/solana/id.json

# Fund — run twice, faucet limits per call
solana airdrop 2
solana airdrop 2

# Verify (need 2+ SOL)
solana balance
```

> ℹ️ You do **not** need to redeploy the Anchor program. The pre-built program ID is already live on devnet.

### 3. Register circuits

```bash
npx ts-node --esm scripts/init-comp-defs.ts

# Expected: 4 computation definitions registered on devnet
```

> ⚠️ If this fails with a URL error, verify your GitHub Release is **published** (not draft) and the `.arcis` files are attached as release assets.

---

## Phase 4 — Deploy Backend to Render

### 1. Create a new Web Service

- Go to [render.com](https://render.com) → **New** → **Web Service**
- Connect: `YOUR_USERNAME/YOUR_REPO_NAME`

### 2. Service settings

| Field | Value |
|---|---|
| Root Directory | `server` |
| Build Command | `npm install && npm run build` |
| Start Command | `node dist/index.js` |
| Environment | `Node` |

### 3. Environment variables

| Variable | Value |
|---|---|
| `PROGRAM_ID` | `57dAxRF57a33kHwa51Xhd4eNjLg7vc7Q1phfMKS4xtfy` |
| `SOLANA_RPC_URL` | `https://api.devnet.solana.com` |
| `CLUSTER_OFFSET` | `456` |
| `CORS_ORIGINS` | `https://your-app.vercel.app` ← update after Phase 5 |
| `PORT` | `4000` |

### 4. Deploy

Click **Deploy**. Once live, copy your Render URL:
```
https://your-service-name.onrender.com
```

---

## Phase 5 — Deploy Frontend to Vercel

### 1. Import your repo

- Go to [vercel.com](https://vercel.com) → **New Project** → Import Git Repository
- Select: `YOUR_USERNAME/YOUR_REPO_NAME`

### 2. Project settings

| Field | Value |
|---|---|
| Root Directory | `app` |
| Framework Preset | `Vite` (auto-detected) |
| Build Command | `npm run build` |
| Output Directory | `dist` |

### 3. Environment variables

| Variable | Value |
|---|---|
| `VITE_MOCK_ARCIUM` | `false` |
| `VITE_PROGRAM_ID` | `57dAxRF57a33kHwa51Xhd4eNjLg7vc7Q1phfMKS4xtfy` |
| `VITE_RPC_URL` | `https://api.devnet.solana.com` |
| `VITE_BACKEND_API_BASE` | `https://your-service-name.onrender.com` |

### 4. Deploy

Click **Deploy**. Once live, copy your Vercel URL:
```
https://your-app-name.vercel.app
```

---

## Phase 6 — Cross-Link Backend & Frontend

Go back to Render → your service → **Environment** and update:

```
CORS_ORIGINS=https://your-app-name.vercel.app
```

> ⚠️ No trailing slash. Render auto-restarts after you save.

✅ **Done.** Your app is live. No user data stored anywhere — all computation happens privately through Arcium MPC and on-chain.

---

## Master Checklist

- [ ] Unzip, create `.gitignore`, push to new GitHub repo
- [ ] Confirm `build/*.arcis` — 4 files present
- [ ] GitHub Release `v1.0.0` created with 4 `.arcis` files attached
- [ ] `Arcium.toml` `[circuits]` updated with GitHub release URLs → pushed
- [ ] `Anchor.toml` `[programs.devnet]` set to `57dAxRF57a33kHwa51Xhd4eNjLg7vc7Q1phfMKS4xtfy`
- [ ] Gitpod opened from your new repo
- [ ] `solana config set --url devnet`
- [ ] Wallet created and funded (2+ SOL via airdrop ×2)
- [ ] `npx ts-node --esm scripts/init-comp-defs.ts` — 4 circuits registered
- [ ] Render: `server/` deployed with all 5 env vars
- [ ] Vercel: `app/` deployed with all 4 env vars
- [ ] Render `CORS_ORIGINS` updated with real Vercel URL

---

## Environment Variables — Quick Reference

### Render (`server/`)

```env
PROGRAM_ID=57dAxRF57a33kHwa51Xhd4eNjLg7vc7Q1phfMKS4xtfy
SOLANA_RPC_URL=https://api.devnet.solana.com
CLUSTER_OFFSET=456
CORS_ORIGINS=https://your-app.vercel.app
PORT=4000
```

### Vercel (`app/`)

```env
VITE_MOCK_ARCIUM=false
VITE_PROGRAM_ID=57dAxRF57a33kHwa51Xhd4eNjLg7vc7Q1phfMKS4xtfy
VITE_RPC_URL=https://api.devnet.solana.com
VITE_BACKEND_API_BASE=https://your-service.onrender.com
```

> `PROGRAM_ID` and `VITE_PROGRAM_ID` are the same value — the pre-built program already deployed on Solana devnet.
