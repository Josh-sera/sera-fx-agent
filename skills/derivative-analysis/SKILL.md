---
name: derivative-analysis
description: Analyze an FX derivative (perp, dated forward, option, basis swap) using Sera spot + a user-supplied derivative price. Decompose into intrinsic, time value, basis, carry. Returns annualized basis bps, Greeks for options, and a buy/sell/hold opinion.
triggers:
  - "perp"
  - "perpetual"
  - "forward"
  - "FX option"
  - "basis"
  - "carry trade"
  - "derivative"
  - "premium decomposition"
  - "term structure"
---

# derivative-analysis

Decompose an FX derivative into its components and evaluate.

## Inputs (from the user or context)

- Pair: base + quote ISO codes (e.g. USD/JPY)
- Instrument type: `perp | dated_forward | call | put | basis_swap`
- Quoted price of the derivative
- For dated instruments: days to expiry
- For options: strike + (optional) implied vol
- For perps: current funding rate, if known

## Tool sequence

1. `sera.get_fx_rate base quote` → spot reference
2. `fx_basis_thinker base quote forward_price days_to_expiry` → annualized basis bps + sign
3. (options only) Walk through Greeks math from `knowledge/fx-derivatives.md`:
   - Compute `d1`, `d2` from BS
   - Premium ≈ intrinsic + time value
   - Vega, theta, gamma at the strike
4. (perps only) Estimate implied funding from basis and compare to user-supplied funding rate
5. (carry only) Use `fx_carry_thinker` with the user's yield spread input
6. Cross-reference `knowledge/fx-derivatives.md` for context

## Output format

```
PAIR: USD/JPY
INSTRUMENT: dated_forward (30 days to expiry)

SPOT (Sera):           158.20
FORWARD (user input):  158.65
BASIS:                 +28.5 bps annualized (contango)

INTERPRETATION:
- Forward trades 0.28% above spot annualized.
- Within normal range for USD/JPY (typical 20-50bps).
- Long-spot / short-forward locks in 28.5bps over 30 days = ~2.4bps absolute.

ACTION CANDIDATES:
- Cash-and-carry: long USDC/sell JPYC spot, sell forward → locks +28.5bps if perfectly hedged.
- Funding cost on the forward leg matters; check the venue.

CAVEATS:
- Basis can shift mid-trade. Use a stop at +50bps to cap downside.
- Sera spot is reference, not executable. Check fx_corridor_pulse for the executable rate.
```

## Common patterns

| User says | Skill response |
|---|---|
| "Should I buy this USD/JPY perp?" | Compute basis vs spot, flag if funding > basis (negative carry on the long), suggest sizing per `knowledge/trading-strategy.md`. |
| "What's a fair price for this 30-day USD/SGD forward?" | Spot + (rate_diff × T/365). If user-supplied price deviates >50bps annualized, flag it. |
| "ATM call on USD/MYR strike 4.20, 14 days, what should it cost?" | Pull spot, ask user for IV (or use fx_vol_window estimate), apply BS approximation, output premium + theta + vega. |
| "Carry trade XSGD vs USDC, 100bps spread, worth it?" | Use fx_carry_thinker, check fx_vol_window, compute Sharpe, flag if vol > spread. |

## Bookkeeping

Cross-load `knowledge/fx-derivatives.md` for any unfamiliar instrument type. Don't guess the formulas.
