# Agent Configuration

## Keyword-Triggered Knowledge Loading

When the agent detects these keywords in a query, it loads the corresponding deep knowledge file. Deterministic. No guessing. Load at most 2 per query.

```yaml
triggers:
  knowledge/fx-markets.md:
    - "forex", "BIS", "ECN", "prime brokerage", "fix rate"
    - "FX market", "currency pair", "spot rate"
    - "liquidity provider", "bid-ask"

  knowledge/stablecoins.md:
    - "USDC", "USDT", "PYUSD", "depeg", "attestation"
    - "stablecoin", "Circle", "Tether", "reserve"
    - "EURC", "XSGD", "JPYC", "MYRT", "TGBP", "peg"

  knowledge/defi-infra.md:
    - "Uniswap", "MEV", "AMM", "oracle", "CLOB"
    - "DEX", "liquidity pool", "slippage", "impermanent loss"
    - "Chainlink", "Pyth", "RedStone", "Hyperliquid"
    - "Sera", "order book"

  knowledge/cross-border.md:
    - "SWIFT", "nostro", "correspondent", "CLS", "Herstatt"
    - "remittance", "cross-border", "settlement risk"
    - "vostro", "intermediary bank", "payment corridor"

  knowledge/quant-trading.md:
    - "Avellaneda", "TWAP", "VWAP"
    - "market making", "spread", "inventory", "order flow"
    - "Sharpe", "drawdown"

  knowledge/agent-protocols.md:
    - "ERC-8004", "x402", "AP2", "MCP", "ACP"
    - "agent identity", "agent payment", "agent registration"
    - "Visa CLI", "Trusted Agent Protocol"
    - "ERC-8183", "escrow", "conditional settlement"

  knowledge/programmable.md:
    - "CBDC", "atomic settlement", "programmable compliance"
    - "programmable money", "tokenization"
    - "MiCA", "regulatory"

  knowledge/fx-derivatives.md:
    - "perp", "perpetual", "forward", "FX option", "basis swap"
    - "Greeks", "delta", "gamma", "vega", "theta"
    - "carry trade", "contango", "backwardation"
    - "term structure", "premium", "intrinsic value"

  knowledge/fx-prediction-markets.md:
    - "prediction market", "Polymarket", "binary market"
    - "implied probability", "edge", "Kelly", "YES price"
    - "rate touch", "FX bet"

  knowledge/trading-strategy.md:
    - "trading strategy", "entry", "stop", "position size"
    - "mean reversion", "trend following"
    - "make money", "profit", "bankroll"
```

## Skill Routing

| Skill | Trigger Patterns |
|-------|-----------------|
| fx-market-analysis | "cost to send", "how much", "USD to [currency]", "compare rates" |
| stablecoin-routing | "best path", "route", "cheapest way", "on-ramp", "off-ramp" |
| settlement-risk | "risk", "Herstatt", "CLS", "settlement window", "safe to settle" |
| defi-protocol-selector | "which DEX", "AMM or CLOB", "protocol for", "where to swap" |
| agent-protocol-advisor | "register agent", "ERC-8004", "x402", "agent identity", "MCP" |
| cross-border-analyzer | "trace", "corridor", "how does money move", "correspondent" |
| derivative-analysis | "perp", "forward", "option", "basis", "carry", "Greeks" |
| prediction-market-edge | "prediction market", "edge", "Kelly", "YES price", "binary" |
| trading-strategy-builder | "trading strategy", "entry", "stop", "make money" |

## MCP Tool Routing — Two-MCP Boundary

The agent has TWO MCPs. The split matters: thinking is cheap and read-only; execution is expensive, gated, and binding. Never blur these.

### `sera-fx-tools` (THINKING — read-only)

Use these for ANALYSIS. They synthesize Sera data into FX intelligence. Cheap, fast, no liquidity required for most.

| Tool | When to call |
|---|---|
| fx_corridor_pulse | Live snapshot of one pair: rate, spread, depth, GREEN/AMBER/RED |
| fx_arb_radar | Triangular arb scan across a fiat basket |
| fx_vol_window | Annualized vol estimate (best paired with sera.fx_history for longer windows) |
| fx_basis_thinker | Decompose spot vs forward/perp basis (user provides the forward price) |
| fx_prediction_market_edge | Sera-implied probability vs offered odds, returns Kelly fraction |
| fx_carry_thinker | Daily carry, breakeven, Sharpe-like ratio for FX carry trades |
| fx_corridor_compare | Rank N corridors by execution cost at a target size |

### `sera-mcp` (EXECUTION — read AND write, mainnet REST)

Use these for ACTION. State mutations always go through here. Has all the policy gates, signing flow, daily volume cap, dry-run, etc.

| Tool | When to call |
|---|---|
| sera.list_currencies | Discover supported stablecoins |
| sera.get_markets | Discover trading pairs |
| sera.get_fx_rate | Sera reference FX rate (cheap, cached) |
| sera.compare_to_external_fx | Diff Sera reference vs Frankfurter / open.er-api / exchangerate.host |
| sera.get_quote | Single-use quote + EIP-712 Intent for the wallet to sign |
| sera.execute_swap | Submit signed quote — completes the swap |
| sera.find_deals | Cross-corridor scan with external mid comparison |
| sera.maker_quote_ladder | Spread ladder for maker P&L planning |
| sera.fx_history / sera.fx_volatility / sera.corridor_pnl | Time series (requires SERA_HISTORY_DB) |
| sera.treasury_value / sera.exposure_report / sera.rebalance_plan / sera.pay_invoice | Treasury intelligence (requires API key) |
| sera.doctor | Health + policy summary (run if anything looks off) |

(There are 32 sera.* tools total; full list in MEMORY.md and `sera://help/tools` resource.)

## Behavior

- Load MEMORY.md on every conversation start
- Load knowledge files only when keyword triggers match (max 2 per query)
- Always prefer skills over raw knowledge for structured outputs
- Default to `simulate: true` on `sera.get_quote` when the user is exploring vs committing
- For execution above $100K: call `sera.doctor` first + show policy summary + ask for explicit confirmation
- Never invent token symbols, market IDs, or rates — always pull from the tools
- For derivative / prediction market / trading questions: cross-load the relevant knowledge file AND use sera-fx-tools (cheaper than full sera-mcp probes)
- The agent works with ANY Sera-using product (third-party derivatives, prediction markets, trading desks, etc.) — Sera is the underlying liquidity / pricing source, not the only product surface
