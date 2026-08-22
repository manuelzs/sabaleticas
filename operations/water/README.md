# Water — capacity for the coming verano

> **Status: project opened 2026-08-21 at Manuel's request. Not yet discussed.**
> This document is the **agenda**, not the answer. It frames the question, sets the method,
> and lists what we need to gather so the conversation is productive when we have it.
> Nothing here is measured or concluded yet.

## Why water gets its own project

Two reasons it outranks its usual place as a footnote in the pasture plan:

1. **A hard verano is coming** (Manuel, 2026-08-21) and we need to know whether the farm can
   carry its current herd through it.
2. **In tierra caliente, water — not grass — is usually what actually caps carrying
   capacity.** A potrero with feed and no water is not a usable potrero. So water decides
   which paddocks are in play during the dry season, which decides whether the rotation can
   run at all, which decides daily gain. It sits upstream of the pasture plan
   ([`../pasture.md`](../pasture.md)), not beside it.

And the stakes are concrete: at **266 head** the farm is stocked at **~1.68/ha** on the 2003
figures — and **~2.13–2.27/ha if the cadastre's smaller area is the right one**
([`../land/geo/README.md`](../land/geo/README.md)), which would put us *above* the
rotated-pasture benchmark. Either way there is **no slack**, and possibly a deficit already.
If dry-season water shrinks the usable area, effective stocking on what's left rises fast
from an already-tight base.

## The question to answer

> **Can we water the current herd through the coming dry season — and if not, what is the
> number of head we *can* carry, and what would it cost to lift that number?**

That decomposes into four, in order:

| # | Question | Why it's the gate |
|---|---|---|
| 1 | **Demand** — how much water does the herd actually need per day, at peak heat? | Sets the target every other number is measured against |
| 2 | **Supply** — what do the springs, quebradas and river reliably yield *at the driest point*? | Yield in verano is the only yield that matters; wet-season flow is irrelevant |
| 3 | **Storage** — how much buffer do the represa + tanks hold, and how fast do they refill? | Storage converts an intermittent supply into a reliable one; it's the lever we've already been buying |
| 4 | **Distribution** — which potreros can actually be watered in verano? | A farm-level surplus means nothing if it can't reach the paddock the cattle are in |

**The most likely failure mode is #4, not #2.** Farms rarely run out of water in aggregate;
they run out of water *where the cattle are*, and end up crowding the herd onto the few
watered paddocks — which overgrazes those and rests the rest into rank, low-quality forage.
That pattern would show up as poor daily gain without ever looking like a water problem.

## What we know today

Thin, and all of it from the 2003 survey plan
([`../land/plano-2003.md`](../land/plano-2003.md)) — which Manuel says is **incomplete** and
predates significant additions:

- **Río Poblanco** along the entire western boundary — the largest and most reliable source,
  but at the farm's low edge, so serving uphill potreros from it means pumping.
- **Quebradas** Sabaletica, Buenavista and Cascajón cross the property. Dry-season behaviour
  unknown — quebradas in tierra caliente often go intermittent.
- **At least two nacimientos and a manantial**, feeding a gravity pipeline.
- **A represa of 0.64 ha**, plus a tanque near the entrance and "Tanques Casa" by the house.
- **A piped network** (`---- Tubería`) with tees and a ventosa, apparently ~3 in.
- **Reservoir-tank storage added since 2003, in several places** — capacity and locations
  not yet recorded. This is the biggest known gap in our picture.

## 📐 The pipe survey — and how to not lose it

Manuel is arranging for **someone to walk and trace every pipe** and update the 2003 map
(2026-08-21). That closes the biggest gap in this document. One thing is worth settling
*before* they walk, because it costs nothing then and a lot afterwards:

> ### Ask them to record a GPS track while they walk.
> Manuel expects the update to come back **on paper**. Paper is a lossy intermediate: someone
> then has to re-draw it, guess at positions, and the result is only as good as the sketch.
> A phone recording a track while walking the same line gives us the **real coordinates for
> free** — same walk, same person, same day, no extra effort.

Any GPS/track app that exports **GPX or KML** works. Accuracy of 3–5 m is plenty; a pipe does
not need centimetres. **Waypoints at every tank, spring, valve and trough** matter as much as
the line itself — arguably more, since a tank's *elevation* is what decides what it can feed.

If it does come back only on paper, we are not stuck: the pipes can be traced onto the
orthophoto in the viewer (below). It is just slower and less accurate.

### Getting it onto the map

The dashboard now has a **drawing mode** ([`../../dashboard/README.md`](../../dashboard/README.md)):
pick a type — *tanque, nacimiento, bebedero, represa, tubería* — click on the 0.5 m
orthophoto, and it exports GeoJSON. It automatically records:

- **elevation** for every point, from the terrain model — so each tank arrives with the number
  that decides its gravity reach;
- **length** for every pipe run;
- **area** for every represa.

So a traced pipe network immediately answers *"what can this tank feed without a pump?"*
rather than just looking like a map.

## What we need to gather

Nothing here needs to be precise. Rough and complete beats exact and partial, as ever.

| # | What | Notes |
|---|---|---|
| 1 | **Inventory of every water point** — springs, tanks, reservoirs, represa, troughs, river/quebrada access | Location, rough capacity (litres or m³), what feeds it, what it serves |
| 2 | **Which potreros have water in verano**, and which don't | The single most decision-relevant fact in this document |
| 3 | **Behaviour of the sources last dry season** — what dried up, what held, when | Direct evidence beats any model. The mayordomo will know this cold |
| 4 | **Condition of the pipeline** — intact? leaking? still gravity-fed? what diameter, what pressure | Leaks are common and cheap to fix relative to their impact |
| 5 | **The represa** — silted up? what does it hold? does it still fill? | 23 years of sediment is a lot |
| 6 | **What happened in past bad veranos** — did we haul water, move cattle, sell early? | Tells us where the system actually broke before |
| 7 | **Which verano, and how bad** — the window Manuel means, and any IDEAM / El Niño forecast behind it | Sets the horizon we plan against |

## Method for the capacity evaluation

A dry-season **water balance**, done crudely first and refined only if the crude version is
close:

```
daily demand   = head × litres/head/day (at peak heat)
daily supply   = sum of source yields measured at the driest point
buffer         = total storage ÷ daily deficit   → days of autonomy if supply < demand
usable area    = area of potreros reachable by a working water point in verano
effective carga = head ÷ usable area   (vs. the 1–2/ha rotated benchmark)
```

The last line is the one that matters. **Effective verano carga, not annual average carga, is
the real stocking number** — and it is the number nobody computes, which is why farms
overgraze in the dry season without realising it.

## To research before we discuss

Per the repo rule, no figures get used until they're sourced — so these are gaps, not
estimates:

- **Daily water intake for a fattening bovine in tierra caliente** (litres/head/day by weight
  and temperature). _TBD — to source._ Deliberately **not** guessed here; it's the
  denominator of the whole exercise and deserves a real citation in
  [`../../research/sources.md`](../../research/sources.md).
- **Dry-season rainfall and evaporation for La Pintada / suroeste antioqueño** (IDEAM), and
  the **current ENSO / El Niño outlook** for the window Manuel is worried about.
- **Cost benchmarks for the obvious remedies** — reservoir tanks, poly pipe per metre,
  troughs, a pump, desilting a represa — so options can be compared on cost per extra head
  carried.

## Open questions for the discussion

1. Which verano are we planning for, and what makes Manuel expect it to be a hard one?
2. Has the farm ever actually run short of water — and what did we do?
3. Where did the new reservoir tanks go, and why *there*?
4. Is any of the system pumped, or is it all gravity?
5. Do we have water rights / a concesión de aguas from Corantioquia for the springs and the
   river? (Relevant if we ever expand capture.)
6. Is the answer to a tight verano *more water*, or *fewer head*? Those compete for the same
   money, and given the operation is losing money monthly, selling down to match capacity may
   beat investing to hold the herd — which also happens to be what the turnover diagnosis
   would recommend anyway ([`../../financials/diagnosis.md`](../../financials/diagnosis.md)).

> Question 6 is the one worth sitting with. It is the point where the water problem and the
> money problem turn out to be the same problem.
