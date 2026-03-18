---
name: fx-market-analysis
description: "Compare TradFi vs stablecoin cost for FX transfers,
  analyze corridor economics, USD to MYR cost breakdown,
  how much does it cost to send money, FX rate comparison"
metadata:
  "openclaw":
    "requires":
      "env": []
      "bins": []
---

# FX Market Analysis

Use when user asks about the cost, speed, or mechanics of moving money between currencies. Always compare TradFi (SWIFT/correspondent) vs stablecoin route.

## TradFi Cost Model

A typical cross-border payment via SWIFT:

```
Sending bank -> Correspondent 1 -> Correspondent 2 -> [Correspondent 3] -> Receiving bank

Each hop:
- SWIFT message fee: $15-50
- Correspondent lifting fee: 0.1-0.3% (min $25-50)
- FX markup at conversion point: 0.3-1.5%
- Nostro capital cost: trapped funds earn 0% while in transit

Total per hop: 0.2-0.5% + fixed fees
Total for 3-5 hops: 1.5-4.0% + $75-250 in fixed fees
Settlement: T+1 to T+2 (business days)
```

## Stablecoin Cost Model

```
On-ramp (fiat to USDC) -> Swap if needed -> Off-ramp (stablecoin to local fiat)

- On-ramp: 0-1.5%
- Swap: 0.01-0.3% (venue dependent)
- Off-ramp: 0.1-2.0% (region dependent)
- Gas: $0.001-5

Total: 0.1-3.0% (almost always cheaper)
Settlement: minutes
```

## CLS Coverage Check

CLS (Continuous Linked Settlement) eliminates Herstatt risk via PvP for 18 currencies:

**Covered**: USD, EUR, GBP, JPY, CHF, CAD, AUD, NZD, SGD, HKD, NOK, SEK, DKK, KRW, ZAR, ILS, MXN, HUF

**NOT covered**: MYR, PHP, THB, IDR, VND, PEN, COP, ARS, NGN, KES, BDT, PKR, EGP, TRY

For non-CLS currencies, there is real settlement risk. This is where stablecoin rails have the strongest advantage: atomic settlement eliminates the risk window entirely.

## Corridor Analysis Framework

For any corridor, compute:

1. **TradFi all-in cost**: SWIFT fees + correspondent fees + FX markup + nostro capital cost
2. **Stablecoin all-in cost**: on-ramp + swap + off-ramp + gas
3. **Savings**: (TradFi - Stablecoin) / TradFi
4. **Speed differential**: T+2 business days vs minutes
5. **Risk differential**: Herstatt risk (TradFi, non-CLS) vs smart contract risk (stablecoin)

## Nostro Capital Cost

Banks pre-fund nostro accounts in each currency they settle. The opportunity cost:

```
Nostro capital cost = amount_trapped * risk_free_rate * days_trapped / 365

Example: $5M trapped in MYR nostro for 2 days
= $5,000,000 * 0.05 * 2/365
= $1,370 per transaction in hidden cost
```

This cost is invisible to the end user but real. Stablecoin settlement has zero trapped capital.

## Output Format

```
## FX Analysis: [SOURCE_CURRENCY] -> [TARGET_CURRENCY] ($[AMOUNT])

### TradFi Route (SWIFT)
- Correspondent chain: [Bank A] -> [Bank B] -> [Bank C]
- SWIFT fees: $X
- Correspondent fees: X% = $X
- FX markup: X% = $X
- Nostro capital cost: $X
- **Total: X% = $X**
- **Settlement: T+[N] business days**

### Stablecoin Route
- Path: [On-ramp] -> [Swap venue] -> [Off-ramp]
- On-ramp: X% = $X
- Swap: X% = $X
- Off-ramp: X% = $X
- Gas: $X
- **Total: X% = $X**
- **Settlement: ~X minutes**

### Comparison
- Cost savings: $X (X%)
- Speed improvement: X days -> X minutes
- Risk: [CLS covered / Herstatt risk / Atomic settlement]

### Recommendation
[Which route and why]
```
