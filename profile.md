# Operation Profile

The single source of truth for the basics. Updated as we learn more.
_Anything marked TBD is unconfirmed — fill in when known._

> ## ⚠️ The core problem
> **The operation is losing money every month.** This is why the advisory project
> exists. The north star is: **stop the monthly loss, then build toward profit.**
> Working diagnosis and the minimal data needed to find the leak are in
> [`financials/diagnosis.md`](financials/diagnosis.md).

## Identity

- **Name:** Hacienda Sabaleticas
- **Location:** La Pintada, suroeste de Antioquia, Colombia
- **Setting:** *Tierra caliente* on the Cauca river (~hot lowland, ~550–600 m)
- **Owner:** Manuel
- **Advisor:** Claude

## The land

Source: the 1:5000 survey plan of **enero 2003** — see
[`operations/land/plano-2003.md`](operations/land/plano-2003.md). Areas are from that plan
and are 23 years old; layout on the ground still to be confirmed.

- **Total area:** **193.41 ha** (titled area per the plan — the old "~200 ha" was a round number)
- **Usable pasture:** **158.67 ha in 10 potreros** (82% of the farm). Rest: playón 21.90,
  sapal 5.52, rastrojos 3.60, cañaverales 1.95, guaduales 1.13, represas 0.64
- **Largest potreros:** Lajas 37.43 · Consuelo 22.17 · Siberia 22.11 · San Matías 17.57 ·
  Riachón 12.45 · Jagüe 11.65 · Abisinia 9.94 · Balkanes 7.94 · Verdún 7.08
- **Pasture type / grasses:** TBD (likely improved tropical — braquiaria, estrella, guinea — _to confirm_; the plan carries no forage data)
- **Water:** Río Poblanco (west edge), quebradas Sabaletica / Buenavista / Cascajón, a
  0.64 ha represa, at least two nacimientos + a manantial, and a **piped network to tanks**
  drawn on the 2003 plan. **Condition today unknown — a top ground-truth question**
- **Subdivision:** 10 potreros on the plan, plus dozens of named sub-parcels whose fence
  status is unknown. Rotation system: TBD
- **Owned vs. leased:** TBD

## The herd

- **Total head:** 266 (per SINIGAN registry, 2026-05-21, all VIVO)
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
- **Stocking rate:** **~1.68 head/ha on actual potrero** _(266 ÷ 158.67)_ — near the top
  of the 1–2/ha rotated-pasture benchmark, i.e. **not under-stocked**. (1.38/ha if measured
  against the full 193.41 ha titled area.)

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
2. Pasture: the 2003 plan gives 10 potreros and their areas — but **do those fences still
   stand**, are the dozens of sub-names fenced paddocks or just place names, what grasses,
   and is any rotation running?
3. Sales & sourcing channels — who do we buy from and sell to?
4. Who does the work, and what does labor cost?
5. In what form are the financial / vaccination / land records (paper, Excel, app)?
