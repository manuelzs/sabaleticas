# The working plan

> **Consolidated 2026-08-22**, after a long session mapping the water system. This is the
> single place to see what is open, what it depends on, and who has to do it.
> Detail lives in the linked documents — this page is the index, not the content.

## The thing that has not changed

> ### The operation loses money every month, and we still cannot say why.
> The diagnosis is blocked on cost and sale records
> ([`data-inventory.md`](data-inventory.md)). The accountant's first delivery is due
> **~end of August 2026** ([`financials/accounting-feed.md`](financials/accounting-feed.md)).
> **Everything below is worth doing. None of it replaces that.**

---

## 1 · Water — the acute failure *(a free fix is waiting)*

The rompecargas empties in under two hours, air enters, and the bebederos stop.
Diagnosed in [`operations/water/README.md`](operations/water/README.md).

| | Action | Who | Cost |
|---|---|---|---|
| **1.1** | **Throttle the outlet valve permanently.** Manuel already does this as a rescue — make it a setting | field | **nothing** |
| 1.2 | Raise the outlet draw-off inside the chamber so it cannot draw air | field | very low |
| 1.3 | Ventosa at the inlet summit | field | low |
| 1.4 | Give the garden a higher take-off than the cattle on the intermedios | field | low |
| **1.5** | **Two stopwatch measurements** — fill time and drain time — settle the diagnosis | field | nothing |

**Blocked on:** one visit. Nothing here needs a survey or a purchase.

## 2 · Water — the storage imbalance *(the best value in the system)*

**60.000 L sits on the garden. The northern cattle have none**, and that volume is stranded
downhill of the T del norte.

| | Action | Cost |
|---|---|---|
| 2.1 | **A poly tank on the north branch** — ~1.5 days of buffer for the cattle | low |
| 2.2 | **Cross-tie intermedios → north branch** — 430 m, 0.4 m of climb, all on our land | low |

## 3 · Water — the represa, and retiring the pump

Three routes, in order of preference. [`operations/water/pump-costing.md`](operations/water/pump-costing.md)
is costed against a duty that may not survive.

| | Route | Lift | Permission |
|---|---|---|---|
| **A** | Through El Guaico | **none** | servidumbre needed |
| **B** | **Our land, contour-routed** | **6.6 m (~50 W)** | **none** |
| C | The original direct line | 33 m (~200 W) | retire it |

**Next step: run a level along the ridge.** A day's work, and it is the cheapest high-value
action in the whole water project.

## 4 · Water — finish the map *(mostly free)*

25 nodes, 23 edges mapped. The network now passes its own physical check.

**Talk to whoever has maintained the plan for twenty years — before commissioning anything.**
Most of the open questions are one conversation.

- Which T feeds Bebedero 1 — T-2 or T-3? *(terrain says T-2, on 3 m of head)*
- **Shut T-4's valve and see which trough goes dry.** The definitive test
- Where Bebederos 5-6-7 connect *(hypothesis: a T at or before Bebedero 3)*
- Sweep the 2003 plan for **more ventosas, and for purgas**
- **Locate the two bocatomas** — off-property, east, still unmapped
- **Read the concesión: the caudal in L/s.** The legal ceiling on supply

## 4b · Re-pull the V5 guides *with the head count* — one task, large payoff

`[derived, 2026-08-22]` All 3 **V6** guides carry a head count; only 3 of 82 **V5** guides do.
That is our export dropping the field, **not SINIGAN failing to record it**.

It matters because a known count plus a complete movement ledger reconstructs the herd
backwards through time. From 266 at 2026-05-21 the six counted guides already give
**303 in February → 259 after 25 May**. Re-pull the V5 guides with the field and **17 months of
herd history** open up — turnover, days-on-farm, and what the herd was when each cost was
incurred. See [`herd/movements.md`](herd/movements.md).

## 5 · Potreros — the biggest unblock in the project

> Grass, cattle location, rest periods, kg per hectare — **every one of them waits on this.**

Manuel's rule: **all enclosures are closed polygons.** So: take IGAC's incomplete `Cerca`
lines, find the dangling ends, close them against the orthophoto, and the faces of the
resulting planar graph *are* the potreros. The same move we just made with water, applied to
land. Manuel supplies the names.

**This is the one I would do next.** No hardware, no survey, no money.

## 6 · The dashboard application

**Moved out.** The app has its own plan and its own to-dos:
[`dashboard/PLAN.md`](dashboard/PLAN.md). It is a tool for running the farm, not part of
running it — mixing the two made both harder to read.

What the farm side needs to know: the water system is mapped, the schematic exists, and the
verification checklist regenerates itself from the data.

## 7 · Sensors — the farm side

Hardware, siting and connectivity: [`operations/water/sensors.md`](operations/water/sensors.md).
LoRa, not cellular. **Deliberately price-free** until researched.

**Rule: fix first, measure second.** A sensor would have reported the rompecargas emptying; it
would not have stopped it.

- The rompecargas wants **two float switches, not an ultrasonic** — it is a buried concrete pit.
- A **sight tube and a daily photo** costs almost nothing and would have caught this months ago.

## 7b · Lluvia — el insumo que falta para casi todo

`[Manuel, 2026-08-22]` *"Necesitamos mejor información del clima, sobre todo lluvia."*

Sin lluvia, la autonomía de agua es un número estático cuando debería ser un **pronóstico**, y
el crecimiento del pasto no tiene explicación. Es el dato que conecta agua, potreros y ganado.

**Mañana:** buscar una **estación cercana** que sirva de proxy — IDEAM u otra fuente pública.
La pregunta que decide cuál sirve: **a qué altura está.** La Pintada es tierra caliente; una
estación de altura no representa esta lluvia.

**A futuro:** una estación sencilla **en la finca**. En terreno quebrado la lluvia es muy local,
así que el proxy sirve para empezar y no para siempre.

Registrada como fuente en
[`operations/sensors/sources.json`](operations/sensors/sources.json) — entra por el mismo
camino que todo lo demás, con `origen: scraped`.

## 8 · Land and paperwork *(Manuel, when convenient)*

- **Impuesto predial** — which predios, what área
- **Certificado de tradición** for 023-16153, and the northern-triangle linderos
- Nine unknown neighbour owners — **Bellavista matters most** (it holds the disputed triangle)
- The **concesión de aguas** — see 4

---

## If you only do three things

1. **Throttle the rompecargas outlet.** Free, today, fixes the live failure.
2. **Close the potrero polygons.** Unblocks more of this project than anything else.
3. **Level the ridge for the gravity route.** Decides whether the pump project exists at all.

_The dashboard has its own plan: [`dashboard/PLAN.md`](dashboard/PLAN.md)._
