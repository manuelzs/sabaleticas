# Operation Profile

The single source of truth for the basics. Updated as we learn more.
_Anything marked TBD is unconfirmed — fill in when known._

## Identity

- **Name:** Hacienda Sabaleticas
- **Location:** La Pintada, suroeste de Antioquia, Colombia
- **Setting:** *Tierra caliente* on the Cauca river (~hot lowland, ~550–600 m)
- **Owner:** Manuel
- **Advisor:** Claude

## The land

- **Total area:** ~200 hectares
- **Usable pasture:** TBD
- **Pasture type / grasses:** TBD (likely improved tropical — braquiaria, estrella, guinea — _to confirm_)
- **Water:** TBD (Cauca river frontage? quebradas, ponds, troughs)
- **Subdivision:** TBD (number of potreros, rotation?)
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
- **Stocking rate:** ~1.33 head/ha at current numbers _(266 ÷ 200)_

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
2. Pasture: how many potreros, what grasses, rotation system?
3. Sales & sourcing channels — who do we buy from and sell to?
4. Who does the work, and what does labor cost?
5. In what form are the financial / vaccination / land records (paper, Excel, app)?
