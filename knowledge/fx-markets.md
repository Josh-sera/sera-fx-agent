# PACK 3 — FX Markets: The Complete Operating Manual

**Purpose:** The agent should understand FX markets at the level of someone who has worked an institutional FX desk — not textbook knowledge, but how it actually operates, including the mechanics that most people in crypto don't understand.

**Classification:** Public domain knowledge. No Sera proprietary information.

***

## Section 3.1 — Market Structure

### The $9.6 Trillion Daily Market

The foreign exchange market is the largest and most liquid financial market in the world. According to the Bank for International Settlements (BIS) 2025 Triennial Central Bank Survey, average daily FX turnover reached **$9.6 trillion** in April 2025 on a net-net basis — a 27.8% increase from the 2022 survey. This is the highest average daily turnover reported by the BIS since it started collecting data in 1986. The April 2025 figure was amplified by a spike in volatility around the US tariff announcements ("Liberation Day"), but the underlying growth trend is structural.[^1][^2][^3]

**Breakdown by instrument (April 2025 daily averages):**

| Instrument | Daily Turnover | Change from 2022 |
|---|---|---|
| FX Swaps | $3.986 trillion | +4.6% |
| Spot | $2.577 trillion | +22.3% |
| Outright Forwards | $1.847 trillion | +58.7% |
| FX Options | $634 billion | +108% (doubled) |
| Currency Swaps | $171.9 billion | +38.6% |

FX swaps remain the largest single instrument class, but the dramatic growth in outright forwards (+58.7%) and the doubling of options volume reflect the heightened hedging demand during a period of elevated macro uncertainty.[^1]

### The Spot Market

The spot market — the segment most directly relevant to stablecoin-based FX settlement — had a daily turnover of **$2.577 trillion** in April 2025. Spot FX is predominantly T+2 settlement (the trade executes today, cash settles two business days later), with the exception of USD/CAD and a few other pairs which settle T+1.[^4][^1]

Key characteristics of the spot market:
- It is **decentralized** and **over-the-counter** (OTC) — there is no central exchange
- Electronic trading accounts for approximately **59%** of spot FX volume, virtually unchanged from the prior survey[^2]
- More than **80%** of customer trades are matched by dealers within their own internal liquidity pools via "internalisation" — meaning most trades never reach the external market[^2]
- Trades execute via interdealer brokers, multi-bank platforms, single-dealer platforms, or voice/chat channels

### Major vs. Minor vs. Exotic Currency Pairs

**Major pairs** (G7/G10 currencies): EUR/USD, USD/JPY, GBP/USD, USD/CHF, AUD/USD, USD/CAD, NZD/USD. These pairs have the tightest spreads, deepest liquidity, and lowest transaction costs.

**Minor pairs** (crosses): EUR/GBP, EUR/JPY, GBP/JPY, etc. These are G10 currencies traded against each other without the USD as an intermediary.

**Exotic pairs**: Involve an emerging market currency — USD/TRY, USD/ZAR, USD/MXN, EUR/PLN, USD/THB, etc. These have wider spreads, lower liquidity, more volatile price action, and higher transaction costs. Emerging market FX centers like Singapore and London report record or near-record volumes in regional EM currency pairs, especially in derivatives like NDFs, forwards, and local-currency swaps.[^5]

### The Interbank Market

The interbank market is the top-level foreign exchange market where banks exchange currencies directly with one another or through electronic brokering platforms. It is the wholesale core of the FX ecosystem.[^6]

**The top dealer banks** dominate FX market making. According to the 2025 Euromoney FX Survey, the top global FX banks by volume are:[^7]

1. **Deutsche Bank** — #1, reaffirming its historical dominance
2. **UBS** — #2, with spot market share above 12% in 2024, bolstered by the Credit Suisse integration[^8]
3. **JPMorgan** — #3, leveraging advanced technology platforms
4. **Citi** — historically top 2, dominant in corporate FX and emerging markets
5. **Barclays** — strong in G10 and electronic FX

Concentration has increased significantly over the past two decades. In 2005, the top 5 dealers controlled ~39% of global volume. By 2013, that figure had risen to ~53%. The trend continues today, driven by:[^9]
- Higher costs of capital (post-GFC regulatory requirements)
- Growing scale advantages in electronic trading infrastructure
- Increasing incentives to clear
- Technology investment requirements that smaller banks cannot match

Beyond the traditional bank dealers, **non-bank liquidity providers** (NBLPs) have become significant market participants. Firms like **XTX Markets**, **Citadel Securities**, **Jump Trading**, and **Virtu Financial** stream competitive electronic prices on major venues. XTX Markets, for example, has regularly ranked among the top 5 spot FX liquidity providers globally.[^4]

### ECNs and Multi-Dealer Platforms

Electronic Communication Networks (ECNs) and multi-dealer platforms allow clients to request prices from multiple banks simultaneously through a single interface. The main venues include:[^10]

**Primary interdealer platforms:**
- **EBS (CME Group)** — Average daily spot volume ~$60 billion in 2024. CME is launching "FX Spot+" to integrate EBS more closely with its futures complex[^4]
- **Refinitiv Matching / FXall (LSEG)** — Combined spot volume ~$100 billion/day, with FXall being the leading multi-dealer platform for corporate and institutional investor flow[^4]

**Multi-dealer platforms (customer-facing):**
- **FXall** (LSEG) — founded by major banks, dominant for institutional investors
- **Currenex** — independent, venture-backed
- **360T** (Deutsche Börse) — strong in European corporate FX
- **Bloomberg FXGO** — leverages Bloomberg terminal distribution
- **Hotspot** (CBOE) — anonymous CLOB venue[^10]

**Single-dealer platforms (SDPs):**
- Most top-tier banks operate proprietary platforms for their clients (e.g., JPMorgan's Execute, Deutsche Bank's Autobahn, Citi's Velocity, UBS's Neo)
- Banks prefer client flow on SDPs because they avoid paying brokerage fees and have exclusive access to the order flow

### Prime Brokerage in FX

FX prime brokerage (PB) is a critical piece of market infrastructure that enables hedge funds, proprietary trading firms, asset managers, and other non-bank participants to access the interbank FX market.[^11][^12]

**How it works:** A client establishes a single credit relationship with a prime broker (typically a major bank). The client then trades with multiple executing dealers (EDs) in the prime broker's name. When the prime broker accepts the trade, it becomes the legal counterparty to both the executing dealer and the client, creating two offsetting transactions.[^12]

**Key benefits:**
- **Credit intermediation:** Clients leverage the prime broker's credit rating to trade with numerous dealers without establishing individual credit lines with each[^11]
- **Speed to market:** Only one set of ISDA documentation needed (with the PB), rather than separate agreements with every dealer[^13]
- **Centralized clearing and settlement:** All trades settle through a single channel
- **Access to anonymous venues:** PB allows access to ECNs and CLOBs that would otherwise require direct credit relationships

FX prime brokerage emerged in the early 1990s with semi-formalized "give-up" arrangements. It expanded rapidly in the late 1990s as several banks built dedicated PB businesses. The primary clients are hedge funds and commodity trading advisors (CTAs). FX PB uses a unique **inverted agency** model: the client acts as the prime broker's agent when placing trades, which automatically creates an offsetting swap between the PB and the client.[^13][^12]

### Geographic Distribution

FX trading is concentrated in a handful of financial centers. In April 2025, four locations accounted for **75%** of global FX turnover:[^3]

| Location | Share of Global Turnover | Daily Volume |
|---|---|---|
| United Kingdom | 37.8% | $4,745 billion |
| United States | ~17% | ~$1,600 billion |
| Singapore | ~9% | ~$850 billion |
| Hong Kong SAR | ~8% | ~$750 billion |

The UK's dominance is a function of London's position at the crossroads of Asian and American time zones, its deep pool of FX expertise, and its role as a hub for European and emerging market currency trading. The UK's share has remained remarkably stable at ~38% across multiple survey cycles.[^14]

### Market Hours and the Global Trading Day

The FX market operates 24 hours a day, 5 days a week. Liquidity follows the sun as regional dealing hubs open and close:[^15]

| Session | UTC Hours | Key Characteristics |
|---|---|---|
| Sydney | 21:00 – 06:00 | Lowest liquidity; AUD, NZD pairs most active |
| Tokyo | 00:00 – 09:00 | JPY pairs dominant; moderate liquidity |
| London | 07:00 – 16:00 | Highest liquidity session; all major pairs active |
| New York | 13:00 – 22:00 | Second-highest liquidity; USD pairs dominant |

**The critical overlaps:**
- **London/New York overlap (13:00–16:00 UTC):** The most liquid and volatile period of the trading day. Tightest spreads, highest volume. This is when the WM/Reuters 4pm London fix occurs[^16][^15]
- **Tokyo/London overlap (07:00–09:00 UTC):** Brief but important for JPY crosses
- **Sydney/Tokyo overlap (00:00–06:00 UTC):** Relevant for AUD, NZD, and Asian currencies

### Client Segments

The BIS 2025 Survey breaks down turnover by counterparty type:[^1]

| Client Segment | Daily Turnover | Change from 2022 |
|---|---|---|
| Non-reporting banks | $2.35 trillion | +45.2% |
| Institutional investors | $1.262 trillion | +49.0% |
| Hedge funds & prop trading | $758 billion | +47.4% |
| Non-financial customers (corporates) | $443 billion | +4.2% |
| Official sector | $26.6 billion | +33% |

The massive growth in institutional investor and hedge fund activity reflects the heightened macro volatility of April 2025. In spot specifically, institutional investor turnover surged 93.9% to $442 billion/day.[^1]

***

## Section 3.2 — How Prices Are Actually Set

### The Myth vs. Reality of "Floating" Exchange Rates

Most people assume major currency exchange rates are determined purely by supply and demand in a free market. The reality is far more nuanced. While the G10 currencies broadly operate under floating exchange rate regimes, central banks actively manage their currencies through various mechanisms. Only a few currencies truly "free float" without any central bank intervention.

### Exchange Rate Regimes

Countries operate under a spectrum of exchange rate arrangements:[^17][^18][^19]

| Regime | How It Works | Examples |
|---|---|---|
| **Free float** | Value determined entirely by market supply/demand; no CB intervention | USD, EUR (largely), GBP, JPY (largely) |
| **Managed float ("dirty float")** | Market-determined but CB intervenes periodically to reduce volatility | INR, BRL, SGD, IDR, MYR, THB |
| **Crawling peg** | Currency adjusts gradually within a pre-set range; periodic small adjustments | Bangladesh (recent), historically Mexico, Vietnam |
| **Currency board / hard peg** | Currency fixed at a specific rate to another currency; CB commits all reserves to maintaining the peg | HKD (pegged to USD at 7.75–7.85), Bulgarian Lev (pegged to EUR) |
| **Conventional peg** | Fixed rate with narrow band (~1%); CB defends the peg | Saudi Riyal (pegged to USD), UAE Dirham |

**The Impossible Trinity (Mundell-Fleming Trilemma):** A fundamental constraint in international economics states that it is impossible to have all three of the following simultaneously:[^19]

1. A fixed exchange rate
2. Free capital movement
3. An independent monetary policy

A country must choose two and sacrifice the third. For example:
- **Hong Kong** chose a fixed exchange rate (peg to USD) and free capital movement, sacrificing independent monetary policy — HK's interest rates must follow the Fed
- **China** chose independent monetary policy and a managed exchange rate, maintaining capital controls
- **The United States** chose independent monetary policy and free capital movement, allowing the dollar to float

The East Asian financial crisis of 1997–98 is the classic example of what happens when countries try to maintain all three: Thailand, Indonesia, and South Korea attempted fixed exchange rates with open capital accounts while running independent monetary policy. When capital fled, they couldn't defend the pegs and experienced devastating currency collapses.[^19]

### Central Bank Intervention Mechanisms

Central banks influence exchange rates through several channels:[^20][^21]

**Direct intervention:**
- **Sterilized intervention:** The central bank buys or sells foreign currency on the open market, then offsets the domestic monetary impact by selling or buying domestic bonds. This changes the relative supply of domestic vs. foreign assets without changing the money supply[^20]
- **Unsterilized intervention:** The central bank buys or sells foreign currency without offsetting the domestic monetary effect. This is more powerful but directly impacts the money supply and inflation[^20]

**Indirect tools:**
- **Interest rate adjustments:** Higher rates attract foreign capital → currency appreciation; lower rates → depreciation
- **Verbal intervention ("jawboning"):** Central bank officials make public statements to signal desired exchange rate direction
- **Capital controls:** Restrictions on cross-border capital flows to manage currency pressure
- **Macro-prudential measures:** Reserve requirements on FX positions, limits on FX borrowing

### The WM/Reuters 4pm London Fix

The WM/Reuters benchmark rates (now called the WMR Fix) are the most widely used FX reference rates globally. They are set at 4pm London time daily based on the median of actual buy and sell transactions during a 60-second window (30 seconds either side of 4pm).[^22]

**Why it matters:** These rates are used to value trillions of dollars in investments held by pension funds, index funds, and asset managers globally — including more than $3.6 trillion of index funds. When an index fund rebalances, it needs to transact at the fix rate.[^22]

**The 2013 FX Scandal:** In June 2013, Bloomberg News revealed that currency dealers at major banks had been front-running client orders and rigging the WM/Reuters fix for at least a decade. Senior traders from banks including JPMorgan, Citigroup, Barclays, UBS, and RBS used private chatrooms with names like "The Cartel," "The Bandits' Club," and "One Team, One Dream" to share confidential client order information and coordinate trading around the fix window.[^23][^24]

**Manipulation tactics:**
- **Sharing client order flow** before the fix — giving competitors advance knowledge of large orders
- **"Banging the close"** — stockpiling client orders and unleashing them in the 60-second fix window to move the rate in a desired direction
- **Front-running** — trading ahead of known client orders to profit from the expected price move

**Aftermath:** Over $10 billion in fines were levied against the banks involved. Traders were suspended, fired, and in some cases criminally charged. The scandal led to a complete overhaul of FX benchmark methodology and the creation of the **FX Global Code** — a set of principles for good practice in the wholesale FX market.[^25][^24]

### Non-Deliverable Forwards (NDFs) and Offshore Markets

For many emerging market currencies that are restricted or not freely convertible offshore, an active **NDF market** exists.[^26][^27]

**How NDFs work:** An NDF is a forward contract where counterparties settle the difference between the agreed NDF rate and the prevailing spot rate at maturity. No physical delivery of the underlying currencies takes place — settlement is in cash, typically in USD.[^27]

**Why NDFs exist:** Many EM governments restrict offshore access to their currencies (capital controls). NDFs allow offshore participants to hedge or speculate on these currencies without requiring onshore bank accounts or dealing with local regulations.[^28][^26]

**Major NDF currencies:**[^27]

| Region | Currencies |
|---|---|
| Asia-Pacific | CNY, INR, KRW, TWD, IDR, MYR, PHP, VND |
| Latin America | BRL, ARS, CLP, COP, PEN |
| EMEA | EGP, NGN, KZT |

NDF volumes often exceed onshore market volumes for some currencies. NDF markets tend to price significant depreciation during market stress episodes. Spillovers between NDF markets and onshore markets run both ways — a key concern for policymakers.[^26]

***

## Section 3.3 — The Bid-Ask Spread

### What the Spread Actually Represents

The bid-ask spread is the difference between the price at which a dealer is willing to buy (bid) and the price at which they're willing to sell (ask/offer) a currency pair. It represents the **cost of immediacy** — the price a trader pays for executing now rather than waiting.

### Components of the Spread

The spread compensates market makers for three types of risk:

1. **Inventory risk:** The risk of holding an unwanted position. If a dealer buys EUR/USD from a client, they now hold a long EUR position that could move against them before they can offload it
2. **Adverse selection:** The risk of trading with someone who knows more than you. Institutional flow from a hedge fund is more likely to be "informed" (trading on superior analysis) than corporate hedging flow
3. **Order processing costs:** The operational cost of quoting, executing, confirming, and settling trades

### How Spreads Vary by Currency Pair

**G10 major pairs — ultra-tight spreads:**
- EUR/USD institutional interbank spread: **0.1–0.5 pips** (a pip = 0.0001)
- EUR/USD top-of-book spread on EBS Market averaged **0.74 pips** in 2024[^29]
- Even during the April 2025 volatility spike (64% increase in EUR/USD vol), average spreads on EBS rose by only 0.15 pips to 0.89 pips[^29]
- Retail EUR/USD spreads: typically **0.6–1.2 pips** for competitive brokers[^30]

**G10 minor/cross pairs — moderate spreads:**
- GBP/JPY, EUR/GBP, AUD/NZD: typically 1–3 pips interbank
- Wider during off-hours (e.g., EUR/GBP during the Sydney session)

**Emerging market pairs — significantly wider:**
- USD/TRY, USD/ZAR, USD/MXN: **10–50+ pips** depending on liquidity conditions
- Exotic-exotic crosses (e.g., THB/MYR): can be 50–200+ pips
- Spreads blow out dramatically during stress events, holidays, or off-hours

### Spread Compression Over the Last 20 Years

FX spreads have compressed dramatically since the early 2000s due to:
- **Electronification:** Automated quoting replaced manual voice trading
- **Competition from non-bank market makers:** Firms like XTX Markets, Citadel Securities stream extremely competitive prices
- **Algorithmic trading:** Dealer banks use algos to manage inventory more efficiently
- **Multi-venue competition:** ECNs compete for order flow, compressing margins

The result: G10 spot trading has become a low-margin, high-volume business. Many dealer banks treat G10 spot as a loss leader to win more profitable derivative, forwards, and prime brokerage business. This structural compression is critical context for understanding why stablecoin-based FX settlement could be competitive — the margins are already thin, and any reduction in infrastructure costs (settlement, pre-funding, compliance) shifts the economics.[^31]

### The Relationship Between Volatility and Spread

Spreads are positively correlated with volatility. During market stress:
- Market makers widen spreads to compensate for increased inventory risk
- Liquidity providers reduce quote sizes or withdraw entirely
- Less liquid pairs see proportionally larger spread widening

Even highly liquid pairs like EUR/USD saw spread impacts during COVID-19 (March 2020), when liquidity fell off sharply outside of peak trading hours.[^32]

***

## Section 3.4 — FX Settlement & Risk

### T+2 Settlement Standard

Most FX spot trades settle on a **T+2** basis — the trade executes today, but the actual exchange of currencies happens two business days later. This delay exists because of the operational complexity of moving money across different banking systems, time zones, and jurisdictions. USD/CAD is a notable exception, settling T+1.[^4]

**Why this matters:** During the T+2 settlement window, both counterparties are exposed to risk. If one party defaults after the other has already sent their currency, the surviving party loses both the currency they sent and the currency they were supposed to receive.

### Herstatt Risk — The 1974 Event That Changed Everything

On **June 26, 1974**, German regulators forced Bankhaus Herstatt, a medium-sized Cologne-based bank active in FX markets, into liquidation at **3:30pm CET** (10:30am New York time).[^33][^34]

**What happened:** Herstatt had accumulated DM 470 million in FX losses against capital of only DM 44 million through wrong-way bets on the US dollar. When German regulators closed the bank, a number of counterparty banks had already released their Deutsche mark payments to Herstatt in Frankfurt. However, because of the time zone difference, the corresponding US dollar payments had not yet been made in New York. Herstatt's failure to pay caused banks globally to stop outgoing payments until they confirmed their countervalues had been received. The international payment system froze, trust evaporated, lending rates spiked, and credit was curtailed.[^35][^34][^33]

**The policy legacy:** Herstatt's failure highlighted the critical importance of settlement risk in FX — the risk that one party pays the currency it sold but does not receive the currency it bought. This risk became known as **"Herstatt risk"** or **FX settlement risk**. The event directly led to:[^35]
- Creation of the **Basel Committee on Banking Supervision** in 1974[^34]
- A 1996 G10 central bank endorsement of a strategy to reduce FX settlement risk[^33]
- Ultimately, the creation of **CLS Bank** in 2002[^34]

### CLS Bank: How It Works

**Continuous Linked Settlement (CLS)** is a specialist financial market infrastructure that settles FX transactions on a **payment-versus-payment (PvP)** basis. PvP eliminates FX settlement risk by ensuring that a payment in one currency occurs **if and only if** the payment in the other currency takes place simultaneously.[^33]

**Key metrics:**
- CLS settles an average of **$7 trillion daily** across **18** of the most actively traded currencies[^36]
- CLS average daily traded volume grew approximately **36%** between April 2022 and April 2025[^37]
- CLS settlement members fund only approximately **1%** of the total value of their payment instructions on a typical day[^38]
- Multilateral netting yields approximately **96% liquidity savings** for settlement members[^38]

**How netting works:** Rather than settling each trade individually, CLS calculates each member's **multilateral net position** in each currency. If Bank A owes $500M to Bank B and Bank B owes $450M to Bank A in the same currency, only the net $50M needs to settle. This dramatically reduces the amount of liquidity required.[^38]

**Currencies settled by CLS:** USD, EUR, GBP, JPY, CHF, CAD, AUD, NZD, HKD, SGD, KRW, ZAR, NOK, SEK, DKK, ILS, MXN, and HUF.

**Critical limitation:** CLS only covers 18 currencies. The vast majority of emerging market currencies — including those most relevant to cross-border remittances and stablecoin use cases — are **not covered by CLS**, meaning they remain subject to full settlement risk.

### CLSNet: Expanding Beyond 18 Currencies

To address the coverage gap, CLS operates **CLSNet**, an automated bilateral netting calculation service covering **120 currencies**. CLSNet doesn't provide PvP settlement but does reduce the number and size of payments needed.[^36]

**CLSNet metrics:**
- Average daily netted value: **$171 billion** in 2025 (up 12% year-on-year)[^39]
- **70%** of CLSNet instructions involve emerging market currencies[^38]
- Eight of the top 10 global banks are now CLSNet participants[^38]

### Settlement Risk Today — Still a Major Problem

Despite CLS, FX settlement risk remains substantial. In April 2022, **$2.2 trillion** of daily FX turnover was subject to settlement risk — up from $1.9 trillion in 2019. This means approximately **one-third** of all deliverable FX turnover remains at risk on any given day.[^40]

**Why risk persists:**
- Many trades involve currencies not eligible for CLS PvP settlement
- Some market participants find CLS too expensive or operationally complex
- Same-day or short-dated trades may not meet CLS cut-off times
- Certain trade types (NDFs, some options) are not eligible

**Recent examples of losses from settlement risk:**
- **KfW Bankengruppe** lost **€300 million** when Lehman Brothers collapsed in 2008[^40]
- **Barclays** lost **$130 million** to a small currency exchange in March 2020[^40]

### Nostro/Vostro Accounts and Correspondent Banking

FX settlement ultimately happens through the correspondent banking system. When a bank needs to pay in a currency it doesn't hold directly, it uses **nostro accounts** (accounts it holds at other banks in foreign jurisdictions) and **vostro accounts** (accounts foreign banks hold at the domestic bank).

**The pre-funding problem:** To settle FX trades, banks must pre-fund their nostro accounts with sufficient balances in each currency. This creates massive amounts of **trapped liquidity** — capital sitting idle in accounts around the world waiting to settle trades. This pre-funding requirement is one of the fundamental inefficiencies that stablecoin-based settlement can address.

***

## Section 3.5 — Retail FX

### The Scale of Retail FX

The retail FX market involves individual traders speculating on currency movements through online brokers. While often characterized as a massive market, retail activity accounts for approximately **2.5% of total FX market volume**.[^41]

**Global distribution of retail FX traders:**[^42][^41]

| Region | Number of Traders | Per Capita Rate |
|---|---|---|
| Asia | 3.2 million | 674 per million |
| Europe | 1.5 million | ~1,800 per million |
| North America | 1.5 million | 2,500 per million |
| Middle East | ~500,000 | 2,083 per million |
| Africa | ~400,000 | ~300 per million |
| Oceania | 190,000 | 4,200 per million |

Retail-driven daily turnover dropped from approximately $450 billion to $242 billion over the three years to 2025, as post-pandemic trading enthusiasm faded.[^41]

### How Retail FX Brokers Actually Work

Retail FX brokers operate under one of three models — and the distinction is critical for understanding the industry's economics and conflicts of interest:[^43][^44][^45]

**A-Book (Straight-Through Processing / STP):**
- The broker routes client orders directly to external liquidity providers (banks, ECNs)
- The broker earns revenue through commissions and/or a markup on the spread
- The broker is **market-neutral** — they don't profit from client losses
- Used for larger, more sophisticated, or consistently profitable clients

**B-Book (Market Making / Internalization):**
- The broker takes the **opposite side** of the client's trade internally
- The trade never reaches the external market — it stays on the broker's books ("internalized" or "warehoused")[^43]
- The broker's profit or loss is directly tied to the client's performance: **if the client loses, the broker gains; if the client wins, the broker pays**[^43]
- This creates an inherent conflict of interest, but brokers justify it statistically: since ~75% of retail clients lose money, the B-book is generally profitable
- Allows brokers to offer fixed spreads, faster execution, and lower minimum deposits

**Hybrid Model:**
- Most modern brokers operate a hybrid of A-Book and B-Book
- Advanced risk management systems evaluate each order based on trade size, leverage, client trading history, and account type
- Profitable or high-volume clients are routed to A-Book (external LPs)
- Smaller, less consistent traders are kept on B-Book[^44][^46]
- This is the dominant model in the industry today

### The MetaTrader Ecosystem

MetaTrader 4 (MT4, launched 2005) and MetaTrader 5 (MT5, launched 2010), both developed by MetaQuotes, dominate retail FX trading platforms.[^47]

**Market share evolution:**
- Q4 2023: MT4 held 65.3% of trading volume, MT5 held 34.7%[^48]
- Q1 2025: MT5 overtook MT4 for the first time — MT5 at 54.2%, MT4 at 45.8%[^49]
- Q3 2025: MT5 extended its lead to 62% vs. MT4 at 38%[^47]

MT4 remained dominant for over 15 years due to its user-friendly interface, vast ecosystem of Expert Advisors (EAs) for algorithmic trading, and deep broker integrations. MT5's eventual overtaking was driven by MetaQuotes scaling back MT4 support, regulatory requirements favoring multi-asset platforms, and MT5's broader capabilities (multi-asset trading, improved order types, more technical indicators).[^47]

Brokers pay approximately **$10,000/month** for a full MetaTrader server license, making MetaQuotes the dominant infrastructure provider in retail FX. Alternative platforms captured about 27% of market share in Q1 2025 and are growing.[^50][^49]

### CFDs vs. Spot FX vs. Futures

| Product | How It Works | Where It Trades |
|---|---|---|
| **Spot FX** | Direct purchase/sale of currency pair; T+2 delivery | OTC; available at some brokers |
| **CFD (Contract for Difference)** | Derivative contract; trader never owns the underlying currency; settles the P&L difference in cash | OTC; the dominant retail product in Europe, Asia, Australia |
| **FX Futures** | Standardized contracts traded on exchanges (CME); physically deliverable or cash-settled | Exchange (CME, ICE) |

CFDs are the primary vehicle for retail FX trading outside the US (where CFDs are banned). They offer leverage but amplify both gains and losses.

### The 70–80% Retail Loss Rate

Under **ESMA** (European Securities and Markets Authority) regulations, CFD brokers must disclose the percentage of retail client accounts that lose money. The data is stark:[^51][^52]

- **ESMA data:** 74–89% of retail traders lose money trading CFDs and forex[^52]
- **US CFTC data:** Consistently shows 70–80% loss rates[^52]
- **UK FCA:** Approximately 80% of retail CFD clients lose money[^51]

Actual broker disclosures range from 60% to 85%+ depending on the platform. The reasons for the high loss rate include:[^53]
- Excessive leverage (even with ESMA caps at 30:1 for majors)
- Lack of risk management discipline
- Trading costs (spreads + overnight financing) that create a structural drag
- B-book broker execution practices that can disadvantage clients
- Emotional decision-making and overtrading

### Regulatory Approaches to Retail FX

| Jurisdiction | Approach |
|---|---|
| **EU (ESMA)** | Max leverage 30:1 for major pairs, 20:1 for minors; negative balance protection; mandatory loss rate disclosure |
| **UK (FCA)** | Follows ESMA framework; ~80% loss rate disclosure; marketing restrictions |
| **Australia (ASIC)** | Leverage caps introduced 2021; product intervention orders |
| **US (CFTC/NFA)** | Max leverage 50:1 for majors, 20:1 for minors; CFDs banned; brokers must be NFA-registered |
| **Japan (JFSA)** | Max leverage 25:1; strict broker requirements |
| **Offshore (unregulated)** | No leverage caps; minimal consumer protection; some offer 500:1 or higher |

***

## Section 3.6 — Central Bank & Government FX Operations

### Foreign Reserve Management

Central banks hold foreign exchange reserves as a buffer against external shocks, to intervene in currency markets, and to maintain confidence in the domestic currency. Total global foreign exchange reserves stood at **$12.54 trillion** as of Q1 2025.[^54]

**Reserve currency allocation (Q1 2025, IMF COFER data):**[^55][^54]

| Currency | Share of Allocated Reserves | Value |
|---|---|---|
| US Dollar (USD) | 57.74% | $7.72 trillion |
| Euro (EUR) | 20.06% | $2.33 trillion |
| Pound Sterling (GBP) | 5.19% | $604 billion |
| Japanese Yen (JPY) | 5.15% | $599 billion |
| Other currencies | 4.93% | $573 billion |
| Canadian Dollar (CAD) | 2.63% | $306 billion |
| Chinese Renminbi (CNY) | 2.12% | $246 billion |

The USD's dominance has been remarkably stable, though it has gradually declined from ~71% in 2001 to ~58% today. The euro holds a steady second position. The Chinese renminbi's share at 2.12% remains low relative to China's economic weight, reflecting ongoing capital account restrictions and limited convertibility.[^56][^55]

### Currency Intervention Mechanics

**Sterilized vs. Unsterilized Intervention:**[^20]

**Sterilized intervention:**
1. Central bank sells USD reserves and buys domestic currency to strengthen it
2. Simultaneously buys domestic government bonds to inject the domestic currency back into the banking system
3. Net effect: exchange rate impact without changing the money supply
4. Less powerful but avoids inflation consequences
5. Most central bank interventions are sterilized

**Unsterilized intervention:**
1. Central bank sells USD reserves and buys domestic currency
2. Does NOT offset the reduction in domestic money supply
3. Net effect: exchange rate impact PLUS monetary tightening
4. More powerful but can cause deflationary pressure or credit tightening

From a recent survey of 22 emerging market central banks, 17 reported "never" or "rarely" pre-announcing their interventions. Most interventions are conducted in secret to maximize their market impact.[^21]

### Capital Flow Management

Central banks manage capital flows to prevent destabilizing "hot money" surges or sudden stops:
- **Hot money inflows:** Speculative capital rushing in during boom times, driving currency appreciation and asset bubbles
- **Sudden stops:** Capital abruptly reversing, causing currency crashes and liquidity crises (classic EM crisis pattern)

Tools include: reserve requirements on short-term FX inflows, taxes on foreign portfolio investment, restrictions on FX derivative positions, and outright capital controls. The IMF has gradually accepted that capital flow management measures (CFMs) can be appropriate in certain circumstances — a significant shift from the pre-2008 "capital account liberalization" orthodoxy.

### Dollarization and De-Dollarization

**Dollarization** occurs when a country's economy becomes heavily dependent on the US dollar — either formally (Ecuador, Panama use USD as legal tender) or informally (citizens prefer USD for savings, contracts, and transactions due to distrust of the local currency — common in Argentina, Turkey, Nigeria).

**De-dollarization** has become a major geopolitical theme, driven primarily by the BRICS nations (Brazil, Russia, India, China, South Africa) and accelerated by Western sanctions on Russia post-2022:[^57][^58]

- **China and Russia** now conduct most of their bilateral trade in yuan and rubles, bypassing the dollar entirely[^58]
- **Brazil and China** signed a yuan-real trade settlement agreement in 2023[^58]
- **India** has begun purchasing Russian oil in rupees[^58]
- **BRICS Pay** — a decentralized payment messaging system for local-currency transactions — is in pilot, with broader deployment expected 2027–2030[^59][^57]

However, the practical impact on USD dominance remains limited. The dollar's share of global reserves (57.8%) has declined only gradually, and there is no credible alternative reserve currency. The renminbi's 2.12% reserve share reflects China's continued capital account restrictions. The most realistic trajectory is not a sudden dollar dethronement but a gradual emergence of regional settlement mechanisms that reduce dollar usage for specific bilateral or intra-bloc trade flows.[^60][^56]

### Currency Wars and Competitive Devaluation

Countries sometimes deliberately weaken their currencies to gain export competitiveness — a practice known as "competitive devaluation" or "beggar-thy-neighbor" policy. This can occur through:
- Direct FX intervention (selling domestic currency)
- Maintaining artificially low interest rates
- Capital controls that prevent currency appreciation
- Accumulating excessive foreign reserves

The risk is retaliation: if multiple countries simultaneously try to devalue, it becomes a zero-sum "currency war" that can lead to trade barriers, capital controls, and global economic instability.

### The Impossible Trinity Applied

The impossible trinity isn't just theory — it's a constraint that shapes every country's macro-economic policy:[^19]

| Country | Chose | Sacrificed |
|---|---|---|
| **Hong Kong** | Fixed rate (USD peg) + Free capital flows | Independent monetary policy (must follow the Fed) |
| **China** | Managed exchange rate + Independent monetary policy | Free capital flows (capital controls) |
| **United States** | Independent monetary policy + Free capital flows | Fixed exchange rate (USD floats) |
| **Singapore** | Managed exchange rate + Free capital flows | Full monetary policy independence (MAS targets exchange rate, not interest rates) |
| **Argentina (Milei era)** | Moving toward fixed rate + Free capital flows | Independent monetary policy (must control spending/inflation first) |

Understanding the trilemma is essential for evaluating which countries are most likely to adopt stablecoin infrastructure: countries with capital controls and managed exchange rates (China, India, Malaysia) face the highest regulatory barriers, while countries with free capital flows and floating rates (most of the West, Singapore) have the fewest structural obstacles.

***

## Agent Instruction Footer

### Guardrails for Agent Behavior

When using this knowledge base, the agent MUST:

1. **Never present information as Sera-proprietary.** Everything in this pack is public domain knowledge. If asked "how do you know this?" the answer is always "this is publicly available market knowledge."

2. **Distinguish between institutional FX and retail FX.** These are fundamentally different markets with different participants, infrastructure, and economics. Don't conflate them.

3. **Use current data.** The BIS 2025 Triennial Survey is the latest authoritative source for market size. Don't cite older figures unless making a historical comparison.

4. **Acknowledge uncertainty in fast-moving areas.** De-dollarization trends, regulatory changes, and market structure evolution are ongoing. Frame forward-looking statements appropriately.

5. **Don't oversimplify settlement risk.** CLS solves PvP for 18 currencies but the vast majority of EM currencies remain unsettled via PvP. This nuance is critical for explaining Sera's value proposition.

6. **Credit the correct entities.** CLS is not a government institution — it's a market infrastructure owned by its members. The BIS conducts the Triennial Survey but doesn't operate FX markets. The WM/Reuters fix is now administered by Refinitiv (LSEG).

7. **Don't give trading advice.** The agent can explain how FX markets work, but should never recommend specific trades, strategies, or brokers.

8. **Recognize the B-book conflict.** When discussing retail FX, be honest about the structural conflicts of interest in the B-book model without being sensationalist. Most regulated brokers manage this appropriately through hybrid models.

### Suggested Agent Behaviors

- When asked about FX market size → Lead with the $9.6T BIS 2025 figure, then break down by instrument
- When asked about settlement → Explain the T+2 standard, Herstatt risk, CLS, and the $2.2T still at risk
- When asked about how FX prices are set → Distinguish between the interbank market (dealer quotes, ECNs) and the WM/Reuters fix (benchmark for fund valuation)
- When asked about retail FX → Be direct about the 70-80% loss rate and the B-book model; explain the A/B/hybrid distinction
- When asked about "can crypto/stablecoins replace FX?" → Reference the structural inefficiencies (T+2, pre-funding, settlement risk on $2.2T/day, no PvP for EM currencies) as the specific problems that on-chain settlement addresses

***

*Pack 3 Complete. Ready for OpenClaw ingestion.*
*Next: Pack 4 — Cross-Border Payments & Remittance: The Full Stack*

---

## References

1. [FX Turnover Hits $9.6 Trillion in BIS Triennial Survey](https://thefullfx.com/fx-turnover-hits-9-6-trillion-in-bis-triennial-survey/) - The Bank for International Settlements has released the 2025 Triennial Survey of FX Turnover, reveal...

2. [The FX trade execution landscape through the prism of the 2025 BIS ...](https://www.bis.org/publ/qtrpdf/r_qt2512v.htm) - The latest snapshot of the microstructure of trading was taken during April 2025, a month marked by ...

3. [Global FX trading hits $9.6 trillion per day in April 2025 and OTC ...](https://www.bis.org/press/p250930.htm) - $9.6 trillion per day in April 2025 and trading of over-the-counter (OTC) interest rate derivatives ...

4. [FX Market Structure - sudolabel](https://blog.sudolabel.xyz/Notes/FX-Market-Structure) - About this doc There is a glossary at the bottom. It’s my distillation of a few days of FX market re...

5. [Electronic platforms and Emerging Market FX - e-Forex](https://e-forex.net/electronic-platforms-and-emerging-market-fx/) - The proliferation of ECNs, combined with increased participation from non-bank financial institution...

6. [The interbank market](https://en.wikipedia.org/wiki/Interbank_foreign_exchange_market)

7. [euromoney.com](https://x.com/euromoney/status/1996516075366707310)

8. [The world's best bank for FX spot 2025: UBS - Euromoney](https://www.euromoney.com/article/9767m8fvdusk08sck04kscgwo/awards/foreign-exchange-awards/the-worlds-best-bank-for-fx-spot-2025-ubs/) - -

9. [Biggest FX Dealers Amassing Dominate Market Share](https://www.greenwich.com/press-release/biggest-fx-dealers-amassing-dominate-market-share) - Foreign exchange trading volumes are consolidating in the hands of the world’s biggest FX dealers — ...

10. [FX ECNs (electronic communication networks)](http://www.londonfx.co.uk/ecn.html)

11. [What Is FX Prime Brokerage and How Does It Work?](https://accountinginsights.org/what-is-fx-prime-brokerage-and-how-does-it-work/) - Uncover FX Prime Brokerage: a core financial service that centralizes and simplifies complex foreign...

12. [Foreign Exchange Prime Brokerage: Product Overview and Best Practice Recommendations](https://www.newyorkfed.org/medialibrary/microsites/fxc/files/annualreports/ar2005/fxar05PB.pd)

13. [FX prime brokerage](https://jollycontrarian.com/index.php?title=FX_PB)

14. [BIS Triennial Survey of Foreign Exchange and Over-The-Counter ...](https://www.bankofengland.co.uk/news/2025/september/bis-triennial-survey-of-foreign-exchange-and-over-the-counter-interest-rate-derivatives-markets) - Results of our latest survey of turnover in the markets for foreign exchange and over-the-counter in...

15. [Forex Time Zones Explained: Best Trading Hours Globally](https://www.ebc.com/forex/forex-time-zones-explained-best-trading-hours-globally) - Learn the role of forex time zones in trading. Explore global market hours and find the best times t...

16. [New York Session Forex Trading Hours | Best Times to Trade](https://marketmates.com/learn/forex/new-york-session-forex-trading-hours/) - The New York session boasts high liquidity, particularly during the overlap with the London session ...

17. [Crawling peg - Wikipedia](https://en.wikipedia.org/wiki/Crawling_peg) - In macroeconomics, crawling peg is an exchange rate regime that allows currency depreciation or appr...

18. [BIG READ: Difference between a fixed, free float crawling peg and managed float exchange rate system; which is better for Nigeria?](https://www.linkedin.com/pulse/big-read-difference-between-fixed-free-float-crawling-peg) - In a landmark move on June 16th, 2023, the Central Bank of Nigeria unveiled sweeping reforms to its ...

19. [Impossible trinity - Wikipedia](https://en.wikipedia.org/wiki/Impossible_trinity)

20. [Unsterilized Foreign Exchange Intervention Overview](https://www.investopedia.com/terms/u/unsterilized.asp) - An unsterilized foreign exchange intervention is a method by which a country's central bank can try ...

21. [How Powerful is Unannounced, Sterilized Foreign Exchange ...](https://publications.banque-france.fr/en/how-powerful-unannounced-sterilized-foreign-exchange-intervention) - Though most central banks actively intervene on the foreign exchange market, the literature offers m...

22. [How The Forex "Fix" May Be Rigged](https://www.investopedia.com/articles/forex/031714/how-forex-fix-may-be-rigged.asp) - When it comes to forex, some types of "fixes" are legal. But some really aren't.

23. [Forex scandal - Wikipedia](https://en.wikipedia.org/wiki/Forex_scandal) - The forex scandal (also known as the forex probe) is a 2013 financial scandal that involves the reve...

24. [How Traders Manipulated the FX Market with Chatrooms](https://www.linkedin.com/posts/thomasbraeuer_2013-wmr-fixing-scandal-activity-7363936249088266243-yq0-) - Counterparty risk profile... it includes character. How Traders Colluded to Rig the FX Market At the...

25. [Final Report on Foreign Exchange Benchmarks](https://www.fsb.org/2014/09/r_140930/) - This report sets out reform recommendations for major FX benchmark rates, responding to concerns aro...

26. [Offshore Currency Markets: Non-Deliverable Forwards (NDFs) in ...](https://www.elibrary.imf.org/view/journals/001/2020/179/article-A001-en.xml) - NDFs are foreign exchange forward contracts that do not require physical delivery of the underlying ...

27. [Non-deliverable forward - Wikipedia](https://en.wikipedia.org/wiki/Non-deliverable_forward)

28. [How to use non-deliverable forwards to hedge FX risk - Convera](https://convera.com/blog/cross-border-payments/non-deliverable-forwards-fx-risk-budget-rate-hedging/) - Non-deliverable forwards (NDFs) help investment funds hedge FX risk, safeguard offshore investor ret...

29. [FX Traders: Lovers of the Light - CME Group](https://www.cmegroup.com/articles/2025/fx-traders-lovers-of-the-light.html) - Top-of-book spreads: Despite a 68% increase in EUR/USD volatility, average top-of-book spreads rose ...

30. [Spread Cost Calculator EUR/USD](https://www.pipcalcs.com/en/eur-usd/spread-calculator) - Calculate EUR/USD spread cost in your account currency. Free spread calculator for forex traders. Se...

31. [JPMorgan and Citi FX Hold Up to 80% of eFX Dealing](https://www.financemagnates.com/institutional-forex/brokerage/jpmorgan-and-citi-fx-hold-up-to-80-of-the-efx-market/) - The latest report on the global FX market by Greenwich Associates underscored the dominance of both ...

32. [Liquidity is returning for some G10 currencies, but emerging markets ...](https://www.mufgemea.com/media/liquidity-is-returning-for-some-g10-currencies-but-emerging-markets-are-not-faring-as-well/) - USD/JPY was largely shielded from disruption throughout the crisis, while EUR/USD liquidity (above) ...

33. [FX settlement risk remains significant](https://www.bis.org/publ/qtrpdf/r_qt1912x.htm) - The bankruptcy of Bankhaus Herstatt in 1974 demonstrated how FX settlement risk can undermine financ...

34. [Herstatt Bank - Wikipedia](https://en.wikipedia.org/wiki/Herstatt_Bank) - This payment versus payment (PVP) process enables member banks to trade foreign currencies without a...

35. [FX Settlement Risk | ShapingFX Series - CLS Group](https://www.cls-group.com/insights/the-fx-ecosystem/fx-ecosystem-02-fx-settlement-risk-to-pvp-or-not-to-pvp-shapingfx-series/) - Read our whitepaper focusing on the role of CLS and its payment-versus-payment settlement system in ...

36. [The world's best FX clearing and settlement venue: CLS](https://www.euromoney.com/article/2dpv1vyj13vl7ipcprfgg/awards/foreign-exchange-awards/the-worlds-best-fx-clearing-and-settlement-venue-cls/) - CLS has been steadily expanding and refining its services to meet the diverse needs of the foreign e...

37. [BIS Triennial Survey 2025 | CLSMarketData Insights](https://www.cls-group.com/insights/data-analysis/bis-triennial-survey-2025-clsmarketdata-insights/) - CLSMarketData can be used to understand how the FX market reacts during significant market events.

38. [[PDF] CLS Presentation - Bank of Canada](https://www.bankofcanada.ca/wp-content/uploads/2024/10/cls-presentation.pdf)

39. [CLSNet growth | CLS Group](https://www.cls-group.com/news/clsnet-growth/) - CLSNet growth news page

40. [FX settlement risk: an unsettled issue](https://www.bis.org/publ/qtrpdf/r_qt2212i.htm) - In April 2022, $2.2 trillion of daily FX turnover was subject to settlement risk, up from an estimat...

41. [Forex Trading Industry + Market Statistics [2026 Updated Guide]](https://www.compareforexbrokers.com/trading/statistics/) - View the key facts and statistics around forex trading from the market size to the most popular coun...

42. [Forex Trading Statistics: Foreign Exchange Market Size 2026](https://www.bestbrokers.com/forex-trading/forex-trading-statistics/) - This report provides the latest statistics, updated November 2025, on the global forex trading marke...

43. [What Is A B-Book Broker?](https://www.ebc.com/forex/b-book-broker) - B-Book brokers internalize client trades instead of sending them to the real market. Learn how this ...

44. [Forex Brokerage Business Models - A-Book, B-Book, and Hybrid](https://devexperts.com/blog/a-book-b-book-and-hybrid-models-in-forex-brokerage/) - B-book brokers act as market-makers. By taking the opposite side of their clients' trades, they crea...

45. [A Book vs B Book Brokers: Key Differences Explained - Finery Markets](https://finerymarkets.com/blog/a-book-vs-b-book-brokers-key-differences-explained) - The A Book model operates as a market-neutral system which provides complete transparency to clients...

46. [Altre voci...](https://b2broker.com/news/a-book-vs-b-book-brokers-whats-the-difference/) - Discover the key differences between A-Book vs B-Book brokers. Learn which brokerage model best fits...

47. [MT5 Extends Its Lead Over MT4 as Platform Shift Accelerates](https://www.financemagnates.com/forex/technology/mt5-extends-its-lead-over-mt4-as-platform-shift-accelerates/) - Competition between MT4 and MT5 is intensifying. Data from the latest Finance Magnates Intelligence ...

48. [Exclusive: MT5 Poised to Surpass MT4 in Volume Rankings by 2025](https://www.financemagnates.com/forex/products/exclusive-mt5-poised-to-surpass-mt4-in-volume-rankings-by-2025/) - In Q4 2023, MT4 retained a commanding 65.3% market share, while MT5 held 34.7%. However, this gap ha...

49. [In Q1 of 2025 MT5 Surpassed MT4 in Volume Rankings](https://www.financemagnates.com/forex/products/exclusive-after-15-years-mt5-overtakes-mt4-in-trading-volume-marking-end-of-an-era/) - Finally, It Happened. Just as we predicted in our December article , MetaTrader 5 (MT5) has official...

50. [The Hidden Bias of MetaTrader 4 & 5 in Retail Forex Trading](https://marcabramsky.substack.com/p/the-hidden-bias-of-metatrader-4-and) - MetaTrader’s Monopoly and Broker-Centric Design

51. [70-80% Of Traders Lose Money. Here's How YOU Win](https://phoenixcreedinstitute.com/70-80-of-traders-lose-money-heres-how-you-win/) - Our latest resource, the PCA Notebook, is now available for purchase. It’s packed with valuable insi...

52. [Why do most retail traders fail, and what can I do to ... - FXStreet](https://www.fxstreet.com/education/why-do-most-retail-traders-fail-and-what-can-i-do-to-improve-my-chances-of-success-202503311406) - ESMA Report: It was found that between 74%-89% of retail traders lose money trading CFDs and forex. ...

53. [What Percentage of Forex Traders Lose Money?](https://www.traderslog.com/what-percentage-of-traders-lose-money) - Broker Percentage of Retail Traders that Lose Money: FXOpen 60%, FXCM 63%, Avatrade 63%, Capital.com...

54. [Currency Composition of Official Foreign Exchange ... - IMF Data Brief](https://data.imf.org/en/news/imf%20data%20brief%20jul%209) - The revisions have only marginal impact on total reserves. World Official Foreign Currency Reserves ...

55. [Global Foreign Exchange Reserves](https://leap-insights.org/2025/07/13/global-foreign-exchange-reserves/) - Based on the International Monetary Fund’s Currency Composition of Official ForeignExchange Reserves...

56. [Dollar cedes ground to euro in global reserves, IMF data shows](https://www.reuters.com/business/dollar-cedes-ground-euro-global-reserves-imf-data-shows-2025-07-09/) - The U.S. dollar's share of global currency reserves reported to the International Monetary Fund nudg...

57. [BRICS 2025: Expansion, De-Dollarization, and the Shift ...](https://thedailyeconomy.org/article/brics-2025-expansion-de-dollarization-and-the-shift-toward-a-multipolar-world/) - The expansion of BRICS and its de-dollarization efforts carry significant implications for the Unite...

58. [BRICS and the Shift Away from Dollar Dependence](https://chicagopolicyreview.org/2025/10/08/brics-and-the-shift-away-from-dollar-dependence/) - For nearly a century, the U.S. dollar has dominated global trade and finance, accounting for 59% of ...

59. [The Realistic Path Forward](https://www.jdsupra.com/legalnews/hot-topics-in-international-trade-2591362/) - Could BRICS break the dollar’s grip? The answer is coming into sharper focus, and it’s more complica...

60. [A reality check for BRICS and the lofty dedollarisation agenda](https://www.lowyinstitute.org/the-interpreter/reality-check-brics-lofty-dedollarisation-agenda) - Local currency deals are growing, but a unified challenge to dollar hegemony remains a distant dream...

