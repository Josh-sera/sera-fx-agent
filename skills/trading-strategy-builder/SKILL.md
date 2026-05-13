---
name: trading-strategy-builder
description: Given a corridor + bankroll + risk tolerance, propose a complete trading plan: entry trigger, size, stop, target, expected hold time, and which Sera tools to use for execution. Read-only — emits a plan, doesn't execute.
triggers:
  - "trade"
  - "trading strategy"
  - "entry"
  - "stop"
  - "position size"
  - "make money"
  - "profit"
  - "carry trade"
  - "mean reversion"
  - "trend following"
---

# trading-strategy-builder

Build a complete, executable-by-hand trading plan for an FX corridor. The agent emits the plan; the user executes via sera-mcp tools.

## Inputs

- Pair: base + quote
- Bankroll in USD
- Risk tolerance: `conservative | moderate | aggressive`
- Strategy type: `mean_reversion | trend | carry | arb | market_making` (or "let the agent choose")
- Optional: directional view, time horizon, stop-loss preference

## Tool sequence

1. `sera.compare_to_external_fx` — is Sera's reference clean vs external?
2. `fx_corridor_pulse` at a probe size — depth, spread, executable vs reference
3. `fx_vol_window` — recent vol regime
4. `sera.fx_history` (if `SERA_HISTORY_DB` is set) — longer-window vol + drift
5. `sera.maker_quote_ladder` — if market making is in scope, what spread is needed for target APY
6. Cross-load `knowledge/trading-strategy.md` for sizing + entry/exit rules
7. Cross-load `knowledge/quant-trading.md` for strategy-specific patterns (Avellaneda-Stoikov, TWAP, etc.)

## Output format

```
STRATEGY: USDC/XSGD mean reversion
BANKROLL: $50,000
TOLERANCE: moderate

CORRIDOR HEALTH (pulse):
  Status:               GREEN
  Spread vs reference:  -42bps (Sera below external mid)
  Executable depth:     adequate at $5K probe size

SIZING:
  Annualized vol:       6.3%
  Vol-targeted size:    (5% × $50K) / 0.063 = $39,700
  Half-Kelly cap:       $10,000 (conservative)
  → Use $10,000 position

ENTRY:
  Trigger: spread vs external mid > 50bps in either direction
  Method: take (spread justifies crossing)
  Tool: sera.get_quote → user wallet signs → sera.execute_swap

STOP:
  Price: 1.5× ATR from entry on the wrong side
  Time: close any position open >48h regardless of P&L

TARGET:
  Take 50% off at half the historical mean-reversion median (~25bps move)
  Trail the remaining 50% with stop at entry

EXPECTED HOLD: 4-12 hours per round trip
EXPECTED ROUND TRIPS PER WEEK: 3-5

PRE-TRADE CHECKLIST (run before each entry):
  1. sera.market_health for the pair
  2. sera.fx_quote_diff (current spread)
  3. Confirm position ≤ 20% of remaining bankroll
  4. Confirm daily loss limit not hit (5% of $50K = $2,500)

POST-TRADE:
  - Log entry/exit/expected via sera.fx_history (if SERA_HISTORY_DB set)
  - After 10 trades, review hit rate + avg win/loss

CAVEATS:
  - Sera's reference rate has measurable bid/ask asymmetry; `compare_to_external_fx`
    is your truth-source for "what's mid really".
  - Stablecoin FX vol is much lower than crypto majors — don't transplant
    Kelly fractions from BTC trading.
```

## Strategy decision tree (when user says "let the agent choose")

```
IF spread (Sera vs external) > 50bps AND vol stable:
  → mean reversion (this skill)
ELIF directional move on multiple timeframes AND user time horizon > days:
  → trend following
ELIF yield differential > 200bps annualized AND vol < 8%:
  → carry trade (use derivative-analysis skill for sizing)
ELIF user has > $100K AND can hold positions for hours:
  → market making (use fx_corridor_pulse + maker_quote_ladder)
ELSE:
  → no clear edge — recommend pass
```

## When to refuse to build a plan

- User can't / won't share bankroll → no sizing possible, refuse
- User wants leverage > 5× on stablecoin FX → refuse and explain
- User has had > 3 losing trades in a row this session → suggest pause + review

## Bookkeeping

Always cross-load `knowledge/trading-strategy.md` and `knowledge/quant-trading.md`. Output the plan; never execute. Any swap goes through sera-mcp tools the user calls themselves.
