# PACK 6 — DeFi &amp; On-Chain FX Infrastructure

**Purpose:** The agent should understand every relevant DeFi primitive and protocol deeply enough to explain how Sera fits into the broader on-chain landscape, why its architecture is superior for FX, and how integration with other protocols works.

**Classification:** Public domain knowledge. No Sera proprietary information.

***

## Section 6.1 — AMM Deep Dive

### Constant Product Formula (x × y = k)

The foundational AMM model, pioneered by Uniswap V1/V2, uses the **constant product invariant**:[^1]

\[
x \times y = k
\]

Where \(x\) = quantity of Token A, \(y\) = quantity of Token B, and \(k\) = constant product (invariant).

**How it works:** When a trader buys Token A, they add Token B to the pool. The AMM adjusts quantities so the product remains constant. This mathematically guarantees infinite liquidity (trades can always execute) but at increasingly worse prices for large trades (price impact/slippage).

**Key properties:**
- Liquidity spread across the entire price range from 0 to infinity
- Extremely capital-inefficient — most liquidity sits in price ranges that never see trading activity
- Simple and elegant — one formula governs everything
- Price is determined by the ratio of reserves: \(P = y/x\)

### Concentrated Liquidity (Uniswap V3/V4)

Uniswap V3 (launched 2021) introduced **concentrated liquidity**, allowing LPs to allocate capital to specific price ranges ("ticks") rather than the entire curve.[^2][^3]

**How it works:** Instead of depositing liquidity from price 0 to ∞, an LP in a DAI/USDC pool can concentrate all capital between $0.99 and $1.01 — where virtually all trading occurs. This means their capital is used far more efficiently.[^4]

**Capital efficiency gains:** Up to **4,000x** more capital-efficient than V2 for tight ranges. An LP providing liquidity in a ±0.5% range earns the same fees as a V2 LP with 4,000x more capital deployed.[^4]

**The trade-off:** Concentrated positions require **active management**. When the price moves outside an LP's range, they stop earning fees entirely and their position converts 100% into the less-valued token — amplifying impermanent loss. This turns passive LP-ing into active market making.[^2]

**Uniswap V4 innovations (launched 2025):**
- **Hooks:** Modular smart-contract callbacks that trigger before/after swaps and liquidity updates — enabling on-chain limit orders, dynamic fees, MEV protection, and oracle integration natively in the AMM[^5]
- **Singleton architecture:** All pools live under a single `PoolManager` contract, reducing gas costs for pool creation and enabling multi-hop swaps without extra token transfers[^5]
- **Flash accounting:** Uses transient storage to batch balance updates within a single transaction[^5]
- **Dynamic fee control:** Fees can adjust based on volatility or market conditions

### Curve's StableSwap Invariant

Curve Finance designed the **StableSwap invariant** specifically for swapping assets that should trade near parity (stablecoin-to-stablecoin, wBTC/renBTC, stETH/ETH).[^6][^7]

The StableSwap formula combines the **constant sum** (linear) and **constant product** invariants:

\[
An^n \sum x_i + D = DAn^n + \frac{D^{n+1}}{n^n \prod x_i}
\]

Where \(A\) = amplification coefficient, \(n\) = number of tokens, \(x_i\) = balance of the \(i\)-th token, and \(D\) = invariant value at equilibrium.[^8][^6]

**Key behavior:**
- When pool is balanced (all tokens near equal value): behaves like a constant sum \(x + y = k\) — nearly zero slippage
- When pool is imbalanced: transitions toward constant product \(x \times y = k\) — higher slippage acts as a natural deterrent against further imbalancing
- The amplification coefficient \(A\) controls how "flat" the curve is near equilibrium — higher \(A\) = flatter curve = lower slippage for balanced pools[^9]

**Why Curve works for stablecoins but NOT for FX:** Curve is optimized for assets that *should* trade at 1:1. FX pairs like EUR/USD trade at ~1.08, and the rate moves continuously. Curve's invariant would cause massive impermanent loss when the exchange rate drifts, because the amplification coefficient assumes price convergence that doesn't exist in FX.[^7]

### Impermanent Loss — The Math

Impermanent loss (IL) is the difference between the value of tokens held in an AMM pool versus simply holding them in a wallet. The formula:[^10][^1]

\[
IL = \frac{2\sqrt{r}}{1 + r} - 1
\]

Where \(r\) = price ratio (new price / original price).

**Example IL values:**

| Price Change | Impermanent Loss |
|---|---|
| ±25% | -0.6% |
| ±50% | -2.0% |
| ±100% (2x) | -5.7% |
| ±200% (3x) | -13.4% |
| ±400% (5x) | -25.5% |

**Why IL is especially devastating for FX pairs:** FX pairs exhibit continuous, directional price movement. EUR/USD might move 10-15% over a year. For a constant product AMM, this sustained directional move means LPs are continuously accumulating impermanent loss with no mean-reversion to recover it. Unlike crypto pairs where volatile bounces can offset IL through fee generation, FX movements are often slow and persistent — the worst-case scenario for AMM LP economics.

### LP Profitability Analysis

Research on Uniswap V3 shows that, on average, **LPs have traded at a significant loss**. A comprehensive study found that the majority of LPs would have been better off simply holding their tokens. The key variables determining LP profitability are:[^11][^12]
- **Pool type:** Stablecoin/stablecoin pairs are most profitable for LPs; volatile pairs are worst
- **Position duration:** Shorter positions reduce IL exposure
- **Range size:** Tighter ranges earn more fees but face higher IL risk
- **Position size:** Larger positions earn proportionally but don't reduce IL

***

## Section 6.2 — Order Book DEXs

### How On-Chain Order Books Work

On-chain order book DEXs replicate the traditional exchange model — matching buy and sell limit orders — but execute on a blockchain. Unlike AMMs where prices are set algorithmically, order book DEXs enable **true price discovery** through competitive quoting.

### Hyperliquid — The Dominant On-Chain Order Book

Hyperliquid has emerged as the dominant decentralized perpetual futures exchange, purpose-built as a Layer 1 blockchain optimized for trading:[^13][^14]

**2025 performance:**[^13]
- **$2.95 trillion** in total trading volume
- **$844 million** in revenue — more than the entire Ethereum blockchain
- **70-80%** market share in decentralized perpetual futures
- **609,000** new users onboarded
- **$3.8 billion** in net inflows
- ~20,000 TPS, sub-second finality[^15]

**Architecture:** Hyperliquid runs its own Layer 1 (HyperBFT consensus, derived from HotStuff) with a fully on-chain order book. Zero gas fees for trading — this eliminates the friction that prevents high-frequency strategies from working on Ethereum or Solana. Market makers can quote tight spreads and cancel thousands of orders without cost.[^13]

### dYdX v4

dYdX v4 migrated from Ethereum/StarkWare to a sovereign **Cosmos appchain** with its own validator set:[^16]
- Monthly volume: **$8.2 billion** (October 2025)[^16]
- Off-chain order matching + on-chain settlement
- 60 validators; ~2,000 TPS initially
- Fully decentralized governance and fee distribution

### Hybrid Models: Off-Chain Matching + On-Chain Settlement

Many DEXs use a hybrid architecture where order matching happens off-chain (for speed) but settlement occurs on-chain (for security and finality):

- **Off-chain:** Order submission, matching, and cancellation happen on a centralized or semi-decentralized matching engine
- **On-chain:** Only matched trades settle via smart contracts
- **Examples:** 0x Protocol (relayer model), Sera's architecture, and various RFQ systems

This hybrid approach combines the speed and capital efficiency of centralized exchange matching with the settlement guarantees and transparency of blockchain execution.

### EIP-712 Signed Orders

**EIP-712** defines a standard for signing structured, typed data on Ethereum. It's the foundation for most off-chain order systems in DeFi:[^17][^18]

- Users sign a structured message describing their order (token pair, amount, price, expiry) using their wallet's private key
- The signature is verified on-chain when the order is filled
- No on-chain transaction is required to *place* an order — only to *fill* it
- This enables gasless order placement and cancellation[^19]

**Use cases:** CoW Protocol, UniswapX, 0x/Matcha, Permit2 (gasless token approvals), and any DEX with off-chain order books.[^20]

### The Gas Problem for On-Chain Order Books

Traditional order books require many transactions: placing orders, canceling orders, modifying orders — each costs gas on Ethereum. At $5-50+ per transaction, this makes pure on-chain order books on Ethereum L1 uneconomical. Solutions:
- **L2 rollups:** Arbitrum, Optimism, Base — gas costs below $0.001[^21]
- **App-specific chains:** Hyperliquid, dYdX v4 — zero or near-zero gas
- **Hybrid models:** Only settle matched trades on-chain

***

## Section 6.3 — Intent-Based &amp; Solver Architectures

### What "Intents" Mean in DeFi

An **intent** is a signed message expressing a desired outcome ("I want to swap 1000 USDC for ETH at the best available price") without specifying *how* to achieve it. Specialized participants called **solvers** (or fillers/resolvers) compete to find the optimal execution path.[^22][^23]

**Traditional DEX:** User selects route → approves tokens → submits transaction → pays gas → hopes to avoid MEV

**Intent-based DEX:** User signs intent → solver network receives it → solvers compete in auction → winning solver executes, pays gas, handles routing → user receives best price with MEV protection[^23]

### UniswapX

UniswapX is Uniswap's intent layer, launched to complement Uniswap V3/V4:[^24]

**How it works:**
1. User creates an **Exclusive Dutch Order** specifying max/min acceptable outputs over a time window
2. The order starts at a price *better* than market and gradually decays (Dutch auction)
3. Professional **fillers** (solvers) compete to fill the order — the first to find it profitable executes
4. The filler sources liquidity from any combination: Uniswap pools, other DEXs, off-chain liquidity, private inventory

**Key advantages:**
- **Gasless swaps:** Users sign off-chain; fillers pay gas
- **MEV protection:** Orders are filled privately; no public mempool exposure
- **Cross-chain:** Integration with Across Protocol enables bridgeless cross-chain swaps[^23]
- **Better pricing:** Fillers access liquidity sources beyond on-chain AMMs

### CoW Protocol

CoW (Coincidence of Wants) Protocol pioneered **batch auctions** for intent settlement:[^25][^22]

**How it works:**
1. Users sign off-chain intents (EIP-712 signed orders)[^20]
2. Multiple intents are batched together for a set time period
3. Solvers compete to find the optimal settlement for the entire batch
4. All trades within a batch execute at **uniform clearing prices**

**Coincidence of Wants matching:** If User A wants to swap USDC→ETH and User B wants to swap ETH→USDC, they can be matched directly — bypassing AMM fees entirely.[^22][^25]

**Scale:** CoW Protocol hit **$10 billion+** in monthly volumes in 2025.[^23]

### 1inch Fusion / Fusion+

1inch extends its DEX aggregator model to intent-based execution:[^23]
- **Resolvers** (1inch's term for solvers) compete to fill orders
- **Fusion+** adds cross-chain support across 13+ networks
- Bridgeless swaps — the resolver handles cross-chain complexity entirely

### The Solver Landscape

The solver/filler ecosystem has become a competitive market in its own right:[^23]

| Protocol | Solver Term | Auction Type | Monthly Volume |
|---|---|---|---|
| UniswapX | Fillers | Dutch auction | Billions |
| CoW Protocol | Solvers | Batch auction | $10B+ |
| 1inch Fusion | Resolvers | Dutch auction | Billions |
| Across Protocol | Relayers | Intent-based bridge | Growing |

**Why this matters for FX protocols:** Sera (or any on-chain FX platform) can integrate as a solver/filler for these protocols — serving as a liquidity source for FX-related intents. When a user on UniswapX or CoW Protocol wants to swap USDC→EURC, a Sera-connected solver could fill that order using Sera's FX liquidity, providing permissionless entry points into the intent-based ecosystem.

***

## Section 6.4 — Oracle Systems

### Chainlink Price Feeds

Chainlink is the dominant oracle network, securing hundreds of billions in DeFi value:[^26][^27]

**How Chainlink works:**
1. A network of independent node operators sources data from multiple premium data providers
2. Nodes aggregate their individual observations
3. An on-chain smart contract stores the aggregated result as a reference price
4. DeFi protocols read this price for their operations

**Key characteristics:**
- **Push-based:** Prices update on-chain at set intervals (heartbeat) or when price deviates by a threshold (e.g., 0.5% for ETH/USD)
- **Update frequency:** Ranges from every heartbeat (e.g., 1 hour) to deviation-triggered updates
- **Deviation thresholds:** Typically 0.5–1% for major assets
- **FX feeds available:** EUR/USD, GBP/USD, JPY/USD, and many others

### Pyth Network

Pyth is a pull-based oracle designed for high-frequency, low-latency price data:[^28][^29]

**How Pyth differs:**
- **Pull-based:** Prices are published off-chain and only written on-chain when a user (or protocol) requests an update — reducing gas costs
- **Update frequency:** Up to **1 millisecond** — orders of magnitude faster than Chainlink[^28]
- **Data sources:** First-party data from exchanges, trading firms, and market makers (not scraped from APIs)
- **Accuracy:** Over 95% accuracy vs. National Best Bid and Offer (NBBO)[^28]
- **Coverage:** Crypto, equities, FX, commodities — all global symbols
- **Market share:** Pyth secures **48%** of all oracle-powered DEX trading volume[^30]

### Oracle-Based Pricing vs. AMM-Based Pricing for FX

| Approach | How Price Is Determined | Pros | Cons |
|---|---|---|---|
| **AMM-based** | Algorithmically from pool reserves (x × y = k) | Permissionless, always available | Impermanent loss, poor for FX, price follows rather than leads |
| **Oracle-based** | External reference price from real FX markets | Accurate, reflects real-world rates | Oracle manipulation risk, update latency, centralization |
| **Hybrid (CLOB + Oracle reference)** | Order book with oracle as guardrail | Best price discovery + safety | More complex architecture |

For FX specifically, oracle-based pricing is superior because FX rates are set in the $9.6 trillion/day interbank market — on-chain AMMs with millions in TVL cannot meaningfully discover FX prices. The oracle brings the real-world rate on-chain; the execution mechanism provides liquidity around that rate.

### Oracle Manipulation Risk

Oracle manipulation is one of the most common DeFi attack vectors:
- **Price feed manipulation:** Attacking low-liquidity reference markets to move the oracle price
- **Flash loan attacks:** Using flash loans to temporarily manipulate on-chain prices that oracles reference
- **Stale price exploitation:** Trading against outdated oracle prices during volatile periods

**Mitigations:** Multi-source aggregation, TWAP (time-weighted average price) smoothing, circuit breakers, deviation bounds, and combining push-based (Chainlink) with pull-based (Pyth) oracles for redundancy.

***

## Section 6.5 — DeFi Composability

### Smart Contract Composability — DeFi's Superpower

Composability means any smart contract can call any other smart contract in a single atomic transaction. This enables complex multi-step operations that would be impossible in traditional finance:

- Borrow from Aave → Swap on Uniswap → Deposit in Curve → Stake in Convex — all in one transaction
- If any step fails, the entire transaction reverts — no partial execution risk

This is the fundamental architectural advantage of DeFi over traditional finance, where each operation involves separate counterparties, separate settlement, and separate risk.

### Flash Loans and Their Implications

Flash loans are uncollateralized loans that must be borrowed and repaid within a **single transaction**:[^31][^32][^33]

**How they work:**
1. Borrow millions in assets from a lending pool (Aave, Balancer)
2. Use the borrowed assets for any operation (arbitrage, liquidation, collateral swap)
3. Repay the full amount plus a small fee (typically 0.09%)
4. If repayment fails, the entire transaction reverts — the loan never happened

**Key use cases:**[^32][^31]
- **Arbitrage:** Exploit price differences across DEXs with unlimited capital
- **Self-liquidation:** Repay DeFi debt, withdraw collateral, and redeposit in one transaction
- **Collateral swaps:** Switch collateral types on lending platforms without closing positions
- **Liquidations:** Front-run liquidation opportunities in lending protocols

**Implications for settlement:** Flash loans demonstrate that atomic, same-block settlement of complex multi-step operations is technically feasible on blockchain — a property that traditional FX settlement (T+2, multiple intermediaries) fundamentally lacks.

### Cross-Protocol Routing and Aggregation

DEX aggregators (1inch, Paraswap, CowSwap) split orders across multiple liquidity sources to find optimal execution. A single swap might route through Uniswap V3, Curve, Balancer, and private market makers simultaneously.

### Yield Strategies Built on Settlement Infrastructure

Once settlement infrastructure exists on-chain, yield products emerge naturally:
- **Liquidity provision:** Earn fees by providing liquidity to FX pools
- **Lending:** Deposit stablecoins in lending protocols and earn interest
- **Staking:** Lock tokens to earn protocol rewards
- **Structured products:** Automated strategies that combine multiple DeFi operations

***

## Section 6.6 — MEV, Front-Running &amp; Security

### What MEV Is

**Maximal Extractable Value (MEV)** is the profit that can be captured by reordering, inserting, or censoring transactions in a block. MEV is not a bug — it's a structural feature of transparent, permissionless blockchains where transaction ordering is visible.[^34][^35]

**The MEV supply chain:**[^35]
1. **Searchers:** Bots that scan the mempool for profitable opportunities and create transaction bundles
2. **Builders:** Aggregate bundles and user transactions to construct the most profitable block
3. **Validators (Proposers):** Choose which block to propose, often selecting the most profitable one

### Sandwich Attacks — Mechanics and Scale

The most harmful MEV strategy for DEX users:[^36][^34]

1. **Front-run:** Bot sees a pending large swap in the mempool; places a buy order *before* the victim's trade, driving the price up
2. **Victim trade executes:** At a worse price due to the front-run
3. **Back-run:** Bot immediately sells after the victim's trade, capturing the price difference

**Impact:** Can cause **5–15% slippage** on large trades. Cross-chain sandwich attacks have been identified extracting approximately **$5.27 million** in profit over a two-month period — 1.28% of total bridged volume.[^34][^36]

### Front-Running and Back-Running

- **Front-running:** Executing a transaction before a known profitable transaction to profit from the expected price impact
- **Back-running:** Executing immediately after a profitable event (arbitrage opportunities, liquidations, oracle updates)
- **Displacement:** Replacing a victim's transaction entirely

### Private Mempools and Order Flow Auctions

**Flashbots Protect:** Submits transactions to a private mempool, bypassing the public mempool where MEV bots operate. Users receive 90% of back-run profits. Over **80%** of Ethereum transactions now use private RPCs.[^34]

**MEV Blocker:** Uses AI-generated fake transactions mixed with real ones to confuse searchers. Provides gas rebates and shares 90% of MEV profits with users.[^34]

**Order Flow Auctions:** Exclusive rights to fill orders for a time window (UniswapX's exclusive filler period) before opening to competition.

### How CLOB Architecture Reduces MEV vs. AMMs

Central Limit Order Books inherently reduce MEV compared to AMMs because:
- **Price certainty:** Limit orders execute at a specified price — no slippage to exploit
- **No public mempool:** Off-chain order matching means orders aren't visible to MEV bots before execution
- **Maker-taker dynamics:** Market makers provide liquidity at specific prices; MEV bots can't front-run deterministic quotes
- **Settlement atomicity:** Matched trades settle at the agreed price — no room for sandwich attacks between matching and execution

This is why Hyperliquid (CLOB) has captured professional trading flow that AMM-based DEXs could not: traders need execution certainty, not algorithmic price curves that expose them to MEV.

### Smart Contract Security

**Common vulnerabilities:**
- **Reentrancy:** An external contract callback re-enters the calling contract before state updates complete (the classic DAO hack pattern)
- **Oracle manipulation:** Exploiting stale or manipulable price feeds
- **Flash loan attacks:** Using instant uncollateralized capital to exploit protocol logic
- **Access control failures:** Missing or incorrect permission checks
- **Integer overflow/underflow:** Arithmetic errors in token calculations

**Best practices:**
- Professional audits from firms like Trail of Bits, OpenZeppelin, Consensys Diligence
- Formal verification for critical math (AMM invariants, settlement logic)
- Bug bounty programs (Immunefi)
- Timelocks on governance actions
- Circuit breakers for extreme market conditions

***

## Agent Instruction Footer

### Guardrails for Agent Behavior

When using this knowledge base, the agent MUST:

1. **Never present information as Sera-proprietary.** Everything in this pack is public domain knowledge.

2. **Be precise about AMM failure modes for FX.** The constant product formula (x × y = k) causes impermanent loss proportional to price divergence. Curve's StableSwap is better for same-peg assets but fails for FX because it assumes price convergence. Neither model is suitable for real FX trading.

3. **Distinguish price discovery from price execution.** AMMs execute at algorithmically determined prices — they don't discover prices. FX prices are discovered in the $9.6T/day interbank market. On-chain FX needs oracle-referenced pricing for accuracy, with execution infrastructure (order books, solvers) providing liquidity around the reference rate.

4. **Understand the intent/solver paradigm.** This is the fastest-growing architecture in DeFi. CoW Protocol hit $10B+/month. UniswapX is Uniswap's future. Any on-chain FX protocol should be able to serve as a solver/filler in this ecosystem.

5. **Don't oversimplify MEV.** MEV is structural, not a bug. Private mempools (Flashbots Protect, MEV Blocker) mitigate but don't eliminate it. CLOB architectures inherently reduce MEV exposure vs. AMMs, which is a genuine advantage.

6. **Acknowledge Hyperliquid's dominance.** $2.95T in volume, $844M revenue, 70-80% perp DEX market share. This validates the on-chain order book model for professional trading. The key question is whether this model can extend to spot FX.

7. **Flash loans demonstrate atomic settlement.** Don't present flash loans as attacks — they're a feature. They prove that complex, multi-step, same-block settlement is possible on blockchain, which is directly relevant to the FX settlement thesis.

### Suggested Agent Behaviors

- When asked "why don't AMMs work for FX?" → Explain impermanent loss math, Curve's peg assumption, lack of price discovery, and MEV vulnerability
- When asked about order books vs. AMMs → Cite Hyperliquid's success as validation; explain the CLOB advantage for professional flow
- When asked about intents/solvers → Explain the paradigm shift from "user specifies execution" to "user specifies outcome, solvers compete" — and note that FX protocols can integrate as solvers
- When asked about oracles → Distinguish push (Chainlink) vs. pull (Pyth); explain why oracle-referenced pricing is essential for FX
- When asked about MEV → Walk through sandwich attack mechanics; explain how CLOB + off-chain matching + private order flow mitigate MEV

***

*Pack 6 Complete. Ready for OpenClaw ingestion.*
*Next: Pack 5 — FX Quant &amp; Trading Strategies (final pack of Phase 3)*

---

## References

1. [Impermanent Loss Explained: The Math Behind DeFi's Hidden Risk](https://speedrunethereum.com/guides/impermanent-loss-math-explained) - Learn everything about impermanent loss in DeFi. Understand the formula, see real-world examples, an...

2. [Uniswap V3: Concentrated Liquidity & Capital Efficiency - Cyfrin](https://www.cyfrin.io/blog/uniswap-v3-concentrated-liquidity-capital-efficiency) - Learn how Uniswap V3 empowers liquidity providers to deploy capital efficiently, benefits traders wi...

3. [Concentrated Liquidity](https://docs.uniswap.org/concepts/protocol/concentrated-liquidity) - With v3, liquidity providers may concentrate their capital to smaller price intervals than (0, ∞). I...

4. [Uniswap v3: Concentrated Liquidity, JIT Attacks, and Integration Guide](https://www.zealynx.io/blogs/uniswap-v3) - This allows for up to 4000x greater capital efficiency compared to v2, meaning LPs can earn the same...

5. [Ultimate Uniswap V4 Liquidity Provision Guide](https://liquidityguide.com/docs/protocols/uniswap/) - Uniswap V4 refines decentralized trading with next-gen concentrated liquidity and deep customization...

6. [Understanding the Curve AMM, Part -1: StableSwap Invariant](https://atulagarwal.dev/posts/curveamm/stableswap/) - Curve StableSwap Invariant

7. [Curve Stableswap Exchange: Overview](https://docs.curve.finance/stableswap-exchange/overview/)

8. [Deep dive into Curve Finance: Core Mechanics, Security, and ...](https://www.zealynx.io/blogs/curve-finance-core-mechanics) - Explore Curve Finance’s protocol mechanics in depth—covering StableSwap, CryptoSwap, crvUSD, LLAMMA,...

9. [Curve StableSwap: A Comprehensive Mathematical Guide - Xord](https://xord.com/research/curve-stableswap-a-comprehensive-mathematical-guide/) - Curve StableSwap is an automated market maker that enables the users to swap between same flavoured ...

10. [Understanding Liquidity Pools and Impermanent Loss](https://www.aarna.ai/blogs/the-math-behind-amms-understanding-liquidity-pools-and-impermanent-loss) - This blog dives into the math behind AMMs, liquidity pools, and IL, helping you understand the risks...

11. [Decentralised Finance and Automated Market Making: Predictable Loss and
  Optimal Liquidity Provision](https://arxiv.org/pdf/2309.08431.pdf) - Constant product markets with concentrated liquidity (CL) are the most
popular type of automated mar...

12. [Automated Market Makers: Toward More Profitable Liquidity Provisioning
  Strategies](https://arxiv.org/pdf/2501.07828.pdf) - ...measurement model based on impermanent loss to analyze the influences of key
parameters (i.e., li...

13. [Hyperliquid's $844M Revenue Machine: How a Single DEX ...](https://blockeden.xyz/blog/2026/01/10/hyperliquid-revenue-dominance-onchain-trading-solana/) - By late 2025, competitors Lighter and Aster briefly surpassed Hyperliquid in perpetual trading volum...

14. [Hyperliquid vs. dYdX, Aevo, GMX: Into the Future of Derivatives](https://nftevening.com/hyperliquid-dydx-aevo-gmx/) - This article offers a comprehensive comparison between Hyperliquid and its top competitors—dYdX, Aev...

15. [Exploring Hyperliquid: Innovation in the Perp DEX ...](https://research.nansen.ai/articles/exploring-hyperliquid-innovation-in-the-perp-dex-landscape) - Exploring Hyperliquid: Innovation in the Perp DEX Landscape

16. [Dydx V4 Api](https://blockeden.xyz/forum/t/perpetual-dex-evolution-la-tech-week-2025-gmx-dydx-v4-and-the-race-to-100b/125) - At LA Tech Week 2025, the “DeFi Derivatives” panel revealed something surprising: Perpetual DEXs are...

17. [Build smarter off-chain flows with EIP-712 typed data signing - Turnkey](https://www.turnkey.com/blog/smarter-off-chain-flows-eip-712) - From gasless token approvals to off-chain order books, EIP-712 powers some of the most important wor...

18. [SignTypedData EIP-712 Secure Off-Chain Signatures for ...](https://andreyobruchkov1996.substack.com/p/evm-message-signtypeddata-eip-712) - I’m currently open to collaborations and development projects across blockchain, smart contracts, an...

19. [EIP-712 Typed Data Signing with Para - Para Docs](https://docs.getpara.com/v2/walkthroughs/eip712-typed-data-signing) - Learn how to sign structured, typed data using EIP-712 standard with Para's Ethers integration

20. [Signature Schemes | CoW Protocol](https://v1.docs.cow.fi/smart-contracts/settlement-contract/signature-schemes)

21. [Top Derivatives DEXs in 2025: How Hyperliquid, dYdX, and Orderly ...](https://lazy-ants.com/en/article/derivatives-dexs-in-2025) - Platforms like Hyperliquid and Orderly Network (WOOFi Pro) drove $1.5 trillion in 2024 volume, captu...

22. [Intents | CoW Protocol Documentation](https://docs.cow.fi/cow-protocol/concepts/introduction/intents) - Rather than placing orders by signing a raw transaction**_ that executes directly on-chain (i.e. as ...

23. [UniswapX, CoW Protocol, and 1inch Fusion Now Handle ...](https://blockeden.xyz/forum/t/uniswapx-cow-protocol-and-1inch-fusion-now-handle-billions-in-monthly-volume-through-solver-auctions-the-intent-architecture-explained-for-builders/462) - The shift from transaction-based to intent-based DeFi is the most significant architectural change s...

24. [What is UniswapX? Complete Guide to Intent-Based Trading ... - Eco](https://eco.com/support/en/articles/11852773-what-is-uniswapx-complete-guide-to-intent-based-trading-and-gasless-swaps) - Discover UniswapX, the intent-based protocol offering gasless swaps, MEV protection, and cross-chain...

25. [CoW DAO and CoW Protocol: How Intent-Based Trading and MEV ...](https://metalamp.io/magazine/article/cow-dao-and-cow-protocol-how-intent-based-trading-and-mev-protection-transform-defi) - The CoW protocol is a trading protocol that uses an intent-based model, solvers, and auctions to fin...

26. [Chainlink (LINK) Price Predictions 2024, 2025, 2030, 2040, 2050 / Axi](https://www.axi.com/int/blog/education/cryptocurrencies/chainlink-link-price-predictions) - Learn everything you need to know about Chainlink (LINK) price predictions and forecasts for 2024, 2...

27. [Decentralized Data Feeds | Chainlink](https://data.chain.link) - Access the most versatile list of decentralized pricing networks to build your smart contracts, powe...

28. [The Price of Everything | Pyth Network](https://www.pyth.network/price-feeds) - Get secure, real-time price feeds from real markets—crypto, equities, FX, and more—delivered directl...

29. [The Price Layer for Global Finance | Pyth Network](https://www.pyth.network) - The financial system is fragmented. Pyth is uniting markets—giving every builder, trader, and innova...

30. [Why These Dapps Are Using Pyth Oracle Price Feeds](https://cryptodaily.co.uk/2024/02/why-these-dapps-are-using-pyth-oracle-price-feeds) - Pyth Network has taken the blockchain world by storm, rapidly emerging as the go-to platform for all...

31. [How DeFi flash loans work | Exponential DeFi](https://exponential.fi/blog/how-defi-flash-loans-work) - Learn what flash loans are in DeFi.

32. [What Are DeFi Flash Loans: DeFi Lending Explained - Changelly](https://changelly.com/blog/defi-flash-loans/) - Flash loans are made possible by the composability of DeFi protocols—the ability to chain multiple o...

33. [What is a flash loan? | The Radix Blog](https://www.radixdlt.com/blog/what-is-a-flash-loan) - Atomic composability is therefore necessary for flash loans to work as everything has to either sett...

34. [Front-running Protection: Complete MEV Defense Guide for DeFi ...](https://coincryptorank.com/blog/frontrunning-protection) - Master front-running protection techniques: private mempools, Flashbots Protect, MEV Blocker, commit...

35. [Front-Running & MEV Mitigation: A DEX Developer's Guide](https://speedrunethereum.com/guides/front-running-mev-mitigation) - Learn to mitigate front-running and MEV attacks on your DEX. This guide covers key strategies, Solid...

36. [Unveiling Cross-Chain Sandwich Attacks in DeFi](https://arxiv.org/html/2511.15245v1)

