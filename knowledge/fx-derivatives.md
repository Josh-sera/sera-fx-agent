# FX Derivatives — perps, options, basis, carry

> Generic FX derivatives knowledge. The agent should apply this whether the derivative venue is a Sera-built product, a third-party perp DEX using Sera spot as oracle, or a TradFi forward.

## What "FX derivative" means here

| Instrument | Settles in | Sera role |
|---|---|---|
| **FX perp** | Cash (stablecoin) | Sera spot is a candidate oracle source |
| **FX dated forward** | Cash | Sera quote at expiry is the settlement reference |
| **FX option** (vanilla) | Cash | Spot reference + vol input |
| **Cross-currency basis swap** | Both legs | Two Sera FX rates + an interest rate differential |
| **Carry trade** (synthetic) | None — it's a position | Use Sera to roll long high-yield / short low-yield stablecoin |

## Core math

### Spot-forward basis

```
basis = (forward - spot) / spot
annualized_basis = basis × (365 / days_to_expiry)
```

Sign:
- `+` → contango (forward > spot). Long-spot / short-forward earns the carry.
- `-` → backwardation. Short-spot / long-forward earns the carry.

Material levels (annualized):
- `<50bps` typical for liquid TradFi forwards
- `100-300bps` common in stablecoin perps (driven by funding, not interest rate parity)
- `>500bps` flag — usually a one-sided positioning blow-off; mean-reverts unless structural

The `fx_basis_thinker` MCP tool computes this from a user-supplied forward price and Sera spot.

### Perp funding ≈ basis

Perp funding rate compensates for spot deviation:
```
expected_funding ≈ (perp_mark - spot) / spot × annualization_factor
```

If `funding > realized_basis_decay`, shorting the perp + holding spot is positive carry. Watch out for:
- Funding paid every N hours (usually 1h or 8h); accrual is per-period, not per-day
- Funding can flip sign quickly when crowd positioning shifts

### Option premium decomposition

```
premium = intrinsic_value + time_value
intrinsic = max(0, spot - strike)   for call
time_value ≈ spot × σ × √(T) × N'(d1)   for ATM
```

Greeks (FX-specific notes):
- **Delta**: 0.5 at ATM, → 1 deep ITM call. FX perps are delta=1.
- **Gamma**: peaks at ATM near expiry. Hedging cost.
- **Vega**: long options = long vol. Sell vol when realized < implied.
- **Theta**: time decay. Buyer pays this; seller earns it. Annualized = vega × IV / √(2π).

### Carry trade

```
expected_carry_pa = yield_long_currency - yield_short_currency
```

Yield in stablecoin context = the DeFi yield differential between high-yield and low-yield stablecoin pools (NOT central bank rates — though they correlate).

Example:
- Long XSGD, short USDC. SGD DeFi yield ≈ 5%, USD DeFi yield ≈ 4%. Spread = 100bps annualized.
- Daily carry = 100bps / 365 ≈ 0.27bps per day.
- Breakeven adverse FX move per day = 0.27bps. Anything bigger and carry doesn't cover.

The `fx_carry_thinker` tool computes this — caller supplies the yield spread, tool combines with Sera spot.

## Pricing perps without a perp venue

Sometimes there's no perp on Sera, but the agent needs to estimate "what would the funding be?" Approximate:

```
implied_funding_8h ≈ basis_to_nearest_dated_forward × (8/24) / days_to_forward
```

If no forward either, fall back to realized vol × √(8/24) and assume neutral funding.

## Common patterns the agent should suggest

1. **Calendar spread** — long near forward, short far forward. Sera spot drift cancels; you're trading the term structure.
2. **Risk-reversal** — long call + short put at different strikes. Bullish skew without paying for the call alone.
3. **Cash-and-carry** — long spot via Sera, short forward elsewhere. Locks the basis at no FX risk if perfectly hedged.
4. **Synthetic forward** — long call + short put at same strike = synthetic forward at strike. Useful when forwards aren't quoted.

## What the agent should NOT do

- Quote firm option premiums — that's a market-making job, not an analytical one.
- Recommend leveraged FX perp positions without sizing by `vol × notional` (use Kelly fraction or fixed-fractional).
- Ignore funding when computing perp P&L. A 5% spread between long and short can be eaten by funding in days.

## Sera surface check

If the user asks about an FX derivative on Sera specifically, run `sera_list_markets` first. Sera might or might not have direct derivative listings — many derivatives are built BY THIRD PARTIES on top of Sera spot pricing. The agent's job is to compose Sera's primitives (spot, history) with the user's external derivative source.

## Verification

Last verified: 2026-05-13. Math is generic and date-stable. Sera-specific surfaces (which derivatives, if any, Sera ships natively) should be verified via `sera_list_markets` per query — don't bake assumptions about Sera's product roadmap into this file.
