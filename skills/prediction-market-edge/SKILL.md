---
name: prediction-market-edge
description: Compute the edge between a prediction market's quoted YES price and the probability implied by Sera's reference FX rate. Returns implied probability, edge, Kelly sizing, and a buy/sell/pass opinion. Generic — works with any market that uses an FX rate as the underlier.
triggers:
  - "prediction market"
  - "Polymarket"
  - "YES price"
  - "implied probability"
  - "edge"
  - "Kelly"
  - "binary market"
  - "USD/JPY > 158"
  - "rate touch"
  - "FX bet"
---

# prediction-market-edge

Determine if a prediction market's offered odds give you positive expectation vs Sera-implied probability.

## Inputs (from the user or context)

- Pair: base + quote ISO codes
- Threshold rate (e.g. "USD/JPY > 158")
- Direction: `above | below | between`
- Days to resolution
- Market's quoted YES price (between $0.01 and $0.99)
- Optional: user-supplied implied vol or annualized vol estimate

## Tool sequence

1. `fx_vol_window base quote` (if user didn't supply vol) → annualized vol estimate
2. `fx_prediction_market_edge` with all inputs → implied probability, edge, Kelly fraction
3. `sera.compare_to_external_fx` to verify Sera spot isn't materially out of line with market consensus
4. Cross-reference `knowledge/fx-prediction-markets.md` for sizing + caveats

## Output format

```
MARKET: USD/JPY > 158 by 2026-06-15 (32 days)
SOURCES:
  Sera spot:            156.80
  Annualized vol:       9.2% (from fx_vol_window)

MODEL:
  Implied probability:  31%  (lognormal, 32 days, 9.2% vol)
  Market YES price:     $0.42
  Edge:                 -11pp (market overprices YES by 11 percentage points)

DECISION:
  → Sell YES (or buy NO).
  → Half-Kelly fraction: 8% of bankroll on the NO side.

CAVEATS:
  - Model assumes no drift. If the user has a directional view (USD weakening), adjust upward.
  - Sera's reference may not reflect intra-day flow. fx_corridor_pulse before sizing.
  - Resolution oracle matters — check before entering large positions.
```

## Edge thresholds

| |edge|     | Action |
|---|---|
| > 10pp | Strong signal. Half-Kelly position. |
| 5–10pp | Modest signal. Quarter-Kelly. |
| < 5pp | Pass. Probably noise. |

## When to refuse the analysis

- User-supplied vol < 1% or > 100% — likely typo
- Market quoted price ≤ $0.01 or ≥ $0.99 — not enough liquidity for the math to be meaningful
- Days to resolution < 1 — gamma blow-up regime, lognormal model breaks down
- Threshold within 0.1% of spot — implied probability is essentially 50%, market is just gambling on noise

## Bookkeeping

Always pull `knowledge/fx-prediction-markets.md` for context on market design (oracle, resolution window, prize structure). Sizing recommendations assume the user has a working bankroll concept.
