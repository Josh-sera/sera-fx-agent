/**
 * Sera FX Agent — thinking tools.
 *
 * READ-ONLY analytical MCP for the Sera FX agent. These tools COMPOSE primitives
 * exposed by sera-mcp and other Sera-based surfaces into higher-level FX intelligence:
 * corridor health, vol surface, basis term structure, prediction-market edge,
 * derivative premium decomposition, triangular arb radar.
 *
 * BOUNDARY:
 *   - This MCP NEVER executes anything. No swap, no signing, no state mutation.
 *   - Execution lives in sera-mcp (which has all the policy / signer / safety gates).
 *   - This MCP only thinks: it reads, synthesizes, scores, ranks, recommends.
 *
 * Talks to api.sera.cx via REST (mainnet by default). Override the base URL via
 * SERA_BASE_URL when running against staging — the same hardcoded-allowlist
 * approach used in sera-mcp applies here too (refuses non-sera.cx hosts unless
 * SERA_BASE_URL_ALLOW_NON_SERA=true is also set).
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// ─── Configuration ──────────────────────────────────────────────────────
const NETWORK = (process.env.SERA_NETWORK ?? "mainnet").toLowerCase();
const NETWORK_URLS: Record<string, string> = {
  mainnet: "https://api.sera.cx/api/v1",
  sepolia: "https://api-sepolia.sera.cx/api/v1",
};
const ALLOW_CUSTOM = (process.env.SERA_BASE_URL_ALLOW_CUSTOM ?? "false").toLowerCase() === "true";
const ALLOW_NON_SERA = (process.env.SERA_BASE_URL_ALLOW_NON_SERA ?? "false").toLowerCase() === "true";
const RAW_URL = process.env.SERA_BASE_URL;

function resolveBaseUrl(): string {
  if (!RAW_URL) return NETWORK_URLS[NETWORK] ?? NETWORK_URLS.mainnet;
  if (!ALLOW_CUSTOM) {
    process.stderr.write(
      `sera-fx-tools: SERA_BASE_URL set but SERA_BASE_URL_ALLOW_CUSTOM is not 'true' — IGNORING.\n`,
    );
    return NETWORK_URLS[NETWORK] ?? NETWORK_URLS.mainnet;
  }
  let parsed: URL;
  try { parsed = new URL(RAW_URL); }
  catch { throw new Error(`SERA_BASE_URL invalid: ${RAW_URL}`); }
  if (parsed.protocol !== "https:") throw new Error(`SERA_BASE_URL must be https://`);
  const inSera = parsed.hostname === "sera.cx" || parsed.hostname.endsWith(".sera.cx");
  if (!inSera && !ALLOW_NON_SERA) {
    throw new Error(
      `SERA_BASE_URL host "${parsed.hostname}" is not under sera.cx. ` +
        `Set SERA_BASE_URL_ALLOW_NON_SERA=true to override.`,
    );
  }
  return RAW_URL.replace(/\/+$/, "");
}
const BASE_URL = resolveBaseUrl();

// ─── REST helpers (no signer; read-only) ─────────────────────────────────
async function getJson<T>(path: string, query: Record<string, string | number | undefined> = {}): Promise<T> {
  const url = new URL(BASE_URL + path);
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  }
  const res = await fetch(url, { headers: { accept: "application/json" }, redirect: "manual" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`sera ${res.status} ${path}: ${text.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const url = BASE_URL + path;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(body),
    redirect: "manual",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`sera ${res.status} ${path}: ${text.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}

// ─── Token resolution (cached) ───────────────────────────────────────────
interface SeraToken { symbol: string; address: string; decimals: number; fiat_currency?: string; }
let _tokensCache: { at: number; tokens: SeraToken[] } | null = null;
async function tokens(): Promise<SeraToken[]> {
  if (_tokensCache && Date.now() - _tokensCache.at < 5 * 60_000) return _tokensCache.tokens;
  const data = await getJson<{ tokens: SeraToken[] }>("/tokens");
  _tokensCache = { at: Date.now(), tokens: data.tokens };
  return data.tokens;
}
async function resolveToken(ref: string): Promise<SeraToken | null> {
  const list = await tokens();
  if (/^0x[0-9a-fA-F]{40}$/.test(ref)) return list.find((t) => t.address.toLowerCase() === ref.toLowerCase()) ?? null;
  return list.find((t) => t.symbol.toUpperCase() === ref.toUpperCase()) ?? null;
}

// ─── Quote helper (uses Sera REST /swap/quote with a burn address) ───────
const SIMULATE_OWNER = "0x000000000000000000000000000000000000dEaD";
async function probeQuote(from: SeraToken, to: SeraToken, humanAmount: number): Promise<
  | { ok: true; output: number; rate: number }
  | { ok: false; reason: string }
> {
  const fromAmount = BigInt(Math.floor(humanAmount * Math.pow(10, from.decimals))).toString();
  try {
    const sysTime = await getJson<{ timestamp: number }>("/system/time").catch(() => ({ timestamp: Math.floor(Date.now() / 1000) }));
    const expiration = Number(sysTime.timestamp) + 60;
    const r = await postJson<any>("/swap/quote", {
      from_token: from.address,
      to_token: to.address,
      from_amount: fromAmount,
      owner_address: SIMULATE_OWNER,
      recipient: SIMULATE_OWNER,
      expiration,
      gas_mode: "receive_less",
    });
    const minOutRaw: string = r.route_params?.minOutputAmount ?? "0";
    const output = Number(minOutRaw) / Math.pow(10, to.decimals);
    if (output <= 0) return { ok: false, reason: "min_output_zero" };
    return { ok: true, output, rate: output / humanAmount };
  } catch (e: any) {
    return { ok: false, reason: e?.message ?? String(e) };
  }
}

// ─── FX rate helper (Sera reference rate, no liquidity required) ─────────
async function fxRate(base: string, quote: string): Promise<number | null> {
  try {
    const r = await getJson<{ rate: string }>("/fx/rate", { base: base.toUpperCase(), quote: quote.toUpperCase() });
    const n = Number(r.rate);
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch { return null; }
}

// ─── Server ──────────────────────────────────────────────────────────────
const server = new McpServer({ name: "sera-fx-tools", version: "1.0.0" });

// 1. fx_corridor_pulse — live health snapshot for one pair at a target size
server.tool(
  "fx_corridor_pulse",
  "Snapshot the live health of a Sera FX corridor: executable rate, spread vs reference, " +
    "depth at the requested size, GREEN/AMBER/RED grade. Read-only — does not execute.",
  {
    from: z.string().describe("Source token symbol (e.g. USDC)"),
    to: z.string().describe("Target token symbol (e.g. XSGD)"),
    notional: z.number().positive().describe("Trade size in `from`-token units"),
  },
  async ({ from, to, notional }) => {
    const fromT = await resolveToken(from);
    const toT = await resolveToken(to);
    if (!fromT || !toT) {
      return { content: [{ type: "text", text: JSON.stringify({ status: "RED", reason: !fromT ? `unknown token ${from}` : `unknown token ${to}` })}]};
    }
    const fiatPair = `${fromT.fiat_currency ?? "USD"}/${toT.fiat_currency ?? "USD"}`;
    const [refRate, exec] = await Promise.all([
      fxRate(fromT.fiat_currency ?? "USD", toT.fiat_currency ?? "USD"),
      probeQuote(fromT, toT, notional),
    ]);
    if (!exec.ok) {
      return { content: [{ type: "text", text: JSON.stringify({
        pair: `${fromT.symbol}/${toT.symbol}`, fiat_pair: fiatPair, status: "RED",
        reason: exec.reason, reference_rate: refRate,
      }, null, 2)}]};
    }
    const deviationBps = refRate ? Math.round(((exec.rate - refRate) / refRate) * 10_000) : null;
    let status = "GREEN";
    if (deviationBps !== null && Math.abs(deviationBps) > 100) status = "AMBER";
    if (deviationBps !== null && Math.abs(deviationBps) > 300) status = "RED";
    return { content: [{ type: "text", text: JSON.stringify({
      pair: `${fromT.symbol}/${toT.symbol}`, fiat_pair: fiatPair,
      notional, executable_rate: exec.rate, executable_output: exec.output,
      reference_rate: refRate, deviation_bps_vs_reference: deviationBps,
      status, note: "Read-only — to execute use sera-mcp's get_quote + execute_swap.",
    }, null, 2)}]};
  },
);

// 2. fx_arb_radar — triangular arb scan across a basket
server.tool(
  "fx_arb_radar",
  "Scan a basket of fiat currencies for triangular arbitrage opportunities. For every " +
    "(A,B,C) triple, compute rate(A,B)*rate(B,C)*rate(C,A). Deviation from 1.0 in bps " +
    "is the implied edge. Read-only — does not execute.",
  {
    currencies: z.array(z.string()).min(3).describe("List of 3+ ISO fiat codes (e.g. ['USD','SGD','MYR','EUR'])"),
    min_edge_bps: z.number().nonnegative().optional().describe("Minimum |deviation| to surface. Default 50."),
  },
  async ({ currencies, min_edge_bps }) => {
    const minEdge = min_edge_bps ?? 50;
    const upper = currencies.map((c) => c.toUpperCase());
    const cache = new Map<string, number>();
    await Promise.all(
      upper.flatMap((a) => upper.map((b) => a !== b ? (async () => {
        const r = await fxRate(a, b);
        if (r) cache.set(`${a}/${b}`, r);
      })() : null)).filter(Boolean) as Array<Promise<void>>,
    );
    const triangles: Array<{ legs: [string, string, string]; product: number; edge_bps: number }> = [];
    for (let i = 0; i < upper.length; i++) for (let j = i + 1; j < upper.length; j++) for (let k = j + 1; k < upper.length; k++) {
      const a = upper[i], b = upper[j], c = upper[k];
      const r1 = cache.get(`${a}/${b}`), r2 = cache.get(`${b}/${c}`), r3 = cache.get(`${c}/${a}`);
      if (!r1 || !r2 || !r3) continue;
      const product = r1 * r2 * r3;
      const edgeBps = Math.round((product - 1) * 10_000);
      if (Math.abs(edgeBps) >= minEdge) triangles.push({ legs: [a, b, c], product, edge_bps: edgeBps });
    }
    triangles.sort((a, b) => Math.abs(b.edge_bps) - Math.abs(a.edge_bps));
    return { content: [{ type: "text", text: JSON.stringify({
      currencies_scanned: upper, min_edge_bps: minEdge,
      triangles_with_edge: triangles.length, triangles,
      caveat: "Reference-rate arbitrage. Execute via sera-mcp; check executable spread first via fx_corridor_pulse.",
    }, null, 2)}]};
  },
);

// 3. fx_vol_window — rolling vol over a recent reference-rate window
server.tool(
  "fx_vol_window",
  "Approximate annualized volatility of a fiat pair using Sera's reference rate. Probes " +
    "/fx/rate at intervals (best-effort using Sera's 24h delta). Useful for sizing positions " +
    "or pricing simple FX options. Read-only.",
  {
    base: z.string().describe("Base fiat code (e.g. 'USD')"),
    quote: z.string().describe("Quote fiat code (e.g. 'JPY')"),
  },
  async ({ base, quote }) => {
    const r = await getJson<{ rate: string; rate_24h_ago?: string }>("/fx/rate", {
      base: base.toUpperCase(), quote: quote.toUpperCase(),
    }).catch(() => null);
    if (!r) {
      return { content: [{ type: "text", text: JSON.stringify({ pair: `${base}/${quote}`, error: "rate unavailable" })}]};
    }
    const today = Number(r.rate);
    const yest = Number(r.rate_24h_ago ?? r.rate);
    const dailyReturn = today > 0 && yest > 0 ? Math.log(today / yest) : 0;
    // Single-day return → very rough annualized estimate (×√365). Best paired
    // with longer history from sera-mcp's fx_history when SERA_HISTORY_DB is set.
    const annualizedVolEst = Math.abs(dailyReturn) * Math.sqrt(365);
    return { content: [{ type: "text", text: JSON.stringify({
      pair: `${base.toUpperCase()}/${quote.toUpperCase()}`,
      latest_rate: today, rate_24h_ago: yest,
      daily_log_return: dailyReturn,
      annualized_vol_estimate: annualizedVolEst,
      caveat: "Single-day proxy. For real vol, set SERA_HISTORY_DB on sera-mcp and use sera.fx_volatility over a longer window.",
    }, null, 2)}]};
  },
);

// 4. fx_basis_thinker — given spot + a forward/perp price from any source, decompose basis
server.tool(
  "fx_basis_thinker",
  "Decompose the basis between a spot Sera FX rate and a user-supplied forward/perp price " +
    "for the same pair. Returns annualized basis in bps and a carry-vs-arbitrage interpretation. " +
    "Read-only — works with ANY forward/perp source the user pulls from.",
  {
    base: z.string(),
    quote: z.string(),
    forward_price: z.number().positive().describe("Forward or perp mark (1 base = X quote)"),
    days_to_expiry: z.number().positive().describe("Days until forward settles. Use 1 for perps."),
  },
  async ({ base, quote, forward_price, days_to_expiry }) => {
    const spot = await fxRate(base, quote);
    if (!spot) return { content: [{ type: "text", text: JSON.stringify({ error: `no Sera spot for ${base}/${quote}` })}]};
    const basis = (forward_price - spot) / spot;
    const annualized = (basis * 365) / days_to_expiry;
    const annualizedBps = Math.round(annualized * 10_000);
    return { content: [{ type: "text", text: JSON.stringify({
      pair: `${base}/${quote}`, spot, forward_price, days_to_expiry,
      basis_pct: (basis * 100).toFixed(4), annualized_basis_bps: annualizedBps,
      sign: annualizedBps > 0 ? "contango" : annualizedBps < 0 ? "backwardation" : "flat",
      interpretation: Math.abs(annualizedBps) > 200
        ? "Material basis. Carry trade or arb candidate — check funding cost on the forward source."
        : "Basis is within normal range; carry is small.",
      caveat: "Spot from Sera /fx/rate. Forward/perp price is whatever you supplied; this tool doesn't fetch it.",
    }, null, 2)}]};
  },
);

// 5. fx_prediction_market_edge — implied probability vs offered odds
server.tool(
  "fx_prediction_market_edge",
  "Compare the probability implied by Sera's reference FX rate vs offered odds on a prediction " +
    "market. Returns implied probability, market probability, and Kelly-fraction sizing. " +
    "Generic — works with any prediction market that uses the Sera-derived spot as its underlier.",
  {
    base: z.string().describe("Base fiat (e.g. 'USD')"),
    quote: z.string().describe("Quote fiat (e.g. 'JPY')"),
    threshold_rate: z.number().positive().describe("The rate level the market is asking about (e.g. USD/JPY > 158)"),
    direction: z.enum(["above", "below"]),
    market_yes_price: z.number().min(0.01).max(0.99).describe("Market's quoted YES price (0.01-0.99)"),
    days_to_resolution: z.number().positive().describe("Days until the market resolves"),
    annualized_vol_estimate: z.number().positive().optional().describe("Optional vol — if unset, derives from fx_vol_window"),
  },
  async ({ base, quote, threshold_rate, direction, market_yes_price, days_to_resolution, annualized_vol_estimate }) => {
    const spot = await fxRate(base, quote);
    if (!spot) return { content: [{ type: "text", text: JSON.stringify({ error: `no Sera spot for ${base}/${quote}` })}]};
    let vol = annualized_vol_estimate;
    if (!vol) {
      const r = await getJson<{ rate: string; rate_24h_ago?: string }>("/fx/rate", { base, quote }).catch(() => null);
      if (r) {
        const today = Number(r.rate), yest = Number(r.rate_24h_ago ?? r.rate);
        const daily = today > 0 && yest > 0 ? Math.log(today / yest) : 0;
        vol = Math.max(0.01, Math.abs(daily) * Math.sqrt(365));
      } else {
        vol = 0.10; // 10% fallback
      }
    }
    const T = days_to_resolution / 365;
    const sigma = vol;
    // Black-Scholes-ish: P(spot at T > threshold) under lognormal
    const drift = 0; // assume no drift on reference rate
    const logRatio = Math.log(threshold_rate / spot);
    const z = (logRatio - drift * T) / (sigma * Math.sqrt(T));
    // Standard normal CDF approximation (Abramowitz & Stegun)
    function phi(x: number): number {
      const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
      const sign = x < 0 ? -1 : 1; x = Math.abs(x) / Math.sqrt(2);
      const t = 1.0 / (1.0 + p * x);
      const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
      return 0.5 * (1 + sign * y);
    }
    const probAbove = 1 - phi(z);
    const impliedProb = direction === "above" ? probAbove : 1 - probAbove;
    const edge = impliedProb - market_yes_price;
    // Kelly fraction = (b*p - q) / b, where odds b = (1-yes)/yes for yes bet
    const b = (1 - market_yes_price) / market_yes_price;
    const kelly = (b * impliedProb - (1 - impliedProb)) / b;
    return { content: [{ type: "text", text: JSON.stringify({
      pair: `${base.toUpperCase()}/${quote.toUpperCase()}`,
      spot, threshold_rate, direction, days_to_resolution, vol_used: sigma,
      implied_probability_from_sera: impliedProb,
      market_yes_price, edge_pct: edge,
      kelly_fraction: Math.max(0, kelly),
      recommendation: edge > 0.05 ? "buy YES (positive edge, size by Kelly)"
                    : edge < -0.05 ? "sell YES / buy NO"
                    : "no clear edge — pass",
      caveat: "Lognormal model on Sera reference rate. Market may price in info Sera reference doesn't reflect (events, news). Treat as a prior, not a certainty.",
    }, null, 2)}]};
  },
);

// 6. fx_carry_thinker — given two pairs, compute approx carry trade signal
server.tool(
  "fx_carry_thinker",
  "Given two fiat currencies + an annualized funding/yield difference, compute the carry " +
    "trade signal: expected daily P&L per unit notional, breakeven move that wipes carry, " +
    "Sharpe-like ratio if vol is supplied. Read-only.",
  {
    long_fiat: z.string().describe("Currency you'd be LONG (high-yield)"),
    short_fiat: z.string().describe("Currency you'd be SHORT (low-yield)"),
    yield_spread_pct: z.number().describe("(long_yield - short_yield) annualized in pct, e.g. 4.0"),
    annualized_vol_estimate: z.number().positive().optional(),
  },
  async ({ long_fiat, short_fiat, yield_spread_pct, annualized_vol_estimate }) => {
    const spot = await fxRate(long_fiat, short_fiat);
    if (!spot) return { content: [{ type: "text", text: JSON.stringify({ error: `no Sera spot for ${long_fiat}/${short_fiat}` })}]};
    const dailyCarry = (yield_spread_pct / 100) / 365;
    const breakevenAdverseMove = dailyCarry; // FX move that exactly offsets one day of carry
    const sharpe = annualized_vol_estimate
      ? (yield_spread_pct / 100) / annualized_vol_estimate
      : null;
    return { content: [{ type: "text", text: JSON.stringify({
      pair: `LONG ${long_fiat.toUpperCase()} / SHORT ${short_fiat.toUpperCase()}`,
      spot,
      yield_spread_annualized_pct: yield_spread_pct,
      daily_carry_per_unit: dailyCarry,
      breakeven_daily_adverse_move_pct: breakevenAdverseMove * 100,
      annualized_vol_estimate: annualized_vol_estimate ?? null,
      pseudo_sharpe: sharpe,
      verdict: yield_spread_pct > 2 && (sharpe == null || sharpe > 0.5)
        ? "carry signal positive — size with vol awareness"
        : "carry weak relative to FX risk; consider hedge or pass",
      caveat: "Yield_spread is YOUR input — typically rates differential or DeFi yield differential between stablecoins of each currency. Sera doesn't publish this.",
    }, null, 2)}]};
  },
);

// 7. fx_corridor_compare — rank N corridors by execution cost at a target size
server.tool(
  "fx_corridor_compare",
  "Rank N candidate corridors by executable cost at a given size. For each pair, probes " +
    "Sera for the executable rate and compares against the reference. Returns ranked list " +
    "with deviation_bps. Useful for choosing which currency to swap into. Read-only.",
  {
    pairs: z.array(z.object({ from: z.string(), to: z.string() })).min(1),
    notional: z.number().positive(),
  },
  async ({ pairs, notional }) => {
    const ranked = await Promise.all(pairs.map(async (p) => {
      const fromT = await resolveToken(p.from);
      const toT = await resolveToken(p.to);
      if (!fromT || !toT) return { pair: `${p.from}/${p.to}`, error: "unknown_token" };
      const exec = await probeQuote(fromT, toT, notional);
      if (!exec.ok) return { pair: `${fromT.symbol}/${toT.symbol}`, error: exec.reason };
      const ref = await fxRate(fromT.fiat_currency ?? "USD", toT.fiat_currency ?? "USD");
      const devBps = ref ? Math.round(((exec.rate - ref) / ref) * 10_000) : null;
      return { pair: `${fromT.symbol}/${toT.symbol}`, executable_rate: exec.rate, output: exec.output, reference_rate: ref, deviation_bps: devBps };
    }));
    const ok = ranked.filter((r: any) => !r.error) as Array<any>;
    ok.sort((a, b) => (a.deviation_bps ?? -Infinity) - (b.deviation_bps ?? -Infinity));
    return { content: [{ type: "text", text: JSON.stringify({
      notional, total_pairs: pairs.length, ok_count: ok.length,
      best_corridor: ok[0]?.pair ?? null,
      ranked: [...ok, ...ranked.filter((r: any) => r.error)],
      note: "Sorted by deviation_bps ascending (most below reference = best for the buy side). Execute via sera-mcp.",
    }, null, 2)}]};
  },
);

// ── Boot ──────────────────────────────────────────────────────────────────
const transport = new StdioServerTransport();
server.connect(transport).catch((e) => {
  process.stderr.write(`sera-fx-tools fatal: ${e?.message ?? e}\n`);
  process.exit(1);
});
process.stderr.write(`sera-fx-tools v1.0.0 (thinking-only) ready (${BASE_URL})\n`);
