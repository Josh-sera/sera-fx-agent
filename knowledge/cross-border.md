# PACK 4 — Cross-Border Payments &amp; Remittance: The Full Stack

**Purpose:** The agent should understand exactly how money moves across borders today — every rail, every intermediary, every pain point — so it can articulate precisely what Sera replaces and why.

**Classification:** Public domain knowledge. No Sera proprietary information.

***

## Section 4.1 — SWIFT &amp; Correspondent Banking

### What SWIFT Actually Is

SWIFT (Society for Worldwide Interbank Financial Telecommunication) is a **messaging network**, not a payment system. This is one of the most commonly misunderstood facts in finance. SWIFT does not move money — it transmits standardized instructions between banks telling them to move money. The actual movement of funds happens through correspondent banking relationships and domestic clearing systems.[^1][^2]

Founded in 1973 and headquartered in Belgium, SWIFT connects over **11,000 financial institutions** across **200+ countries**. It processes approximately **40–50 million messages per day**, but again — these are messages, not payments.[^2]

### SWIFT Message Types

The key message types for understanding cross-border payments are:[^3][^4][^1]

| Message Type | Purpose | Key Details |
|---|---|---|
| **MT103** | Customer credit transfer | The core payment instruction from one bank to another on behalf of a customer. Contains full beneficiary details (name, account, amount, currency). This is what you receive as "proof of payment" |
| **MT202** | Financial institution transfer | Bank-to-bank transfer for the institution's own account or for settlements. Does NOT contain end-customer details. Used for moving funds between correspondent accounts |
| **MT202 COV** | Cover payment | Paired with an MT103 in the "cover method" — the MT103 carries beneficiary details directly to the beneficiary's bank, while the MT202 COV moves funds through intermediary correspondent banks |
| **MT199** | Free-format message | Used for payment investigations, queries, and non-standard communications between banks |

**Critical distinction:** An MT202 alone is NOT proof of payment to an end customer — it only shows bank-to-bank fund movement and lacks beneficiary fields.[^4]

**Two routing methods for SWIFT payments:**[^4]

1. **Serial method:** The MT103 hops bank-to-bank through each correspondent until it reaches the beneficiary's bank. Each bank in the chain sees the full beneficiary details.
2. **Cover method:** The MT103 goes directly from the sending bank to the beneficiary's bank (carrying all details). Simultaneously, an MT202 COV travels through correspondent banks to move the actual funds. Faster for the beneficiary but creates reconciliation complexity.

### ISO 20022 Migration

SWIFT has confirmed **November 2025** as the end of the MT/ISO 20022 coexistence period for cross-border payments. ISO 20022 is a richer, more structured data format that replaces the legacy MT message types. This migration enables better data analytics, improved compliance screening, and enhanced interoperability — but it requires significant system upgrades from all participating banks.[^5]

### SWIFT gpi (Global Payments Innovation)

Launched in 2017, SWIFT gpi was the network's response to criticism about slow, opaque cross-border payments. Key improvements:[^2]

- **Unique End-to-End Transaction Reference (UETR):** Every SWIFT payment carries a tracking ID — like a parcel tracking number — enabling real-time visibility into payment status[^6][^5]
- **Speed:** Nearly **60%** of gpi payments are credited to beneficiaries within 30 minutes; **90%** arrive within one hour; almost **100%** within 24 hours[^7][^2]
- **Transparency:** Banks must provide upfront information on fees, FX rates, and processing times
- **Adoption:** Over **4,450+ financial institutions** use gpi, processing over **$530 billion daily** in value[^2]

While gpi has significantly improved the speed and transparency of SWIFT payments, it is an overlay on existing infrastructure — it doesn't change the underlying correspondent banking mechanics, settlement timing, or pre-funding requirements.

### The Correspondent Banking Model

When money moves across borders, it typically passes through a chain of correspondent banks. Here's how a USD payment from Bangkok to Lagos actually works step-by-step:

1. **Sender** deposits Thai Baht at their bank in Bangkok (Bank A)
2. **Bank A** doesn't have a direct relationship with any Nigerian bank, so it converts THB to USD and sends a SWIFT MT103 to its USD correspondent bank in New York (Bank B)
3. **Bank B** debits Bank A's nostro account and credits the funds to the USD account of a bank that has a relationship with Nigeria (Bank C)
4. **Bank C** sends the USD to a Nigerian correspondent (Bank D) via another SWIFT message
5. **Bank D** converts USD to Nigerian Naira and credits the beneficiary's account at their local bank (Bank E)

Each step involves: a SWIFT message, a debit/credit to nostro/vostro accounts, compliance screening (sanctions, AML), and potential FX conversion. **3–5 intermediary banks** can be involved in a single payment, each taking a fee and adding processing time.

### Nostro/Vostro Account Mechanics

- **Nostro account** ("ours"): An account that a bank holds at a foreign bank, denominated in the foreign currency. Example: Bank A (Thailand) holds a USD account at JPMorgan New York — this is Bank A's nostro account
- **Vostro account** ("yours"): The same account from the foreign bank's perspective. JPMorgan sees Bank A's account as a vostro account

These accounts must be **pre-funded** — Bank A needs to have sufficient USD sitting in its JPMorgan nostro account before it can send a payment. This creates the **pre-funding problem**: billions of dollars in capital trapped in nostro accounts around the world, earning minimal returns, just waiting to facilitate payments.

### De-Risking and the Shrinking Correspondent Banking Network

Correspondent banking relationships have declined by more than **20% since 2013**, a phenomenon known as "de-risking". The trend accelerated dramatically after the US Department of Justice signaled in 2014 that any global transaction threatening the integrity of the US financial system could be tried in a US court.[^8][^9]

**Why banks are cutting correspondent relationships:**
- **Compliance costs:** AML/KYC screening for every transaction in the chain; penalties exceed $1 billion annually globally[^8]
- **Regulatory risk:** BNP Paribas' $8.9 billion fine in 2014 for sanctions violations sent shockwaves through the industry[^10]
- **Low revenue vs. high risk:** Many correspondent relationships — especially with smaller banks in developing countries — generate minimal revenue but carry significant compliance risk
- **Basel III capital requirements:** Make it more expensive to maintain correspondent banking assets[^8]

**The impact is devastating for developing countries:** Research shows that when local banks lose correspondent relationships, their corporate clients experience export declines of up to **57%** within four years. Smaller and younger firms are hit hardest, as they cannot easily switch to other banks. This creates a vicious cycle: de-risking removes financial access, which pushes transactions into informal channels, which increases actual money laundering risk.[^9]

### SWIFT's Response to Crypto/Stablecoin Threats

SWIFT has taken several steps to defend its position:
- Launched blockchain connectivity experiments (Project Ion) to link multiple DLTs
- Developed tokenized asset settlement capabilities
- Enhanced gpi for near-real-time tracking
- Partnered with Chainlink for cross-chain interoperability
- Built Swift Connector to bridge traditional finance and blockchain networks

However, SWIFT's fundamental architecture — messaging that triggers correspondent bank settlements — remains unchanged. The system still requires pre-funded nostro accounts, still operates on banking hours, and still involves multiple intermediaries for most corridors.

***

## Section 4.2 — Domestic Payment Rails

### Real-Time Payment Systems

A revolution in domestic payments has occurred over the past decade, with countries deploying instant payment infrastructure. The irony is stark: domestic payments in many countries settle in seconds, while the same money moving cross-border can take days.

| System | Country | Launch | Key Stats |
|---|---|---|---|
| **UPI** | India | 2016 | 3,000+ TPS at peak; <30% adult penetration but growing rapidly; free for consumers[^11] |
| **PIX** | Brazil | 2020 | 80%+ adult population using it; 24/7/365; free for individuals; QR-code driven[^11] |
| **FedNow** | United States | 2023 | 700+ financial institutions; still early adoption; complements existing RTP by The Clearing House[^12] |
| **Faster Payments** | United Kingdom | 2008 | Pioneer of real-time payments; £1M limit; near-universal bank participation |
| **PayNow** | Singapore | 2017 | Linked to mobile numbers/NRIC; cross-border linkage with Thailand's PromptPay |
| **FPX** | Malaysia | 2004 | Online banking-based; real-time bank transfers; widely used for e-commerce |
| **PromptPay** | Thailand | 2017 | National ID or mobile number-based; QR payments ubiquitous; linked to Singapore PayNow |
| **SEPA Instant** | EU | 2017 | Cross-border within EU; €100,000 limit; 10-second settlement target |
| **GCash/InstaPay** | Philippines | 2018 | InstaPay is the central infra; GCash/Maya are dominant mobile wallets |

### How PIX and UPI Compare

PIX and UPI share core design principles — instant settlement, mobile-first UX, free for consumers — but differ in architecture:[^11]

- **PIX** uses cross-settlement (full transaction volumes processed, even between same institutions), while **UPI** uses net-settlement (only balances settle between institutions)
- **PIX** is accessed via bank apps directly; **UPI** is primarily accessed through third-party payment apps (PhonePe, Google Pay, Paytm) that connect to bank accounts
- **PIX** already has 80%+ adult population penetration in Brazil; **UPI** has under 30% penetration in India despite higher transaction counts[^11]

### FedNow — The Late Arrival

The United States launched FedNow in July 2023, making it a latecomer to real-time payments. Before FedNow, instant payments made up only about **1%** of overall US money transfers. FedNow is a Federal Reserve initiative designed to be accessible to any financial institution regardless of size — unlike The Clearing House's RTP, which is owned by a consortium of large commercial banks.[^12]

As of 2025, FedNow has connected **700+ financial institutions**, but adoption remains early-stage compared to PIX and UPI, partly due to legacy infrastructure, lack of merchant demand, and consumer habits built around card payments.[^13][^12]

### QR-Based Payment Ecosystems in Asia

Southeast Asian countries have built interconnected QR payment systems:
- **Singapore PayNow** ↔ **Thailand PromptPay** (bilateral linkage live since 2021)
- **Malaysia DuitNow QR** ↔ **Thailand PromptPay** (cross-border QR)
- **Indonesia QRIS** — standardized QR for all payment providers
- Plans for ASEAN-wide QR interoperability

These systems demonstrate that cross-border instant payments are technically feasible — but they're still built on bilateral agreements between central banks and operate within limited corridors.

### Mobile Money in Africa

In sub-Saharan Africa, mobile money has leapfrogged traditional banking:
- **M-Pesa** (Safaricom, Kenya): The original mobile money success story; 50M+ users; enables P2P transfers, bill payments, savings, and merchant payments via SMS/USSD
- **MTN Mobile Money**: Active across West and Central Africa; 60M+ active users
- **Airtel Money**: Strong presence in East Africa and India

Mobile money accounts exceed bank accounts in many African countries, making these networks critical for remittance "last mile" delivery.

### Why Domestic Instant But Cross-Border Slow

The fundamental disconnect: a PIX payment in Brazil settles in 2 seconds, but sending money from Brazil to the Philippines takes 2–5 days and costs 6–10%. The reasons:

1. **No shared infrastructure:** Each country's instant payment system is sovereign; there's no global equivalent
2. **FX conversion:** Cross-border payments require currency conversion, which introduces FX risk and intermediaries
3. **Compliance layering:** Each jurisdiction has different AML/KYC requirements; every intermediary re-screens
4. **Time zone mismatches:** Banking hours differ; cut-off times create delays
5. **Correspondent banking:** The money still moves through the correspondent chain, even when both endpoints have instant domestic rails

***

## Section 4.3 — Remittance Industry

### Market Size

Global remittance flows reached an estimated **$905 billion** in 2024, up 4.6% from $865 billion in 2023. Remittance flows to low- and middle-income countries (LMICs) specifically reached an estimated **$685 billion** in 2024, growing 5.8% year-over-year.[^14][^15]

The World Bank forecasts remittance flows to LMICs to reach **$690 billion** in 2025, with growth driven by widening income disparities, demographic pressures, regional conflicts, and climate migration. Worldwide, **one billion people** (one in eight) rely on remittance services every year.[^16][^14]

**Top 5 recipient countries (2024 estimates):**[^15]

| Country | Inflow | Key Corridors |
|---|---|---|
| India | $129 billion | Gulf states, US, UK, Singapore |
| Mexico | $68 billion | United States (dominant) |
| China | $48 billion | Global diaspora |
| Philippines | $40 billion | Gulf states, US, Singapore, Hong Kong |
| Pakistan | $33 billion | Gulf states, UK, US |

### The 6.49% Average Cost Problem

The global average cost of sending $200 in remittances was **6.49%** in Q1 2025 — a sizable figure that falls far short of the **UN Sustainable Development Goal (SDG) target of 3%** by 2030.[^17][^18]

**Cost varies dramatically by corridor and channel:**[^18][^19]

| Channel / Region | Average Cost (sending $200) |
|---|---|
| **Global average** | 6.49% |
| **From G8 countries** | 5.99% |
| **To Sub-Saharan Africa** | 8.78% (most expensive region) |
| **From South Africa** | 15.23% (most expensive G20 sender) |
| **From Brazil** | 9.96% |
| **Digital MTO (all payout methods)** | 4.9% |
| **Via mobile operators** | ~3% |
| **Bank-to-bank (same bank)** | 13.46% |
| **Sending to bank account** | 7.99% |

The cost of sending $200 is significantly higher as a percentage than sending $500, meaning the poorest senders — making small, frequent transfers — pay the highest relative cost.[^19]

### How Wise (TransferWise) Works

Wise, founded in 2011 by Kristo Käärmann and Taavet Hinrikus, disrupted cross-border payments with a simple insight: **money doesn't need to actually cross borders**.[^20][^21][^22]

**The model:**
1. User wants to send EUR from Germany to GBP in the UK
2. User sends EUR to Wise's German bank account
3. Wise pays the recipient from its UK bank account in GBP
4. The EUR that came in from the German sender is used to pay out a different user who needs EUR

This "pooling" or P2P matching approach means Wise uses **local bank transfers** on both ends — avoiding correspondent banking fees and FX markups entirely. When there's no matching counterparty, Wise buys the missing currency from the interbank market at the mid-market rate.[^21][^20]

**Key economics:**
- Charges a transparent fee starting at **0.35%** (varies by corridor and currency)[^22]
- Uses the **mid-market exchange rate** from Reuters with zero markup[^20]
- Claims to be **8x cheaper** than traditional banks on average[^23]
- Processed over $65 billion in 2021; now serves 10M+ customers[^22]
- Revenue model: transaction fees (0.6–0.7% average) + float on multi-currency accounts[^23]

### How Remitly Works

Remitly is a digital-first remittance company that went public in 2021 (NASDAQ: RELY). It focuses on mobile-first cross-border transfers with an emphasis on speed and reliability.[^24][^25]

**Q1 2025 performance:**[^24]
- Revenue: **$361.6 million** (+34% YoY)
- Send volume: **$16.2 billion** (+41%)
- Active customers: **8.0 million** (+29%)
- First quarterly profit since IPO: **$11.4 million** net income
- **93% of transactions** settle in under one hour
- **95% of customers** resolve issues without contacting support

Remitly's model relies on direct integrations with banks, mobile wallets, and cash pickup networks in destination countries. It's particularly strong in the US→Philippines, US→Mexico, and Europe→Africa corridors. For FY 2024, Remitly surpassed $1 billion in annual revenue for the first time, with 2025 guidance targeting $1.57–1.58 billion.[^26][^25]

### MoneyGram and the Stellar/USDC Integration

MoneyGram, one of the world's largest money transfer companies, has been the most aggressive legacy player in integrating stablecoin technology.[^27][^28]

**Key milestones:**
- 2021: Partnered with Stellar Development Foundation to integrate the Stellar blockchain into MoneyGram's network
- 2021: Launched a pilot enabling cash-in and cash-out via Stellar USDC at MoneyGram locations
- 2023: Announced a non-custodial digital wallet in partnership with Stellar/SDF
- Users can deposit cash at MoneyGram locations → convert to USDC on Stellar → send globally → recipient cashes out at any MoneyGram location in 180+ countries[^29][^30]
- Settlement with MoneyGram via USDC is near-instantaneous, compared to the traditional batch settlement process[^28]

MoneyGram was previously a Ripple/XRP partner but shifted its blockchain strategy toward Stellar/USDC after Ripple's SEC challenges.

### Western Union — Legacy Model Under Pressure

Western Union remains the largest remittance company by brand recognition and physical network, but faces structural challenges:[^31][^32]

- **Q2 2025:** GAAP revenue fell to $1.03 billion, a **4% decline** year-over-year[^32]
- CMT (Consumer Money Transfer) transactions declined **3%**[^33]
- Branded digital business grew **6%** in revenue and **9%** in transactions — but digital still accounts for only **29% of CMT revenue**[^34]
- "Evolve 2025" strategy aims to digitize 30% of CMT revenue[^32]
- Q3 2025: CMT revenues fell 6% to $878M; branded digital revenues rose 7%[^35]
- Full-year 2025 GAAP revenue guidance: $4.1–4.2 billion[^35]
- Launched "V Go" digital wallet in US; exploring stablecoin infrastructure[^33]

Western Union's challenge is classic innovator's dilemma: its 500,000+ agent locations globally are both its greatest asset (cash pickup network) and its greatest liability (high fixed costs, declining foot traffic).

### Informal Channels — Hawala and Beyond

A significant portion of remittances flow through informal, unlicensed channels — particularly in Africa, South Asia, and the Middle East.[^36][^37]

**How hawala works:** A sender gives cash to a hawaladar (broker) in the sending country. The hawaladar contacts a counterpart in the receiving country, who pays out the equivalent amount to the recipient in local currency. No actual money crosses borders. The hawaladars settle their mutual obligations later through trade invoicing, gold transfers, or reverse flows.[^37]

**Why informal channels persist:**
- **Cheaper:** No formal compliance costs, no FX spread markup
- **Faster:** Settlement can happen within hours
- **Accessible:** No bank account, ID requirements, or forms needed
- **Trust-based:** Built on community relationships and reputation
- **Favorable rates:** Operate on parallel market exchange rates (often better than official rates in countries with capital controls)[^37]

Estimates suggest informal remittances could account for **as much as 50%** of total formal remittance volumes in some African corridors. In countries with capital controls or parallel exchange rate markets (e.g., Nigeria, previously Myanmar), the informal share is even higher.[^36]

### Binance P2P and Crypto-Native Remittance

Binance P2P and similar crypto platforms have become de facto remittance channels in markets with restricted financial access or unfavorable official exchange rates. Users in countries like Nigeria, Turkey, Argentina, and Venezuela use P2P platforms to:

1. Buy stablecoins (USDT typically) at the market rate using local currency
2. Send stablecoins to a recipient in another country (or even domestically)
3. Recipient sells stablecoins for local currency on the P2P market

This bypasses the formal banking system entirely, avoids correspondent banking fees, and often provides better exchange rates than official channels. The trade-off is regulatory risk and counterparty risk on the P2P platform.

***

## Section 4.4 — The Pain Points Stack

### 1. Pre-Funding and Trapped Liquidity

Banks must maintain pre-funded nostro accounts in every currency they need to settle in. JPMorgan alone holds over **$600 billion** in deposits from other banks. Globally, the correspondent banking system requires **trillions of dollars** in trapped liquidity sitting in nostro accounts, earning minimal returns, just to keep cross-border payments operational.

For smaller banks and payment companies, pre-funding requirements are especially burdensome — they must tie up scarce capital in multiple currencies across multiple jurisdictions.

### 2. FX Markup (Hidden Fees)

Many remittance providers and banks advertise "zero fee" transfers while embedding a 2–5% markup in the exchange rate. The customer sees a single number and doesn't realize they're paying a significant hidden fee through an inflated FX spread. This practice is so pervasive that Wise built its entire brand around exposing it.

### 3. Compliance Friction

Every intermediary in the correspondent banking chain performs its own AML/KYC screening. A single payment might be screened 3–5 times as it passes through different banks, each with different sanctions lists, different risk models, and different compliance standards. This creates:
- Delays (payments held for manual review)
- False positives (legitimate payments flagged and delayed)
- Data requests (intermediary banks asking for additional documentation)
- Costs (compliance staff, screening systems, regulatory reporting)

### 4. Cut-Off Times and Banking Hours

Cross-border payments are bound by banking hours in each jurisdiction. If a payment arrives after the cut-off time for same-day processing, it waits until the next business day. Weekend and holiday schedules differ by country, creating additional delays. A payment initiated Friday afternoon in Asia might not begin processing in New York until Monday morning.

### 5. Failed Payments and Returns

Approximately **6–8% of cross-border payments** fail on the first attempt due to incorrect beneficiary details, compliance holds, or routing issues. Failed payments must be investigated, corrected, and resubmitted — a process that can take days to weeks and generates significant operational costs.

### 6. Lack of Transparency and Tracking

Despite SWIFT gpi improvements, many payments still lack real-time tracking — especially those routed through smaller banks or older systems that haven't adopted gpi. Senders and recipients often have no visibility into where their money is or when it will arrive.

### 7. The "Last Mile" Problem

Even after money successfully traverses the correspondent banking chain, getting it to the final recipient can be challenging in cash-dependent economies. Recipients may need to physically visit an agent location, provide identification, and collect cash — a process that can involve travel, waiting times, and security risks.

### 8. Regulatory Fragmentation

Each jurisdiction has different rules for: maximum transfer amounts, required documentation, beneficial ownership requirements, sanctions screening, tax reporting, and consumer protection. Payment providers must navigate a patchwork of regulations that increases costs and limits the number of corridors they can serve.

***

## Section 4.5 — Emerging Alternatives

### Stablecoin-Based Cross-Border Payments

The end-to-end flow for a stablecoin-based cross-border payment works as:

1. **On-ramp:** Sender converts local currency to a stablecoin (USDC, USDT) via a licensed on-ramp (exchange, neobank, OTC desk)
2. **Transfer:** Stablecoin is sent on-chain from sender's wallet to recipient's wallet — settles in seconds, 24/7/365, with no intermediaries
3. **Off-ramp:** Recipient converts stablecoin to local currency via a licensed off-ramp (local exchange, mobile money agent, bank integration)

**What this eliminates:**
- Correspondent banking chain (no intermediaries)
- Pre-funded nostro accounts (settlement is instant and atomic)
- FX markup (can use on-chain DEX rates or transparent OTC quotes)
- Banking hours (blockchain operates 24/7)
- T+2 settlement (settles in seconds)

**What challenges remain:**
- On/off-ramp availability and licensing in each jurisdiction
- FX conversion still required (stablecoins are typically USD-denominated)
- Regulatory uncertainty in many markets
- User experience and education
- Liquidity for non-USD stablecoin pairs

### Bridge (Acquired by Stripe for $1.1 Billion)

In October 2024, Stripe announced the acquisition of **Bridge** for **$1.1 billion** — the largest crypto acquisition by a major payments company. Bridge, co-founded by Coinbase and Square alumni Zach Abrams and Sean Yu, built an API that helps companies accept and process stablecoins.[^38][^39]

**What Bridge built:**[^40]
- API-based stablecoin payment platform — companies integrate a small amount of code to gain full stablecoin payment capabilities
- Supports USDC, PYUSD, USDT and enables creation of new stablecoins
- Processed over $5 billion in annualized payment volume as of July 2024
- Raised $58 million from Sequoia, Index Ventures, and others at a $200 million valuation

**Why Stripe paid $1.1 billion:**[^39][^40]
- Stripe's CEO Patrick Collison called stablecoins "room-temperature superconductors for financial services"
- Stablecoins reached $173 billion market cap by late 2024, with massive growth in cross-border usage
- Bridge gives Stripe immediate stablecoin infrastructure capability
- Acquisition valued at 5.5x the Series A valuation, likely over 100x revenue[^40]
- Stripe (valued at ~$70 billion) positions stablecoin integration as a core payment rail alongside cards and bank transfers[^41]

### Thunes + Circle Partnership

In October 2024, **Thunes** (a cross-border payment infrastructure provider connecting 130+ countries) announced a strategic collaboration with **Circle** (USDC issuer) to launch stablecoin-powered liquidity management.[^42][^43]

**How it works:**
- Members of Thunes' Direct Global Network can fund and execute cross-border transactions using USDC
- Enables faster transfers in seconds, seven days a week
- USDC settlement boosts liquidity and reduces capital costs for network members
- Replaces pre-funded nostro accounts with real-time USDC-based settlement[^42]

Thunes' CEO Floris de Kort: *"Settlements made with stablecoins provide exactly these four things: accessible, fast, safe, and cost-effective"*.[^42]

### Visa Stablecoin Settlement Program

In December 2025, **Visa** launched **USDC settlement in the United States**, marking a major milestone in integrating stablecoins into mainstream payment infrastructure.[^44][^45]

**Key details:**
- U.S. issuers and acquirers can settle Visa obligations in USDC instead of fiat
- Initial banking partners: **Cross River Bank** and **Lead Bank**, settling via USDC on the **Solana blockchain**
- **7-day settlement windows** instead of the traditional 5-business-day window
- Automated treasury operations and blockchain infrastructure integration
- Annualized stablecoin settlement volume exceeded **$3.5 billion** as of November 2025[^46]
- Visa is a design partner for Circle's **Arc** blockchain (Layer 1), planning to use it for USDC settlement and operate a validator node[^44]
- Broader U.S. availability planned through 2026

Visa's Head of Growth Products: *"Financial institutions are looking for faster, programmable settlement options that integrate seamlessly with their existing treasury operations"*.[^44]

### Ripple/XRP Ledger Approach

Ripple's **On-Demand Liquidity (ODL)** service (now rebranded as **Ripple Payments**) uses XRP as a bridge currency for cross-border settlement:[^47][^48]

**How ODL works:**
1. Sending institution converts fiat to XRP
2. XRP transfers across the XRP Ledger in 3–5 seconds
3. Receiving institution converts XRP to local fiat currency

**Current status:**
- Ripple works with **300+ financial institutions** including SBI Holdings, Santander, and Tranglo[^47]
- ODL handled **$1.3 billion** in payments during Q2 2025[^47]
- Active in corridors: Japan→Philippines, Middle East, Brazil, Portugal→Latin America[^48]
- Claims **70% cost reduction** in high-volume corridors[^48]

**Limitations:**
- Many partners use RippleNet's messaging system without actually using XRP for settlement[^47]
- XRP price volatility introduces risk during the conversion window
- Regulatory uncertainty (SEC case, though largely resolved in 2025)
- Ripple and founders control a large portion of XRP supply (36B in escrow)[^47]
- ODL volume ($1.3B/quarter) is minuscule compared to SWIFT ($530B+/day)

### Stellar/USDC with MoneyGram

The Stellar blockchain has carved out a niche as a remittance-focused blockchain through its partnership with MoneyGram:[^30][^27][^28]

- Users can convert cash to Stellar USDC at MoneyGram locations globally
- USDC on Stellar provides near-instant, low-cost transfers
- MoneyGram's presence in **180+ countries** gives the Stellar/USDC combination a massive physical distribution network
- Primary use case: enabling unbanked populations to access digital dollars through cash-in/cash-out at familiar MoneyGram locations

### Why Stablecoins Are Winning in Specific Corridors

Stablecoin-based cross-border payments are gaining traction fastest in corridors where:

1. **High costs:** Corridors to Sub-Saharan Africa (8.78% average cost) and between emerging markets
2. **Capital controls:** Countries where official exchange rates diverge significantly from market rates (Nigeria, Argentina, previously Myanmar)
3. **Limited banking access:** Underbanked populations that have smartphone access but no bank account
4. **Speed requirements:** Business payments that cannot wait for T+2 or longer settlement
5. **Weekend/holiday needs:** Payments required outside banking hours
6. **Dollar demand:** Emerging market populations seeking USD-denominated savings and transfer mechanisms

The growth is structural, not speculative. Stablecoin settlement volume has surpassed Visa's annual transaction volume, and institutional adoption (Stripe, Visa, Thunes, MoneyGram) signals that stablecoins are transitioning from crypto-native experimentation to mainstream payment infrastructure.

***

## Agent Instruction Footer

### Guardrails for Agent Behavior

When using this knowledge base, the agent MUST:

1. **Never present information as Sera-proprietary.** Everything in this pack is public domain knowledge.

2. **Be precise about SWIFT.** SWIFT is a messaging network, not a payment system. Saying "send money via SWIFT" is technically imprecise — SWIFT sends instructions; correspondent banks move the money.

3. **Use current remittance data.** The World Bank's Remittance Prices Worldwide (Issue 53, March 2025) is the latest source. Global average cost: 6.49%. Always note this is for $200 transfers — costs differ for larger amounts.

4. **Acknowledge progress alongside problems.** SWIFT gpi has genuinely improved speed and transparency. Don't paint the legacy system as entirely broken — rather, explain the structural limitations that remain even with improvements.

5. **Don't oversimplify hawala.** Informal remittance channels serve legitimate needs for underbanked populations. They persist because they're cheaper, faster, and more accessible — not solely because of illicit use.

6. **Credit specific innovations correctly.** Bridge was acquired by Stripe (not built by Stripe). Visa's stablecoin settlement uses USDC on Solana. Thunes is the infrastructure partner; Circle is the USDC issuer. MoneyGram works with Stellar, not Ripple (anymore).

7. **Be honest about stablecoin limitations.** On/off-ramp availability, regulatory uncertainty, and USD-denomination bias are real challenges. Don't present stablecoins as a solved problem — present them as a structural improvement with remaining friction.

8. **Frame the opportunity quantitatively.** $905B annual remittances, 6.49% average cost, $2.2T daily FX at settlement risk, 20%+ decline in correspondent banking relationships — these numbers tell the story.

### Suggested Agent Behaviors

- When asked about cross-border payments → Start with the correspondent banking model (how money actually moves), then explain why it's slow/expensive, then position alternatives
- When asked "why are remittances so expensive?" → Break down the cost stack: FX markup, compliance costs, intermediary fees, last-mile delivery costs, pre-funding costs
- When asked about Wise → Explain the pooling model (money never crosses borders), mid-market rate with transparent fee, and why traditional banks can't easily replicate it
- When asked about stablecoin payments → Walk through the full on-ramp → transfer → off-ramp flow, noting what's eliminated (correspondents, pre-funding, banking hours) and what remains (on/off-ramp, FX conversion, regulation)
- When asked about Bridge/Stripe → Emphasize the "API-first" stablecoin integration thesis and why the largest payment company in the world paying $1.1B signals institutional conviction
- When asked about Visa USDC → Highlight the $3.5B annualized volume, 7-day settlement, and the fact that consumer experience doesn't change — only the backend settlement rail

***

*Pack 4 Complete. Ready for OpenClaw ingestion.*
*Phase 1 (Foundation) now complete: Pack 3 + Pack 4 delivered.*
*Next up: Phase 2 — Pack 1 (Stablecoins: The Complete Picture)*

---

## References

1. [MT202 - An inter-bank payment messaging system - Money Moverwww.moneymover.com › about › faqs › what-mt202](https://www.moneymover.com/about/faqs/what-mt202) - An MT202 is a standardised SWIFT payment message used to instruct the transfer of funds between fina...

2. [What are the limitations of...](https://www.thunes.com/insights/learn/swift-gpi-cross-border-payments/) - Explore how Swift GPI is reshaping global payments, its limitations, future trends, and how Thunes e...

3. [MT202 SWIFT Explained: Bank-to-Bank Transfers, Benefits, and Differences from MT103](https://bankingdigits.com/2024/07/08/mt202-swift-explained-bank-to-bank-transfers-benefits-and-differences-from-mt103/) - What is MT202 SWIFT? The MT202 is a standardized format used for transferring funds between financia...

4. [SWIFT message types decoded: MT202 vs MT103 for freelancers](https://www.karboncard.com/blog/swift-message-types-mt202-mt103) - Learn SWIFT message types: SWIFT MT202 vs MT103 explained, mt202 meaning, bank-to-bank transfers, pr...

5. [The State of Cross-Border Payments in 2025: Legacy Rails, New ...](https://www.fintechtris.com/blog/the-state-of-cross-border-payments-in-2025) - In this report, we break down how international payment rails are evolving, who's competing to move ...

6. [Swift GPI: driving a payments revolution](https://www.swift.com/news-events/news/swift-gpi-driving-payments-revolution) - Our new report sheds light on how Swift GPI has reshaped the cross-border payments landscape and the...

7. [Swift GPI | Swift](https://www.swift.com/products/swift-gpi) - Transform cross-border payments with Swift GPI. Meet client’s needs for speed, traceability, and tra...

8. [Correspondent Banking in 2025: Shrinking Networks, Rising ...](https://balasubramaniam675791.substack.com/p/correspondent-banking-in-2025-shrinking) - Correspondent Banking in 2025: Shrinking Networks, Rising Risks

9. [The impact of de-risking by correspondent banks on ...](https://cepr.org/voxeu/columns/impact-de-risking-correspondent-banks-international-trade) - The sharp decline in correspondent banking over the past decade has raised concerns that the associa...

10. [Managing AML Risks in Correspondent Banking Without ...](https://amlwatcher.com/blog/money-laundering-risks-correspondant-banking/) - Practical controls for correspondent banking that improve visibility across payment chains, align wi...

11. [Comparing RTP systems: Pix, UPI, and FedNow](https://paymentscmi.com/insights/comparing-pix-upi-fednow/) - Pix and UPI share the same basic precepts of RTP systems (instant payments and interconnectivity bet...

12. [Bridging the Instant Payment Divide: How FedNow Could ...](https://payspacemagazine.com/articles/bridging-the-instant-payment-divide-how-fednow-could-emulate-upi-and-pix/) - While FedNow is a rapidly expanding instant payment network in the U.S., we cannot help but wonder h...

13. [Hyperswitch | Global Payments: Unpacking User Experiences in FedNow, Pix, and UPI](https://www.hyperswitch.io/blogs/a2a-payment-experience-fednow-vs-pix-vs-upi) - Hyperswitch | Global Payments: Unpacking User Experiences in FedNow, Pix, and UPI

14. [Key trends within the $905 billion peer-to-peer cross-border market - Visa](https://globalclient.visa.com/visa-direct-remittances-report-2025)

15. [In 2024, remittance flows to low- and middle-income countries are ...](https://blogs.worldbank.org/en/peoplemove/in-2024--remittance-flows-to-low--and-middle-income-countries-ar) - Officially recorded remittances to low- and middle-income countries (LMICs) are expected to reach $6...

16. [The Fed - Global Remittances Cycle - Federal Reserve Board](https://www.federalreserve.gov/econres/notes/feds-notes/global-remittances-cycle-20250227.html) - The World Bank forecasts that remittance flows to LMICs will grow by 2.3% in 2024 and 2.8% in 2025, ...

17. [Homepage | Remittance - World Bank](https://remittanceprices.worldbank.org)

18. [[PDF] Remittance Prices Worldwide - Issue 49, March 2024 - World Bank](https://remittanceprices.worldbank.org/sites/default/files/rpw_main_report_and_annex_q125_1_0.pdf)

19. [Understanding cost patterns in remittance corridors of sub- ...](https://www.resbank.co.za/content/dam/sarb/what-we-do/payments-and-settlements/cross-border-payments-conference/documents/paper-cost-patterns-remittance.pdf)

20. [Wise Exchange Rate: What is the Cost for Transferring Money?](https://currencyshop.org/wise-exchange-rate/) - Unlock the secrets of Wise's unbeatable exchange rates & why banks can't compete! Find the trick to ...

21. [How Wise (formerly TransferWise) Works | Blog - RemitFinder](https://www.remitfinder.com/blog/how-transferwise-works) - Wise uses a peer-to-peer platform for its service. That means your payment will be matched at the mi...

22. [TransferWise Business Model: Working & Revenue Model!](https://www.apptunix.com/blog/transferwise-business-model/) - Explore everything about TransferWise's business model & how TransferWise works and makes money. Rea...

23. [Business Model Canvas – Wise](https://lumosbusiness.com/business-model-canvas-transferwise/) - Transferwise (Wise) is a borderless, digital-only currency exchange platform ... this is very unique...

24. [Remitly's Q1 2025 Surge: Profitability and Growth Take Center Stage](https://www.ainvest.com/news/remitly-q1-2025-surge-profitability-growth-center-stage-2505/) - Remitly’s Q1 2025 Surge: Profitability and Growth Take Center Stage

25. [Remitly's billion-dollar year: CEO Matt Oppenheimer on 2024](https://www.fxcintel.com/research/reports/ct-remitly-fy-2024-earnings)

26. [What is Growth Strategy and Future Prospects of Remitly Global ...](https://portersfiveforce.com/blogs/growth-strategy/remitly) - World Bank projections show remittance flows to low- and middle-income countries rising modestly in ...

27. [MoneyGram and Stellar partner to offer stablecoin remittance](https://www.forbesindia.com/article/crypto-made-easy/moneygram-and-stellar-partner-to-offer-stablecoin-remittance/76831/1) - MoneyGram International and Stellar blockchain have come together to allow its users to send UDC sta...

28. [MoneyGram International Launches a New Pilot on Stellar](https://stellar.org/blog/ecosystem/moneygram-international-launches-a-new-pilot-on-stellar) - The Stellar network is an open-source blockchain for payments & asset tokenization. Stellar offers t...

29. [Moneygram to launch crypto wallet including for cross border ...](https://www.ledgerinsights.com/moneygram-crypto-wallet-fcross-border-payments/) - Moneygram plans to launch a cryptocurrency wallet in early 2024 to enable people to send cross borde...

30. [MoneyGram Ramps: One Integration, Cash Access - Stellar](https://stellar.org/products-and-tools/moneygram) - Leverage USDC on Stellar. Use one of the fastest-growing digital dollar stablecoins for near instant...

31. [Western Union's Q1 2025 Revenue Decline: Navigating Challenges ...](https://www.ainvest.com/news/western-union-q1-2025-revenue-decline-navigating-challenges-seizing-opportunities-shifting-financial-landscape-2504/) - Western Union's Q1 2025 Revenue Decline: Navigating Challenges and Seizing Opportunities in a Shifti...

32. [Western Union's Struggle to Stay Relevant in the Digital Payments ...](https://www.ainvest.com/news/western-union-struggle-stay-relevant-digital-payments-revolution-2510/) - Western Union's Struggle to Stay Relevant in the Digital Payments Revolution

33. [Earnings call transcript: Western Union Q2 2025 sees digital growth amid challenges](https://www.investing.com/news/transcripts/earnings-call-transcript-western-union-q2-2025-sees-digital-growth-amid-challenges-93CH-4287527) - Earnings call transcript: Western Union Q2 2025 sees digital growth amid challenges

34. [Western Union sees digital growth as core markets slow in Q1 2025](https://www.fxcintel.com/research/analysis/ct-western-union-q1-2025-earnings)

35. [Western Union Investor Day 2025: Beyond plan, digital growth](https://www.fxcintel.com/research/reports/ct-western-union-investor-day-2025) - The company reaffirmed its full-year outlook for 2025, with GAAP revenue expected to be between $4.1...

36. [Informal remittance is still common in East Africa and is ...](https://www.fsdkenya.org/blogs-publications/informal-remittance-is-still-common-in-east-africa-and-is-moving-with-the-times/)

37. [Informal Funds Transfer Systems](https://documents1.worldbank.org/curated/en/410351468765856277/pdf/multi0page.pdf)

38. [Stripe makes $1.1B crypto bet as it closes on Bridge acquisition](https://techcrunch.com/2025/02/05/stripe-makes-1-1-billion-crypto-bet-as-it-closes-on-bridge-acquisition/) - Stripe has closed on its $1.1 billion purchase of stablecoin platform Bridge — marking the payment g...

39. [Stripe announces $1.1 billion acquisition of stablecoin start-up Bridge](https://fortune.com/crypto/2024/10/22/stripe-announces-1-1-billion-acquisition-of-stablecoin-start-up-bridge/) - Bridge seeks to help financial institutions seamlessly integrate stablecoin technology.

40. [Stripe is acquiring Bridge for $1.1 billion the most strategically ...](https://architectpartners.com/stripe-is-acquiring-bridge-for-1-1-billion-the-most-strategically-important-transaction-since-the-emergence-of-crypto/) - Delivering outstanding results requires senior leadership and relentless focus. Architect helps lead...

41. [Stripe closes $1.1 billion Bridge deal, prepares for stablecoin push](https://www.cnbc.com/2025/02/04/stripe-closes-1point1-billion-bridge-deal-prepares-for-stablecoin-push-.html) - Stripe has closed its acquisition of Bridge Network, and executives are gearing up to make a big spl...

42. [Thunes & Circle to Launch Stablecoin Liquidity Solution](https://www.circle.com/pressroom/thunes-and-circle-to-launch-stablecoin-powered-liquidity-management-solution) - The alliance empowers Members of Thunes' Direct Global Network to fund and execute cross-border tran...

43. [Thunes and Circle to Launch Stablecoin-powered Liquidity Management Solution - Silicon UK](https://www.silicon.co.uk/press-release/thunes-and-circle-to-launch-stablecoin-powered-liquidity-management-solution) - Thunes, the Smart Superhighway to move money around the world, today announced a strategic collabora...

44. [Visa Launches Stablecoin Settlement U.S.](https://corporate.visa.com/en/sites/visa-perspectives/newsroom/visa-launches-stablecoin-settlement-in-the-united-states.html) - With more than $3.5B in annualized stablecoin settlement volume , Visa brings USDC settlement to U.S...

45. [Visa expands USDC stablecoin settlement to US financial institutions](https://www.investing.com/news/company-news/visa-expands-usdc-stablecoin-settlement-to-us-financial-institutions-93CH-4410352) - Visa expands USDC stablecoin settlement to US financial institutions

46. [Visa Launches Stablecoin Settlement in U.S.](https://www.morningstar.com/news/dow-jones/202512164549/visa-launches-stablecoin-settlement-in-us)

47. [DAS Research Paper Says Ripple Positioning XRP as Key ...](https://thecryptobasic.com/2025/12/12/das-research-paper-says-ripple-positioning-xrp-as-key-infrastructure-for-global-payments/) - A report from Digital Asset Solutions (DAS) explains how Ripple continues to push XRP toward becomin...

48. [Ripple's Strategic Position in the Evolving Cross-Border ...](https://www.ainvest.com/news/ripple-strategic-position-evolving-cross-border-payments-ecosystem-2510/) - Ripple's Strategic Position in the Evolving Cross-Border Payments Ecosystem

