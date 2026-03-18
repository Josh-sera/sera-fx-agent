---
name: defi-protocol-selector
description: "Select optimal DeFi protocol for a trade,
  AMM vs CLOB decision, oracle selection, MEV mitigation,
  which DEX for this size, Uniswap vs Sera vs Hyperliquid"
metadata:
  "openclaw":
    "requires":
      "env": []
      "bins": []
---

# DeFi Protocol Selector

Use when user asks which protocol, DEX, or execution venue to use for a specific trade.

## AMM vs CLOB vs Intent-Based

| Factor | AMM (Uniswap) | CLOB (Sera, Hyperliquid) | Intent (CoW, UniswapX) |
|--------|---------------|--------------------------|----------------------|
| Best for | Retail swaps < $100K | FX pairs, large sizes | Mid-size, MEV-sensitive |
| Slippage | Proportional to size | Zero (limit orders) | Solver-optimized |
| IL risk | Yes (for non-pegged pairs) | No | No |
| Speed | Instant (1 block) | Instant (limit fills on match) | 1-30 seconds (solver auction) |
| MEV risk | High (sandwich attacks) | Low (limit orders) | Low (batch auctions) |
| FX pairs | BAD (IL destroys returns) | GOOD (oracle-referenced) | OK (solver handles) |

### Decision Tree

```
IF pair is FX (different pegs, e.g., USDC/EURC):
  USE CLOB (Sera Protocol)
  NEVER use AMM (impermanent loss on FX pairs is a real cost)

ELIF size < $10K AND pair is same-peg or ETH/token:
  USE AMM (Uniswap V4)

ELIF size $10K - $1M:
  USE Intent-based (CoW Protocol, UniswapX)
  Solver competition gets better price than AMM

ELIF size $1M - $10M:
  USE CLOB (Hyperliquid for crypto, Sera for FX)
  AMM slippage is material at this size

ELIF size > $10M:
  OTC desk (Cumberland, GSR, Wintermute)
  No on-chain venue has sufficient depth
```

## Oracle Selection

| Oracle | Latency | Chains | Best For |
|--------|---------|--------|----------|
| Chainlink | 1-60s (heartbeat) | 20+ | Blue-chip pairs, high reliability |
| Pyth | 400ms | 40+ | Speed-sensitive, cross-chain |
| RedStone | On-demand | 30+ | Cost-efficient, pull-based |
| Sera FICAMM | Block-level | Ethereum | Sera-native pairs |

```
IF need sub-second updates (market making):
  Pyth Network

IF need maximum reliability (settlement):
  Chainlink

IF want to minimize gas (pull only when needed):
  RedStone

IF trading on Sera:
  Use Sera's native FICAMM oracle + Chainlink/Pyth as fallback
```

## MEV Mitigation

| Strategy | How It Works | When to Use |
|----------|-------------|-------------|
| Private mempool | Submit via Flashbots Protect | Any mainnet swap |
| Intent-based | Solver executes, no public mempool | Mid-size trades |
| Limit orders (CLOB) | No MEV vector on limits | Sera, Hyperliquid |
| Batch auction | CoW Protocol batching | MEV-sensitive trades |
| Time-weighted (TWAP) | Split across blocks | Large trades on AMM |

**Default rule**: Never submit a swap to the public Ethereum mempool without MEV protection. Use Flashbots Protect RPC or intent-based routing.

## Liquidity Assessment

Before recommending a venue, check:

1. **TVL / order book depth**: Can it handle the trade size?
2. **24h volume**: Is there active trading? Low volume = stale liquidity
3. **Spread**: For CLOBs, what is the bid-ask?
4. **Slippage simulation**: For AMMs, simulate at trade size

## Output Format

```
## Protocol Selection: [PAIR] ($[AMOUNT])

**Recommended**: [Protocol name]
**Why**: [1-2 sentences]

**Venue Details**:
- Type: [AMM / CLOB / Intent-based]
- Expected slippage: X bps
- MEV risk: [Low / Medium / High]
- Oracle: [Which oracle, why]

**Execution**:
- [Step-by-step instructions]

**Alternatives**: [1-2 with trade-offs]
```
