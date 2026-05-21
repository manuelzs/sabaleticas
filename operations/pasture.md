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

## Data model (to add when the farm plan arrives)

Two new tables, same CSV→SQLite pattern as the rest:

- `potreros(id, name, area_ha, grass_species, water_source, notes)`
- `grazing_events(id, potrero_id, group, head, date_in, date_out, notes)`

With those plus weights, we can compute **kg of gain produced per hectare** — the
real productivity number for the farm — and see which potreros and grasses perform.

## Farm plans / maps

When you send plans of the farm, they go in `operations/land/` (images or PDFs).
From a map I can help lay out the potrero list, estimate areas, and design a
**rotation** if one isn't already running.

## Forage notes (to confirm on the ground)

Tierra caliente Antioquia typically runs improved tropical grasses — *braquiaria*
(Urochloa/Brachiaria), *estrella* (Cynodon), *guinea/india* (Megathyrsus). What we
actually have at Sabaleticas is **TBD** — we'll inventory it. The research briefing
([`../research/colombia-cattle-profitability.md`](../research/colombia-cattle-profitability.md),
in progress) will give benchmarks for what good pasture should deliver here.

_Nothing measured yet — waiting on the farm plan and a forage walk-through._
