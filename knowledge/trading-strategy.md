# Trading Strategy — sizing, vol-aware entry/exit, market making vs taking

> Practical FX trading knowledge for stablecoin pairs on Sera or any Sera-based derivative venue.

## Sizing

### Vol-targeted position sizing

```
position_notional = (target_vol × bankroll) / pair_realized_vol
```

Example: $10K bankroll, target portfolio vol 5%/yr, USDC/JPYC realized vol 8%/yr →
position = (0.05 × 10_000) / 0.08 = $6,250.

Use `fx_vol_window` (or `sera.fx_volatility` from history DB) for the realized number.

### Half-Kelly default

For directional positions with quantified edge:

```
position_pct = 0.5 × (edge / variance)
```

Full Kelly is mathematically optimal for log-utility but assumes certainty in `edge` — wrong in practice. Half-Kelly is the standard professional reduction.

### Hard caps regardless of model

- Single position: ≤ 20% of bankroll
- Single corridor: ≤ 30% (multiple positions in correlated pairs counted together)
- Daily loss limit: 5% of bankroll → flatten

These are guardrails for when the model is wrong (it sometimes is).

## Entry/exit

### Vol-aware entry

Don't enter a directional position when realized vol is at a recent low — that often precedes a vol expansion (volatility-of-volatility clusters). Wait for either:
- Vol expansion + your bias confirmed by price action, OR
- Vol contraction + a clear range with defined invalidation

### Stops

| Strategy | Stop sizing |
|---|---|
| Mean reversion | 1.5–2× ATR from entry, on the wrong side |
| Trend following | Trailing stop at 1× ATR below recent swing low (long) |
| Carry trade | Stop at FX move equal to 30 days of expected carry — anything bigger means carry isn't compensating |
| Arb / market making | Time-based stop (close after N hours), not price-based |

### Profit taking

Don't define "take profit" ahead of time for trends. Use a trailing stop. For mean-reversion, take 50% off at the median target, hold the rest with stop at entry.

## Maker vs taker

### When to make (post passive orders, earn rebate/spread)

- Liquid pair, tight spread, deep book
- You don't need fill urgency
- Capital not needed elsewhere immediately
- Your model produces a fair value tighter than the spread

### When to take (cross the spread)

- Thin pair where waiting risks adverse selection
- Time-sensitive (event coming, deadline)
- Size > top-of-book (can't get filled passively at the price you want)
- Spread is wider than your edge

For Sera specifically, `sera.maker_quote_ladder` shows the earnings table at common bps spreads. Use it to decide if making is worth the inventory risk.

## Market microstructure rules of thumb

- **Adverse selection**: if your passive order gets hit immediately, the market just learned something you didn't. Reprice.
- **Fade the open, trade the close**: first hour after major FX market opens (Tokyo, London, NY) is noise; last hour has direction.
- **Don't trade through illiquid hours** (Asian afternoon, US late evening) for mean-reversion strategies — you'll get stopped on noise.
- **Funding/carry beats narrative**: stablecoin pairs settle their own basis through funding mechanisms; reading "USD strength" headlines doesn't help you trade USDC/EURC.

## Pre-trade checklist

Run these before entering any position:

1. `fx_corridor_pulse` — is the corridor live + reasonable spread vs reference?
2. `fx_vol_window` — what's the recent vol (and is it expansive vs contractive)?
3. `sera.compare_to_external_fx` — does Sera's reference deviate materially from external mid? If yes, Sera might be pricing in something external doesn't (or vice versa).
4. `sera.maker_quote_ladder` — if making, what spread do you need to earn target APY?
5. Hard sizing check — position ≤ 20% bankroll? Daily loss limit hit?

## Post-trade

- Log entry, expected move, stop, target. Use `sera.fx_history` to track realized vs expected.
- After 10 trades, compute hit rate + average win/loss. If win rate × avg win < loss rate × avg loss, model is broken — pause.

## What the agent should NOT do

- Recommend a "moonshot" position without explicit risk warning.
- Suggest entering when the user hasn't told you their bankroll (sizing requires a denominator).
- Encourage trading on news without quantitative entry/exit rules.
- Forget to remind the user that stablecoin FX has lower vol than crypto majors — same Kelly fraction applied to BTC and EURC produces very different risk.

## Verification

Last verified: 2026-05-13. Strategy framing is generic; numbers (vol levels, ATR multiples) are starting points operators should tune to their bankroll and risk tolerance.
