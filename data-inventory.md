# Data inventory — everything I need from you

The single tracker of every kind of information this advisory needs, what we already have,
what's missing, and **whether it's one-off or recurring.** When something lands, update its
row. Companion docs: [`financials/owner-records-request.md`](financials/owner-records-request.md)
(the fill-in templates for the money records) and the per-area READMEs.

**Status:** ✅ have · 🟡 partial / low-confidence · ❌ missing
**Cadence:** *One-off* = give once, update occasionally · *Recurring* = ongoing (frequency noted)

---

## Start here — the 4 things that unblock the P&L (highest priority)

These four build the 12-month P&L and confirm the core diagnosis (why we're losing money).
Everything else can wait behind them.

| # | What | Status | Cadence | Lands in |
|---|---|---|---|---|
| 1 | **Sales, last 12 mo** — date, head, total kg en pie, COP received, buyer, channel, comisionista | ❌ | One-off (history) + Recurring per sale | [`financials/intake/sales_intake.csv`](financials/intake/sales_intake.csv) → `sales` |
| 2 | **Purchases, last 12 mo** — date, head, entry kg, COP paid, source/feria, lot name | ❌ | One-off (history) + Recurring per purchase | [`financials/intake/purchases_intake.csv`](financials/intake/purchases_intake.csv) → `lotes` |
| 3 | **Monthly costs, last 12 mo** — by category (labor, feed, health, pasture, transport, admin) | ❌ | One-off (history) + Recurring monthly | [`financials/intake/costs_intake.csv`](financials/intake/costs_intake.csv) → `costs` |
| 4 | **Lot history** — which lot each animal/group entered with & when it left | ❌ | One-off (history) + Recurring per event | `lotes` ↔ `sales.lote_id` |

---

## Herd & animals

| What | Status | Cadence | Notes |
|---|---|---|---|
| Current roster / head count | 🟡 | One-off (re-validate) | SINIGAN ~266; ages roughly right, low confidence ([`herd/inventory.md`](herd/inventory.md)) |
| Lot purchase records (entry) | ❌ | One-off + Recurring per purchase | Same as P&L #2; the spine of everything per-lote |
| Lot exits (which lot a sale came from) | ❌ | Recurring per sale | Same as P&L #4; gives days-on-farm → real turnover |
| **Weighings (báscula)** | ❌ | Recurring (per lot, ~every 1–2 mo) | Unlocks GDP (ganancia diaria de peso) — the core ceba metric. None yet |
| Mortality / losses / forced sales | ❌ | Recurring per event | Date, lot, head, cause — affects turnover & cost per finished animal |
| Births on farm (calves from pregnant purchases) | ❌ | Recurring per event | The few machos + youngest hembras; sold at weaning, not fattened |

## Revenue & selling channels

| What | Status | Cadence | Notes |
|---|---|---|---|
| Realized sale prices ($/kg or total) | ❌ | One-off + Recurring | GSMI has the movements but **never** prices — this is the #1 gap |
| Channel & commission terms | ❌ | One-off + update | Commission % per comisionista (ELUPI, Agroequina); consignación vs. PSE terms |
| Sale movement guías (cadence, destinations) | ✅ | — | 84 guías loaded ([`herd/movements.md`](herd/movements.md)); head counts mostly missing |

## Costs & financials

| What | Status | Cadence | Notes |
|---|---|---|---|
| Operating costs by category | ❌ | One-off + Recurring monthly | Same as P&L #3 |
| Finance costs (loan interest), taxes, insurance | ❌ | Recurring | Roll into `costs` once known |
| Market price benchmarks | ✅ | Recurring (weekly auto-pull) | Central Ganadera Medellín ([`sabaleticas prices show`](README.md)) |

## Capital & balance sheet

| What | Status | Cadence | Notes |
|---|---|---|---|
| Land — owned vs. rented, area, value | ❌ | One-off + update | 200 ha; rent terms if any |
| Herd value (capital tied up) | ❌ | One-off + periodic | Derivable once we have $/kg + weights; sizes the "slow capital" problem |
| Equipment / machinery / infrastructure value | ❌ | One-off + update | — |
| Debts / loans / financing terms | ❌ | One-off + update | Interest is a real monthly cost if present |

## Operations & land

| What | Status | Cadence | Notes |
|---|---|---|---|
| **Farm map / potrero layout** | 🟡 | One-off + occasional | Entrance pin received ([`operations/land/location.md`](operations/land/location.md)); **boundary map coming from owner**. Then: area, water, grass per paddock |
| Grazing history (group, potrero, in/out dates) | ❌ | Recurring per move | Enables kg-gain-per-hectare; **parked until weights exist** (your call) |
| Forage condition & improvements (fertilizing, renovation) | ❌ | Recurring / seasonal | What grasses we actually have is TBD |
| Infrastructure (corrals, fencing, water, is there a báscula?) | ❌ | One-off | Whether a scale exists decides how fast we get weights |
| Yearly operational calendar | ❌ | One-off | Vaccination, deworming, breeding, weaning, sale seasons vs. invierno/verano |

## Labor / workers

| What | Status | Cadence | Notes |
|---|---|---|---|
| Worker roster & roles | ❌ | One-off + update | Mayordomo, jornaleros; headcount, full/part-time; who decides when to sell |
| Wages / payments per worker | ❌ | Recurring monthly | Also feeds the `labor` cost category → goes in [`operations/labor.md`](operations/README.md) |

## Animal health & inputs

| What | Status | Cadence | Notes |
|---|---|---|---|
| Sanitary calendar (vaccines, deworming, products) | ❌ | Recurring / seasonal | — |
| Input usage (sal mineralizada, melaza, supplements) | ❌ | Recurring | Quantities + cost → `feed` category |
| Veterinary events / treatments | ❌ | Recurring per event | — |

## Context & strategy

| What | Status | Cadence | Notes |
|---|---|---|---|
| Goals, time horizon, constraints, your involvement | 🟡 | One-off + update | Partly in [`profile.md`](profile.md); refine as we go |

---

## How to hand things over

- **Structured records** → fill the CSV templates in [`financials/intake/`](financials/intake/),
  or just send whatever format you have (spreadsheet, photos of a notebook, WhatsApp dump) and
  I'll structure it. **Approximate and complete beats exact and partial.**
- **Maps / documents** → drop images or PDFs; for the farm map, `operations/land/`.
- I load everything into the canonical CSVs → rebuild `sabaleticas.db` → run the analysis.
