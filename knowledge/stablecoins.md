# PACK 1 — Stablecoins: The Complete Picture

**Purpose:** The agent should know stablecoins better than anyone in the room.

**Classification:** Public domain knowledge. No Sera proprietary information.

***

## Section 1.1 — Foundations

### What a Stablecoin Actually Is

A stablecoin is a digital token designed to maintain a stable value relative to a reference asset — typically the US dollar. Unlike Bitcoin or Ethereum, which fluctuate freely, stablecoins attempt to hold a 1:1 peg through various mechanisms.

**Stablecoins vs. adjacent concepts:**

| Concept | What It Is | Key Difference from Stablecoins |
|---|---|---|
| **Stablecoin** | Privately issued digital token, pegged to fiat, on public blockchain | Permissionless, runs on existing blockchains, issued by private companies |
| **CBDC** | Central bank-issued digital currency | Sovereign liability, issued and controlled by central bank, may use private/permissioned ledger |
| **E-money** | Digitally stored monetary value (PayPal balance, Revolut balance) | Regulated as stored value, not on public blockchain, redeemable at par for fiat |
| **Tokenized deposit** | Bank deposit represented as a token on blockchain | Bank liability, covered by deposit insurance, may use private ledger |

### The Minting/Burning Mechanism

For fiat-backed stablecoins (USDT, USDC, PYUSD):

**Minting:** A user (typically an institutional customer) sends $1 million USD to the issuer's bank account. The issuer mints 1,000,000 stablecoin tokens and sends them to the user's blockchain address. The $1 million goes into reserves.

**Burning (Redemption):** A user sends 1,000,000 stablecoin tokens back to the issuer. The issuer burns (destroys) the tokens and wires $1 million USD to the user's bank account. Reserves decrease by $1 million.

This create/redeem mechanism maintains the peg through arbitrage: if the stablecoin trades below $1 on exchanges, arbitrageurs buy it cheaply and redeem with the issuer at $1 for profit; if it trades above $1, they mint new tokens at $1 and sell on exchanges.

### Reserve Models

| Model | How It Works | Examples |
|---|---|---|
| **Full-reserve (fiat-backed)** | Every token backed 1:1 by cash, T-bills, or cash equivalents in reserve | USDT, USDC, PYUSD, FDUSD |
| **Overcollateralized** | Users deposit >$1 of crypto collateral per $1 of stablecoin minted (e.g., $1.50 ETH for $1 DAI) | DAI/USDS (Sky/MakerDAO) |
| **Algorithmic** | No direct collateral; uses supply/demand algorithms and incentive mechanisms to maintain peg | UST (collapsed), FRAX (partial) |
| **Synthetic / Delta-neutral** | Backed by crypto + offsetting derivatives positions that hedge out price risk | USDe (Ethena) |
| **Hybrid** | Combination of collateral types — partially fiat, partially crypto, partially algorithmic | FRAX (v2), various experimental designs |

### Attestation vs. Audit

This distinction matters enormously and is frequently misunderstood:

- **Attestation:** A snapshot-in-time verification by an accounting firm that reserves existed at a specific date. It does NOT verify what happened between snapshots. Tether and Circle publish attestations.
- **Full audit:** A comprehensive examination of financial statements, internal controls, and processes over a period of time. Conducted under GAAP/IFRS standards. No major stablecoin issuer has completed a full public audit to date, though Circle (now public) files SEC-audited financials.

### Custodians and Reserve Composition

Major stablecoin issuers hold reserves primarily in:
- **US Treasury Bills** (short-term government debt, <90 days maturity) — the dominant reserve asset
- **Reverse repurchase agreements** (overnight lending collateralized by Treasuries)
- **Money market funds** (typically Treasury-focused)
- **Cash deposits** (bank deposits, minimal allocation)

Reserve composition has shifted dramatically. In 2021, Tether held significant commercial paper. By 2025, virtually all major issuers hold predominantly Treasuries, reflecting regulatory pressure and market demand for safety.

### Redemption Mechanics and Blacklisting

Both USDT and USDC smart contracts include **freeze/blacklist functions** that allow the issuer to freeze tokens in any wallet address. This capability has been used for:
- OFAC sanctions compliance (freezing addresses on the Specially Designated Nationals list)
- Law enforcement cooperation (freezing addresses linked to hacks, fraud, or terrorism financing)
- Court orders

As of 2025, Tether has blacklisted over 1,700 addresses, and Circle has blacklisted hundreds. This centralized control is a fundamental design trade-off: it enables regulatory compliance but contradicts crypto's decentralization ethos.

***

## Section 1.2 — The Major Players (Deep Profiles)

### Tether (USDT)

**Overview:** USDT is the world's largest stablecoin and the most widely used digital asset for trading and cross-border transfers. As of January 2026, USDT's circulating supply reached approximately **$186.9 billion**, commanding roughly **60% of the total stablecoin market**.[^1][^2]

**History and controversies:**
- Founded in 2014 as "Realcoin," rebranded to Tether; originally issued on Bitcoin's Omni Layer
- Connected to cryptocurrency exchange Bitfinex — both companies share management (CEO Paolo Ardoino, formerly CTO)
- 2018–2019: New York Attorney General investigation revealed Bitfinex borrowed $850M from Tether's reserves to cover losses. Settled for $18.5M fine in 2021[^3]
- 2021: CFTC fined Tether $41M for misleading statements about reserves
- Tether published its first reserve breakdown in 2021: 75.8% in cash and cash equivalents (heavily commercial paper), 12.5% in secured loans[^3]

**Reserve composition evolution (dramatically improved):**

| Period | Composition |
|---|---|
| 2021 | 75.8% cash/equivalents (heavy commercial paper), 12.5% secured loans, 10% corporate bonds |
| Q1 2025 | 81.5% cash/equivalents; $98.5B in direct T-Bills, $15.1B in reverse repos, $6.3B money market funds[^4] |
| Q4 2025 | 83.11% cash/equivalents; ~$112.4B in T-Bills, ~$18B in reverse repos; total assets $181B+[^1][^5] |

**Tether's profit model:** Tether generates massive profits from the yield on its reserves. With ~$135–138 billion in US Treasury exposure, even at 4–5% yields, Tether earns **$5–7 billion annually** just from reserves. The company reported **$10 billion in profits** for the first nine months of 2025. Additional revenue comes from Bitcoin holdings (~$7B), gold (~$6.7B), and other investments.[^6][^1]

**Chain distribution:** Tron dominates USDT distribution — approximately 50%+ of all USDT circulates on Tron, driven by lower transaction fees preferred for P2P transfers and remittance-style use cases. Ethereum carries roughly 30%, with the remainder on Solana, Avalanche, and other chains.[^7]

### Circle (USDC)

**Overview:** USDC is the second-largest stablecoin with approximately **25% market share** and a market cap of approximately **$73.4 billion** as of Q3 2025. Circle is the leading "compliance-first" stablecoin issuer.[^2]

**Key milestones:**
- Launched in 2018 through the Centre Consortium (Circle + Coinbase). Centre was dissolved in 2023, giving Circle sole control
- Backed by Goldman Sachs and BlackRock (BlackRock manages Circle's reserve fund)
- **IPO:** Circle priced its IPO in June 2025 at **$31/share**, raising **$1.054 billion** at a **$7.2 billion valuation**. Shares trade on NYSE under ticker CRCL. BlackRock reportedly acquired ~10% of offered shares[^8]
- Monthly attestations (not quarterly like Tether) from Deloitte
- Reserves: 100% in cash and short-dated US Treasuries (via BlackRock-managed Circle Reserve Fund)

**SVB depeg (March 2023):** When Silicon Valley Bank collapsed on March 10, 2023, Circle revealed it had **$3.3 billion** (~8.3% of reserves) deposited at SVB. USDC depegged to a low of **$0.8726** on March 11. The FDIC's announcement on March 12 guaranteeing all SVB deposits triggered a recovery, with USDC fully re-pegging by March 13. The event demonstrated contagion risk between traditional banking and stablecoins — DAI, which used USDC as collateral in its PSM (Peg Stability Module), also briefly lost its peg.[^9][^10][^11][^12]

**Arc blockchain:** In August 2025, Circle announced **Arc**, a proprietary Layer 1 blockchain designed specifically for stablecoin payments. Arc uses USDC as its native gas token, offering predictable fees. The public testnet launched in October 2025 with **100+ firms** including BlackRock, Goldman Sachs, Visa, Apollo, and AWS. Regional stablecoin issuers from Japan (JPYC), Brazil (BRLA), and Canada (QCAD) are participating. Arc is positioned as enterprise-grade blockchain infrastructure for financial services.[^13][^14][^15]

### DAI / USDS (MakerDAO → Sky Protocol)

**Overview:** DAI is the largest **decentralized, overcollateralized** stablecoin, historically maintaining a ~$5 billion market cap. In August 2024, MakerDAO rebranded to **Sky Protocol**, introducing USDS (upgrade of DAI) and SKY (upgrade of MKR governance token).[^16][^17]

**How it works:**
- Users deposit collateral (ETH, wBTC, USDC, RWAs) into **Vaults** and mint DAI/USDS against that collateral
- Minimum collateralization ratio: typically 150% (deposit $1.50 of ETH to mint $1 DAI)
- If collateral value drops below the ratio, the position is automatically liquidated
- **Peg Stability Module (PSM):** Allows 1:1 swaps between USDC and DAI, creating a direct peg anchor to USDC[^11]

**RWA Integration:** MakerDAO/Sky has aggressively integrated Real-World Assets (tokenized T-Bills, corporate credit) as collateral, with over $2 billion in RWA exposure by 2024. This generates yield that funds the DAI Savings Rate / Sky Savings Rate (SSR).[^17]

**The Sky rebrand:**
- DAI → USDS (1:1 conversion, voluntary upgrade)
- MKR → SKY (1 MKR = 24,000 SKY)
- New features: Sky Savings Rate (SSR), Sky Token Rewards (STRs)
- USDS introduces a **freezing function** — a controversial addition that enables centralized intervention for compliance[^18]
- Both DAI and MKR remain as legacy tokens; coexistence with USDS and SKY[^19][^16]

### PYUSD (PayPal USD)

**Overview:** PayPal launched PYUSD in August 2023, issued by Paxos Trust Company under NYDFS regulation. It represents the first major consumer fintech company entering the stablecoin market with built-in distribution to **400+ million PayPal users**.[^20][^21]

**Growth trajectory:**
- August 2024: First reached $1B market cap, with supply on Solana briefly exceeding Ethereum[^22]
- January 2025: Dropped to ~$498M market cap (post-DeFi incentive wind-down)[^20]
- June 2025: Recovered to $1B, surpassed it[^20]
- September 2025: $1.17B, monthly volumes surged 400% YoY to $3.95B[^23]
- Late 2025: **Surged to $3.8 billion** market cap, entering top 6 stablecoins[^21]
- Deployed across 6 blockchains (Ethereum, Solana, Arbitrum, Stellar, etc.) using LayerZero[^21]
- 3.7–4% APY yield for retail savers[^23][^21]
- 20M+ merchants enabled for PYUSD bill-pay[^23]

### FDUSD (First Digital USD)

**Overview:** FDUSD is a stablecoin issued by FD121 Limited, a subsidiary of Hong Kong-based First Digital Limited. It rose to prominence through its close relationship with Binance, becoming a key trading pair stablecoin on the exchange.[^24]

**The April 2025 depeg controversy:** On April 2, 2025, Tron founder Justin Sun publicly accused First Digital Trust (FDT) of being insolvent, primarily regarding its management of TrueUSD (TUSD) reserves. Although the accusations concerned TUSD, FDUSD was caught in the crossfire because both are associated with FDT.[^25][^24]

- FDUSD depegged to a low of **$0.87** (13% deviation)
- Market maker Wintermute pulled **$30M+** in FDUSD from Binance
- Market cap fell by $130M
- FDT responded that FDUSD was "fully backed by US Treasury Bills" and announced legal action against Sun
- Binance co-founder Yi He offered to audit FDUSD reserves
- FDUSD recovered above $0.99 within hours[^26][^27]

The incident highlighted how reputational contagion from one product (TUSD) can destabilize an unrelated stablecoin (FDUSD) from the same issuer family.

### What Happened to BUSD, TUSD, GUSD, USDP

| Stablecoin | Issuer | Status | What Happened |
|---|---|---|---|
| **BUSD** | Paxos (for Binance) | Winding down | NYDFS ordered Paxos to stop minting in Feb 2023; SEC issued Wells notice; supply dropped from $22B to <$100M |
| **TUSD** | TrueCoin → Techteryx | Controversy | 99% of reserves were in risky offshore funds per SEC settlement; Justin Sun involvement; First Digital Trust mismanagement allegations |
| **GUSD** | Gemini | Marginal | Never achieved significant scale; sub-$100M market cap; regulatory-first approach but no distribution advantage |
| **USDP** | Paxos | Marginal | Rebranded from PAX; sub-$200M; Paxos pivoting to enterprise (PYUSD issuance, own stablecoin infrastructure) |

***

## Section 1.3 — Non-USD Stablecoins

### The Current Landscape

More than **99% of all stablecoins** are denominated in US dollars. Non-USD stablecoins represent less than 1% of total supply but are growing exponentially, particularly after MiCA regulation provided clarity in Europe.[^7]

**Euro stablecoins (the fastest-growing segment):**

| Token | Issuer | Market Cap (Late 2025) | Notes |
|---|---|---|---|
| **EURC** | Circle | Largest EUR stablecoin | MiCA-compliant; volume up 1,139% post-MiCA[^28] |
| **EURS** | Stasis (Malta) | $283.9M (Oct 2025) | 644% surge post-MiCA[^28] |
| **EURCV** | SG-Forge (Société Générale) | Growing | Bank-issued; volume up 343% post-MiCA[^28] |
| **agEUR / EURA** | Angle Protocol | Decentralized | Algorithmic-backed |

**Total euro stablecoin market cap:** approximately **$680 million** as of late 2025, having **doubled** in the 12 months following MiCA's June 2024 rollout — reversing a prior 48% decline. Monthly euro stablecoin volume rose nearly **ninefold** to $3.83 billion.[^28][^29][^30]

**ASEAN stablecoins:**

| Token | Currency | Issuer | Notes |
|---|---|---|---|
| **XSGD** | SGD | StraitsX (Xfers) | Licensed Major Payment Institution under MAS; Travel Rule compliant; ~$30M+ market cap; available on Ethereum, Polygon, Zilliqa[^31][^32] |
| **XIDR** | IDR | StraitsX | Indonesian Rupiah stablecoin by same issuer |

**Other regional stablecoins:**
- **BRZ** (Brazilian Real) — issued by Transfero; active in Brazil's crypto ecosystem
- **BRLA** (Brazilian Real) — participating in Circle's Arc testnet[^13]
- **JPYC** (Japanese Yen) — participating in Circle's Arc testnet; Japan revised its Payment Services Act to enable bank-issued stablecoins[^13]
- **GYEN** (Japanese Yen) — issued by GMO Trust under NYDFS regulation
- **MXN stablecoins** — emerging in the Mexico corridor (largest remittance recipient from US)
- **QCAD** (Canadian Dollar) — participating in Circle's Arc testnet[^13]

### Why Non-USD Stablecoins Are <1% But Growing Exponentially

The issuer's dilemma for non-USD stablecoins is a **liquidity-distribution-utility chicken-and-egg**:

1. **Liquidity:** Without deep trading pairs, the stablecoin can't be used efficiently
2. **Distribution:** Without exchange listings and wallet integrations, users can't access it
3. **Utility:** Without real use cases (payments, DeFi, FX), there's no demand
4. **Yield disadvantage:** USD stablecoins generate 4–5% from T-Bills; EUR stablecoins earn less (ECB rates are lower), and many EM currency stablecoins earn even less in local government debt

**Growth catalysts:**
- **MiCA** provided regulatory clarity that unlocked European issuers and exchanges[^28]
- **Cross-border payments:** Non-USD stablecoins enable direct FX-to-stablecoin-to-FX flows without USD as an intermediary
- **Local DeFi ecosystems:** Growing demand for on-chain local currency exposure
- **Regulatory mandates:** Some jurisdictions may require local currency stablecoins for domestic transactions

### Latin America and Africa as Growth Frontiers

- **Brazil:** PIX has created a digital payments culture; BRL stablecoins enable on-chain access to the Brazilian economy; Drex (Brazil's CBDC) may interoperate with stablecoins
- **Argentina:** Extreme peso depreciation drives massive USDT adoption for savings; local stablecoin experiments emerging
- **Nigeria:** Parallel exchange rate markets make USDT the de facto digital dollar; NGN stablecoins could formalize existing crypto-native remittance flows
- **Kenya:** M-Pesa ecosystem could integrate with stablecoin on/off-ramps

***

## Section 1.4 — Stablecoin Economics

### How Stablecoin Issuers Make Money

The stablecoin business model is extraordinarily profitable — and deceptively simple:

1. **Accept $1 from customer → mint 1 stablecoin**
2. **Invest the $1 in US Treasury Bills (earning 4–5% annually)**
3. **When customer redeems, return $1 → burn the stablecoin**
4. **Keep the yield earned while the stablecoin was in circulation**

This is essentially the same model as a bank — accept deposits, invest them, keep the spread — except stablecoin issuers don't pay depositors interest (in most cases) and don't have to maintain branches, ATMs, or extensive regulatory infrastructure.

**Tether's economics:** With ~$135–138B in US Treasury exposure, at ~4.5% yield = **~$6+ billion/year** in risk-free revenue. Tether reported $10 billion profit in the first 9 months of 2025. With only ~100 employees, this makes Tether one of the most profitable companies per employee in the world.[^1]

**Circle's economics:** Circle's IPO filings revealed approximately $1.7 billion in revenue for 2024, almost entirely from reserve yield. At its $7.2B IPO valuation, Circle trades at roughly 4x revenue.[^8]

### Yield-Bearing Stablecoins

A new category has emerged: stablecoins that pass some of the reserve yield back to holders.

| Token | Mechanism | Yield Source | Market Cap |
|---|---|---|---|
| **sDAI / Sky Savings Rate** | Deposit DAI/USDS → earn variable APY | RWA yield, stability fees from borrowers | ~$2B+ deposited |
| **sUSDe (Ethena)** | Stake USDe → earn yield via sUSDe | Perpetual futures funding rates + ETH staking rewards[^33][^34] | USDe: ~$14B at peak[^35] |
| **USDY (Ondo)** | Tokenized note backed by Treasuries | Direct Treasury yield pass-through | Growing institutional demand |
| **sfrxUSD (Frax)** | Deposit FRAX → earn yield | Mixed (AMO strategies, RWA) | Smaller scale |

**Ethena's USDe — the delta-neutral innovation:**
USDe is a synthetic dollar that maintains its peg through delta-neutral hedging:[^33]
1. Users deposit crypto (ETH, stETH, BTC) as collateral
2. Ethena opens an equal-size **short position** in perpetual futures
3. Long collateral + short futures = net zero market exposure (delta-neutral)
4. Yield comes from: funding rate payments (shorts receive when rates are positive) + ETH staking rewards + basis spread[^36][^33]

**The risk:** In October 2025, during a market crash, USDe depegged to **$0.65** — a severe failure that exposed the fragility of synthetic stablecoin models during extreme volatility when funding rates turn negative. The $9 billion yield-bearing stablecoin market remains experimental.[^37]

### Stablecoin Velocity and Settlement Volume

Stablecoin transaction volume has exploded:
- **2024:** Stablecoins settled approximately **$27.6 trillion** — officially surpassing Visa's total annual payment volume[^38][^39]
- **Q4 2024:** Average weekly stablecoin volume reached **$464 billion** vs. Visa's **$316 billion**[^39]
- **Growth rate:** Stablecoin volumes were 10x less than Visa in 2020; parity was achieved in just 4–5 years[^40]
- **Q1 2025:** Stablecoin volumes rose 30%+ YoY[^39]
- **Daily volumes:** Estimated at ~$30 billion/day as of 2025[^7]
- **USDT dominance:** ~90% of stablecoin payment volume attributed to USDT[^7]

**Important caveat:** Experts warn that stablecoin volume is not directly comparable to Visa volume. Much of it represents trading/DeFi activity (not consumer payments), and professional traders can generate hundreds of millions in volume with relatively little capital. Still, the trajectory is structural and real economic activity (cross-border payments, payroll, commerce) is growing as a share.[^40][^39]

### Stablecoins as Collateral in DeFi

Stablecoins are the foundational collateral layer of DeFi:
- **~75%** of all DeFi liquidity is stablecoin-backed[^7]
- Major lending protocols (Aave, Compound, Morpho) use USDC, USDT, DAI as primary collateral and borrowing assets
- Stablecoin issuers have become a **top 15 holder of US Treasuries** globally, reflecting their integration into traditional financial markets[^39]
- **Citigroup projects** the stablecoin market could reach **$3.8 trillion** by 2030[^39]

***

## Section 1.5 — Historical Crises &amp; Lessons

### UST/Luna Collapse (May 2022) — The Death Spiral

The collapse of Terra's UST algorithmic stablecoin and its companion token LUNA wiped out **$60 billion** in value and remains the single most destructive event in stablecoin history.[^41][^42]

**How the mechanism worked:**
- UST was an algorithmic stablecoin with NO direct collateral
- Peg was maintained through an arbitrage loop with LUNA: burning $1 of LUNA minted 1 UST, and vice versa
- **Anchor Protocol** offered ~20% APY on UST deposits — subsidized by the Luna Foundation Guard (LFG) — creating artificial demand that inflated UST's market cap to $18B[^43][^41]

**The death spiral (May 7–13, 2022):**[^42][^41]
1. Large UST withdrawals from Anchor (deposits fell from $14B to $11.77B in 24 hours — a 16% drop)[^43]
2. UST began trading below $1 on exchanges
3. Arbitrageurs burned UST to mint LUNA (the designed mechanism), but the scale of selling was overwhelming
4. Massive LUNA minting flooded the market → LUNA's price collapsed
5. As LUNA's price crashed, more LUNA had to be minted per UST burned → exponential dilution
6. LUNA went from $86 to effectively **$0** in 6 days[^44][^42]
7. LFG sold most of its $3B Bitcoin reserve trying to defend the peg — it failed
8. Do Kwon, Terra's founder, was later arrested and extradited; convicted of fraud

**Lessons:**
- Algorithmic stablecoins without exogenous collateral are inherently fragile
- Unsustainable yield (Anchor's 20% APY) creates artificial demand that masks systemic risk
- "Death spirals" are a mathematical certainty when the peg-defense mechanism requires minting more of a declining asset
- The collapse triggered contagion: Three Arrows Capital, Celsius, Voyager, and eventually FTX all fell in subsequent months

### USDC/SVB Depeg (March 2023) — Banking Contagion

When Silicon Valley Bank collapsed on March 10, 2023, Circle disclosed **$3.3 billion** of its ~$40 billion reserves were held at SVB. USDC depegged to a low of **$0.8726** within hours.[^10][^9]

**Contagion chain:**
1. SVB collapse → Circle $3.3B exposure revealed
2. USDC depegged → mass selling on exchanges
3. **DAI depegged** because its Peg Stability Module held significant USDC (DAI's peg was partially anchored to USDC)[^11]
4. On-chain redemptions spiked: Circle processed $1.4B in USDC redemptions in 8 hours[^9]

**Resolution:** The FDIC, Federal Reserve, and Treasury announced on Sunday March 12 that all SVB depositors (insured and uninsured) would be made whole. USDC recovered sharply and fully re-pegged by Monday March 13.[^12]

**Lessons:**
- Centralized stablecoins inherit the risk of the banking system they rely on
- Concentration risk in any single bank is dangerous for reserve management
- Two-way feedback between TradFi and DeFi: a bank run triggered a stablecoin depeg, and a stablecoin crisis could theoretically force reserve liquidations that impact traditional markets[^12]
- Circle subsequently diversified reserves away from any single bank

### USDT FUD Cycles — Why It Survived

Tether has faced recurring "Fear, Uncertainty, and Doubt" cycles:
- 2017: Allegations of unbacked printing to inflate Bitcoin's price
- 2019: NY Attorney General investigation revealed Bitfinex borrowing from Tether reserves
- 2021: CFTC fine ($41M); first reserve breakdown showed significant commercial paper
- 2022: Post-UST collapse, massive USDT redemption wave ($10B+ in weeks)
- Ongoing: Periodic depeg scares, regulatory pressure, questions about reserve quality

**Why USDT survives every cycle:**
1. **Network effects:** USDT is deeply embedded in global crypto trading infrastructure; most trading pairs are USDT-denominated
2. **Tron dominance:** USDT on Tron is the de facto payment rail for P2P transfers in emerging markets — this is sticky, utility-driven demand
3. **Reserve improvement:** Composition shifted from commercial paper to overwhelmingly US Treasuries (~$135B+)
4. **Profitability:** Tether's massive profits provide a buffer — excess reserves above liabilities
5. **No true alternative at scale:** USDC is the main competitor but has never matched USDT's distribution in emerging markets and trading venues

### Iron Finance, Basis Cash, and Other Failed Algorithmic Stablecoins

| Project | Year | What Happened |
|---|---|---|
| **Iron Finance** | 2021 | Partially collateralized stablecoin on Polygon; "bank run" triggered when TITAN (governance token) entered a death spiral; Mark Cuban was famously caught in it |
| **Basis Cash** | 2020–2021 | Three-token design (BAC, BAS, BAB) inspired by Robert Sams' "Seigniorage Shares" paper; failed to maintain peg; abandoned |
| **Empty Set Dollar (ESD)** | 2020 | Rebasing algorithmic stablecoin; traded well below $1 for most of its existence; abandoned |
| **Fei Protocol** | 2021–2023 | "Protocol Controlled Value" design; struggled with peg; eventually merged with Rari Capital |

**Common failure patterns:**
1. Reflexive death spirals when confidence breaks
2. Unsustainable yield incentives masking structural weakness
3. Insufficient exogenous collateral to absorb sell pressure
4. Governance token dilution as a peg-defense mechanism that makes the problem worse

### Lessons for Risk Assessment

A risk framework for evaluating stablecoins should consider:

1. **Reserve quality:** What assets back the stablecoin? How liquid are they? What's the maturity profile?
2. **Transparency:** How frequently and thoroughly are reserves attested/audited? By whom?
3. **Redemption mechanics:** Can any holder redeem at $1? What's the minimum? How fast?
4. **Concentration risk:** Is there single-bank exposure? Single-chain risk? Single-exchange dependency?
5. **Regulatory status:** Is the issuer licensed? In which jurisdictions? Under what framework?
6. **Peg mechanism:** Is the peg maintained by collateral (robust) or algorithms (fragile)?
7. **Market structure:** How deep is secondary market liquidity? On how many venues?
8. **Blacklist risk:** Can the issuer freeze your tokens? Under what circumstances?

***

## Agent Instruction Footer

### Guardrails for Agent Behavior

When using this knowledge base, the agent MUST:

1. **Never present information as Sera-proprietary.** Everything in this pack is public domain knowledge.

2. **Be precise about stablecoin types.** Don't conflate fiat-backed (USDT, USDC), overcollateralized (DAI/USDS), algorithmic (UST — dead), and synthetic (USDe). Each has fundamentally different risk profiles.

3. **Use current market data.** Stablecoin market caps change daily. As of late 2025: total market ~$308B, USDT ~$175–187B, USDC ~$73B, USDe peaked at ~$14B, PYUSD ~$3.8B. Always note the "as of" date.

4. **Be balanced on Tether.** Acknowledge both the controversies (opacity, Bitfinex connection, past reserve composition) AND the strengths (network effects, reserve improvement, profitability, real-world utility). Tether is not going away — it's deeply embedded in global crypto infrastructure.

5. **Highlight the non-USD stablecoin opportunity.** This is critical for Sera's context. Non-USD stablecoins are &lt;1% of supply but growing exponentially. MiCA has catalyzed euro stablecoins. ASEAN stablecoins (XSGD) are regulated and growing. This is where Sera's FX infrastructure matters most.

6. **Don't overstate the "stablecoins surpassed Visa" comparison.** The $27.6T figure includes significant trading/DeFi volume that isn't comparable to consumer payments. Acknowledge the milestone but add context about what the volume actually represents.

7. **Frame yield-bearing stablecoins as experimental.** USDe's October 2025 depeg to $0.65 demonstrates that delta-neutral strategies can fail catastrophically. sDAI/SSR yield from RWA is more conservative. Clearly distinguish risk profiles.

8. **Understand the freeze function trade-off.** Both USDT and USDC can freeze tokens. USDS added this capability (controversial). DAI legacy cannot freeze. This matters for censorship resistance vs. regulatory compliance positioning.

### Suggested Agent Behaviors

- When asked "what is a stablecoin?" → Start with the simple definition, then distinguish from CBDCs, e-money, and tokenized deposits
- When asked about Tether → Lead with current reserve composition ($135B+ in Treasuries), acknowledge history and controversies, explain the profit model and why it survives FUD cycles
- When asked about Circle/USDC → Emphasize compliance-first positioning, IPO at $7.2B, BlackRock backing, Arc blockchain, and the SVB depeg as a lesson in concentration risk
- When asked about non-USD stablecoins → Frame as &lt;1% of market but the fastest-growing segment; cite MiCA's catalytic effect on EUR stablecoins (market cap doubled, volume 9x); mention XSGD, BRZ, JPYC by name
- When asked about UST/Luna → Walk through the death spiral mechanics step by step; emphasize that algorithmic stablecoins without exogenous collateral are structurally fragile
- When asked about stablecoin regulation → Defer detailed discussion to Pack 2 but note: GENIUS Act (US), MiCA (EU), MAS framework (Singapore), and HKMA sandbox (Hong Kong)

***

*Pack 1 Complete. Ready for OpenClaw ingestion.*
*Phase 2 (Asset Class Depth) now complete.*
*Next up: Phase 3 — Pack 6 (DeFi Infrastructure) + Pack 5 (FX Quant &amp; Trading)*

---

## References

1. [Tether (USDT) January 2026 Reserves Report - Stablecoin Insider](https://stablecoininsider.org/tether-usdt-january-2026-reserves-report/) - Discover Tether (USDT) reserves as of late 2025: $181B+ total assets backing $174B+ in circulation, ...

2. [USDT vs USDC Q3 2025: Market Share & Dominance Analysis](https://crystalintelligence.com/thought-leadership/usdt-maintains-dominance-while-usdc-faces-headwinds/) - Explore our stablecoin market analysis of USDT vs USDC, highlighting liquidity, institutional adopti...

3. [Tether Releases Breakdown of Reserves for the First Time ...](https://coinmarketcap.com/academy/article/tether-releases-breakdown-of-reserves-for-the-first-time-ever) - The stablecoin issuer offers USDT, an asset that’s pegged on a 1:1 basis with the U.S. dollar.

4. [Tether Boosts US Treasury Holdings by 3.1% in Q1 2025 - AInvest](https://www.ainvest.com/news/tether-boosts-treasury-holdings-3-1-q1-2025-2505/) - Tether Boosts US Treasury Holdings by 3.1% in Q1 2025

5. [Transparency - Tether](https://tether.to/ru/transparency/?tab=reports) - Most recent Reserves report as of December 31, 2025 UTC. Reports3. As part ... Cash & Cash Equivalen...

6. [Tether’s Reserve Report Q4 2025: Breaking Down the $120B ...](https://tethernews.com/tethers-reserve-report-q4-2025-breaking-down-the-120b-asset-base/) - Tether, the issuer of the world’s largest stablecoin, remains under the microscope as it continues t...

7. [Stablecoin Market Share by Chain Statistics 2026 - SQ Magazine](https://sqmagazine.co.uk/stablecoin-market-share-by-chain-statistics/) - USDT and USDC now hold nearly 90% of the total stablecoin market share as of November 2025. In Septe...

8. [USDC Issuer Circle Supercharges IPO to $1B as BlackRock Backs ...](https://www.blockhead.co/2025/06/05/usdc-issuer-circle-supercharges-ipo-to-1b-as-blackrock-backs-stablecoin-play/) - Circle's upsized $1B offering values the USDC stablecoin company at $7.2 billion, positioning it to ...

9. [USDC depegs as Circle confirms $3.3B stuck with Silicon ...](https://cointelegraph.com/news/usdc-depegs-as-circle-confirms-3-3b-stuck-with-silicon-valley-bank) - USDC has lost over 10% of its value as it trades at $0.8774, while on-chain data reveals that Circle...

10. [Market Analysis: Silicon Valley Bank, Circle & USDC](https://data.coindesk.com/blogs/market-analysis-silicon-valley-bank-circle-usdc)

11. [The Fragility of Centralized Stablecoins: Lessons from USDC's $3.3 ...](https://www.ainvest.com/news/fragility-centralized-stablecoins-lessons-usdc-3-3-billion-svb-exposure-2601/) - The Fragility of Centralized Stablecoins: Lessons from USDC's $3.3 Billion SVB Exposure

12. [The Fed - In the Shadow of Bank Runs - Federal Reserve Board](https://www.federalreserve.gov/econres/notes/feds-notes/in-the-shadow-of-bank-run-lessons-from-the-silicon-valley-bank-failure-and-its-impact-on-stablecoins-20251217.html) - On the morning of Friday, March 10, 2023, Silicon Valley Bank ("SVB") entered bank resolution after ...

13. [Circle Launches Arc Testnet With BlackRock, Visa, and AWS — A New Era for Stablecoin Infrastructure](https://finance.yahoo.com/news/circle-launches-arc-testnet-blackrock-130546932.html) - USDC issuer Circle launched its Arc blockchain testnet with 100+ firms, including BlackRock and Visa...

14. [Goldman, BlackRock Sign Up to Trial Circle's Arc Blockchain](https://www.bloomberg.com/news/articles/2025-10-28/goldman-blackrock-sign-up-to-trial-circle-s-arc-blockchain) - The Arc blockchain is built to process stablecoin payments directly and is now available for develop...

15. [Circle: A Comprehensive Analysis of the Leading Compliant ...](https://www.techflowpost.com/en-US/article/28233) - ARC: A Stablecoin-Optimized Blockchain: In August 2025, Circle announced ARC, an open L1 blockchain ...

16. [MakerDAO Rebrands To "Sky" and Schedules USDS Stablecoin ...](https://thedefiant.io/news/defi/makerdao-schedules-sky-rebrands-and-usds-stablecoin-launch) - On Aug. 27, MakerDAO rebranded to Sky and announced it will deploy its new stablecoin, USDS, and gov...

17. [Maker rebrands as SKY, DAI will be upgradeable to USDS](https://blockworks.co/news/maker-rebrands-as-sky-dai-will-be-changed-to-usds) - The Maker Endgame enters a new phase

18. [MakerDAO's Rebranding to Sky Protocol: What You Need ...](https://www.okx.com/en-eu/learn/makerdao-rebranding-sky-protocol-sky-usds) - OKX Europe - Discover MakerDAO's transformation into Sky Protocol and learn about its new stablecoin...

19. [MakerDAO rebrands as Sky, unveils new USDS stablecoin and SKY ...](https://cryptoslate.com/makerdao-rebrands-as-sky-unveils-new-usds-stablecoin-and-sky-governance-token/) - The Sky rebranding introduces "Sky Stars" projects and upgrades stablecoin and governance tokens to ...

20. [MILESTONE | PayPal's PYUSD Stablecoin Surpasses $1 Billion ...](https://bitcoinke.io/2025/06/pyusd-stablecoin-doubles-marketcap/)

21. [PayPal's PYUSD Stablecoin Surges to $3.8B Market Cap, Enters ...](https://coinalertnews.com/news/2025/12/03/71b88ca0) - PYUSD's market cap tripled in months, driven by PayPal's user base and multi-chain DeFi integration,...

22. [PayPal's PYUSD Hits $1 Billion Market Cap Amid Solana ...](https://www.cryptonite.ae/global/paypal-pyusd-stablecoin-surpasses-1-billion-market-cap-solana-expansion) - PayPal's stablecoin PYUSD has surpassed a $1 billion market cap, driven by its recent expansion to t...

23. [Stablecoin Insider](https://x.com/stablecoininfo/status/1965716294302630262)

24. [What Really Happened to FDUSD? Breaking Down the Sudden Depeg](https://flush.com/blog/post/what-really-happened-to-fdusd-breaking-down-the-sudden-depeg) - FDUSD lost its $1 peg, dropping to $0.87 amid insolvency claims. Discover the key events, market rea...

25. [Justin Sun Causes FDUSD Depeg With Strong Accusations](https://beincrypto.com/justin-sun-stablecoin-fdusd-binance-depeg/) - Justin Sun accuses First Digital over TUSD insolvency; FDUSD depegs amid panic as Binance and Winter...

26. [Binance's FDUSD stablecoin regains its dollar peg after ...](https://www.mitrade.com/insights/news/live-news/article-3-737685-20250403) - First Digital USD (FDUSD) crashed and de-pegged as low as 13% after Justin Sun claimed its issuer, F...

27. [FDUSD Depegged After Insolvency Rumor Hits First Digital - Binance](https://www.binance.com/en/square/post/22400607986969) - Tron founder Justin Sun sparked the controversy, alleging that FDT might be insolvent and incapable ...

28. [Euro Stablecoin Market Cap Doubles After MiCA Rollout](https://coinmarketcap.com/academy/article/euro-stablecoin-market-cap-doubles-after-mica-rollout) - Euro stablecoins still represent a tiny fraction of the $300 billion held in dollar-pegged tokens, a...

29. [Euro Stablecoin Market Cap Doubles in Year After MiCA, Study Finds](https://finance.yahoo.com/news/euro-stablecoin-market-cap-doubles-130000981.html) - Prior to MiCA, euro-denominated stablecoins' market cap contracted by 48% in the year leading up to ...

30. [Euro Stablecoin Market Doubles to $680M A Year After MiCA](https://finance.yahoo.com/news/euro-stablecoin-market-doubles-680m-101251073.html) - Decta's report says euro-denominated stablecoins climbed to roughly $500 million by May 2025 followi...

31. [XSGD | Singapore Dollar Stablecoin by StraitsX](https://www.straitsx.com/xsgd) - StraitsX’s regulated Singapore Dollar stablecoin. Move SGD 24/7 on blockchain for fast settlements, ...

32. [Introducing XSGD — the Singapore Dollar-backed and ...](https://www.straitsx.com/blog-post/introducing-xsgd-the-singapore-dollar-backed-and-travel-rule1-compliant-stablecoin) - We are excited to announce the public release of XSGD, the world’s first Travel Rule¹ compliant stab...

33. [Inside Modern Stablecoin Architecture: How Ethena's USDe Work](https://rocknblock.io/blog/stablecoin-architecture-how-ethena-usde-works) - sUSDe is the staked, yield-bearing version: stake USDe 1:1 to receive sUSDe, which accrues the proto...

34. [What Is (sUSDe) Ethena Staked USDe & Why It Matters - Phemex](https://phemex.com/academy/what-is-ethena-staked-usde-susde) - sUSDe, short for “Staked USDe,” is essentially the interest‑bearing version of Ethena's synthetic do...

35. [How stablecoins reached a $300 billion market cap in 2025](https://info.arkm.com/research/how-stablecoins-reached-a-300-billion-market-cap-in-2025) - The stablecoin market cap has increased from $205 billion to $300 billion in 2025. Here’s how it hap...

36. [Ethena and the Mechanics of USDe](https://coinmetrics.io/state-of-the-network/ethena-usde/) - Understanding the backing mechanics, usage profile, and risks of Ethena's synthetic dollar

37. [The Risks and Opportunities in Yield-Bearing Stablecoins](https://www.ainvest.com/news/risks-opportunities-yield-bearing-stablecoins-lessons-ethena-usde-2512/) - The Risks and Opportunities in Yield-Bearing Stablecoins: Lessons from Ethena's USDe

38. [Stablecoins Surpass Visa with $27.6 Trillion Settled in 2024 | Flash News Detail](https://cn.blockchain.news/flashnews/stablecoins-surpass-visa-with-27-6-trillion-settled-in-2024) - According to AltcoinGordon, stablecoins settled an astonishing $27.6 trillion in 2024, surpassing Vi...

39. [Stablecoins flipped the script to surpass Visa in transaction volume | Cryptopolitan on Binance Square](https://www.binance.com/en/square/post/23660973225074) - The Bitwise Crypto Market Review for Q1 2025 revealed that stablecoin transaction volume narrowly su...

40. [Stablecoins flipped the script to surpass Visa in transaction volume](https://www.mitrade.com/insights/news/live-news/article-3-794912-20250501) - Bitwise Crypto Market Review for Q1 2025 revealed that stablecoin transactions narrowly surpassed Vi...

41. [The Rise and Fall of Terra: How a $60 Billion Crypto Ecosystem ...](https://www.okx.com/en-us/learn/terra-collapse-ust-luna-stablecoin) - Terra's Death Spiral Explained The death spiral began in May 2022 when UST lost its dollar peg. As U...

42. [Terra - What it Was, Collapse, Stablecoin - Corporate Finance Institute](https://corporatefinanceinstitute.com/resources/cryptocurrency/what-happened-to-terra/) - In May 2022, the value of Luna collapsed from over $120 a coin to effectively zero, wiping out over ...

43. [Terra's death spiral: how and why LUNA and UST collapsed](https://forklog.com/en/news/terras-death-spiral-how-and-why-luna-and-ust-collapsed/)

44. [Luna Fell by More than 95% in a Single Day. What Is the "Death Spiral" Leading to Hell?](https://www.gate.io/blog/959/Luna-Fell-by-More-than-95--in-a-Single-Day.-What-Is-the--Death-Spiral--Leading-to-Hell-) - What is Luna? Cause analysis of LUNA slump. Is Luna likely to rise?

