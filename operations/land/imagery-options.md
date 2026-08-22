# Getting better imagery of the farm — options and verdict

> Researched 2026-08-21 at Manuel's request. **Bottom line: commercial satellite cannot
> answer the question we're asking, at any price.** Not because of cost — that objection is
> out of date — but because of physics.

## The decisive test: can you see a 1,000 L tank?

That is the whole question. A 1,000 L tank is roughly **1.2 m across**. Using Johnson's
criteria (~2 pixels to *detect* something is there, ~8 to *recognise* what it is, ~13 to
*identify* it):

| Task | Pixels | Required resolution | Available? |
|---|---|---|---|
| Detect "something is there" | ~2 | ≤ 0.6 m | Yes, marginally |
| **Recognise "that's a tank"** | **~8** | **≤ 0.15 m** | **No satellite on orbit** |
| Identify which tank, its condition | ~13 | ≤ 0.09 m | Drone only |

**Native commercial satellite bottoms out at 25–30 cm** (SuperView Neo-1 at 25 cm; WorldView
Legion and Pléiades Neo at 30 cm). The "15 cm HD" products sold by some vendors are
**upsampled from 30 cm** — they add no real information.

At 30 cm a 1.2 m tank is **4 pixels**: a bright dot you cannot tell from a boulder, a stump, a
feed drum, or a white cow lying down. A drone at 3 cm gives **40 pixels** across the same tank.

> ### So: buying satellite imagery would give us *currency*, not *detail*. It would not let us
> find the tanks.

## Cost — Manuel's assumption was reasonable but is now outdated

Sub-50 cm satellite used to be gated behind huge minimum orders, and via the classic resellers
it still is: Pléiades Neo 30 cm archive at ~$22.50/km² with a **25 km² minimum** (~$562), or
tasking at ~$32.50/km² with a **100 km² minimum** (~$3,250). SkySat tasking carries a flat
$15,000 minimum.

But marketplaces have negotiated those minimums down to **1 km²**. A fresh 30 cm capture of our
152 ha would run roughly **USD 44–165**, not thousands. So cost is no longer the objection —
**capability is.**

One local caveat: La Pintada sits in the tropical Andes, where persistent convective cloud
makes optical tasking unreliable. A tasked capture can wait weeks for a clear pass.

## Drone — the only option that clears the bar, and Manuel is right that it's expensive

Published Colombian rates run **COP 80,000–150,000/ha** for a basic 5 cm orthomosaic, and
150,000–280,000/ha with point cloud and terrain models. At 152 ha that implies roughly
**COP 12–23 million (~USD 3,900–7,400)** — 40× to 100× the satellite price.

Two qualifications: no Colombian operator publishes a real rate card, so these are blog
figures anchored on small parcels, and both sources note that jobs over 100 ha move to custom
quotation with per-hectare rates falling substantially. **The real number is probably below
that band — worth three quotes.**

Also relevant to us specifically: **our 230 m of relief makes terrain-following mandatory**,
both legally (the 122 m ceiling is above ground, not above takeoff) and for data quality.
Uneven terrain also pushes image overlap up, roughly doubling flight time.

## The free leads worth chasing first

1. 🟢 **Catastro Multipropósito.** La Pintada is in the 2024 Antioquia update, and an aerial
   sensor reportedly flew the municipality on **2023-02-08**, with deliverables explicitly
   including **ortofotos and a terrain model**. Contact the **Gerencia de Catastro Antioquia**.
   **This is the most likely route to current sub-metre coverage at zero cost** — and we
   already know Catastro Antioquia responds, since our whole boundary came from them.
2. **Esri Wayback** — a free archive of past basemap releases, swipe-comparable. ⚠️ See the
   verification note below.
3. **Sentinel-2 NDVI** (10 m, free, ~5-day revisit) — useless for tanks, genuinely good for
   **pasture monitoring**, which is a different job we will want later.

### ⚠️ Verification note

The research flagged a **0.31 m WorldView-3 frame from March 2017** as sitting in Esri Wayback
for our coordinate. **I could not reproduce this.** Probing Wayback releases at our exact tile,
zoom 19 (which 0.31 m imagery would support) returned *no data* in every release tested, and
the one release that did serve our tile served it only at zoom 18 — the same ~0.6 m we already
have.

That does not disprove it: Wayback stores only tiles that *changed* in each release, so a
correct probe has to walk back through releases, and I tested only a handful. **Treat the
0.31 m claim as unconfirmed.** It costs ten minutes to check by hand in the
[Wayback viewer](https://livingatlas.arcgis.com/wayback/) if curiosity strikes.

## Recommended sequence

1. **Free, this week:** ask Catastro Antioquia for the Catastro Multipropósito orthophoto and
   DTM for La Pintada. Highest chance of a real improvement at zero cost.
2. **Skip commercial satellite entirely.** It is the one option that costs money without
   solving the problem.
3. **Only quote drones if an imagery-based tank inventory is still the goal after step 1** —
   and get three quotes, because published rates overstate what a 152 ha job should cost.

## The honest caveat on all of it

> **Imagery tells you *where* a tank is. It does not tell you whether it holds water, whether
> the float valve works, or whether the line into it is blocked.**

For building the asset register we actually need, **walking the farm with a phone GPS costs
nothing and produces a better result** — position *and* condition *and* function. That is
precisely what Manuel has been doing by reading coordinates off the viewer, and it has already
placed the tanks, the rompecargas and the reservoir more reliably than any image would have.

The drone earns its money at the point where we need a **surface model for water-system
design** — pipe routing, gravity head, catchment — which imagery alone can't give and the free
5 m terrain model only approximates. Notably, that is exactly the question left open by the
[El Guaico gravity route](../water/README.md), where our margin is 0.2 m and the terrain model
carries ±1–2 m of error. **If a drone gets bought, that is the justification** — not counting
tanks.

---

# Price trend — Manuel's question answered

> Researched 2026-08-21. **Parked; not yet discussed.**
> Manuel: *"I know it has gone down dramatically since so many companies have been launching...
> even if it's not an option today, it might become an option one day."*

## He is right that it collapsed — but not for the reason he thinks

**The per-km² rate has not fallen. For Western 30 cm it is flat to slightly *up* since 2020.**

| Sensor, archive $/km² | Jan 2020 | May 2026 |
|---|---|---|
| WorldView 30 cm | $22.50 | **$24.00** |
| Pléiades Neo 30 cm | — | $22.50 |
| Maxar 50 cm | $17.50 | $15.00 |

What actually collapsed is the **minimum order area**, and for a farm-sized buyer that is the
only number that ever mattered:

| Buying a **3 km²** archive image | 30 cm |
|---|---|
| Traditional reseller, 2020 (25 km² minimum) | 25 × $22.50 = **$562** |
| Traditional reseller, today (still 25 km² minimum) | 25 × $24.00 = **$600** |
| **Marketplace today (1 km² minimum)** | 3 × $19 = **$57** |

> ### A ~10× fall in what we would actually pay — delivered entirely by the minimum dropping
> from 25 km² to 1 km², not by imagery getting cheaper.

The traditional-reseller floor is **almost exactly what it was in 2020**, because their 25 km²
minimum never moved. **So the single decision worth making is the channel, not the sensor:**
buy through **SkyWatch** or **SkyFi**, never a classic reseller, unless the area is big enough
that 25 km² isn't wasted.

**Tasking minimums fell too, and very recently.** SkyWatch now advertises **1 km² minimum for
30–49 cm tasking** — roughly **$87 for our 3 km²**, against ~$3,250 at a traditional reseller's
100 km² minimum. If that holds in practice it is the most significant development here.

## Should we wait? Modestly, no

The reasons to expect further falls are weaker than the launch headlines suggest:

- **Added capacity has not cut prices.** WorldView Legion's six satellites roughly *doubled*
  30 cm capacity, and the archive rate went **up** $22.50 → $24. The extra supply went into
  premium guaranteed-collection tiers instead.
- **Albedo — the 10 cm hope — has failed.** Clarity-1 launched March 2025, a bearing failed a
  month later, it never achieved stable pointing, and contact was lost around December 2025.
  The company **never sold a single image** and has left the imagery business.
- **Planet Pelican is still 50 cm.** The 30 cm version is "coming soon" with no announced price.
- BlackSky sells six-to-eight-figure subscriptions and has no interest in small buyers.

The one genuine deflation is **Chinese sensors** — SuperView fell 25–33% in eighteen months,
and **BJ3N offers 30 cm at $16/km²**, the cheapest on the market. Worth knowing: **Colombia can
buy these.** The export restrictions run the other way, barring sales *into* China, North Korea
and Iran; Colombia appears on no restricted list.

> **Bottom line: the price fall Manuel expected has already happened, in the last two years,
> and it came from minimum order sizes rather than rates. Waiting longer buys little.**
> The ~$57 figure does not change the conclusion at the top of this document — 30 cm still
> cannot resolve a 1,000 L tank — but it does make **periodic pasture snapshots** cheap enough
> to be a real option, which is the use Manuel actually described.
