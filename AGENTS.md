# Agent Configuration

## Keyword-Triggered Knowledge Loading

When the agent detects these keywords in a query, it loads the corresponding deep knowledge file. Deterministic. No guessing.

```yaml
triggers:
  knowledge/fx-markets.md:
    - "forex", "BIS", "ECN", "prime brokerage", "fix rate"
    - "FX market", "currency pair", "spot rate", "forward"
    - "liquidity provider", "market maker", "bid-ask"
  
  knowledge/stablecoins.md:
    - "USDC", "USDT", "PYUSD", "depeg", "attestation"
    - "stablecoin", "Circle", "Tether", "reserve"
    - "EURC", "XSGD", "MYRX", "peg"
  
  knowledge/defi-infra.md:
    - "Uniswap", "MEV", "AMM", "oracle", "CLOB"
    - "DEX", "liquidity pool", "slippage", "impermanent loss"
    - "Chainlink", "Pyth", "RedStone", "Hyperliquid"
    - "Sera", "FCIC AMM", "order book"
  
  knowledge/cross-border.md:
    - "SWIFT", "nostro", "correspondent", "CLS", "Herstatt"
    - "remittance", "cross-border", "settlement risk"
    - "vostro", "intermediary bank", "payment corridor"
  
  knowledge/quant-trading.md:
    - "Avellaneda", "TWAP", "VWAP", "carry trade"
    - "market making", "spread", "inventory", "mean reversion"
    - "order flow", "volatility", "Greeks"
  
  knowledge/agent-protocols.md:
    - "ERC-8004", "x402", "AP2", "MCP", "ACP"
    - "agent identity", "agent payment", "agent registration"
    - "Visa CLI", "visacli", "Trusted Agent Protocol"
    - "ERC-8183", "escrow", "conditional settlement"
  
  knowledge/programmable.md:
    - "CBDC", "atomic settlement", "programmable compliance"
    - "programmable money", "smart contract", "tokenization"
    - "MiCA", "regulatory", "compliance"
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

## MCP Tool Routing

Sera MCP tools are available when the query involves direct interaction with Sera Protocol:

| Tool | When to Call |
|------|-------------|
| sera_route_settlement | User wants to execute or price a settlement via Sera |
| sera_corridor_health | User asks if a corridor is safe/liquid right now |
| sera_rebalance_vault | User wants to rebalance treasury positions |
| sera_settlement_cost | User wants Sera vs SWIFT vs Wise cost comparison |
| sera_ficamm_settle_advisor | User asks about FCIC AMM position management |
| sera_run_market_maker | User wants to market-make on Sera |
| sera_preflight_check | Before any large settlement, run safety checks |

## Behavior

- Load MEMORY.md on every conversation start
- Load knowledge files only when keyword triggers match
- Load at most 2 knowledge files per query (keep context lean)
- Always prefer skills over raw knowledge for structured outputs
- Always call sera_preflight_check before settlements > $100K
