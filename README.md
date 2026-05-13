# Sera FX Agent

The FX intelligence agent for [Sera Protocol](https://sera.cx). Reads Sera's mainnet REST API for live FX state. Composes that data into thinking tools — corridor health, vol estimates, basis decomposition, prediction-market edge calc, carry analysis, triangular arb scan, multi-corridor comparison. **Read-only** — every state mutation routes through `sera-mcp` (which has all the policy / signer / safety gates).

10 lazy-loaded knowledge domains. 9 reasoning skills. Two MCPs (intentional split: thinking + execution). Built to plug into ANY Sera-based product — Sera's first-party tools, third-party derivatives, prediction markets, trading desks, settlement flows.

Works in **OpenClaw, Hermes, NanoClaw, Claude Code, Claude Desktop, Cursor, OpenAI Agents SDK** — anything that speaks MCP.

## Quick Start (OpenClaw — default)

```bash
# 1. Clone this agent + the canonical sera-mcp (which owns execution)
git clone https://github.com/Josh-sera/sera-fx-agent.git
git clone https://github.com/Josh-sera/sera-mcp.git ~/sera-mcp
cd ~/sera-mcp && npm install && npm run build && cd -

# 2. Install this agent's thinking-MCP deps
cd sera-fx-agent
cp .env.example .env             # add ANTHROPIC_API_KEY (or OPENAI_API_KEY)
cd mcp/sera-fx-tools && npm install && cd ../..

# 3. Run with OpenClaw
SERA_MCP_DIST=$HOME/sera-mcp/dist/index.js openclaw start
```

## Other hosts

See [`hosts/README.md`](hosts/README.md) for per-host setup. Same two-MCP wiring pattern across all of them.

## Architecture — Two MCPs by design

```
                 ┌────────────────────────────────────────┐
                 │     OpenClaw / Hermes / NanoClaw       │
                 │       Claude / Cursor / etc.           │
                 └────────────────┬───────────────────────┘
                                  │
                ┌─────────────────┴──────────────────┐
                │                                    │
                ▼                                    ▼
    ┌───────────────────────┐           ┌──────────────────────────┐
    │  sera-fx-tools (THIS) │           │   sera-mcp (EXECUTION)   │
    │  ──────────────────── │           │   ────────────────────── │
    │  7 read-only tools    │           │   32 tools, mainnet REST │
    │  Synthesizes insight  │           │   Quote → sign → execute │
    │  No signing, no state │           │   Policy + caps + gates  │
    └────────────┬──────────┘           └────────────┬─────────────┘
                 │                                   │
                 └────────────┬──────────────────────┘
                              ▼
                   ┌──────────────────────┐
                   │  Sera REST API       │
                   │  api.sera.cx (chain  │
                   │  id=1, mainnet)      │
                   └──────────────────────┘
```

**Why two MCPs:** thinking is cheap, fast, read-only — should be free to use without warming up the execution path. Execution is gated, binding, and expensive — should only run when the user explicitly wants to mutate state. Mixing them means analytical exploration is slower than it needs to be, AND analytical tools end up holding signing keys they don't need.

## Knowledge layers

**Layer 1 — `MEMORY.md`** (~150 lines, always loaded). Compressed essentials: the two-MCP boundary, corridor economics, tool reference, decision trees.

**Layer 2 — 10 `knowledge/*.md` files**, lazy-loaded by keyword triggers in [`AGENTS.md`](AGENTS.md):

| File | Loads when user mentions |
|---|---|
| fx-markets | forex, BIS, ECN, prime brokerage |
| stablecoins | USDC, USDT, depeg, attestation, peg |
| defi-infra | Uniswap, MEV, AMM, oracle, CLOB |
| cross-border | SWIFT, nostro, CLS, Herstatt |
| quant-trading | Avellaneda, TWAP, market making |
| agent-protocols | ERC-8004, x402, AP2, MCP, ACP |
| programmable | CBDC, atomic settlement, MiCA |
| **fx-derivatives** | perp, forward, option, basis, Greeks, carry |
| **fx-prediction-markets** | prediction market, Polymarket, Kelly, edge |
| **trading-strategy** | trading strategy, entry, stop, sizing, profit |
| freshness | (the verification log; not auto-loaded) |

## Skills (9)

Each is a `SKILL.md` with frontmatter + structured-output template:

- fx-market-analysis · stablecoin-routing · settlement-risk · defi-protocol-selector
- agent-protocol-advisor · cross-border-analyzer
- **derivative-analysis** — decompose perp/forward/option using Sera spot + user-supplied derivative price
- **prediction-market-edge** — implied probability vs offered odds + Kelly sizing
- **trading-strategy-builder** — full plan: entry, size, stop, target, hold time

## Thinking tools (sera-fx-tools, 7)

| Tool | What it composes |
|---|---|
| `fx_corridor_pulse` | Live snapshot: executable rate vs reference, depth, GREEN/AMBER/RED |
| `fx_arb_radar` | Triangular arb scan across a fiat basket |
| `fx_vol_window` | Annualized vol from Sera reference rate |
| `fx_basis_thinker` | Spot vs forward/perp basis decomposition |
| `fx_prediction_market_edge` | Sera-implied prob vs market YES price + Kelly |
| `fx_carry_thinker` | Daily carry, breakeven, Sharpe-like ratio |
| `fx_corridor_compare` | Rank N corridors by execution cost at a target size |

All read-only. Hit Sera REST. Compose with sera-mcp's primitives or external sources.

## Sera tools (sera-mcp, 32 — for execution)

The canonical execution layer. The agent calls these for any state-mutating action: quote, swap, treasury, settlement. See `sera://help/tools` resource (loaded in any host that registers sera-mcp).

## Cost economics

| Model | Per-query | Daily (50–200 q) |
|---|---|---|
| Claude Opus 4.6 | $0.06–$0.18 | $9–$36 |
| Claude Sonnet 4.6 (default) | $0.02–$0.08 | $3–$10 |
| GPT-5.4 (fallback) | $0.02–$0.10 | $3–$12 |
| DeepSeek V3.2 | $0.002–$0.008 | $0.30–$1.20 |

Loading every knowledge file into every prompt: $50+/day. Keyword-triggered loading: $3–$12/day.

## What changed in v2.0

The previous build hit a Goldsky GraphQL subgraph indexing **Sepolia testnet** with its own MCP that competed with `sera-mcp`. Wrong surface, wrong network, duplicate infra. v2.0:

- Mainnet only (chain_id=1, `api.sera.cx/api/v1`)
- `sera-mcp` is the execution authority — not duplicated here
- New thinking-MCP `sera-fx-tools` (7 read-only compositors)
- 3 new knowledge files: derivatives, prediction markets, trading strategy
- 3 new skills: derivative-analysis, prediction-market-edge, trading-strategy-builder
- Generic positioning — works with ANY Sera-based product, not just Sera's first-party tools

## Repository layout

```
sera-fx-agent/
├── README.md
├── MEMORY.md                          Always-loaded compressed memory
├── AGENTS.md                          Keyword + tool routing
├── openclaw.json                      Wires sera-mcp + sera-fx-tools
├── .env.example
│
├── knowledge/                         Lazy-loaded references (11 files incl. freshness)
├── skills/                            9 SKILL.md files
├── mcp/sera-fx-tools/                 7 thinking tools (read-only, mainnet REST)
└── hosts/                             Per-host integration snippets
```

## License

MIT
