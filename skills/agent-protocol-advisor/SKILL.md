---
name: agent-protocol-advisor
description: "Register agent on-chain with ERC-8004, set up x402
  micropayments, configure AP2 mandates, expose MCP tools,
  agent identity, agent payment protocols, Visa CLI"
metadata:
  "openclaw":
    "requires":
      "env": ["PRIVATE_KEY"]
      "bins": []
---

# Agent Protocol Advisor

Use when user asks about registering an agent on-chain, setting up agent payments, or integrating with Q1 2026 agent protocols.

## ERC-8004: On-Chain Agent Identity

Register your agent as an on-chain NFT. Gives it a persistent identity, reputation, and transaction history across chains.

```typescript
// Register agent with ERC-8004
import { createPublicClient, createWalletClient, http } from "viem";
import { sepolia } from "viem/chains";

const AGENT_REGISTRY = "0x..."; // ERC-8004 registry address

const abi = [
  {
    name: "registerAgent",
    type: "function",
    inputs: [
      { name: "metadata", type: "string" },
      { name: "capabilities", type: "string[]" },
    ],
    outputs: [{ name: "agentId", type: "uint256" }],
  },
] as const;

const tx = await walletClient.writeContract({
  address: AGENT_REGISTRY,
  abi,
  functionName: "registerAgent",
  args: [
    JSON.stringify({
      name: "sera-fx-agent",
      version: "1.0.0",
      description: "FX settlement agent on Sera Protocol",
      operator: "your-org-name",
    }),
    [
      "fx-settlement",
      "stablecoin-routing",
      "cross-border-analysis",
      "market-making",
    ],
  ],
});
```

**Supported chains**: Ethereum, Base, Optimism, Arbitrum, Polygon, BNB Chain.

## x402: Agent-to-Agent Micropayments

HTTP 402-based payments. Your agent pays other agents for services over HTTP.

```typescript
// x402 payment setup (USDC on Base L2)
import { x402 } from "@coinbase/x402";

const client = x402.createClient({
  chain: "base",
  wallet: agentWallet,
  maxPaymentPerRequest: "1.00", // $1 USDC max per API call
});

// Agent pays for a premium data feed
const response = await client.fetch(
  "https://fx-data-provider.example/api/rates/USDMYR",
  {
    method: "GET",
    payment: {
      currency: "USDC",
      maxAmount: "0.10", // 10 cents for this request
    },
  }
);
// If the server returns 402, x402 automatically negotiates
// and pays, then retries the request with proof of payment
```

**Stats**: 50M+ transactions on Base L2 as of March 2026.

## AP2: Google Agent-to-Agent Protocol

Mandate-based authorization. A human sets spending limits, the agent operates within them.

```typescript
// AP2 mandate configuration
const mandate = {
  agent_id: "sera-fx-agent-v1",
  permissions: [
    {
      action: "fx_settlement",
      max_amount_usd: 50000,
      max_per_day: 5,
      approved_corridors: ["USD/MYR", "USD/PHP", "USD/SGD"],
      require_preflight: true, // Run sera_preflight_check first
    },
    {
      action: "data_purchase",
      max_amount_usd: 100,
      max_per_day: 50,
      provider_allowlist: ["refinitiv", "bloomberg", "pyth"],
    },
  ],
  expiry: "2026-06-30T00:00:00Z",
  notify_on: ["settlement_executed", "limit_reached"],
};
```

**Ecosystem**: 60+ launch partners including Salesforce, SAP, Intuit, HubSpot.

## Visa CLI: visacli.sh

Agents hold Visa credentials and pay from terminal. Built on RFC 9421 HTTP message signatures (Trusted Agent Protocol).

```bash
# Authenticate with Visa Trusted Agent Protocol
$ visacli auth \
    --agent-id "sera-fx-agent-v1" \
    --cert "/etc/visa/agent.pem"

# Agent purchases premium FX data
$ visacli pay \
    --merchant "refinitiv-fx-feed" \
    --amount "49.99" \
    --currency "USD" \
    --memo "Monthly FX tick data subscription"

# Returns: transaction_id, auth_code, settlement_status
```

## ERC-8183: Conditional Settlement

Escrow where an AI evaluator, ZK verifier, or DAO decides whether to release funds.

```typescript
// Create conditional escrow
const escrow = await escrowFactory.createEscrow({
  depositor: agentWallet.address,
  beneficiary: counterpartyAddress,
  amount: parseUnits("50000", 6), // 50K USDC
  token: USDC_ADDRESS,
  evaluator: {
    type: "ai", // or "zk", "dao", "oracle"
    endpoint: "https://evaluator.example/verify",
    criteria: "Verify FX settlement completed at agreed rate",
  },
  timeout: 86400, // 24 hours
});
```

## MCP Tool Exposure

Expose your agent's capabilities as MCP tools so other agents can call them:

```typescript
// In your MCP server
server.tool(
  "fx_quote",
  "Get real-time FX quote with cost breakdown",
  {
    from: z.string(),
    to: z.string(),
    amount: z.string(),
  },
  async ({ from, to, amount }) => {
    // Your agent's FX analysis logic
    const quote = await analyzeRoute(from, to, amount);
    return { content: [{ type: "text", text: JSON.stringify(quote) }] };
  }
);
```

## Output Format

```
## Agent Protocol Setup: [PROTOCOL]

**What it does**: [1 sentence]
**Status**: [Live / Beta / Proposed]

**Implementation**:
[Working code with comments]

**Dependencies**: [packages, keys, contracts needed]
**Cost**: [Gas, fees, subscription]
**Next steps**: [What to do after setup]
```
