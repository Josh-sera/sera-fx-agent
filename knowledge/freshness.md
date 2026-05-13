# Knowledge freshness log

> Tracking what's been verified, when, and against what. Apply Karpathy's "the schema is the highest-leverage artifact" insight: if the agent's grounding goes stale, every downstream answer is wrong.

When you edit a knowledge file, append a row here noting **what changed**, **what you verified it against**, and **what's date-sensitive in it**.

## Verification rules

1. Anything mentioning a specific date, version, or count gets re-checked monthly.
2. Anything citing a Sera API field gets re-checked with `sera.doctor` + a sample call.
3. Anything citing an external rail (SWIFT cost %, Wise %, Coinbase fee) gets re-checked quarterly.

## Log

| File | Last verified | Verified against | Date-sensitive content | Notes |
|---|---|---|---|---|
| `MEMORY.md` | 2026-05-13 | sera-mcp REST (api.sera.cx mainnet) + sera-fx-tools | Two-MCP architecture, tool list, payment-rails table | v2.0 — switched from Goldsky subgraph to canonical Sera REST API. Added thinking-MCP boundary doc. |
| `AGENTS.md` | 2026-05-13 | manual | Tool routing tables for both MCPs | Added 3 new triggers (derivatives, prediction markets, trading-strategy) + 7 new fx_* tools |
| `knowledge/fx-derivatives.md` | 2026-05-13 | generic FX math | Generic (perp/forward/option theory). No Sera-specific surface assumptions. | Verified via `sera.list_markets` per query — Sera may or may not list specific derivatives natively |
| `knowledge/fx-prediction-markets.md` | 2026-05-13 | generic | Generic (binary market math, Kelly, oracle design). | Specific platforms (Polymarket, etc.) verified per query, not baked in |
| `knowledge/trading-strategy.md` | 2026-05-13 | generic | Generic (sizing, vol-targeting, MM vs taker). | Numbers (vol levels, ATR multiples) are starting points, not absolutes |
| `knowledge/fx-markets.md` | (pending) | — | BIS volume figure ($9.6T from 2025), CLS coverage list | Verify against current BIS + CLS sites |
| `knowledge/stablecoins.md` | (pending) | — | Reserve/attestation status for major stables | Drop "Q1 2026" framings; use month-resolution dates |
| `knowledge/defi-infra.md` | (pending) | — | Sera as CLOB | Verified — Sera is a CLOB for stablecoin FX |
| `knowledge/cross-border.md` | (pending) | — | Cost % ranges per corridor | Re-verify against current SWIFT pricing + Wise published rates |
| `knowledge/quant-trading.md` | (pending) | — | None obviously stale | Math/theory; low rot |
| `knowledge/agent-protocols.md` | (pending) | — | Adoption stats, partner counts | Refresh: ERC-8004 adoption, x402 stats, AP2 partner list |
| `knowledge/programmable.md` | (pending) | — | CBDC pilot status, MiCA timelines | Re-check against ECB / BIS publications |

## How to verify a Sera-API claim

```bash
# 1. Health check (sera-mcp is the canonical source)
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"x","version":"0"}}}
{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"sera.doctor","arguments":{}}}' \
  | SERA_NETWORK=mainnet POLICY_PRESET=standard LOG_LEVEL=error \
    node ~/Desktop/sera-mcp/dist/index.js

# 2. Sample any Sera API field the knowledge file relies on
# 3. Update the file
# 4. Add a row above with today's date + what you verified
```

## Why this exists

The agent's value is its grounding. Without a verification log, knowledge silently rots and the agent confidently answers from stale beliefs. This file tells future-you (or the agent itself) when to refresh what.

This file is load-bearing.
