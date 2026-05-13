# FX Prediction Markets — implied probability, edge, market design

> Generic prediction market knowledge applied to FX. Works for any third-party prediction market that uses Sera-derived spot rates as the underlier (Polymarket-style markets, Augur-style oracles, custom escrow markets on Sera stablecoins, etc.).

## What an FX prediction market is

A binary or multi-outcome market on the future state of an FX rate. Examples:
- "USD/JPY > 158 by Friday close?"
- "Will EUR/USD touch 1.10 in the next 30 days?"
- "Closing rate for USD/MYR on June 30, 2026: 4.20–4.30 / 4.30–4.40 / 4.40+?"

Settlement happens when the market resolves: a yes-share pays $1 if the condition is met, $0 otherwise. The market's quoted YES price (between $0.01 and $0.99) is the market's implied probability.

## Core math

### Implied probability from a Sera reference rate

For "rate ≥ K at time T", under a lognormal model (FX spot ≈ GBM):

```
ln(spot_T / spot_0) ~ N(μ × T, σ² × T)

P(spot_T ≥ K) = 1 - Φ((ln(K/spot_0) - μT) / (σ √T))
```

Where:
- `Φ` = standard normal CDF
- `μ` = drift (often assumed 0 for short horizons)
- `σ` = annualized vol
- `T` = years to resolution

The `fx_prediction_market_edge` tool computes this from Sera spot + a vol input (or derived from `fx_vol_window`).

### Edge calculation

```
edge = implied_probability_from_model - market_yes_price
```

- `edge > 0.05` → buy YES (model says outcome is more likely than market priced)
- `edge < -0.05` → sell YES / buy NO
- Within ±0.05 → no clear signal; pass

### Kelly fraction sizing

For a binary bet at market YES price `p_market`, with model probability `p_model`:

```
kelly = (b × p_model - (1 - p_model)) / b
where b = (1 - p_market) / p_market   (decimal odds for the YES bet)
```

- `kelly > 0`: positive expectation. Bet `kelly × bankroll` on YES (full Kelly is aggressive — half-Kelly is standard practice).
- `kelly < 0`: negative expectation. Don't bet (or bet NO if NO has positive Kelly).

## Market design considerations (when evaluating a market)

1. **What's the resolver?**
   - On-chain oracle (Chainlink, Pyth) — verifiable but lags
   - Sera price at a specific block — exact but vulnerable to manipulation if size is small
   - UMA / Reality.eth optimistic oracle — disputable, slower to settle
   - Centralized settlement (single party) — fast but trust-dependent

2. **What's the underlier?**
   - Sera fx_rate at a snapshot? Trustworthy but smoothed (Sera applies its own aggregation)
   - Sera market last-trade price? Volatile but real
   - External (Bloomberg fix, ECB reference)? Off-chain dependency

3. **What's the resolution window?**
   - Single point in time → vulnerable to flash manipulation
   - VWAP over a window → more robust, harder to game
   - Multi-source median → most robust

4. **What's the prize structure?**
   - 1:1 binary → standard
   - Scalar (proportional to outcome) → continuous payoff
   - Tiered (3+ buckets) → multi-outcome

## Common biases the agent should flag

- **Recency bias**: market price chases recent FX moves. Often overshoots.
- **Round-number magnetism**: markets price round numbers (USD/JPY 150, EUR/USD 1.10) higher than vol-adjusted probability suggests. Real flows defend round numbers, but markets overprice.
- **Tail underpricing**: extreme outcomes (>3σ) are systematically underpriced in retail markets. Edge available on rare events.
- **Sample-size illiquidity**: many FX prediction markets have <$10K open interest. A single trade can move the price without information.

## What the agent should NOT do

- Treat the model probability as absolute truth. The market may price in info that's not in Sera's reference rate (central bank meeting tomorrow, intervention, etc.).
- Ignore funding/borrow costs on hedged positions.
- Bet on markets resolving via a single-source oracle without checking the oracle's manipulation budget.
- Suggest sizing >Half-Kelly without explicit user confirmation.

## How to use the agent's tools together

A typical "prediction market opportunity" workflow:

```
1. user: "USD/JPY hit 158 by Friday — Polymarket has YES at $0.42, what do you think?"
2. fx_vol_window USD JPY                      → annualized vol estimate
3. fx_prediction_market_edge with vol from #2  → implied prob, edge, Kelly
4. fx_corridor_pulse USDC JPYC + sera.fx_history JPY → check if Sera's spot is current + behaving normally
5. agent reasons over knowledge/quant-trading.md (mean-reversion, vol clustering)
6. agent returns: implied prob, market price, edge, Kelly fraction, risk caveats
```

## Verification

Last verified: 2026-05-13. Math is standard. Specific market platforms (Polymarket, Limitless, Sera-native if/when launched) should be verified per query — don't bake platform assumptions here.
