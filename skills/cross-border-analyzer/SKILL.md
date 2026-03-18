---
name: cross-border-analyzer
description: "Trace correspondent banking chains, analyze
  cross-border payment corridors, per-hop cost breakdown,
  where stablecoins bypass and where they do not,
  KL to Lima, SWIFT trace, remittance analysis"
metadata:
  "openclaw":
    "requires":
      "env": []
      "bins": []
---

# Cross-Border Payment Analyzer

Use when user asks to trace a payment corridor, understand how money moves between two cities/countries, or analyze correspondent banking chains.

## How Correspondent Banking Works

Money does not fly directly from Bank A in Country X to Bank B in Country Y. It hops through intermediary (correspondent) banks that hold nostro/vostro accounts in each currency.

```
Sender -> Sending Bank -> Correspondent 1 (USD) -> Correspondent 2 (local) -> Receiving Bank -> Recipient

Each hop:
1. SWIFT message sent (MT103 or pacs.008)
2. Correspondent debits nostro, credits vostro
3. FX conversion at one or more hops
4. Each bank takes a fee + FX markup
5. Compliance screening at each hop (sanctions, AML)
```

## Corridor Trace Template

For any corridor, trace the actual path:

### Example: Kuala Lumpur to Lima ($50,000)

```
Step 1: Sender deposits MYR at Maybank (KL)
Step 2: Maybank converts MYR -> USD (FX markup: 0.5-1.0%)
Step 3: Maybank sends SWIFT MT103 to JP Morgan (NYC)
        - Correspondent fee: $35 + 0.15%
Step 4: JP Morgan sends to Citibank (NYC, intermediary)
        - Correspondent fee: $25 + 0.10%
Step 5: Citibank sends to BBVA Continental (Lima)
        - Correspondent fee: $30 + 0.20%
Step 6: BBVA converts USD -> PEN (FX markup: 0.8-1.5%)
Step 7: PEN credited to recipient account

Total fees: ~$90 in fixed + ~2.5% in FX markup + ~0.45% in correspondent fees
Total cost: ~$1,500-$2,500 on $50,000
Settlement time: 2-5 business days
Capital trapped in nostro accounts at each hop
```

### Same corridor via stablecoin rails:

```
Step 1: Sender on-ramps MYR -> USDC via StraitsX (0.5%)
Step 2: USDC settles through Sera CLOB (0.05-0.1%)
Step 3: USDC off-ramped via Bitso in Peru (0.8-1.0%)

Total cost: ~$675-$800 on $50,000 (1.35-1.6%)
Settlement time: 15-30 minutes
No trapped capital
```

## Key Correspondent Banking Hubs

| Hub | Role | Major Banks |
|-----|------|------------|
| New York | USD clearing (CHIPS/Fedwire) | JP Morgan, Citi, BofA |
| London | EUR/GBP clearing, global node | HSBC, Barclays, Standard Chartered |
| Singapore | SEA gateway | DBS, OCBC, UOB |
| Hong Kong | Greater China gateway | HSBC, StanChart, Hang Seng |
| Tokyo | JPY clearing | MUFG, SMBC, Mizuho |
| Frankfurt | EUR clearing (TARGET2) | Deutsche Bank, Commerzbank |

## Where Stablecoins Win vs Lose

### Stablecoins WIN:

- **Non-CLS corridors**: MYR/PHP, MYR/PEN, THB/IDR. No PvP settlement in TradFi, real Herstatt risk. Stablecoin atomic settlement eliminates this.
- **Speed-sensitive**: Same-day settlement needed. TradFi is T+2 minimum.
- **Small/medium amounts**: < $5M. Correspondent chain fees have high fixed component.
- **Emerging market corridors**: Thin liquidity, wide spreads in TradFi.

### Stablecoins LOSE (or draw):

- **Large institutional (> $50M)**: OTC desks + CLS provide better rates at massive size
- **CLS-covered major pairs**: USD/EUR, USD/GBP. TradFi infrastructure is mature, competitive, low-cost.
- **Regulatory-restricted corridors**: Some countries (China, India) have capital controls that make stablecoin off-ramp difficult or illegal.

## SWIFT gpi vs Stablecoin Rails

| Feature | SWIFT gpi | Stablecoin Rails |
|---------|-----------|-----------------|
| Speed | 30min-2 days (50% same-day) | Minutes |
| Cost | 1.5-4.0% | 0.3-2.0% |
| Tracking | gpi Tracker (UETR) | On-chain (block explorer) |
| Finality | Revocable (up to recall) | Irreversible (on-chain) |
| Coverage | 11,000+ banks | Anyone with internet |
| Compliance | Bank-level KYC/AML | On/off-ramp KYC |
| Capital efficiency | Nostro pre-funding | No pre-funding |

## Output Format

```
## Corridor Trace: [CITY_A] to [CITY_B] ($[AMOUNT])

### TradFi Route
1. [Step-by-step with specific banks]
2. [Each hop: fee + FX markup]
3. [Total cost in $ and %]
4. [Settlement time]
5. [Risk factors]

### Stablecoin Route
1. [On-ramp: provider, cost]
2. [Settlement: venue, cost]
3. [Off-ramp: provider, cost]
4. [Total cost in $ and %]
5. [Settlement time]

### Comparison
| | TradFi | Stablecoin |
|--|--------|-----------|
| Cost | $X (X%) | $X (X%) |
| Time | X days | X minutes |
| Risk | [assessment] | [assessment] |
| Savings | - | $X (X%) |

### Recommendation
[Which route, why, caveats]
```
