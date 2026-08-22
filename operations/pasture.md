# Pasture, land & grazing

Why this matters for the money: on a fattening operation, **pasture is the feed
bill you don't see**. Daily gain (GDP) is mostly decided by forage quantity and
quality, and how well grazing is managed (rest and rotation). This is hypothesis
**H2** in [`../financials/diagnosis.md`](../financials/diagnosis.md) and probably
the biggest lever we have. So tracking land use isn't bookkeeping — it's directly
about profit.

## What we want to track (your ideas, structured)

1. **The land itself** — a map of the farm divided into **potreros** (paddocks),
   with area, water access, and the grass growing in each.
2. **Grazing history** — which group of cattle was in which potrero, and when
   (in/out dates). This gives us rotation, rest periods, and where animals
   actually gained.
3. **Forage inventory** — what grasses (and legumes) we have, their condition,
   and where. Lets us judge carrying capacity and improvement opportunities.

## Watching it from space

Researched and parked: [`pasture-monitoring.md`](pasture-monitoring.md). Short version — the
free tooling (Copernicus Browser, plus Auravant's free tier which has a **grazing-circuit
module in Spanish**) costs nothing and we are ~130,000× under the free quota. But **cloud is
the real limit** (zero scenes under 10% cloud over a full year at tile level), **NDVI saturates
exactly at grazing entry**, and **our ~47 ha of trees bias it by ~0.2 NDVI**. Useful as a
*relative* paddock ranking; poor as an absolute kg-of-grass number.

## Data model (to add when the farm plan arrives)

Two new tables, same CSV→SQLite pattern as the rest:

- `potreros(id, name, area_ha, grass_species, water_source, notes)`
- `grazing_events(id, potrero_id, group, head, date_in, date_out, notes)`

With those plus weights, we can compute **kg of gain produced per hectare** — the
real productivity number for the farm — and see which potreros and grasses perform.

## Farm plans / maps

✅ **The plan arrived (2026-08-21):** the 1:5000 survey of enero 2003 —
[`land/plano-2003.md`](land/plano-2003.md). It gives us **193.41 ha total, of which 158.67 ha
is potrero across 10 paddocks**, their names and areas, and a mapped **water distribution
network**. What it does *not* give: grass species, current fence status, or the condition of
the water system today.

**The key fact, confirmed by Manuel (2026-08-21): the dozens of named sub-parcels on the plan
are real fenced potreros — and the farm has been subdivided further since.**

That is very good news, and it reframes this whole document. **The farm is already finely
subdivided, so rotation is not blocked behind a fencing investment.** The infrastructure
exists. What we don't know is whether it's being *used* — how many days cattle spend in a
potrero, and how long it rests before they come back.

So the question here is no longer "can we rotate?" but:

- **What rotation is actually running today?** Days in, days of rest, which order.
- **Is the rest period long enough** for the grass to recover before it's grazed again?
  Grazing a paddock again too early is the classic way to degrade good pasture and lose daily
  gain without spending a peso on anything.
- **Which potreros are usable in verano** — a water question, not a grass question
  ([`water/README.md`](water/README.md)).

Rotation discipline is now the cheapest lever we have: no capital, just a plan.

## Forage notes (to confirm on the ground)

Tierra caliente Antioquia typically runs improved tropical grasses — *braquiaria*
(Urochloa/Brachiaria), *estrella* (Cynodon), *guinea/india* (Megathyrsus). What we
actually have at Sabaleticas is **TBD** — we'll inventory it. The research briefing
([`../research/colombia-cattle-profitability.md`](../research/colombia-cattle-profitability.md),
in progress) will give benchmarks for what good pasture should deliver here.

_Areas now known from the 2003 plan; grass species and current condition still need a forage
walk-through._
