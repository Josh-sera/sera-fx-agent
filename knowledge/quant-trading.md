
# PACK 5 — FX Trading \& Quant Strategies

**Purpose:** The agent should understand FX trading at a quantitative level — how bots work, how market making functions mechanically, how arbitrage strategies operate, and how to think about profitability and risk. This makes the agent credible with traders and market makers.[^1]

**Classification:** Public domain knowledge. No Sera proprietary information.

***

## Section 5.1 — Market Making Fundamentals

### What a Market Maker Actually Does

A **market maker** continuously quotes both bid and ask prices, standing ready to buy (at the bid) and sell (at the ask) a given currency pair. The goal is to earn the **bid–ask spread** while managing **inventory risk** (exposure to directional price moves).[^2][^3][^4]

- **Bid price:** Price at which the market maker buys the base currency.
- **Ask (offer) price:** Price at which the market maker sells the base currency.
- **Spread:** Ask − Bid; gross revenue per round-trip trade before costs and inventory risk.

In spot FX, top-tier G10 pairs (EUR/USD, USD/JPY, GBP/USD) often trade with 0.1–1.0 pip spreads for institutional flow, while illiquid EM pairs can have 10–50+ pip spreads.[^3][^5]

### Market Maker P\&L Decomposition

A market maker’s P\&L has three main components:[^4]

1. **Spread P\&L:** Profit from buying at bid and selling at ask.
2. **Inventory P\&L:** Gains or losses from holding a long/short position as prices move.
3. **Adverse selection costs:** Losses when informed traders hit stale or mispriced quotes.

Simplified:

- Spread P\&L: $\text{Spread P&L} = \sum (\text{Ask} - \text{Bid}) \times \text{Trade Size}$.
- Inventory P\&L: $\text{Inventory P&L} = q \cdot (S_{t+1} - S_t)$, where $q$ is inventory and $S$ is mid-price.

The core optimization problem is choosing bid/ask levels and sizes that maximize expected spread income minus expected inventory and adverse selection losses.[^6][^7]

### Determinants of the Bid–Ask Spread

Spreads compensate for:[^8][^9]

- **Volatility:** Higher volatility → wider spreads (greater inventory risk).
- **Order flow toxicity:** More informed flow → wider spreads.
- **Inventory:** If long, tighten bids and widen asks to encourage selling; opposite for short.
- **Competition:** More competing market makers → tighter spreads.

Spreads typically widen around major macro events (NFP, CPI, central bank decisions) because short-term volatility and asymmetric information spike.[^10]

### Avellaneda–Stoikov Model (High-Level)

The Avellaneda–Stoikov framework models optimal quotes as a stochastic control problem: maximize expected utility of terminal wealth over a finite horizon while controlling inventory risk.[^11][^12]

Key assumptions:[^13][^14]

- Mid-price $S_t$ follows Brownian motion with volatility $\sigma$.
- Order arrival intensities decline exponentially as quotes move away from mid.
- The market maker has risk aversion parameter $\gamma$ governing inventory tolerance.

Two central outputs:

1. **Reservation price** (inventory-skewed fair value):

$$
r_t = S_t - q_t \gamma \sigma^2 (T - t)
$$

where $q_t$ is inventory and $T - t$ is time to horizon.[^13]
2. **Optimal total spread** (symmetric around reservation price):

$$
2\delta_t = \gamma \sigma^2 (T - t) + \frac{2}{\gamma} \ln \left(1 + \frac{\gamma}{\kappa}\right)
$$

where $\kappa$ parameterizes how quickly order arrival declines with distance from mid.[^14]

Optimal quotes:

- Bid: $b_t = r_t - \delta_t$.
- Ask: $a_t = r_t + \delta_t$.[^13]

Intuition:

- Higher volatility $\sigma$ → wider spreads and stronger inventory skew.
- Higher risk aversion $\gamma$ → more aggressive flattening of inventory.
- Shorter horizon $T - t$ → less time to offload inventory, so quotes become more aggressive to shed risk.[^12]

This model underpins many HFT and crypto market-making bots, with real desks adding transaction costs, discrete ticks, and richer limit order book dynamics.[^15][^16]

### Inventory Management and Skew

Modern market makers manage inventory across many pairs, skewing quotes to control risk:[^7][^17]

- If long EUR/USD, a desk may:
    - Lower bids and raise asks in EUR/USD to encourage net selling.
    - Skew correlated crosses (EUR/JPY, EUR/GBP) to offload EUR risk.
- When risk limits are hit, desks may hedge externally (e.g., via futures) or widen spreads dramatically.

Multi-asset extensions of Avellaneda–Stoikov introduce correlation across assets so inventory risk is managed at portfolio level, not pair-by-pair.[^18]

***

## Section 5.2 — Triangular Arbitrage

### Concept and Detection

Triangular arbitrage exploits inconsistencies among three FX rates (e.g., EUR/USD, GBP/USD, EUR/GBP). If the quoted cross rate differs from the implied rate, there is a potential riskless loop.[^19][^20]

For currencies A, B, C with pairs A/B, B/C, A/C:

- Implied A/C: $\text{Implied } A/C = (A/B) \times (B/C)$.
- If $\text{Implied } A/C \neq \text{Quoted } A/C$, an arbitrage opportunity exists.[^20]


### Worked Numerical Example

Suppose:[^21][^20]

- EUR/USD = 1.1325 (1 EUR = 1.1325 USD)
- GBP/USD = 1.4528 (1 GBP = 1.4528 USD)
- EUR/GBP = 0.7805 (1 EUR = 0.7805 GBP)

Implied EUR/GBP from the two USD legs:

$$
\text{Implied EUR/GBP} = \frac{\text{EUR/USD}}{\text{GBP/USD}} = \frac{1.1325}{1.4528} \approx 0.7796
$$

Quoted EUR/GBP is 0.7805, slightly higher than implied. A loop:

1. Start with USD → buy EUR via EUR/USD.
2. EUR → GBP via EUR/GBP.
3. GBP → USD via GBP/USD.

After accounting for spreads and fees, if USD_out > USD_in, there is a triangular arbitrage profit.[^20][^21]

### Why It’s Essentially HFT-Only in TradFi

In modern FX markets, exploitable tri-arb windows last milliseconds because:[^22][^23]

- Spreads have compressed due to competition and algos.
- HFT firms co-located with matching engines continuously monitor crosses and auto-arbitrage.
- Latency from non-co-located participants makes them too slow; by the time they act, mispricings are gone.

Empirical work on covered interest parity and cross-currency basis shows deviations persist more from regulatory and balance sheet constraints than simple misquotes; “arbitrage” is balance-sheet intensive and risky, not free money.[^24][^22]

### On-Chain Angle (High-Level)

On-chain protocols that enable **atomic multi-leg settlement** (all three legs in one transaction) can reintroduce triangular-like structures in a different universe: multi-stablecoin or tokenized FX baskets where centralized HFT isn’t yet dominant. Economics are identical; frictions are gas, on-chain slippage, and oracle precision rather than colocation and microseconds.

***

## Section 5.3 — Statistical Arbitrage in FX

### Mean Reversion and Pairs Trading

FX pairs often show mean-reverting behavior over medium horizons due to central bank anchors and macro fundamentals. Stat-arb approaches:[^25]

- Model the spread between two correlated series (e.g., EUR/USD vs GBP/USD).
- Use mean-reverting processes (e.g., Ornstein–Uhlenbeck) on the spread.
- Go long the underperformer and short the outperformer when the spread deviates beyond thresholds, betting on convergence.

Cointegration tests (Engle–Granger, Johansen) identify pairs whose linear combination is stationary, a classical basis for FX pairs trading.[^25]

### Cross-Currency Basis Trades

Covered interest parity (CIP) condition (simplified):[^26][^22]

$$
(1 + i_\text{dom}) = (1 + i_\text{for}) \cdot \frac{F}{S}
$$

Where $i_\text{dom}$ is domestic rate, $i_\text{for}$ foreign rate, $S$ spot, $F$ forward. Deviations from this equality are the **cross-currency basis**.[^22]

In theory, traders can arbitrage a non-zero basis by borrowing in one currency, lending in another, and hedging via FX swaps. In practice since 2008, regulatory and balance sheet constraints mean non-zero bases persist, and exploiting them is a leveraged risk trade, not pure arbitrage.[^23][^22]

### Carry Trades

A **carry trade** borrows in a low-yield currency (funding) and invests in a high-yield currency, collecting the interest differential.[^27][^28]

Example:

- Borrow JPY at near-zero rates.
- Purchase AUD or USD assets yielding several percent.
- Optionally hedge FX via forwards.

Returns equal interest differential plus FX move; if the high-yield currency does not depreciate enough, the trader earns positive carry.[^29]

### Yen Carry Trade Unwind Risk (2025–26 Context)

When funding costs rise (e.g., Bank of Japan hiking) or risk sentiment collapses, yen-funded carry trades can unwind violently:[^30][^31]

- Investors buy JPY to repay loans and sell risk assets.
- JPY appreciates sharply; EM FX, equities, and higher-yield currencies fall.
- Recent BoJ policy shifts and rising JGB yields have triggered warnings about renewed yen-carry unwind risk, with potential cross-asset spillovers.[^32][^30]

Historically, carry strategies show **negative skew and fat tails**: extended smooth gains punctuated by large drawdowns during unwind episodes.[^33][^29]

### Momentum Strategies in FX

Momentum strategies buy currencies that have appreciated and short those that have depreciated over horizons (3–12 months). Recent research indicates carry, momentum, and value premia remain in currencies but have evolved post-crisis and are regime-dependent.[^28][^33]

***

## Section 5.4 — Trading Bot Architecture

### Core Components

A production FX (or FX-like) bot typically has this pipeline:[^34][^35]

1. **Data ingestion:** Tick or bar data from ECNs/brokers or on-chain venues.
2. **Signal generation:** Indicators, rule-based logic, or ML models producing entry/exit signals.
3. **Risk management:** Position sizing, leverage limits, stop-loss/target logic.
4. **Execution engine:** Venue selection, order placement, smart routing.
5. **Monitoring \& logging:** PnL, risk metrics, latency, failures.

### Order Types

Key order types for FX and on-chain CLOBs:[^36][^37]

- Market: immediate execution at best price.
- Limit: execute at specified price or better.
- IOC: immediate-or-cancel partial; rest canceled.
- FOK: fill-or-kill, all-or-nothing immediately.
- Iceberg: only a portion of size visible in book.
- TWAP: time-weighted execution over an interval.
- VWAP: volume-weighted execution tracking market volume curve.


### Execution Algorithms and Transaction Costs

Execution algorithms aim to minimize **implementation shortfall** — slippage vs a benchmark price — by balancing timing risk and market impact:[^37][^38]

- **TWAP:** splits order evenly in time; simple but ignores volume patterns.
- **VWAP:** matches predicted market volume profile to look “like the tape.”[^39][^40]
- **POV:** trades as a fixed fraction of real-time market volume.
- Newer approaches use deep RL to adjust slicing dynamically vs static schedules.[^41][^42]

BIS and central bank work note that algos account for a large share of spot FX volume, especially in G10, materially shaping market microstructure.[^38][^43]

### Backtesting and Common Pitfalls

Backtest frameworks must address:[^34]

- **Overfitting:** Strategies optimized to noise.
- **Survivorship bias:** Ignoring delisted instruments/regimes.
- **Look-ahead bias:** Using information not available at trade time.
- **Understated costs:** Ignoring real spreads, commissions, and impact.

Better practice uses rolling walk-forward, out-of-sample validation, and stress tests across macro regimes.

### Common FX Bot Strategies

- **Grid trading:** Place layered buy/sell orders at fixed intervals, monetizing range-bound oscillations.[^44][^45]
- **Scalping:** Exploit small moves on high leverage; extremely sensitive to spreads and latency.
- **Trend following:** Use moving averages, breakouts, or channels to ride medium-term moves.[^34]
- **Breakout:** Enter when price exits a long-held range.
- **Mean reversion:** Fade deviations from reference levels (e.g., moving average, VWAP).[^34]

Grid bots are popular in FX and crypto, but they are vulnerable to one-way trends where they accumulate increasingly unprofitable inventory.[^46][^44]

***

## Section 5.5 — On-Chain Market Making

### How On-Chain MM Differs from TradFi

On-chain market-making adds new constraints:[^47][^48]

- **Gas costs:** Every quote update or rebalance costs gas.
- **MEV exposure:** Sandwich and front-running attacks can erode edge.[^49][^50]
- **Smart contract risk:** Bugs/exploits can wipe positions.
- **Full transparency:** Positions and orders are visible (unless using off-chain matching).

Constant-product AMMs in particular force LPs into **passive, price-agnostic quoting** along a curve and expose them to **impermanent loss**, making them unlike true FX market making.[^51][^47]

### JIT Liquidity Dynamics

On concentrated-liquidity AMMs, sophisticated actors can provide **Just-In-Time (JIT) liquidity** — injecting capital immediately before large swaps, capturing most fees, and withdrawing afterward.[^52][^51]

This behavior extracts value from passive LPs, leaving them with worse inventory and lower fee share.

### MEV and Sandwich Risk

For AMMs connected to a public mempool:

1. A large user trade appears in the mempool.
2. An MEV bot sends a buy transaction to front-run it.
3. The user’s swap executes at an inferior price.
4. The bot immediately sells back, capturing the price impact.[^50][^53]

Sandwich attacks create extra slippage for users and complicate LP P\&L. Research has quantified millions in profits from sandwich MEV, including cross-chain variants.[^53][^50]

Order-book architectures with off-chain matching or private orderflow significantly reduce these MEV vectors by avoiding deterministic AMM curves in the public mempool.[^54][^55]

### Profitability Framework for On-Chain FX MM

A simple expectation decomposition:

$$
\text{Expected P&L} = \text{Fee Income} - \text{Impermanent Loss} - \text{MEV Slippage} - \text{Gas Costs}.
$$

- Fee income: function of volume, fee rate, and liquidity share.
- IL: function of volatility and directional drift between currencies.[^56][^47]
- MEV slippage: value extracted by adversarial flow.
- Gas: depends on rebalancing frequency and chain conditions.

For FX stablecoin pairs where the real-world rate drifts (e.g., USDC/EURC), constant-product AMMs are structurally misaligned; oracle-referenced order books or specialized FX AMM designs align better with how FX actually trades.[^57][^58]

***

## Section 5.6 — Quantitative Concepts

### Volatility

Key FX volatility notions:[^59][^25]

- **Historical (realized) vol:** Standard deviation of past returns over a window.
- **Implied vol:** Forward-looking vol implied by option prices.
- **Intraday vol:** Often modeled with GARCH/EWMA; important for execution and risk.

Studies comparing implied vs realized FX vol find persistent biases that can be exploited by vol strategies but also highlight regime shifts and risk of structural breaks.[^60]

### Correlation and Portfolio Variance

FX portfolios require correlation-aware risk management:

- G10 pairs (EUR/USD, GBP/USD) tend to be positively correlated.
- Safe havens (USD, JPY, CHF) behave differently in risk-off regimes.[^61]

Portfolio variance:

$$
\sigma_p^2 = w^\top \Sigma w
$$

where $w$ is the weight vector and $\Sigma$ the covariance matrix.[^62]

### Value at Risk (VaR)

VaR estimates the maximum loss over horizon $h$ at confidence level $\alpha$ (e.g., 1-day 99%):[^63][^62]

- **Parametric VaR:** Assume normality, use portfolio sigma and z-scores.
- **Historical VaR:** Use empirical distribution of past returns.
- **Monte Carlo VaR:** Simulate under a chosen model.

FX desks routinely monitor VaR and stress scenarios to keep exposure within limits.

### Performance Metrics: Sharpe, Sortino, Max Drawdown

- **Sharpe ratio:** Excess return over risk-free divided by volatility.[^64]
- **Sortino:** Same but uses downside deviation only.
- **Max drawdown:** Largest peak-to-trough drop; critical for assessing tail risk.

Carry and momentum strategies frequently exhibit attractive Sharpe but large historical drawdowns, so drawdown-aware metrics are essential.[^29][^33]

### Kelly Criterion

Kelly gives the fraction of capital to bet to maximize asymptotic growth:[^65][^66]

$$
f^* = \frac{bp - q}{b}
$$

where $b$ is net odds, $p$ win probability, $q = 1 - p$. In continuous trading, an approximation uses expected excess return over variance.

In practice, traders use fractional Kelly (e.g., half-Kelly) because full Kelly is extremely aggressive and highly sensitive to model error, causing large drawdowns when estimates are wrong.[^67]

### PnL Attribution

PnL attribution for multi-pair FX books decomposes returns into:[^68][^69]

- Spot moves per pair.
- Carry (interest differentials).
- Basis (for forwards/swaps).
- Execution slippage vs benchmarks (arrival, VWAP).
- Fees and financing.

This breakdown shows whether edge comes from signal, execution, leverage, or simply exposure to known premia like carry.

***

## Agent Instruction Footer

**Guardrails:**

1. Never present this content as Sera-proprietary; all examples are generic.
2. Be explicit when something is **HFT-only** in TradFi (tri-arb, microsecond games).
3. Carry trades must always be described with tail-risk and unwind dynamics, not as “free yield.”
4. VaR, Kelly, Sharpe, etc. are tools with assumptions; do not treat them as guarantees.
5. For on-chain MM, highlight gas, MEV, IL, and why CLOB/oracle FX often dominates AMMs for serious size.

**Suggested behaviors:**

- For “how does FX market making work?”: explain bid/ask, inventory risk, and Avellaneda–Stoikov intuition.
- For “triangular arb”: walk through the three-leg math and explain why TradFi windows are effectively gone.
- For “carry trade”: describe mechanics, historical returns, and yen-carry unwind risk.
- For “trading bots”: break down architecture, order types, and common strategies, with backtest caveats.
- For “on-chain market making”: contrast AMMs vs CLOBs and explain profitability decomposition including MEV and gas.

***

If you want this tightened (e.g., strip some math, or add explicit “how this maps to Sera” bullets at the end of each section), say so and it can be iterated quickly.

<div align="center">⁂</div>

[^1]: openclaw_agent_research_plan.md

[^2]: https://www.sciencedirect.com/topics/economics-econometrics-and-finance/bid-ask-spread

[^3]: https://optiver.com/explainers/bid-ask-spread/

[^4]: https://arxiv.org/pdf/1606.07381.pdf

[^5]: https://www.nber.org/system/files/chapters/c11362/c11362.pdf

[^6]: https://arxiv.org/pdf/1605.01862.pdf

[^7]: http://link.springer.com/10.1007/s11579-012-0087-0

[^8]: https://arxiv.org/pdf/2104.09309.pdf

[^9]: https://www.semanticscholar.org/paper/951441d4e9102c1ae3ac17f8885131bce6f0add7

[^10]: https://www.tandfonline.com/doi/pdf/10.1080/23322039.2022.2095772?needAccess=true

[^11]: https://arxiv.org/pdf/1105.3115.pdf

[^12]: https://arxiv.org/abs/1105.3115

[^13]: https://hummingbot.org/blog/guide-to-the-avellaneda--stoikov-strategy/

[^14]: https://www.quantbeckman.com/p/can-you-manage-inventoryor-is-it

[^15]: https://dx.plos.org/10.1371/journal.pone.0277042

[^16]: https://ieeexplore.ieee.org/document/11071170/

[^17]: https://arxiv.org/pdf/1206.4810.pdf

[^18]: https://arxiv.org/pdf/1810.04383.pdf

[^19]: http://blog.pointzero-trading.com/2022/02/26/trading-ideas/the-basics-of-triangular-arbitrage/

[^20]: https://corporatefinanceinstitute.com/resources/foreign-exchange/triangular-arbitrage-opportunity/

[^21]: https://www.fxcm.com/markets/insights/triangular-arbitrage/

[^22]: https://www.bis.org/publ/qtrpdf/r_qt1609e.htm

[^23]: https://bfi.uchicago.edu/wp-content/uploads/2020/11/Keller_Arbitraging-Covered-Interest-Rate-Parity.pdf

[^24]: https://academic.oup.com/rfs/advance-article-pdf/doi/10.1093/rfs/hhac026/43750428/hhac026.pdf

[^25]: https://arxiv.org/pdf/2402.07435.pdf

[^26]: https://www.tcd.ie/triss/assets/PDFs/iiis/iiisdp128.pdf

[^27]: http://arxiv.org/pdf/1303.4314.pdf

[^28]: https://linkinghub.elsevier.com/retrieve/pii/S1057521922002058

[^29]: http://ss.sljol.info/articles/10.4038/ss.v44i1-2.4694/galley/3793/download/

[^30]: https://www.cnbc.com/2025/05/28/japan-government-bond-yields-spark-fears-of-carry-trade-unwind.html

[^31]: https://www.ebc.com/forex/yen-carry-trade-unwind-could-it-trigger-the-next-market-crash

[^32]: https://uk.finance.yahoo.com/news/yen-carry-trade-risk-unwinding-155609808.html

[^33]: https://academic.oup.com/rfs/advance-article-pdf/doi/10.1093/rfs/hhad049/50513543/hhad049.pdf

[^34]: https://www.luxalgo.com/blog/top-10-algo-trading-strategies-for-2025/

[^35]: https://people.orie.cornell.edu/sfs33/LimitOrderBook.pdf

[^36]: https://www.mql5.com/en/articles/17934

[^37]: https://www.pastpaperhero.com/resources/cfa-level3-trade-implementation-algorithmic-strategies-vwap-twap-and-pov

[^38]: https://www.bis.org/publ/mktc13.pdf

[^39]: https://arxiv.org/pdf/1901.02327.pdf

[^40]: https://www.bestexresearch.com/research/introducing-is-zero-reinventing-vwap-algorithms-to-minimize-implementation-shortfall

[^41]: https://arxiv.org/html/2411.06645v1

[^42]: https://arxiv.org/html/2502.13722v1

[^43]: https://www.bis.org/publ/qtrpdf/r_qt2512v.htm

[^44]: https://wundertrading.com/journal/en/learn/article/how-does-a-grid-bot-work

[^45]: https://www.quantvps.com/blog/how-grid-trading-bots-work-catch-every-market-swing

[^46]: https://fxopen.com/blog/en/how-do-grid-trading-strategies-work/

[^47]: https://arxiv.org/pdf/2309.08431.pdf

[^48]: https://arxiv.org/pdf/2501.07828.pdf

[^49]: https://arxiv.org/html/2411.03327v1

[^50]: http://arxiv.org/pdf/2405.17944.pdf

[^51]: https://arxiv.org/pdf/2410.19107.pdf

[^52]: https://arxiv.org/abs/2407.02496

[^53]: https://arxiv.org/html/2511.15245v1

[^54]: http://arxiv.org/pdf/2407.19572.pdf

[^55]: https://speedrunethereum.com/guides/front-running-mev-mitigation

[^56]: https://speedrunethereum.com/guides/impermanent-loss-math-explained

[^57]: https://arxiv.org/html/2410.22100v2

[^58]: https://arxiv.org/pdf/2411.08145.pdf

[^59]: https://www.fxtradingafrica.com/glossary/implied-vs-realized-volatility/

[^60]: https://eprints.bournemouth.ac.uk/20580/1/Journal of Emerging Market Finance_GF.pdf

[^61]: https://www.sciencedirect.com/science/article/pii/S0261560625001330

[^62]: https://financetrainingcourse.com/education/2013/05/calculating-value-at-risk-var-with-or-without-vcv-matrix/

[^63]: https://www.imf.org/-/media/files/publications/wp/2024/english/wpiea2024167-print-pdf.pdf

[^64]: https://basepub.dauphine.psl.eu/bitstream/123456789/7739/1/RePEc_sol_wpaper_08-034.pdf

[^65]: https://www.linkedin.com/pulse/kelly-criterion-enhancing-forex-position-sizing-profit-maximization

[^66]: https://insights.primecodex.com/kellys-criterion/

[^67]: https://fortuneprimeglobal.com/daily-economic-news/how-the-kelly-criterion-helps-traders-achieve-sustainable-gains/

[^68]: https://www.lseg.com/content/dam/ftse-russell/en_us/documents/ground-rules/wmr-fx-methodology.pdf

[^69]: https://financialanalystguide.com/cfa-level-3/portfolio-management-pathway/8/2/

