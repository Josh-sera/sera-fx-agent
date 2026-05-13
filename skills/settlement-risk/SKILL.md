---
name: settlement-risk
description: "Assess settlement risk for FX transactions,
  Herstatt risk analysis, CLS coverage check, risk window
  calculation, counterparty risk, nostro pre-funding"
metadata:
  "openclaw":
    "requires":
      "env": []
      "bins": []
---

# Settlement Risk Analyzer

Use when user asks about risk in a currency corridor, Herstatt risk, settlement safety, or whether a transaction is safe to execute.

## Herstatt Risk

Named after Bankhaus Herstatt (1974). The risk that one leg of an FX trade settles while the other does not. You pay your side, counterparty defaults before paying theirs. You lose the full notional.

**Risk window**: Time between when you pay and when you receive. In TradFi:
- Same timezone: 0-8 hours
- Cross timezone (e.g., USD/JPY): up to 24 hours
- Non-CLS currency: full T+2 window (48 business hours)

**On-chain (atomic settlement)**: Risk window = 0. Both legs settle in the same transaction or neither does.

## CLS Coverage Matrix

| Currency | CLS | Risk Level Without CLS |
|----------|-----|----------------------|
| USD | Yes | Low (deep markets, many counterparties) |
| EUR | Yes | Low |
| GBP | Yes | Low |
| JPY | Yes | Low |
| SGD | Yes | Low |
| HKD | Yes | Low |
| MYR | No | HIGH (limited counterparties, timezone gap) |
| PHP | No | HIGH (capital controls, limited liquidity) |
| THB | No | MEDIUM-HIGH (better liquidity than PHP/IDR) |
| IDR | No | HIGH (capital controls, volatile) |
| VND | No | CRITICAL (strict capital controls) |
| PEN | No | HIGH (thin market, volatile) |
| COP | No | HIGH (capital controls) |
| ARS | No | CRITICAL (blue dollar spread, controls) |
| NGN | No | CRITICAL (multiple exchange rates) |

## Risk Assessment Framework

For every corridor, assess:

1. **CLS coverage**: Are both currencies covered?
2. **Timezone gap**: Hours between settlement windows
3. **Capital controls**: Any restrictions on flow?
4. **Counterparty quality**: Bank rating, jurisdiction
5. **Amount relative to market depth**: Large trades in thin corridors = higher risk
6. **Volatility**: Current vol vs 30-day average

## Risk Scoring

```
IF both currencies CLS-covered:
  Base risk = LOW
  IF counterparty rated A+ or above: risk = LOW
  ELIF counterparty rated BBB+: risk = MEDIUM-LOW
  ELSE: risk = MEDIUM

IF either currency NOT CLS-covered:
  Base risk = HIGH
  IF capital controls exist: risk = CRITICAL
  IF timezone gap > 12 hours: risk += 1 level
  IF amount > 5% of daily corridor volume: risk += 1 level

IF atomic on-chain settlement (Sera, DEX):
  Settlement risk = ZERO
  Remaining risks: smart contract, oracle, off-ramp counterparty
```

## Nostro Pre-funding Risk

```
Pre-funding cost = notional * rate * (days_locked / 365)
Opportunity cost = same capital deployed elsewhere

For $10M locked in MYR nostro:
- If rate = 5%: $10M * 0.05 * 2/365 = $2,740/transaction
- If 50 transactions/month: $137,000/month in hidden cost
```

## Mitigation Strategies

| Risk | TradFi Mitigation | On-chain Mitigation |
|------|-------------------|-------------------|
| Herstatt | CLS (18 currencies only) | Atomic settlement (all currencies) |
| Counterparty | Netting agreements, collateral | Smart contract escrow (ERC-8183) |
| FX movement during settlement | Forward contracts | Instant settlement eliminates window |
| Nostro trapped capital | Intraday liquidity facilities | No nostro needed |
| Operational | SWIFT gpi tracking | On-chain transparency |

## Output Format

```
## Settlement Risk: [CURRENCY_PAIR] ($[AMOUNT])

**CLS Coverage**: [Both covered / One uncovered / Neither covered]
**Risk Level**: [LOW / MEDIUM / HIGH / CRITICAL]

**Risk Factors**:
- [Factor 1]: [Assessment]
- [Factor 2]: [Assessment]

**Risk Window**: [X hours (TradFi) vs 0 (on-chain)]
**Nostro Pre-funding Cost**: $[X] per transaction

**Recommendation**: [TradFi with CLS / Atomic on-chain / Split into tranches]
**Mitigation**: [Specific steps]
```
