# Plano 1:5000 (2003) — areas, potreros & the water system

> Source document: [`plano-aguas-2003.jpg`](plano-aguas-2003.jpg) — hand-drawn survey plan,
> **Mario Escobar R., ingeniero forestal**, Medellín, **enero de 2003**, escala 1:5000,
> archivo `GUAICO1A`, lámina N.º 01. Titled **"Hacienda El Guaico — Lote No. 1, Vereda El
> Mamoncillo, Municipio de La Pintada."** Owner field left blank on the plan.
>
> ⚠️ **The plan is 23 years old.** Treat every line on it as *the layout as of 2003* —
> good for structure and names, needing ground-truthing for what exists today. Especially
> the fences and the pipeline.

This is the first real land data the project has. It replaces the "~200 ha, subdivision TBD"
placeholder in [`../../profile.md`](../../profile.md) and gives
[`../pasture.md`](../pasture.md) something to work with.

## Orientation — the plan is rotated

The plan is **not** drawn north-up. Reading the grid ticks: Easting increases *upward*
along the side margin, Northing increases *leftward* along the bottom margin. So:

| On the page | Real direction | Cross-check |
|---|---|---|
| **Up** | **East** | "A Medellín" + the road sit at the top ✓ (Ruta 25 is the east edge) |
| **Down** | **West** | "Río Poblanco" runs along the bottom ✓ (the river is the west edge) |
| **Left** | **North** | Hacienda Texas on the left = the northern neighbour |
| **Right** | **South** | Lote No. 2, Hda. La Perla, Fernando González on the right |

This is consistent with the boundaries already recorded in [`location.md`](location.md) —
the plan confirms them independently.

## Cuadro de áreas — total 193.41 ha

Transcribed verbatim from the plan's area table:

| Use | Hectares | Share |
|---|---|---|
| **Potreros (10)** | **158.67** | 82.0% |
| Playón (es) | 21.90 | 11.3% |
| Sapal | 5.52 | 2.9% |
| Rastrojos | 3.60 | 1.9% |
| Cañaverales | 1.95 | 1.0% |
| Guaduales | 1.13 | 0.6% |
| Represas | 0.64 | 0.3% |
| **Total** | **193.41** | 100% |

**So the 2003 parcel was 193.41 ha, of which 158.67 ha was potrero.** ⚠️ But see
[`geo/README.md`](geo/README.md): the cadastre puts *today's* Sabaleticas at **151.85 ha**, so
these 2003 figures describe a larger property than we may now hold. The correct denominator
for carrying capacity is unresolved until that is settled.

### What this does to the stocking rate

| Denominator | Head/ha at 266 head |
|---|---|
| 200 ha (old placeholder) | 1.33 |
| 193.41 ha (the 2003 parcel) | 1.38 |
| 158.67 ha (2003 potrero) | 1.68 |
| **~117–125 ha (potrero, if today's area is the cadastre's 151.85 ha)** | **~2.13–2.27** |

Against the benchmarks in [`../../financials/diagnosis.md`](../../financials/diagnosis.md)
(national "losing" ~0.87/ha; rotated target 1–2/ha) the farm is **at best near the top of the
rotated-pasture range, and possibly above it.** Either way the read holds and hardens:
whatever is wrong is about **velocity and price, not about having too few animals** — and
adding head is the wrong instinct. If the cadastral area is the right one, we may need to
*reduce* head, which happens to be what the turnover diagnosis would recommend anyway.

## Named potreros (with areas on the plan)

| Potrero | Hectares |
|---|---|
| Lajas | 37.43 |
| Consuelo | 22.17 |
| Siberia | 22.11 |
| San Matías | 17.57 |
| Riachón | 12.45 |
| Jagüe | 11.65 |
| Abisinia | 9.94 |
| Balkanes | 7.94 |
| Verdún | 7.08 |
| **Sum of the 9 legible** | **148.34** |

⚠️ **Read these as blocks, not as the working paddocks.** The nine lettered areas sum to
148.34 against the table's 158.67, and the count "(10)" is the surveyor's aggregation for the
area table — **not** the number of fenced paddocks. The real subdivision is finer (see below).
The ~10.33 ha difference is unresolved on the scan; it stops mattering once areas are computed
from real polygons rather than transcribed.

Note **Lajas is 37.43 ha as a block** — but again, that's the block, not a single paddock.

### The real potreros — the named sub-divisions

**✅ Confirmed by Manuel (2026-08-21): the dozens of named sub-divisions ARE the potreros.**
They are fenced paddocks, and that is what they are called on the farm. Names on the plan:
*San Sebastián, Punta Cruceta, La Mancha, Mozambique, Tierradentro, Panamá, Piñón, Portugal,
Bilbao, El Silencio, Perfume, Kena, Paraíso, Alejandría, Lisboa, Barcelona, Samán, Mamoncillo,
Palma, Etiopía, Argelia, El Cairo, Congo, Rincón, Marruecos, Buenavista, El Bosque,
Sabaleticas…*

**And the farm has been subdivided further since 2003** — there are now *more* potreros than
the plan shows. Manuel will supply an updated plan later.

This is the single most useful thing the document told us, and it flips an earlier
assumption. The farm is **already finely subdivided**. Rotation is not blocked behind a
fencing investment — the infrastructure for it is on the ground today. That moves grazing
management from "needs capital" to "needs a plan and discipline," which is the cheapest
possible kind of fix and squarely inside the biggest lever we have
([`../pasture.md`](../pasture.md)).

The open question is no longer *can we rotate* but **what rotation is actually being run
today**, and whether rest periods are long enough.

## The water system — the real find

The file is named *"Plano Aguas"* and that's what it is: alongside the boundaries it maps a
**piped water distribution network**, legend `---- Tubería`. Visible on the plan:

- **Sources:** at least two **nacimientos** and a **manantial** (spring-fed), plus the
  **Río Poblanco** on the west edge and quebradas **Sabaletica**, **Buenavista** and
  **Cascajón** crossing the property.
- **Storage:** a **represa** of 0.64 ha near Verdún; a **tanque** near the entrance;
  **"Tanques Casa"** — a tank cluster by the house.
- **Distribution:** a dashed pipeline running the length of the farm with fittings
  annotated — **T** (tees) at several points and a **ventosa** (air-release valve, which
  means it climbs over a high point). Segment figures are noted along it (e.g. 38.23 m,
  170.79 m) and what looks like **"3 in"** pipe diameter.

### ⚠️ This water map is incomplete — and out of date in our favour

Per Manuel (2026-08-21): **the network drawn here is not the whole system** — it's the best
information he has been able to gather so far. Since 2003 the farm has also added
**substantial reservoir-tank storage in several places** that does not appear on the plan.

So treat the plan as a **partial, historical** picture of the water system: the springs,
represa and pipe runs it shows are real and useful, but absence from the plan proves nothing,
and the farm's true storage capacity is larger than drawn.

**Why this matters.** In *tierra caliente*, dry-season (verano) water is normally the binding
constraint on carrying capacity — which potreros have water decides which are usable at all
in verano, which decides whether the rotation can actually run. With a hard verano coming,
this has been promoted from a background question to **its own workstream** →
[`../water/README.md`](../water/README.md).

## Land tenure — resolved

**✅ Confirmed by Manuel (2026-08-21): this is the plan drawn *for* the subdivision, and
Lote No. 1 is today's Sabaleticas.** The larger Hacienda El Guaico was divided into four;
this 2003 survey is that subdivision, and our parcel is Lote No. 1. "Lote No. 2" on the
southern edge is a sibling parcel; the other two lie beyond it.

⚠️ **But the area does not survive contact with the cadastre.** Catastro Antioquia records
our parcel at **151.85 ha**, not 193.41 — and the missing 41.56 ha matches an adjacent parcel,
*AP 2 Parte Alta*, which Manuel says now belongs to a neighbour. So **Lote No. 1 as drawn in
2003 is larger than what we hold today.** The full analysis, and the possibility that we are
still being taxed on the difference, is in [`geo/README.md`](geo/README.md). Until it's
settled, treat **193.41 ha as the 2003 figure, not as our area**.

## What's now answered vs. still open

**Answered by this plan:** total area (193.41 ha), the pasture/non-pasture split, potrero
count and most potrero areas and names, the four boundaries (confirmed independently), the
existence and rough layout of a piped water system, and the streams and reservoirs.

Also confirmed since: the named sub-divisions are **real fenced potreros**, and Lote No. 1
is today's Sabaleticas.

**Still open:**
- **The current potrero layout** — the farm has been subdivided further since 2003. Manuel
  will supply an updated plan; until then we don't know today's paddock count or areas.
- **The full water system** — the plan is partial and predates the added reservoir tanks.
  → [`../water/README.md`](../water/README.md).
- Grass species per potrero — the plan shows no forage information at all.
- Whether the **playón** (21.90 ha) is grazed in verano, as river terraces usually are;
  if so, effective grazing area is larger than 158.67 in the dry season.
- A digital boundary — this scan can't give precise coordinates.
  → [`geo/README.md`](geo/README.md) is the plan for fixing that.

## Next step

**Digitize before tabulating.** Rather than transcribe the plan's numbers into a `potreros`
table, the better move is to build real geometry — then areas are *computed* from polygons
instead of copied off a 23-year-old scan (which also dissolves the missing-10.33-ha problem).
The approach and format decision live in [`geo/README.md`](geo/README.md); the data model
for the eventual table is in [`../pasture.md`](../pasture.md).
