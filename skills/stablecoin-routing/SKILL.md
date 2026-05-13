---
name: stablecoin-routing
description: "Find optimal path for stablecoin transfers,
  on-ramp to off-ramp routing, which DEX to use for which
  swap size, USDC to any currency, best stablecoin route,
  bridge between chains"
metadata:
  "openclaw":
    "requires":
      "env": []
      "bins": []
---

# Stablecoin Routing Optimizer

Use when user wants to move value on-chain across currencies or chains.

## DEX Selection by Trade Size

| Size        | Venue                   | Why                           |
|-------------|-------------------------|-------------------------------|
| < $10K      | Uniswap V4              | Simple, sufficient liquidity  |
| $10K - $1M  | CoW Protocol / UniswapX | Better price, solver comp.    |
| $1M - $10M  | Hyperliquid order book  | AMM slippage material at size |
| > $10M      | OTC (Cumberland, GSR)   | AMM pools cannot handle       |

**Critical**: USDC/EURC is NOT a stablecoin-to-stablecoin pair. It is an FX pair (EUR/USD ~1.08). AMMs cause IL. For FX pairs, use CLOB with oracle pricing (Sera Protocol).

## Chain Selection

- **Base L2**: Default for x402 agent micropayments
- **Polygon**: Small-value high-frequency, cheap gas
- **Solana**: High throughput, USDC + PYUSD flows
- **Ethereum mainnet**: Large sizes only (gas immaterial), Sera CLOB

## Bridge Selection

| Bridge | Cost | Speed | Notes |
|--------|------|-------|-------|
| Circle CCTP | Free (USDC only) | 10-20 min | Native burn/mint, no wrapped tokens |
| Wormhole | ~0.01% | 1-5 min | Wide chain coverage |
| Stargate | 0.01-0.06% | 1-15 min | Unified liquidity model |
| LayerZero | varies | 1-5 min | Message passing, flexible |

Default to CCTP for USDC transfers. It is free and produces native USDC.

## On-Ramp by Region

| Region | Provider | Cost | Speed |
|--------|----------|------|-------|
| USA | Coinbase (USDC) | 0% | Instant (if USD balance) |
| USA | MoonPay | 1.0-3.5% | Minutes |
| Europe | Coinbase / Kraken | 0-0.5% | Hours (SEPA) |
| SEA | Transak | 0.5-1.5% | Minutes |
| LATAM | Bitso | 0.5-1.0% | Minutes |

## Off-Ramp by Region

| Region         | Options                            | Cost       |
|----------------|------------------------------------|------------|
| Southeast Asia | Coins.ph, PDAX, Indodax, StraitsX | 0.5 - 1.5% |
| Latin America  | Bitso, Mercado Bitcoin, Ripio      | 0.8 - 2.0% |
| Europe         | Kraken, Bitstamp                   | 0.1 - 0.5% |
| USA            | Coinbase (USDC to USD free)        | 0 - 0.1%   |
| Japan          | bitFlyer, Coincheck                | 0.1 - 0.5% |
| Middle East    | Rain, Fasset                       | 0.5 - 1.5% |

## Total Cost Formula

```
Total = on_ramp + bridge (if cross-chain) + swap + off_ramp + gas
```

Always express in both basis points and absolute dollars.

## Decision Flow

```
1. Identify source currency and target currency
2. Determine if this is a stablecoin swap or FX pair
   - Same peg (USDC/USDT): straightforward swap
   - Different peg (USDC/EURC): FX pair, use CLOB
3. Check if source and target are on same chain
   - If not: select bridge (default CCTP for USDC)
4. Select swap venue by size
5. Select off-ramp by target region
6. Compute total cost
7. Compare vs TradFi alternative
```

## Output Format

```
## Stablecoin Route: [SOURCE] -> [TARGET] ($[AMOUNT])

**Path:** [Step-by-step]

**Cost Breakdown**
- On-ramp: X% = $X
- Swap ([venue]): X% = $X
- Off-ramp: X% = $X
- Gas: ~$X
- Total: X% = $X

**Settlement time:** ~X minutes

**Alternatives:** [1-2 with trade-offs]
```
