# Sera FX Agent

A complete AI agent workspace for settling foreign exchange transactions across stablecoin rails using [Sera Protocol](https://sera.cx).

7 knowledge domains. 6 reasoning skills. 7 MCP tools wired to live testnet endpoints. Every agentic payment rail that shipped in Q1 2026.

Clone it, configure it, run it. Works in OpenClaw, Claude Code, Cursor, GitHub Copilot, OpenAI Codex, and Gemini CLI.

## Quick Start

```bash
git clone https://github.com/Josh-sera/sera-fx-agent.git
cd sera-fx-agent

# Copy env and add your API key
cp .env.example .env

# Install MCP server dependencies
cd mcp/sera-fx-server && npm install && cd ../..

# Run with OpenClaw
openclaw start
```

## What's Inside

```
sera-fx-agent/
├── MEMORY.md                          # Always-loaded compressed memory (~120 lines)
├── AGENTS.md                          # Keyword triggers + skill routing
├── openclaw.json                      # Agent configuration
├── .env.example                       # Environment variables template
│
├── knowledge/                         # 7 deep knowledge domains (loaded on demand)
│   ├── fx-markets.md                  # FX market structure, BIS data, ECN/EBS
│   ├── stablecoins.md                 # USDC/USDT/PYUSD, reserves, peg mechanics
│   ├── defi-infra.md                  # AMM/CLOB/intents, oracles, MEV
│   ├── cross-border.md                # Correspondent banking, SWIFT, nostro/vostro
│   ├── quant-trading.md               # Market making, Avellaneda-Stoikov, TWAP/VWAP
│   ├── agent-protocols.md             # ERC-8004, x402, AP2, MCP, ACP
│   └── programmable.md                # CBDCs, atomic settlement, programmable compliance
│
├── skills/                            # 6 AgentSkills (SKILL.md with YAML frontmatter)
│   ├── fx-market-analysis/SKILL.md    # TradFi vs stablecoin cost comparison
│   ├── stablecoin-routing/SKILL.md    # Optimal path: on-ramp -> swap -> off-ramp
│   ├── settlement-risk/SKILL.md       # Herstatt risk, CLS coverage, risk scoring
│   ├── defi-protocol-selector/SKILL.md # AMM vs CLOB vs intent decision tree
│   ├── agent-protocol-advisor/SKILL.md # ERC-8004, x402, AP2, Visa CLI setup
│   └── cross-border-analyzer/SKILL.md # Correspondent banking trace, corridor analysis
│
└── mcp/sera-fx-server/               # 7 Sera MCP tools
    ├── index.ts                       # Full MCP server implementation
    ├── package.json
    └── tsconfig.json
```

## Architecture

**Two-layer knowledge system:**

- **Layer 1: `MEMORY.md`** (~120 lines). Always loaded. Compressed essentials: corridor economics, cost formulas, protocol addresses, decision trees for 80% of queries. Keeps context lean, keeps cost low.

- **Layer 2: 7 knowledge files** (379-733 lines each). Loaded on demand when the agent detects keywords in `AGENTS.md`. A query about "SWIFT" triggers `cross-border.md`. A query about "Uniswap" triggers `defi-infra.md`. Deterministic, no guessing.

**Why this matters for cost:**

| Model | Cost/1M tokens | Per Query | Daily (50-200 queries) |
|-------|---------------|-----------|----------------------|
| Claude Opus 4.6 | $15.00 | $0.06-$0.18 | $9-$36 |
| Claude Sonnet 4.6 | $3.00 | $0.02-$0.08 | $3-$10 |
| GPT-5.4 | varies | $0.02-$0.10 | $3-$12 |
| DeepSeek V3.2 | $0.28 | $0.002-$0.008 | $0.30-$1.20 |

Loading everything into every context window: $50+/day. Keyword-triggered loading: $3-12/day.

## Sera MCP Tools

| Tool | What It Does |
|------|-------------|
| `sera_route_settlement` | Find optimal route, return EIP-712 order params ready to sign |
| `sera_corridor_health` | GREEN/AMBER/RED corridor viability with tranche recommendation |
| `sera_rebalance_vault` | Compute and execute multi-leg vault rebalance |
| `sera_settlement_cost` | Sera vs SWIFT vs Wise cost comparison table |
| `sera_ficamm_settle_advisor` | Settle or defer FICAMM position credits |
| `sera_run_market_maker` | Two-sided market-making strategy with target APY |
| `sera_preflight_check` | GO/NO-GO/SPLIT safety check before large settlements |

All tools hit Sera's live Sepolia testnet. Endpoints:

- **GraphQL**: `https://api.goldsky.com/api/public/project_cmicv6kkbhyto01u3agb155hg/subgraphs/sera-pro/1.0.9/gn`
- **Router**: `0x82bfe1b31b6c1c3d201a0256416a18d93331d99e`
- **Relayer**: `https://api.sera.finance/api/orders/execute`

## Sera Protocol

Sera is a fully on-chain central limit order book (CLOB) for FX settlement between stablecoins on Ethereum. Not a DEX. Not an AMM. A settlement layer.

- **Zero slippage**: Trade at exactly the price you see
- **70+ FX pairs**: Stablecoin-denominated currency pairs
- **Order NFTs**: Every position is a composable on-chain asset
- **FICAMM**: Hybrid liquidity layer for bootstrapping order book depth

**Testnet is live now.** Every user gets 10M free testnet tokens.

**Mainnet launches on Ethereum by end of March 2026.**

Documentation: [docs.sera.cx](https://docs.sera.cx)

## Community

- [Haruki Kondo's 7-part dev.to series](https://dev.to/haruki_kondo/building-an-agent-skill-for-seraprotocol-the-ultimate-guide-to-on-chain-fx-automation-4o2m) - Independent build and test of the full Sera agent stack (100% pass rate, 24/24 assertions)
- [mashharuki/SeraProtocol-Sample](https://github.com/mashharuki/SeraProtocol-Sample) - Haruki's test suite and sample code
- [Sera Agent on Moltbook](https://www.moltbook.com/u/SeraAgent) - Where the agents hang out
- [Build guide](https://www.perplexity.ai/computer/a/sera-s-guide-to-building-the-c-F_wLQyYSQQ.iifKrOsRSgQ) - Full technical article

## License

MIT
