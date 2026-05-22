# Published cattle-price benchmarks (Colombia) — for Hacienda Sabaleticas

**Purpose:** External, publicly published price references to compare against the ranch's own
realized sale prices. The ranch sells small lots frequently, ~63% via comisionistas on
consignación, mostly **hembras 2–3 años** to slaughter plants (Frigorífico Municipal de
Fredonia, Frigocentro, Riosucio, Amagá, La Virginia) and **machos 2–3 años** to the Medellín
livestock market (Sociedad Central Ganadera S.A.).

**All prices are COP per kilogram, ganado en pie (live weight), unless noted otherwise.**
**Accessed 2026-05-22. Prices drift weekly — re-pull before using.**

---

## TL;DR / what to track

- **Track weekly: Sociedad Central Ganadera S.A. — "Boletín de Precios Oficiales"** ([S37]). This is the
  single most relevant source because the ranch actually sells machos there, AND it is the only
  source found that publishes a **finished-female ("Hembras Cebadas") $/kg en pie** line — exactly
  the category the ranch mostly sells. Weekly PDF, machine-readable via `pdftotext`. **Priority.**
- **Cross-check weekly: CONtexto Ganadero weekly "precio del ganado"** ([S38], built on Fedegán-FNG
  auction data). Gives national average + best plaza by category, and reports the Medellín macho
  figure (it matched Central Ganadera's boletín to the peso for the week of Apr 18–24 2026 — good
  validation). Weakness: it reports **macho cebado and hembra *de levante*, not hembra *gorda***.
- The rest (Fedegán portal, BMC, DANE/SIPSA, Subastar, ferias) are secondary or not a fit — see
  per-source notes and the "Gaps" section.

---

## Current benchmark table (advisor's working reference)

| Category | COP/kg en pie | Date (week) | Source |
|---|---|---|---|
| **Hembra gorda / cebada — Medellín (Central Ganadera)** | **9,671 avg** (7,300–11,200 range) | Apr 20–24 2026 | [S37] |
| **Macho gordo / cebado — Medellín (Central Ganadera)** | **11,644 avg** (9,700–12,400 range) | Apr 20–24 2026 | [S37] |
| Macho gordo — Medellín plaza (CONtexto/Fedegán-FNG) | 11,644 | Apr 18–24 2026 | [S38] |
| Macho gordo — **national average** (CONtexto/Fedegán-FNG) | 9,411 | Apr 18–24 2026 | [S38] |
| Hembra de levante — national average | 8,742 | Apr 18–24 2026 | [S38] |
| Macho gordo — Antioquia (BMC/Fedegán dept. table) | ~10,316 | early Mar 2026 | [S39] |
| Macho gordo — national avg (BMC) | 9,885 | early Mar 2026 | [S39] |

> The **hembra gorda figure (~9,671) is the most important number for this ranch** and is only
> available from Central Ganadera [S37]. Note hembra cebada trades roughly **~17% below macho
> cebado** at the same plaza/week (9,671 vs 11,644, Apr 20–24 2026) — see "Macho vs hembra" below.
> Caveat: this is the Medellín *market* price for animals delivered to the feria; the ranch's
> slaughter-plant sales via comisionista (Fredonia etc.) will realize **less** after commission and
> because plants buy on rendimiento en canal, not feria en-pie. Treat the boletín as a ceiling/
> reference, not the expected realized price.

---

## 1. Sociedad Central Ganadera S.A. (Feria de Ganados de Medellín) — PRIORITY [S37]

- **What it publishes:** Weekly "Precios Oficiales Feria de Ganados de Medellín" boletín (PDF). Full
  category breakdown with **N° animales, $ Máximo, $ Mínimo, Promedio Po.** for each category, plus a
  separate weekly "Subasta Comercial" results table (precio promedio máximo/mínimo and $/kg).
- **Categories (en pie $/kg unless per-head):**
  - BOVINO MACHOS: Machos Cebados (kg en pie), Machos de Levante 1 año / 1½ años (per head),
    Machos para Ceba 2 / 2½ años (per head), Machos Destete (per head).
  - BOVINO HEMBRA: **Hembras Cebadas (kg en pie)**, Hembras de Levante 1 / 1½ año, Hembras de Cría
    2 / 2½ años, Vacas con cría (Ataos), Vacas de Leche, Revoltura, Bovino Industrial (kg en pie).
- **Latest figures — Boletín N.º 16, Apr 20–24 2026** (en pie $/kg, min–max → avg):
  - **Machos Cebados kg en pie: 9,700–12,400 → 11,644** (n=2,361)
  - **Hembras Cebadas kg pie: 7,300–11,200 → 9,671** (n=746)
  - Bovino Industrial kg en pie: 4,500–7,700 → 6,010 (n=129)
  - Hembras de Cría 2½ años: 2,472,300–3,357,900 → 3,251,000/head (n=200)
  - Vacas con cría (ataos): 2,790,000–4,799,916 → 3,377,000/head (n=43)
  - Subasta Comercial N.º 19 (Apr 21): Hembras de Vientre ~8,810 $/kg, Vaca Horra ~8,427, Vacas
    Paridas ~9,077, Machos de ceba 2 años ~9,180, Toros ~10,420.
  - Feria-level variation vs prior week: Bovino Macho price **+5.3%**, Bovino Hembra price **+6.8%**
    (both volumes down: machos −12.6%, hembras −39.4%).
  - **Trend within 2026:** Boletín N.º 05 (Feb 2–6): Machos Cebados avg 11,279; Hembras Cebadas avg
    9,215. So Feb→late-Apr, macho gordo +~3.2%, hembra gorda +~5.0%. Prices are rising in 2026.
- **Cadence:** Weekly, one boletín per Mon–Fri feria week, posted the following week.
- **Format / accessibility:** PDF at a stable, dated URL pattern under
  `centralganadera.com/wp-content/uploads/YYYY/MM/NN_PRECIOS-OFICIALES_..._cg.pdf`, indexed at
  `centralganadera.com/boletines/precios-oficiales/`. **Image-based PDF** — WebFetch's reader fails
  on it, but `curl` + `pdftotext -layout` extracts the full table cleanly (verified). They also post
  to @CentralGanadera (X/Facebook). A separate "Resultados de subasta" boletín index exists too.
- **Agent re-pull:** Yes, easily. Scrape the boletines index for the newest PDF link, download,
  `pdftotext -layout`, parse the "Machos Cebados" and "Hembras Cebadas" rows. Recommended weekly.

## 2. Fedegán — Precios (estadísticas) [S2, portal]

- **What it publishes:** National price statistics portal; underlying data feeds CONtexto Ganadero
  and the BMC/Fedegán department tables. Categories include macho gordo and flaco/levante and
  hembra; national series.
- **Latest figures (from Fedegán-FNG auction data, via reports):** national subasta avg ~$8,524/kg
  (week of Jan 10–16 2026); macho cebado 2 años up to $11,200/kg at Cencogán Planeta Rica with
  Medellín close behind (~$11,034) that week.
- **Cadence:** The landing page (`fedegan.org.co/estadisticas/precios`) is a portal/index; actual
  numbers sit behind a "Cifras Precios" interactive viewer, not a clean static table or PDF.
- **Accessibility / agent re-pull:** Poor directly — the index page exposes no figures to a fetcher;
  data is in an embedded viewer. **In practice, consume Fedegán's data via CONtexto Ganadero [S38]**,
  which republishes it weekly as readable HTML tables. Flag: portal numbers above are dated (Jan 2026).

## 3. CONtexto Ganadero — weekly "precio del ganado" [S38]

- **What it publishes:** Weekly HTML article ranking plazas by category (macho cebado, macho/hembra
  de levante, búfalos) with a **national average** for each, built on Fedegán-FNG auction data.
  Regularly highlights Medellín for macho cebado.
- **Latest figures — week of Apr 18–24 2026:**
  - Macho gordo: **Medellín $11,644** (#1, only plaza >11,000); Mercagan Bucaramanga 10,400; Catama
    (Meta) 10,200; Subacasanare 10,106. **National avg 9,411.**
  - Macho de levante: Subacasanare 12,027; Sugaberrío 11,474. National avg 10,239.
  - Hembra **de levante**: Sugaberrío 10,217; Doradaexpo 9,946. National avg 8,742.
  - (Earlier: week of Apr 2–10 2026 Medellín macho 11,391; hembra-de-levante top Acacías 10,600.)
- **Cadence:** Weekly. **Format:** readable HTML (easy to fetch/parse). **Agent re-pull:** Yes, weekly —
  good cross-check. **Limitation:** reports hembra *de levante*, not hembra *gorda*; for finished
  females use Central Ganadera [S37].

## 4. Bolsa Mercantil de Colombia (BMC) — ganado gordo comercial [S39, S25]

- **What it publishes:** "Tabla de precios indicativos de ganado bovino comercial (ganado macho
  gordo)" for ~9 departments, supplied jointly by Fedegán + BMC; republished weekly by trade media
  (e.g. agriculturayganaderia.com, periódico Agricultura & Ganadería). **Macho gordo only — no hembra
  breakout found.**
- **Latest figures (early Mar 2026):** Atlántico $10,543/kg (highest), Bogotá $10,400, **Antioquia
  $10,316** (#3); **national consolidated $9,885/kg**. (Older ref [S25]: nat. avg $7,860, Feb 2024.)
- **Cadence:** Weekly. **Format:** the BMC source table is published as an image; trade-press
  republishes are also largely image-based, so direct text extraction is unreliable.
- **Agent re-pull:** Marginal (image tables). Lower priority than [S37]/[S38]; useful only as an
  Antioquia-department cross-reference for macho gordo.

## 5. Subastas / Antioquia ferias [S40]

- **Subastar S.A. (subastar.com.co):** Operates commercial auctions and has a price-consultation
  section (`app.subastar.com.co/precio/`) and live broadcasts. Not Antioquia-feria-specific; no clean
  published series captured. The Medellín feria's own auction results are already covered inside the
  Central Ganadera boletín ("Subasta Comercial" table) [S37] — that is the relevant Antioquia auction
  series, so a separate Subastar pull is not needed for this ranch.

## 6. DANE / SIPSA / Agronet — NOT a fit for en-pie [S41]

- **Verified:** The SIPSA monthly/weekly boletines (DANE; mirrored on Agronet) report **wholesale
  prices of agricultural products and beef *cuts* (carne en canal/despiece — e.g. lomo fino de res,
  sobrebarriga de res), NOT live cattle (ganado en pie)**. Confirmed by extracting the Jan 2026 SIPSA
  monthly bulletin: it discusses "lomo fino de res" wholesale prices, no en-pie cattle series.
- **Conclusion:** Not usable for the ranch's en-pie sale benchmark. Could be a secondary reference
  for the *downstream* beef-cut market, not for what the ranch sells.

## 7. Frigorífico Fredonia / municipal plants — "precio de sustentación"

- **No published "precio de sustentación / concentración" found** for Frigorífico Municipal de
  Fredonia, Frigocentro, Central de Sacrificio de Riosucio, Planta de Faenado de Amagá, or Matadero
  La Virginia. These appear to be small municipal/regional slaughter plants that **buy at negotiated
  prices (often via comisionista), not at a published posted price.** This is a real gap: the ranch's
  ~half-of-sales channel (Fredonia) has **no public benchmark** — the closest proxies are the Central
  Ganadera hembra-cebada en-pie price [S37] (as a market ceiling) and any private quotes the
  comisionistas give. **Recommend the ranch log realized $/kg per Fredonia sale to build its own
  internal benchmark**, since no external one exists.

---

## Macho vs hembra, and Antioquia/Medellín specifics

- **Hembra gorda trades below macho gordo.** At Medellín, week of Apr 20–24 2026: hembra cebada avg
  **9,671** vs macho cebado avg **11,644** — hembra ~**17% lower**. This spread is the key fact for a
  ceba-de-hembras operation: the ranch is structurally selling the lower-priced category, so its
  realized prices should be benchmarked against the **hembra cebada line, not the headline macho
  number** the trade press leads with.
- **Medellín / Antioquia run hot for macho gordo.** Medellín is repeatedly the #1 national plaza for
  macho cebado in 2026 (the only one >$11,000/kg most weeks), ~20–24% above the national average.
  Antioquia also tops the BMC department table (~$10,316, #3 nationally). So Antioquia is a
  comparatively strong selling region — useful framing for the advisory.
- **2026 trend is upward** (Central Ganadera Feb→Apr: macho +~3%, hembra +~5%; CONtexto reported
  "fuertes alzas" to open 2026). Re-pull before quoting.

---

## Recommendation

1. **Primary, weekly:** Central Ganadera "Boletín de Precios Oficiales" [S37] — only source with
   **hembra cebada en-pie $/kg** (the ranch's main category) plus macho cebado. Automate the
   PDF pull + `pdftotext` parse of the Machos Cebados / Hembras Cebadas rows.
2. **Cross-check, weekly:** CONtexto Ganadero weekly price article [S38] — national avg + plaza
   ranking, readable HTML, validates the Medellín macho number.
3. Have the ranch record realized $/kg (and $/animal + weight) per sale, especially the Fredonia /
   slaughter-plant channel where no public benchmark exists, to build an internal series.

## Gaps / honesty notes

- **No public posted price for the Fredonia / municipal-plant channel** (~half of sales). Biggest gap.
- Fedegán figures cited are dated (Jan 2026) because the live data sits behind an interactive viewer;
  treat CONtexto [S38] as the current proxy.
- BMC department table (incl. Antioquia macho) is image-based and harder to automate; figure cited is
  early-Mar 2026.
- All en-pie prices are **feria/market** prices; the ranch's consignación sales net less after
  commission and plant rendimiento-en-canal pricing. Use the boletín as a reference ceiling.
- Prices drift weekly and were rising through 2026 — always re-pull before advising.
