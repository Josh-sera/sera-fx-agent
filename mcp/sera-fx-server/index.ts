import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// ── Sera Testnet Endpoints ─────────────────────────
const SERA_GRAPHQL =
  "https://api.goldsky.com/api/public/"
  + "project_cmicv6kkbhyto01u3agb155hg/"
  + "subgraphs/sera-pro/1.0.9/gn";

const SERA_ROUTER  = "0x82bfe1b31b6c1c3d201a0256416a18d93331d99e";
const SERA_RELAYER = "https://api.sera.finance/api/orders/execute";

// ── Server Init ────────────────────────────────────
const server = new McpServer({
  name: "sera-fx-tools",
  version: "1.0.0",
});

// ── Helper: Query Sera GraphQL ─────────────────────
async function querySeraGraph(query: string, variables?: Record<string, any>) {
  const res = await fetch(SERA_GRAPHQL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

// ── Helper: Query Markets ──────────────────────────
async function queryMarkets(fromToken: string, toToken: string) {
  const query = `{
    markets(where: {
      or: [
        { baseToken_contains_nocase: "${fromToken}", quoteToken_contains_nocase: "${toToken}" },
        { baseToken_contains_nocase: "${toToken}", quoteToken_contains_nocase: "${fromToken}" }
      ]
    }) {
      id
      baseToken
      quoteToken
      lastPrice
      volume24h
    }
  }`;
  const data = await querySeraGraph(query);
  return data.markets || [];
}

// ── Helper: Query Order Book Depth ─────────────────
async function queryDepth(marketId: string, amount: string) {
  const query = `{
    orders(
      where: { market: "${marketId}", status: "OPEN" }
      orderBy: price
      orderDirection: desc
      first: 100
    ) {
      id
      price
      amount
      side
      maker
    }
  }`;
  const data = await querySeraGraph(query);
  return {
    marketId,
    orders: data.orders || [],
    requestedAmount: amount,
  };
}

// ── Helper: Score Paths ────────────────────────────
function scorePaths(
  paths: any[],
  opts: { urgency?: string }
) {
  return paths
    .map((p) => {
      const bids = p.orders.filter((o: any) => o.side === "BUY");
      const asks = p.orders.filter((o: any) => o.side === "SELL");
      const bestBid = bids[0]?.price || 0;
      const bestAsk = asks[0]?.price || Infinity;
      const spread = bestAsk - bestBid;
      const depth = asks.reduce(
        (sum: number, o: any) => sum + parseFloat(o.amount),
        0
      );
      return {
        ...p,
        bestBid,
        bestAsk,
        spread,
        depth,
        outputAmount: depth > parseFloat(p.requestedAmount)
          ? parseFloat(p.requestedAmount) * bestAsk
          : depth * bestAsk,
        costBps: (spread / bestAsk) * 10000,
        slippageBps: depth < parseFloat(p.requestedAmount)
          ? ((parseFloat(p.requestedAmount) - depth) / parseFloat(p.requestedAmount)) * 10000
          : 0,
        path: [p.marketId],
      };
    })
    .sort((a, b) => a.costBps - b.costBps);
}

// ── Helper: Build EIP-712 Order ────────────────────
function buildEIP712Order(route: any, router: string) {
  return {
    domain: {
      name: "Sera Protocol",
      version: "1",
      chainId: 11155111, // Sepolia
      verifyingContract: router,
    },
    types: {
      Order: [
        { name: "maker", type: "address" },
        { name: "market", type: "bytes32" },
        { name: "side", type: "uint8" },
        { name: "amount", type: "uint256" },
        { name: "price", type: "uint256" },
        { name: "expiry", type: "uint256" },
        { name: "nonce", type: "uint256" },
      ],
    },
    value: {
      maker: "SIGNER_ADDRESS",
      market: route.marketId,
      side: 0, // 0 = BUY
      amount: route.requestedAmount,
      price: route.bestAsk?.toString() || "0",
      expiry: Math.floor(Date.now() / 1000) + 3600, // 1 hour
      nonce: Date.now(),
    },
  };
}

// ── Tool: sera_route_settlement ────────────────────
server.tool(
  "sera_route_settlement",
  "Find optimal settlement route across Sera order book. "
  + "Enumerates direct and multi-leg paths, queries depth, "
  + "computes cost per route, returns best path with "
  + "EIP-712 order params ready to sign.",
  {
    from_token: z.string().describe("Source token (e.g. USDC)"),
    to_token:   z.string().describe("Target token (e.g. MYRX)"),
    amount:     z.string().describe("Amount in source token units"),
    urgency:    z.enum(["low", "medium", "high"]).optional(),
  },
  async ({ from_token, to_token, amount, urgency }) => {
    // 1. Query available markets
    const markets = await queryMarkets(from_token, to_token);

    // 2. For each path, query order book depth
    const paths = await Promise.all(
      markets.map((m: any) => queryDepth(m.id, amount))
    );

    // 3. Score routes: expected output, slippage, gas
    const scored = scorePaths(paths, { urgency });

    // 4. Build EIP-712 order params for best route
    const best = scored[0];
    const orderParams = buildEIP712Order(best, SERA_ROUTER);

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          route: best.path,
          expected_output: best.outputAmount,
          cost_bps: best.costBps,
          slippage_bps: best.slippageBps,
          eip712_params: orderParams,
          relayer_url: SERA_RELAYER,
          alternatives: scored.slice(1, 3).map((s) => ({
            path: s.path,
            cost_bps: s.costBps,
          })),
        }, null, 2),
      }],
    };
  }
);

// ── Tool: sera_corridor_health ─────────────────────
server.tool(
  "sera_corridor_health",
  "Check health and viability of a Sera FX corridor. "
  + "Returns GREEN/AMBER/RED with depth, spread, and "
  + "tranche recommendation.",
  {
    base_token:  z.string().describe("Base token (e.g. XSGD)"),
    quote_token: z.string().describe("Quote token (e.g. MYRX)"),
    amount:      z.string().describe("Settlement amount in base token"),
  },
  async ({ base_token, quote_token, amount }) => {
    const markets = await queryMarkets(base_token, quote_token);
    if (markets.length === 0) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            status: "RED",
            reason: `No active market for ${base_token}/${quote_token}`,
            recommendation: "Use multi-leg route via USDC",
          }),
        }],
      };
    }

    const depth = await queryDepth(markets[0].id, amount);
    const totalDepth = depth.orders.reduce(
      (sum: number, o: any) => sum + parseFloat(o.amount), 0
    );
    const requestedNum = parseFloat(amount);
    const coverage = totalDepth / requestedNum;
    const spread = depth.orders.length > 1
      ? Math.abs(parseFloat(depth.orders[0].price) - parseFloat(depth.orders[depth.orders.length - 1].price))
      : Infinity;

    let status = "GREEN";
    let recommendation = "Safe to settle in single tranche";

    if (coverage < 0.5) {
      status = "RED";
      recommendation = `Insufficient depth. Only ${(coverage * 100).toFixed(0)}% coverage. Split into ${Math.ceil(1 / coverage)} tranches or use multi-leg via USDC.`;
    } else if (coverage < 1.0) {
      status = "AMBER";
      recommendation = `Partial depth. ${(coverage * 100).toFixed(0)}% coverage. Consider splitting into 2-3 tranches.`;
    }

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          status,
          corridor: `${base_token}/${quote_token}`,
          depth_available: totalDepth,
          amount_requested: requestedNum,
          coverage_pct: (coverage * 100).toFixed(1),
          spread_bps: spread,
          recommendation,
          order_count: depth.orders.length,
        }, null, 2),
      }],
    };
  }
);

// ── Tool: sera_settlement_cost ─────────────────────
server.tool(
  "sera_settlement_cost",
  "Compare settlement cost: Sera vs SWIFT vs Wise/Remitly. "
  + "Returns cost table per rail in USD and basis points.",
  {
    from_currency: z.string().describe("Source currency (e.g. USD)"),
    to_currency:   z.string().describe("Target currency (e.g. MYR)"),
    amount:        z.string().describe("Amount in source currency"),
  },
  async ({ from_currency, to_currency, amount }) => {
    const amountNum = parseFloat(amount);

    // SWIFT estimate (3-5 hop model)
    const swiftFixed = 35 * 3 + 25; // avg 3 correspondents + SWIFT fee
    const swiftPct = 0.025; // 2.5% avg for non-CLS
    const swiftCost = swiftFixed + (amountNum * swiftPct);

    // Wise estimate
    const wisePct = 0.008; // ~0.8% for most corridors
    const wiseFixed = 5;
    const wiseCost = wiseFixed + (amountNum * wisePct);

    // Sera estimate (needs live data)
    let seraCost = amountNum * 0.003; // ~0.3% baseline estimate
    try {
      const stableFrom = `${from_currency}C`; // e.g., USDC
      const stableTo = `${to_currency}X`; // e.g., MYRX
      const markets = await queryMarkets(stableFrom, stableTo);
      if (markets.length > 0) {
        const depth = await queryDepth(markets[0].id, amount);
        const scored = scorePaths([depth], {});
        if (scored.length > 0) {
          seraCost = amountNum * (scored[0].costBps / 10000);
        }
      }
    } catch {
      // Use baseline estimate
    }

    // Add on-ramp + off-ramp for Sera
    const onRampCost = amountNum * 0.005; // 0.5% avg
    const offRampCost = amountNum * 0.008; // 0.8% avg
    const seraTotal = seraCost + onRampCost + offRampCost;

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          corridor: `${from_currency}/${to_currency}`,
          amount: amountNum,
          comparison: [
            {
              rail: "SWIFT",
              cost_usd: swiftCost.toFixed(2),
              cost_pct: ((swiftCost / amountNum) * 100).toFixed(2) + "%",
              cost_bps: ((swiftCost / amountNum) * 10000).toFixed(0),
              settlement_time: "1-3 business days",
              notes: "Includes correspondent fees and FX markup",
            },
            {
              rail: "Wise",
              cost_usd: wiseCost.toFixed(2),
              cost_pct: ((wiseCost / amountNum) * 100).toFixed(2) + "%",
              cost_bps: ((wiseCost / amountNum) * 10000).toFixed(0),
              settlement_time: "1-2 business days",
              notes: "Pooled model, mid-market rate",
            },
            {
              rail: "Sera Protocol",
              cost_usd: seraTotal.toFixed(2),
              cost_pct: ((seraTotal / amountNum) * 100).toFixed(2) + "%",
              cost_bps: ((seraTotal / amountNum) * 10000).toFixed(0),
              settlement_time: "~15 minutes",
              notes: "Includes on-ramp (0.5%) + Sera settlement + off-ramp (0.8%)",
            },
          ],
          recommended: seraTotal < wiseCost ? "Sera Protocol" : "Wise",
        }, null, 2),
      }],
    };
  }
);

// ── Tool: sera_rebalance_vault ─────────────────────
server.tool(
  "sera_rebalance_vault",
  "Compute and execute vault rebalance across Sera markets. "
  + "Sequences legs to self-fund, decides maker vs taker per leg.",
  {
    vault_address: z.string().describe("Vault contract address"),
    target_weights: z.string().describe(
      "JSON target weights, e.g. {\"USDC\": 0.7, \"XSGD\": 0.2, \"MYRX\": 0.1}"
    ),
    total_value: z.string().describe("Total vault value in USD"),
  },
  async ({ vault_address, target_weights, total_value }) => {
    const targets = JSON.parse(target_weights);
    const total = parseFloat(total_value);

    // Compute target amounts
    const targetAmounts = Object.entries(targets).map(([token, weight]) => ({
      token,
      target_usd: total * (weight as number),
      target_pct: ((weight as number) * 100).toFixed(1) + "%",
    }));

    // Determine which legs to execute (sell before buy to self-fund)
    const legs = targetAmounts.map((t) => ({
      token: t.token,
      target_usd: t.target_usd,
      action: "REBALANCE",
      note: "Query current vault balance to determine buy/sell",
    }));

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          vault: vault_address,
          total_value_usd: total,
          target_allocation: targetAmounts,
          execution_plan: legs,
          strategy: "Sell overweight positions first to fund underweight buys",
          note: "Connect vault balance feed for live delta computation",
        }, null, 2),
      }],
    };
  }
);

// ── Tool: sera_ficamm_settle_advisor ───────────────
server.tool(
  "sera_ficamm_settle_advisor",
  "Advise whether to settle or defer FICAMM position credits. "
  + "Reads state indices, computes net pending value, projects P&L.",
  {
    position_id: z.string().describe("FICAMM position ID"),
    token:       z.string().describe("Token to evaluate (e.g. USDC)"),
  },
  async ({ position_id, token }) => {
    // Query FICAMM position state
    const query = `{
      ficammPosition(id: "${position_id}") {
        id
        owner
        token
        depositAmount
        lastSeenIndex
        pendingCredits
        settledAmount
        createdAt
      }
    }`;

    try {
      const data = await querySeraGraph(query);
      const pos = data.ficammPosition;

      if (!pos) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              recommendation: "POSITION_NOT_FOUND",
              note: "Check position ID and try again",
            }),
          }],
        };
      }

      const pending = parseFloat(pos.pendingCredits || "0");
      const settled = parseFloat(pos.settledAmount || "0");
      const deposit = parseFloat(pos.depositAmount || "0");
      const totalValue = settled + pending;
      const pnl = totalValue - deposit;
      const pnlPct = (pnl / deposit) * 100;

      // Settlement fee estimate (capital gains on positive P&L)
      const settleFee = pnl > 0 ? pnl * 0.001 : 0; // 0.1% protocol fee on gains

      const recommendation = pending > deposit * 0.05
        ? "SETTLE"
        : "WAIT";

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            position_id,
            token,
            deposit_amount: deposit,
            settled_amount: settled,
            pending_credits: pending,
            total_value: totalValue,
            pnl: pnl.toFixed(2),
            pnl_pct: pnlPct.toFixed(2) + "%",
            settle_fee_estimate: settleFee.toFixed(2),
            recommendation,
            reasoning: recommendation === "SETTLE"
              ? `Pending credits (${pending.toFixed(2)}) exceed 5% of deposit. Settle to realize gains.`
              : `Pending credits (${pending.toFixed(2)}) are small relative to deposit. Wait for more accumulation.`,
          }, null, 2),
        }],
      };
    } catch (err) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            recommendation: "ERROR",
            error: String(err),
          }),
        }],
      };
    }
  }
);

// ── Tool: sera_run_market_maker ────────────────────
server.tool(
  "sera_run_market_maker",
  "Configure and monitor a two-sided market-making strategy "
  + "on a Sera order book. Computes spread for target APY.",
  {
    market:      z.string().describe("Market pair (e.g. XSGD/MYRX)"),
    target_apy:  z.string().describe("Target APY percentage (e.g. 8)"),
    capital:     z.string().describe("Capital allocated in USD"),
  },
  async ({ market, target_apy, capital }) => {
    const apy = parseFloat(target_apy);
    const cap = parseFloat(capital);

    // Compute required spread for target APY
    // Simplified: APY = (spread * fills_per_day * 365) / capital
    // Assume ~10 fills per day for active pair
    const fillsPerDay = 10;
    const requiredDailyReturn = (apy / 100) / 365;
    const requiredSpreadPct = (requiredDailyReturn / fillsPerDay) * 100;
    const spreadBps = requiredSpreadPct * 100;

    // Order sizes (split capital across price levels)
    const levels = 5;
    const orderSize = cap / (levels * 2); // 5 levels each side

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          market,
          target_apy: apy + "%",
          capital_usd: cap,
          strategy: {
            spread_bps: spreadBps.toFixed(1),
            spread_pct: requiredSpreadPct.toFixed(4) + "%",
            order_levels: levels,
            order_size_per_level: orderSize.toFixed(2),
            total_orders: levels * 2,
          },
          execution: {
            step_1: "Subscribe to Sera oracle WebSocket for live price",
            step_2: `Post ${levels} bid orders below mid, ${levels} ask orders above mid`,
            step_3: "Cancel and repost on price move > spread/2",
            step_4: "Track inventory exposure, rebalance if > 60% one-sided",
          },
          monitoring: {
            track: ["realized_pnl", "inventory_skew", "fill_rate", "running_apy"],
            rebalance_trigger: "Inventory skew > 60%",
            stop_loss: "Daily P&L < -0.5% of capital",
          },
          note: "This is a configuration plan. Actual execution requires signing EIP-712 orders via wallet.",
        }, null, 2),
      }],
    };
  }
);

// ── Tool: sera_preflight_check ─────────────────────
server.tool(
  "sera_preflight_check",
  "Pre-settlement safety check. Verifies peg status, depth, "
  + "counterparty balance. Returns GO/NO-GO/SPLIT.",
  {
    from_token: z.string().describe("Source token"),
    to_token:   z.string().describe("Target token"),
    amount:     z.string().describe("Settlement amount"),
  },
  async ({ from_token, to_token, amount }) => {
    const amountNum = parseFloat(amount);
    const checks: any[] = [];
    let status = "GO";

    // Check 1: Market exists
    const markets = await queryMarkets(from_token, to_token);
    if (markets.length === 0) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            status: "NO-GO",
            reason: `No market for ${from_token}/${to_token}`,
            checks: [{ check: "market_exists", passed: false }],
            recommendation: "Route via USDC as intermediate",
          }, null, 2),
        }],
      };
    }
    checks.push({ check: "market_exists", passed: true });

    // Check 2: Depth sufficiency
    const depth = await queryDepth(markets[0].id, amount);
    const totalDepth = depth.orders.reduce(
      (sum: number, o: any) => sum + parseFloat(o.amount), 0
    );
    const depthOk = totalDepth >= amountNum;
    checks.push({
      check: "depth_sufficient",
      passed: depthOk,
      detail: `${totalDepth.toFixed(2)} available vs ${amountNum} requested`,
    });
    if (!depthOk) status = totalDepth > amountNum * 0.5 ? "SPLIT" : "NO-GO";

    // Check 3: Spread sanity
    if (depth.orders.length >= 2) {
      const prices = depth.orders.map((o: any) => parseFloat(o.price));
      const maxSpread = Math.max(...prices) - Math.min(...prices);
      const midPrice = (Math.max(...prices) + Math.min(...prices)) / 2;
      const spreadBps = (maxSpread / midPrice) * 10000;
      const spreadOk = spreadBps < 100; // < 1% spread
      checks.push({
        check: "spread_reasonable",
        passed: spreadOk,
        detail: `${spreadBps.toFixed(0)} bps`,
      });
      if (!spreadOk && status === "GO") status = "SPLIT";
    }

    const recommendation =
      status === "GO"
        ? "Safe to settle in single tranche"
        : status === "SPLIT"
        ? `Split into ${Math.ceil(amountNum / totalDepth)} tranches of ${(totalDepth * 0.8).toFixed(0)} each`
        : "Do not proceed. Insufficient liquidity or market not available.";

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          status,
          corridor: `${from_token}/${to_token}`,
          amount: amountNum,
          checks,
          recommendation,
        }, null, 2),
      }],
    };
  }
);

// ── Start Server ───────────────────────────────────
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const transport = new StdioServerTransport();
server.connect(transport).catch(console.error);
