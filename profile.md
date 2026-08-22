# Operation Profile

The single source of truth for the basics. Updated as we learn more.
_Anything marked TBD is unconfirmed — fill in when known._

> ## 🔴 Live risk: El Niño
> A **very strong, possibly historic** El Niño is forecast for late 2026 into 2027, and
> **both our water sources are surface intakes on quebradas** — the exact thing it dries up.
> Storage gives ~5–7 days of autonomy. See [`operations/water/`](operations/water/README.md).

> ## ⚠️ The core problem
> **The operation is losing money every month.** This is why the advisory project
> exists. The north star is: **stop the monthly loss, then build toward profit.**
> Working diagnosis and the minimal data needed to find the leak are in
> [`financials/diagnosis.md`](financials/diagnosis.md).

## Identity

- **Name:** Hacienda Sabaleticas
- **Location:** La Pintada, suroeste de Antioquia, Colombia
- **Setting:** *Tierra caliente*, Cauca river valley. **Elevation 628–821 m, 191 m of vertical
  range** `[IGAC terrain model, sampled 2026-08-21]` — corrects the unsourced "~550–600 m"
  carried since the first commit. Median slope 10.8°; ~22% of the farm is steep (15–25°).
  See [`operations/land/geo/terrain-and-climate.md`](operations/land/geo/terrain-and-climate.md)
- **Owner:** Manuel
- **Advisor:** Claude

## The land

Every figure below carries its provenance — see the convention in
[`AGENTS.md`](AGENTS.md). Two documents disagree about the area and **the disagreement is not
resolved**; both are shown rather than picking one silently.

- **Total area: 151.85 ha** `[cadastre — Catastro Antioquia, parcel AP 1 SABALETITAS,
  matrícula 023-16153, computed from the official polygon 2026-08-21]`. **This is the best
  evidence we have and the number to use.**
  - ⚠️ **But a 41.56 ha discrepancy is open and unexplained.** The 2003 survey plan's *Lote
    No. 1* was **193.41 ha** `[plano 2003]`. Where the difference went is **not established** —
    see [`operations/land/geo/README.md`](operations/land/geo/README.md).
  - ~~"~200 ha"~~ `[owner, unverified — and wrong]`. Carried from the first commit with no
    source. Superseded 2026-08-21. Kept visible as a caution.
- **Usable pasture:** **158.67 ha** of potrero `[plano 2003]` — but that is 82% *of the 2003
  parcel*, so it inherits the unresolved area gap. Rest: playón 21.90, sapal 5.52, rastrojos
  3.60, cañaverales 1.95, guaduales 1.13, represas 0.64 `[plano 2003]`
- **Blocks on the 2003 plan:** Lajas 37.43 · Consuelo 22.17 · Siberia 22.11 · San Matías 17.57 ·
  Riachón 12.45 · Jagüe 11.65 · Abisinia 9.94 · Balkanes 7.94 · Verdún 7.08
- **Pasture type / grasses:** TBD (likely improved tropical — braquiaria, estrella, guinea — _to confirm_; the plan carries no forage data)
- **Water:** Río Poblanco (west edge) `[orthophoto + cadastre]`, quebradas Sabaletica /
  Buenavista / Cascajón `[plano 2003]`, **4 mapped water bodies inside the parcel**
  `[IGAC 1:5000]`, a 0.64 ha represa + nacimientos + a piped network `[plano 2003, partial]`,
  plus **reservoir-tank storage added since 2003** `[owner, unverified]`.
  → active workstream: [`operations/water/`](operations/water/README.md)
- **Land cover:** **~47 ha forest / ~105 ha open** `[derived: IGAC 1:5000 Bosque ∩ parcel]`.
  Much of the forest is gallery woodland along the quebradas and hedgerows, so it is *not* all
  lost to grazing — but the open-land figure is the honest lower bound for grazing area
- **Subdivision:** **finely subdivided into many fenced potreros** `[owner, corroborated by
  the 0.5 m orthophoto — hedgerows and fence lines are clearly visible dividing the pasture
  into blocks]`. The dozens of named parcels on the 2003 plan (Bilbao, Siberia, Portugal,
  Marruecos, El Cairo…) are real paddocks, and more have been added since `[owner,
  unverified]`. Current count and layout: TBD. **Rotation actually being run today: TBD — the
  key pasture question**
- **Owned vs. leased:** TBD

## The herd

- **Total head:** ⚠️ **266 is stale** `[SINIGAN, 2026-05-21]` — **sales in progress since**, so the real number is lower and moving. Treat 266 as a conservative upper bound
- **Operation type:** **Ceba de hembras** — buy **females**, fatten, sell on weight. Females are the deliberate strategy.
- **Born-on-farm calves:** some purchased females arrive **pregnant**; their calves are born here, raised to weaning, and sold around then — **not fattened**. The 10 males in the herd are these born-on-farm animals.
- **Breed(s):** TBD (likely Cebú/Brahman or crosses — _to confirm_)
- **Class breakdown:** see [`herd/inventory.md`](herd/inventory.md) — 256 hembras / 10 machos

### Composition (SINIGAN, 2026-05-21)

| Grupo etario | Head |
|---|---|
| Hembras 2–3 años | 135 |
| Hembras 1–2 años | 102 |
| Hembras 9–12 meses | 10 |
| Hembras 3–5 años | 7 |
| Hembras 3–9 meses | 1 |
| Hembras < 3 meses | 1 |
| Machos 3–9 meses | 5 |
| Machos 2–3 años | 4 |
| Machos 1–2 años | 1 |
| **Total** | **266** |

> ❓ To verify with weights: 5 males are 3–9 mo (fit the weaning-calf story) but 4 are 2–3 yr and 1 is 1–2 yr — older than weaning. Either unsold or an exception to "sell at weaning."

## The business

- **Revenue model:** sell fattened females by weight; profit = (sale value − purchase cost − inputs) on the **kilos gained**. Secondary: sale of born-on-farm calves at weaning.
- **Sales channels:** TBD (subasta/feria, comisionista, direct)
- **Sourcing:** buy females in lotes from various sources — _tracking source performance is a goal_
- **Labor:** TBD (mayordomo, vaqueros, headcount, pay)
- **Stocking rate: ~2.1–2.3 head/ha** `[derived: 266 head ÷ ~117–125 ha of potrero, using the
  cadastral 151.85 ha]` — **above** the 1–2/ha rotated-pasture benchmark, i.e. **overstocked**.
  On the older 193.41 ha basis it would be 1.68/ha, near the top of the range. Either way the
  direction is the same and it matters for the coming verano
  ([`operations/water/`](operations/water/README.md)).

## Systems of record

- **SINIGAN / ICA (SNIITA)** — official national registry. Holds the animal roster (system IDs, sex, grupo etario, estado) and movement guías. **One predio = Sabaleticas** (other predios shown in the app are a known V6 bug). Does **not** hold our weights or financials. V6 is new and buggy; a read-only V5 also exists.
- **Our own records** — weights, purchases, sales, costs — live outside SINIGAN (to be imported). These drive the margin analysis.

## Records that exist today (to be imported)

- ✅ Financial records
- ✅ Precise herd count
- ✅ Vaccination records
- ✅ Land records

## Tracking model

Track at **two levels** (see [`herd/`](herd/)):
- **Individual animal** — ear tag, weights over time (we weigh individually)
- **Lote (batch)** — how cattle are bought and sold; lets us compare **performance by source** over time

## Open questions

1. Class breakdown of the 266 head (and how many are the born-at-farm calves)?
2. Pasture: the farm is already finely divided into fenced potreros — so **what rotation is
   actually being run today**, with what rest periods, and what grasses are in them?
3. Sales & sourcing channels — who do we buy from and sell to?
4. Who does the work, and what does labor cost?
5. In what form are the financial / vaccination / land records (paper, Excel, app)?
