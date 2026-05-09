# Parc Perps

**Private perpetual futures on Solana, powered by Arcium MPC.**

Position size, entry price, leverage, and liquidation thresholds never appear in plaintext on-chain. Encrypted inputs flow into a threshold MPC cluster, computations execute over ciphertext, and only the final realized PnL is returneddecrypted exclusively by the trader.

---

## The Problem

Every existing on-chain perpetuals protocol publishes full position data to the ledger. Size, direction, leverage, and liquidation price are readable by anyone MEV bots, copy-traders, and liquidation hunters alike. This is not a UX deficiency. It is a structural property of transparent execution environments.

Parc Perps removes that constraint entirely.

---

## How It Works

```
  TRADER BROWSER
  ─────────────────────────────────────────────────────────────
  │                                                           │
  │   1. ENCRYPT                                             │
  │   ┌─────────────────────────────────────────────────┐   │
  │   │  ephemeral x25519 keypair generated              │   │
  │   │  shared_secret = ECDH(trader_priv, mxe_pub)      │   │
  │   │  ciphertext    = RescueCipher(plaintext, nonce)  │   │
  │   └────────────────────┬────────────────────────────┘   │
  │                        │ encrypted blob                  │
  └────────────────────────┼────────────────────────────────┘
                           │
  SOLANA                   ▼
  ─────────────────────────────────────────────────────────────
  │   2. SUBMIT                                              │
  │   ┌─────────────────────────────────────────────────┐   │
  │   │  Anchor program receives encrypted fields        │   │
  │   │  queue_computation() → Arcium mempool            │   │
  │   │  position account stores ciphertext only         │   │
  │   └────────────────────┬────────────────────────────┘   │
  │                        │ computation request             │
  └────────────────────────┼────────────────────────────────┘
                           │
  ARCIUM MPC CLUSTER       ▼
  ─────────────────────────────────────────────────────────────
  │   3. COMPUTE                                             │
  │   ┌─────────────────────────────────────────────────┐   │
  │   │  Node A  ──┐                                     │   │
  │   │  Node B  ──┼──  threshold execution over shares  │   │
  │   │  Node C  ──┘                                     │   │
  │   │                                                   │   │
  │   │  open_position    → encrypted liq_price           │   │
  │   │  check_liquidation → boolean only                 │   │
  │   │  calculate_pnl    → encrypted pnl                 │   │
  │   └────────────────────┬────────────────────────────┘   │
  │                        │ signed output                   │
  └────────────────────────┼────────────────────────────────┘
                           │
  SOLANA                   ▼
  ─────────────────────────────────────────────────────────────
  │   4. CALLBACK                                            │
  │   ┌─────────────────────────────────────────────────┐   │
  │   │  on-chain callback instruction fires             │   │
  │   │  encrypted result stored / event emitted         │   │
  │   │  position state updated                          │   │
  │   └────────────────────┬────────────────────────────┘   │
  │                        │ encrypted pnl in event          │
  └────────────────────────┼────────────────────────────────┘
                           │
  TRADER BROWSER           ▼
  ─────────────────────────────────────────────────────────────
  │   5. DECRYPT                                             │
  │   ┌─────────────────────────────────────────────────┐   │
  │   │  event caught by frontend listener               │   │
  │   │  RescueCipher.decrypt(ciphertext, shared_secret) │   │
  │   │  plaintext PnL displayed — visible only locally  │   │
  │   └─────────────────────────────────────────────────┘   │
  │                                                           │
  └───────────────────────────────────────────────────────────
```

At no point does any on-chain observer, keeper, or MPC node have access to the complete set of position parameters in plaintext.

---

## Privacy Guarantees

| Field | Visibility |
|---|---|
| Position size | Encrypted. Never on-chain in plaintext. |
| Entry price | Encrypted. Never on-chain in plaintext. |
| Leverage | Encrypted. Never on-chain in plaintext. |
| Liquidation price | Computed inside MPC. Never stored. |
| Direction (long/short) | Encrypted. Never on-chain in plaintext. |
| Realized PnL | Revealed only to the trader on position close. |
| Liquidation event | Public (position closed), threshold not revealed. |

---

## Stack

| Layer | Technology |
|---|---|
| Smart contract | Anchor 0.32 + arcium-anchor macros |
| MPC circuits | Arcis (encrypted-ixs/) |
| Frontend | React + Vite + Tailwind CSS |
| Live prices | Binance WebSocket — 8 markets |
| Backend | Express on Render |
| Circuit storage | Supabase |

---

## Repository Structure

```
parc-perps/
├── programs/
│   └── stealth_perps/
│       └── src/lib.rs          Anchor program — queue, callback, state
├── encrypted-ixs/
│   └── src/lib.rs              Arcis circuits — open, liquidate, pnl
├── app/
│   ├── src/
│   │   ├── components/         UI components
│   │   ├── hooks/              useMarketData, usePositions
│   │   ├── pages/              HomePage, TradingPage
│   │   └── lib/                constants, arcium client helpers
│   └── .env.example
├── server/
│   └── index.js                REST bridge — encrypt, decrypt, await
├── scripts/
│   └── init-comp-defs.ts       One-time circuit registration
├── tests/
│   └── stealth-perps.ts        Integration tests against real devnet MPC
├── Anchor.toml
├── Arcium.toml
└── Cargo.toml
```

---

## Getting Started

### Prerequisites

```
Rust 1.88+
Solana CLI 1.18+
Anchor CLI 0.32
Node.js 20+
```

### Run in mock mode (no wallet required)

```bash
cd app
npm install
cp .env.example .env          # VITE_MOCK_ARCIUM=true by default
npm run dev
```

Open `http://localhost:5173`. Live prices stream immediately from Binance WebSocket. All position operations are simulated locally — no on-chain transactions occur.

### Run against devnet

Set `VITE_MOCK_ARCIUM=false` in `app/.env` and configure the remaining variables, then:

```bash
cd app && npm run dev
cd server && node index.js
```

---

## Live Markets

Eight perpetual markets stream via Binance WebSocket (`wss://stream.binance.com:9443`). CoinGecko REST provides fallback prices on initial load.

```
BTC/USDC   ETH/USDC   SOL/USDC   BNB/USDC
AVAX/USDC  LINK/USDC  JUP/USDC   WIF/USDC
```

---

## Environment Variables

### app/.env

```
VITE_MOCK_ARCIUM=true
VITE_PROGRAM_ID=
VITE_RPC_URL=https://api.devnet.solana.com
VITE_BACKEND_API_BASE=https://your-api.onrender.com
```

### server/.env

```
PROGRAM_ID=
SOLANA_RPC_URL=https://api.devnet.solana.com
CLUSTER_OFFSET=456
CORS_ORIGINS=https://your-app.vercel.app
PORT=4000
```

---

## Deployment

Full step-by-step deployment instructions including circuit publication, Gitpod-based circuit registration, Render backend deployment, and Vercel frontend deployment 
are documented in `DEPLOYMENT.md`.

The pre-built Anchor program is already deployed to Solana devnet:

```
Program ID: 3DHnmtHxAkKq6oMzydRMNS7yduYT4Ee1ecAdXWniEGzx
```

No redeployment is required unless modifying the on-chain program.

---

## Testing

Integration tests run against the real Arcium devnet MPC cluster — no mocks.

```bash
# Fund a devnet wallet first
solana airdrop 2 --url devnet

# Run tests
yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts
```

Each test encrypts real position data, submits to Solana, waits for MPC finalization, and decrypts the result client-side.

---

## Arcium Integration

The program registers four computation definitions against the Arcium MPC network:

```
open_position       Encrypts collateral, size, entry price, leverage, direction.
                    Returns encrypted liquidation price.

check_liquidation   Takes encrypted position + current mark price.
                    Returns boolean only — never reveals the threshold.

calculate_pnl       Takes encrypted position + exit price.
                    Returns encrypted PnL decryptable only by the trader.

apply_funding       Applies encrypted funding rate to encrypted position.
```

Circuit files are stored as release assets and referenced by URL in `Arcium.toml`. The Arcium program fetches, verifies, and registers them against the MXE on first initialization.

---

## License

MIT
