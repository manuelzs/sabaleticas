# Water — capacity for the coming verano

> **Status: active, and the risk is now quantified (2026-08-21).** This started as an agenda.
> It isn't one any more — the forecast and the structure of our supply together make this the
> most urgent operational risk on the farm. Read
> [The El Niño problem](#the-el-niño-problem-and-why-it-lands-squarely-on-us) first.

## The El Niño problem — and why it lands squarely on us

Three facts, each independently sourced. Individually they are unremarkable. Together they
describe a specific, avoidable failure.

**1. The forecast is not a normal dry season.** NOAA's Climate Prediction Center puts a
**very strong El Niño above 90%** for late 2026 into 2027, and gives **69% odds of a
*historic* event** in October–December — one that would exceed **every El Niño in the record
back to 1950** — persisting into early 2027 `[S43]`. IDEAM has El Niño conditions already
present, and projects **10–30% less rainfall for the Andean region**, higher temperatures,
and — the line that matters most to us — **progressive reduction in the flow of rivers and
quebradas** `[S44]`.

**2. Both our water sources are exactly the thing that dries up.** Per Manuel (2026-08-21),
the two external sources are both **bocatomas on quebradas** — surface stream intakes, on two
different streams.

> **Two intakes on two streams is not redundancy against a drought.** It protects against a
> local failure — a landslide, a blocked intake, a broken line. It gives us **nothing**
> against a regional rainfall deficit, because that hits both streams at once. Our supply has
> a single point of failure, and El Niño is precisely the event that triggers it.
>
> Had one source been a deep spring or a well, we would have diversity in the failure mode
> that matters. We don't.

**3. Demand rises at the same moment supply falls.** Potreros with natural water are watered
by the same quebradas that are drying. As they fail, **more of the herd shifts onto the tank
system** — so the tanks face their heaviest draw in the week their inflow is weakest. Both
curves move the wrong way together.

### How long the tanks last on their own

Storage is **~70,000 L** (50,000 + 20,000) `[owner, unverified]`. Requirement for cattle in
tropical conditions is **36 L/day at 300 kg and 48 L/day at 400 kg**, with the guidance to use
the upper end when it's hot `[S42]` — and our August mean daily maximum is **33.2 °C** `[S45]`.

| Assumed weight | Demand, 266 head | **Autonomy at zero inflow** |
|---|---|---|
| 300 kg | 9,576 L/day | **7.3 days** |
| 400 kg | 12,768 L/day | **5.5 days** |

Storage comes in **three usable steps**, and each one bites at a different moment:

| | Storage | 300 kg | 400 kg |
|---|---|---|---|
| Top **main tank alone**, before anyone switches over | 50,000 L | 5.2 days | **3.9 days** |
| Top main + reserve | 70,000 L | 7.3 days | 5.5 days |
| **Whole system**, including the mid cluster | **~130,000 L** | **13.6 days** | **10.2 days** |

> ### So roughly **ten days to two weeks** across the whole system — but under four days on
> the top main tank alone if nobody intervenes.

Two things make the real figure better than the table:

- **The garden is discretionary demand.** Manuel: *"in a bad situation we stop watering the
  garden to leave everything for the animals."* That is a **reserve you release rather than
  water you buy** — and it costs nothing. Worth measuring what the house actually uses, so we
  know how many days that lever is worth.
- **The herd is shrinking** — sales are in progress, so 266 is a conservative ceiling.

⚠️ **The switchover is manual.** That means the reserve only helps if someone *notices* in
time. If the main runs down unobserved — overnight, or over a weekend — the buffer is the
main tank alone, and the reserve is 20,000 L of water we own and didn't use. A float alarm or
a simple daily level reading closes that gap for almost nothing, and it is the cheapest
resilience improvement on this page.

Two caveats, pulling opposite ways and roughly cancelling: not every animal drinks from the
tanks today (some potreros have natural water) — but in the scenario we're worried about,
those are exactly the ones that fail, and the house draws from the same system. **We also
don't know our animals' weights**, because there is still no báscula — so the demand figure
is an assumption, not a measurement.

### What the dry season looks like with 10–30% less rain

Applying IDEAM's stated range `[S44]` to our own climatology `[S45]`. **A scenario, not a
forecast** — and conservative, because it holds evapotranspiration constant when higher
temperatures would raise it:

| December–March | Rainfall | Balance vs ET0 |
|---|---|---|
| Normal | 314 mm | −172 mm |
| −10% | 283 mm | −203 mm |
| −20% | 251 mm | **−235 mm** |
| −30% | 220 mm | **−266 mm** |

This also **resolves the confusion in the earlier climate note.** In an average year the
mid-year dry season (May–September, −336 mm) is the harsher one. El Niño doesn't amplify that
one — it amplifies **December–March**, pushing it toward mid-year severity while temperatures
run above normal. So when Manuel says a big verano is coming, **the December–March window is
the right thing to be planning for**, and we have roughly three months.

## Where we stand right now (2026-08-21)

Manuel spent last weekend surveying the water infrastructure. Current state `[owner]`:

- ✅ **All tanks are at full capacity today.** Supply is not failing — we are going into this
  from a sound starting position, which is the best possible time to act.
- ⚠️ **Known faults**, detail to follow: **some smaller tanks are not properly connected**,
  plus other issues.
- Improvements to the system are already intended.

> **The disconnected tanks are the most interesting sentence here.** Storage capacity that
> physically exists but isn't plumbed in is **the cheapest water on the farm** — it needs
> connecting, not buying. And storage is precisely the lever that matters when inflow is the
> thing at risk. This should be costed first, before anything is purchased.

## What to do, in order

We have roughly **three months** before the December–March window. Sequenced by cost per day
of autonomy bought:

### 0. Price a pumped connection: lake → rompecargas *(outranks everything else here)*
**138 m of pipe and 20 m of lift**, into a tank that already feeds the whole lower system.
Behind it sits somewhere between 885 and 2,949 days of herd demand, against 13.6 days in the
tanks. It converts a supply with one failure mode into a genuinely redundant one.

Get a quote for: the pipe run, a pump of roughly 150–600 W depending on how fast you want to
move water, and either a solar array (~400 Wp for daily demand) or a mains/genset feed.

**Do not spend anything on measuring the lake's depth first.** Across every plausible dam
height and shape the answer stays "years of demand," so the measurement cannot change the
decision. Measure it out of curiosity, not as a gate.

### 1. Make the storage we already own actually usable *(cheapest, do first)*
**Correction (2026-08-21): the two main tanks are NOT disconnected** — I had misread that.
Both are plumbed in, main and reserve, with a manual switchover. What Manuel flagged is
**smaller tanks elsewhere that aren't connected properly** (detail still to come).

Two cheap wins remain, and both are about *usability* rather than capacity:

- **Close the manual-switchover gap** — a float alarm, or a daily level reading written down.
  Without it the reserve's 20,000 L is only available if someone happens to look in time.
- **The smaller tanks**, once Manuel describes them. Storage that physically exists but isn't
  plumbed in is the cheapest water on the farm: roughly **every 10,000 L made usable is
  another day** of herd autonomy. Nothing bought new comes close to that ratio.

### 2. Start measuring **now**, while conditions are normal
This is free and it expires. **You cannot detect a 40% decline in a quebrada you never
measured at 100%.** Starting now, in a normal August, gives us the baseline that makes every
later reading meaningful:

- **Flow at both bocatomas** — even a bucket and a stopwatch, weekly, written down.
- **Tank levels** — a mark on the wall and a daily reading. No sensors, no connectivity, no
  cost. This is the manual version of the telemetry in
  [`../../dashboard/README.md`](../../dashboard/README.md), and it answers the same question
  three months sooner.
- **Which potreros still have natural water**, revisited as things dry — this becomes the map
  of usable grazing area in verano.

### 3. Fix the distribution faults before the dry season, not during it
Leaks and bad connections cost little when inflow is plentiful and everything is full. They
become the whole problem when it isn't. A leak that is invisible today is a crisis in
February. Same for the **over-pressure question** — 108 m of head to the big house and up to
186 m to the lowest ground (see above) is the kind of fault that surfaces when a line is
finally run hard.

### 3b. Telemetry — see [`sensors.md`](sensors.md)

LoRa over cellular, what to instrument and in what order, and why the rompecargas is a hard
site. **Deliberately price-free** until researched. The rule that governs it:
**fix first, measure second.**

### 4. The herd question — ✅ already in hand
**Manuel is actively selling** (2026-08-21), a good number of animals, ahead of further price
falls. So this section is recording a decision already taken, not proposing one.

Worth noting because it lands directly on this page: **destocking is also a water action.**
At 36 L/head/day, every **10 head sold adds roughly a quarter-day** of autonomy across the
whole system — and unlike every other item here, it costs nothing and raises cash. The herd
count in this document is therefore **falling and stale**; the autonomy figures above are a
conservative ceiling on demand.

The reasoning that made it the right call, kept for the record:

- We are stocked at roughly **2.1–2.3 head/ha of potrero**, **above** the 1–2/ha rotated
  benchmark ([`../land/geo/README.md`](../land/geo/README.md)).
- Water autonomy is **5–7 days**, and every animal is a fixed daily draw on it.
- A **historic** El Niño is forecast `[S43]`.
- The operation is **losing money monthly**, and the leading diagnosis is that the herd
  **turns over too slowly** ([`../../financials/diagnosis.md`](../../financials/diagnosis.md)).

> **Selling down is the one action that answers all four at once.** It cuts water demand,
> relieves the stocking pressure, raises cash, and *is* the turnover fix we would be
> recommending anyway. Buying water infrastructure to hold a herd that is already too large
> for the land, in the worst forecast year on record, would be spending money to make the
> underlying problem worse.
>
> The timing argument is sharper still: **sell early or sell with everyone else.** In a hard
> verano, pasture fails region-wide, cattle come to market together, and prices fall exactly
> when the animals are worth least. The farms that do well in an El Niño are the ones that
> moved before the rush.

How far to take it still needs the P&L, which lands around the close of August.

## Why water gets its own project

Two reasons it outranks its usual place as a footnote in the pasture plan:

1. **A very strong El Niño is forecast** `[S43]`, and both our sources are vulnerable to
   exactly it — so we need to know whether the farm can carry its current herd through it.
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

## How the system works — Manuel's account (2026-08-21)

⚠️ **All `[owner, unverified]` — explicitly from memory, to be fact-checked by the survey.**
Recorded because it is the first coherent description of the system we have.

1. **Two sources, both outside the farm**, which we hold **water rights** on. They feed the
   farm — this is how water gets in at all.
2. **Two tanks at the top**, beside the little house at the entrance: a **~50,000 L main**
   and a **~20,000 L reserve**. **Both are plumbed into the system**, arranged so one backs
   up the other, with a **manual switchover** if the main fails. *(Capacities from memory —
   Manuel: "I just don't know the capacity.")*
3. **Distribution runs from those two tanks across the farm** — and it is **two-stage**, not
   one. See below.
4. **A second tank cluster mid-farm: three tanks, ~20,000 L each** (at least), so **~60,000 L**.
   📍 **Located exactly** at **5.797095, −75.609996 — 762 m** `[owner, 2026-08-21]`. They are
   **filled from the top tanks**, and they serve:
   - **the house**, which is *recreational* and consumes a significant amount, including
     **garden watering**; and
   - **about half the cattle drinking points in that area.**
5. **Potreros without natural water have a small trough (bebedero)**. A large share of total
   use, and split between the two stages.
6. **The big reservoir — "the lake" — is not connected to the system.** Always been there.
   In an emergency a pump could draw from it: not enough to reach the top tanks, but enough
   for the lower half — the three mid tanks and some bebederos beyond them.
7. **A ~1,000 L pressure-compensation tank** sits between the top tanks and the mid tanks:
   water flows in and straight out, holding a small standing volume. Manuel: *"we have such a
   slope. If you don't do that, the pipes break."*

   > That has a name — it is a **tanque rompecargas** (also *cámara rompe-presión*); in
   > English, a **break-pressure tank**. It converts a long, dangerous static head into two
   > short safe ones by returning the line to atmospheric pressure partway down. It is the
   > standard solution for exactly the situation described, and it is **precisely what this
   > document predicted must exist** when the single-stage head looked impossible
   > (~10.6 bar to the house). Good instinct, correctly built — Manuel just didn't have the
   > word for it.

## ⚠️ Correction: I was wrong about gravity

An earlier version of this section claimed the lake could gravity-feed the mid tanks, because
it sits 16 m above them. **That was a bad piece of analysis.** I compared two endpoint
elevations and never asked what the pipe has to cross in between — which is the only question
that matters in gravity flow.

Manuel corrected it from the ground, and the terrain model backs him up:

- On the straight line from the reservoir to the mid tanks, the ground rises to **796 m —
  18 m above the lake's surface.**
- Searching the *entire* terrain grid for the route with the lowest possible high point, the
  best available still tops out at **778 m**, exactly the lake surface. A pipe that grazes its
  own source elevation has **zero driving head and carries no water.**
- **A siphon cannot rescue it.** At 778 m elevation atmospheric pressure supports only
  **9.4 m** of water column in theory, and about **7 m** in practice once vapour pressure,
  dissolved air and friction are allowed for. The ridge needs 18 m. Not close.
- Trenching through the hill is, as Manuel says, not sensible.

**So the reservoir has to be pumped. He was right, I was wrong.**

## 🔴 The failure happening right now: the rompecargas runs dry

> **Reported by Manuel 2026-08-21, first verano this has appeared.** Symptom is fact; the
> mechanism below is a **working hypothesis** pending two site measurements.

### What happens

1. Tanques altos stay **full** — supply from the bocatomas is fine so far.
2. The **rompecargas empties itself**: it passes more water out than the float valve lets in.
3. Once it runs to air, **air enters the line feeding the bebederos** and delivery stops —
   even after the tank refills.
4. Recovery is manual: **close the valves to the tanques intermedios**, let the rompecargas
   fill, and the restored head pushes flow through again.
5. Meanwhile the **tanques intermedios drain** — house, garden and ~half the bebederos.

### Why, in one number

The two legs have the **same pipe diameter but very different driving gradients**:

| Leg | Length | Drop | Gradient | Flow at 1" `[Hazen-Williams, C=150]` |
|---|---|---|---|---|
| Tanques altos → rompecargas | 448 m | 13.1 m | **2.92 %** | **0.39 L/s** ≈ 34 m³/día |
| Rompecargas → intermedios | 425 m | 34.2 m | **8.05 %** | **0.68 L/s** ≈ 59 m³/día |

Flow scales with roughly √gradient, so **the outlet can pull ~1.73× what the inlet can
deliver — regardless of diameter.** The float valve throttles the inlet further still, and the
single outlet then splits to several branches `[owner]`.

At those rates the rompecargas nets **−0.29 L/s**. At **2.000 L** `[owner, 2026-08-21: cámara enterrada de ~1 m² × 1–2 m]` that is **under two hours from full to air.**

> **This is structural, not a fault. Matching pipe sizes was never going to match flows.**

### It is an air lock, not a lost siphon

Profiling the terrain model along both legs: **no crest sits above the upstream water level on
either one.** So there is no true siphon that can "break." What forms instead are **air pockets
at local high points**, which throttle or block flow until enough head sweeps them out — which
is precisely what closing the valves achieves. `[derived, IGAC MDT 5 m]`

The profile was run on the **schematic straight line**, not the surveyed pipe route — but it
found that the run from the tanques altos **drops into a valley and climbs 20.9 m back up** to
the rompecargas, putting the summit **at the tank inlet**. Manuel: *"I'm pretty certain the
summit sits right at the tank inlet"* `[owner, corroborated by IGAC MDT]`.

That makes the inlet leg an **inverted siphon**, and it matters more than it looks:

> **An air pocket at a summit doesn't just add friction — it subtracts its own height from the
> driving head.** The inlet leg has only **13 m** to work with, so a 2–3 m air column costs it
> **15–25 % of its head**. The same pocket on the 34 m outlet leg costs 6–9 %.
>
> **The low-gradient leg is the one air hurts most** — which is exactly the leg that is
> already losing.

### Why a better float valve is *not* the answer

Manuel's first read was that the float was starving the inlet, and that the fix was a better
float system. **The symptom is right; the cause is not.** `[derived]`

- Even **wide open**, the inlet leg carries ~0.39 L/s against the outlet's ~0.68 L/s. A perfect
  float valve still leaves a deficit — it would **slow the drain, not stop it.**
- The likelier restriction is the **air pocket at the inlet summit**, not the valve.
- So: **inspect and clean the float, don't redesign it.** Spend the money on a ventosa instead.

**A bigger float valve alone would delay the failure and hide it.** That is worse than the
current situation, where it fails visibly and often enough to have been diagnosed.

### The good news: this is a control problem, not a shortage

Estimated demand on this branch is **~10–17 m³/día** `[derived, unverified]` (~130 head ×
~50 L/día, plus the garden) against **~34 m³/día** the inlet leg can carry at 1". **Capacity is
two to three times demand.** The system is losing water to *stoppages*, not to scarcity.

### Fixes, cheapest first

| | Fix | Cost |
|---|---|---|
| 1 | **Throttle the outlet valve permanently** so outflow ≤ inflow. Manuel already does this as an emergency measure — make it a setting, not a rescue. Continuous moderate flow beats intermittent fast flow, because the intermedios are *storage*: they care about the daily total, not the rate. | **nothing** |
| 2 | **Raise the outlet draw-off inside the rompecargas** (internal standpipe / elbow up) plus a vortex breaker, so the tank **physically cannot drain to air.** Level falls, flow drops to match inflow, prime is never lost. | very low |
| 3 | ~~Bigger rompecargas~~ — **downgraded.** It is a **buried concrete chamber with a flush lid**, not a swappable poly tank `[owner, 2026-08-21]`. Enlarging it is civil works. Do fixes 1, 2 and 4 first and it should not be needed. | *was low, actually high* |
| 4 | **Ventosa (automatic air-release valve) at the inlet summit**, where the line crests just before the tank. This is the one that should actually **raise the inflow** — the concern Manuel started from. | low |
| 5 | **Inspect and clean the float valve.** Check size and blockage; this is unfiltered quebrada water. **Do not redesign it** — see above. | low |
| 6 | **Give the garden a higher take-off than the cattle** on the tanques intermedios. The garden then dies first, automatically, and the remaining volume is reserved for the bebederos — **no discipline required.** | low |

### The line to the house, and what it pins down

`[owner, 2026-08-21]` **Tanques intermedios → T-1 → T-2 → T-3 → casa principal.** The house is
**not** fed directly from the intermedios, as this document previously drew it.

That plus one confirmed trough brackets the two bad junctions without needing the plan at all:

| | Constraint | Source |
|---|---|---|
| **T-1** | 747 m, trusted — Manuel can see its trench in the orthophoto | photo |
| **T-3** | **≥ 720 m** — it feeds Bebedero 1 at 717 m, and the casa at 705 m below it | terrain + owner |
| **T-2** | **between 720 and 747 m** — downstream of T-1, upstream of T-3 | ordering |

> **Both junctions live in a 27 m band of elevation.** Turn on **Curvas 5 m** in the viewer and
> that band is a visible strip on the ground — a far better place to look in the photo than
> anywhere the 2003 plan puts them.

### The drawing is a palimpsest — and that explains the errors

`[owner, 2026-08-21]` Manuel: *"the drawing is from 2003, but the markings for the water lines
have been updated over time. I think the last update was ten years ago, so I'm just guessing."*

So the sheet holds **two different kinds of information at two different accuracies**:

| | Base survey — linderos, mojones, cuadro de áreas | **Water lines, added later** |
|---|---|---|
| Date | **2003**, surveyed by Mario Escobar R. | **~2016, guessed** — a decade of edits |
| Method | Instrument survey, measured sides, marked mojones | **Almost certainly drawn on by hand, without survey control** |
| How it georeferences | Fitted to **~11 m RMS** on 10 control points | **Not fitted to anything** — it inherits the base transform and adds its own error on top |

> ### This is the cleanest explanation we have for what we just found.
> The boundary fits the photo well. The water lines put **T-2 and T-3 twelve to twenty-two
> metres below a trough they are supposed to feed.** That is not a georeferencing error — a
> shared transform would displace everything together. It is what hand-sketched annotations
> look like when you try to read coordinates off them.

Two consequences, and they pull in opposite directions:

- **Existence is more credible than I assumed.** These features were marked up long after 2003,
  so a ventosa or a T on this sheet is more likely to be real than a 23-year-old drawing would
  suggest.
- **Position is less credible than I assumed.** Freehand annotation carries no survey accuracy
  at all. **Use the markings to learn what exists and in what order — never where it is.**

And it is still **up to a decade stale**: lines added, abandoned or rerouted since would not
appear. **This raises the value of the walk-the-pipes survey again** — the only record of this
system is a hand annotation nobody has touched in ten years.

### ⚠️ How good these coordinates are — read before trusting any profile below

`[owner, 2026-08-21]` Manuel, on everything transcribed off the 2003 plan:

> *"Everything that I'm giving you — the three tanks, the location of the first T junction, all
> of that is unconfirmed. I'm trying to be as accurate as possible, but the plan doesn't really
> match what I'm seeing in the photo, sometimes by 10 m, even 15. Only the tanks and the houses
> we are certain of."*

| Feature | Position confidence |
|---|---|
| **Tanques altos, intermedios, both casas** | **high** — given from the viewer against the orthophoto |
| Represa (extent) | high — IGAC polygon |
| **T-junctions, ramal norte troughs, ventosa** | **±10–15 m** — read off the 2003 plan |
| All pipe routes | schematic unless stated otherwise |

> ### What this means for the terrain analysis
> Every profile in this document is sampled **along a line between two points**. A 15 m
> sideways error puts the sample on different ground. On a slope of 20 % that is **3 m of
> spurious elevation** — enough to invent a hump, or to hide one.
>
> **Treat every hump, summit and clearance figure below as a hypothesis to check in the field,
> not a measurement.** The findings that survive are the ones with margins much larger than
> that: the 7 m difference between route options, the 49 m vs 13 m gradient asymmetry. The ones
> that do not are the small ones: a 0.50 m clearance, a 1.9 m hump.

### ⚠️⚠️ The bigger problem: the pipe does not follow the ground

`[owner, 2026-08-21]` A second and **larger** source of divergence than the coordinates:

> *"The humps might be not as humpy as you think. In some places they have dug deeper trenches,
> and where hoses go down into deep creeks, they hang the hose from side to side above the
> creek. Not everything is underground either, so it might be a little bit aerial."*

Every terrain profile in this document assumes **pipe elevation = ground elevation.** Three
construction facts break that assumption, and they all break it in the same direction:

| What was built | Effect on the profile |
|---|---|
| **Deeper trenches at high spots** | Cuts the tops off humps. The pipe crosses **below** the summit the model sees |
| **Aerial spans across deep creeks** | **Removes the dip entirely.** The pipe takes the chord; the model takes the valley floor |
| **Surface-laid sections** | Pipe sits at or slightly above ground, roughly as modelled |

> ### This weakens my strongest air-trap finding, and I should say so directly.
> The **20.9 m "climb" into the rompecargas** and the **10.6 m "climb" into Bebedero 2**
> were computed by walking the ground down into a valley and back up. **If those valleys are
> creeks the hose spans aerially, neither climb exists in the pipe** — the hose goes straight
> across. I called those two "large enough to survive" the coordinate error. They survive *that*
> error; they may not survive *this* one.

**What does not change:** Manuel observes air entering and blocking the lines. That is
observation, not model. **Air traps exist. The terrain model just cannot tell us where.**

And an aerial crossing does not remove the problem so much as move it: a span **sags**, so its
low point is mid-creek — but the **two banks, where the pipe lifts off the ground, become local
high points.** Those are the new candidate air traps, and conveniently they are the easiest
places in the whole system to reach and to fit a ventosa.

> **Conclusion: ventosa placement cannot be computed. It has to be walked.**
> The recommendation to fit them stands — the 2003 plan proves the original designers agreed —
> but *where* is a field question, and the terrain model has now given all the help it can.

Two further consequences of exposed pipe worth carrying to the survey: **UV degradation and
thermal cycling** on anything sun-exposed, and **flood debris** at creek crossings in invierno.

### The T del norte — an uncontrolled split, and the north loses it

`[owner, 2026-08-21]` **5.797082, −75.607946 · 775 m**, on the leg between the rompecargas and
the tanques intermedios. It splits the **ramal norte** off from the run to the intermedios.

| Leg | Length | Drop | Gradient |
|---|---|---|---|
| Rompecargas (798 m) → T (775 m) | 198 m | 23 m | **11.6 %** |
| T (775 m) → intermedios (762 m) | 227 m | 13 m | **5.7 %** |

Two things fall out of that:

1. **Most of the head is already spent before the T.** More than half the fall on this leg
   happens in the first 198 m.
2. **The north branch carries no storage of its own** — its three points are *bebederos*, not tanks `[owner, 2026-08-21]` — `[owner, 2026-08-21]` — it leans on the
   tanques altos. The tanques intermedios exist *"mostly because of the high water usage of the
   house."*

#### ❌ Retracted: the north is *not* outbid on head

An earlier version of this section argued the south branch wins the split because it has 13 m
of extra head. **That was wrong, and the error is worth naming:** it compared a drop that was
known (13 m, south) against a drop that was *not known at all* (north), and the unstated
assumption — that the north branch stayed near the T's elevation — carried the whole conclusion.

Manuel's coordinates for the ramal norte, 2026-08-21:

| From the T (775 m) | Distance | Drop | Gradient |
|---|---|---|---|
| South → tanques intermedios (762 m) | 227 m | 13 m | 5.7 % |
| **North → Bebedero 2 (747 m)** | 371 m | **28 m** | **7.6 %** |

The north's first tank is **28 m below** the T. If diameters match, flow goes roughly as
√gradient, so the north should draw about **15 % more** than the south — the opposite of the
claim. **Nor is the reverse now proven:** the pipe diameters are unknown, and a narrower north
line would flip it back. **Head competition does not explain the north's behaviour in either
direction.** Diameters are on the field list for exactly this reason.

### What does explain it: the north branch is one long air trap

| Leg | Length | Drop | Gradient | Ground above its own grade line |
|---|---|---|---|---|
| T → Bebedero 2 | 371 m | 28 m | 7.6 % | **+5.7 m**, and a **10.6 m climb into the tank** |
| Bebedero 2 → 3 | 337 m | 25 m | 7.4 % | **+9.2 m** at 272 m along |
| Bebedero 3 → 4 | 401 m | 22 m | 5.5 % | +1.9 m |
| **Total from the T** | **1.109 m** | **75 m** | | 13 humps in all |

> ### Tanks are built on high points, so every tank inlet is a summit — and every summit is an air trap.
> The rompecargas inlet climbs **20.9 m**. Bebedero 2's inlet climbs **10.6 m**. Same shape,
> twice. That is a property of how the system was laid out, not an accident of one pipe.

⚠️ **Both caveats above apply, and the second one bites hardest here.** These humps are sampled
along straight lines between points that may be 10–15 m off — and, more seriously, **they assume
the pipe follows the ground.** If the deep dips are creeks the hose spans aerially, these climbs
are artefacts. **Do not act on this table; walk the line.**

So when the rompecargas runs to air, the branch that stays blocked is the one with the most
summits and the longest run — **the north, 1.1 km of it, with nothing stored downstream.**
That matches Manuel's account far better than any competition at the T.

### 🔴 The buffer is on the discretionary load, and none is on the cattle

Putting the storage answer together with the layout:

| Load | Dedicated storage |
|---|---|
| **House and garden** — *discretionary; "the garden might die a little bit, but it's fine"* | **60.000 L** in the tanques intermedios |
| **Northern cattle** — *not discretionary* | **none** |

The northern cattle's only buffer is the **tanques altos**, on the far side of a 2.000 L
chamber that empties in under two hours. **And the 60.000 L in the intermedios cannot reach
them — it is downhill of the T.** In a shortage that volume is stranded relative to the animals
that need it.

**Two fixes, both cheap, and they are probably the best value in the whole water system:**

1. **Put a poly tank on the north branch.** A 10.000 L tank at Bebedero 2 buys roughly
   **1.2–2 days** for the northern cattle `[derived, unverified: ~100–160 head × ~50 L/día]`.
   It is a tank on a slab — not civil works, unlike enlarging the rompecargas.
2. **Cross-tie the tanques intermedios to the north branch.** Tested on the terrain model:

   | | |
   |---|---|
   | Route | intermedios (762 m) → Bebedero 2 (747 m) |
   | Length | **430 m, entirely on our own land** |
   | Climb required | **0.4 m** — less than the tanks' own height |
   | Limiting gradient | 3.40 % |
   | Flow at 1½″ | **1.24 L/s ≈ 107 m³/día** |

   > **That turns 60.000 L of house-dedicated storage into cattle insurance, by gravity, with
   > nobody's permission.** It also gives the north a second path when the first air-locks.

   **Fit a normally-closed valve**, so it is opened deliberately when the north is short —
   otherwise the garden drains the cattle's reserve too, which is the current problem with the
   sign reversed.

**Still unmapped:** the ramal norte's true route (positions are read off the 2003 plan and
marked `posición: BAJA`), and **the further T-junctions below the tanques intermedios**
`[owner, 2026-08-21]` — Manuel has those but has not given coordinates yet.

### A ventosa already exists — the 2003 designers knew about air

`[plano 2003]` The plan labels a **ventosa** at **5.796878, −75.612092 · 739 m**, located by
Manuel on the georeferenced overlay. Drawn with its own arrow marker in the viewer.

Two things worth taking from it:

1. **The original design already handled air.** Ventosas are not a modern retrofit being
   proposed here — they are how this system was meant to work. That makes the recommendation
   above far less speculative: **we are restoring an idea the builders had, not importing one.**
   It sits on the **tanques intermedios → casa principal** leg. The leg that is failing — the
   **entrada to the rompecargas** — apparently has none.
2. ~~It lands 1.1 m from the schematic straight line for that leg~~ — **❌ retracted.**

> **The "free calibration" claim is void.** I compared the ventosa against a straight line drawn
> from the tanques intermedios to the casa principal — but Manuel has since confirmed the line
> does not run that way at all. It goes **intermedios → T-1 → T-2 → T-3 → casa**
> `[owner, 2026-08-21]`. The ventosa falling near a route that does not exist is a coincidence,
> not a confirmation, and it never supported the conclusion I drew from it about the schematic
> routes being better than indicative.

⚠️ **Existence today is unconfirmed.** Per Manuel's standing rule, nothing from the 2003 plan
counts as current until checked in the field. Add it to the walk-the-pipes list: **is it still
there, and does it still work?** A seized ventosa is indistinguishable from no ventosa.

### The two measurements that would settle it

Both need only a watch:

- **Close the outlet. Time the rompecargas filling.** 2.000 L ÷ seconds = **inflow in L/s.**
- **Shut the inlet, open the outlet. Time it draining.** = **outflow in L/s.**

If outflow > inflow, the hypothesis is confirmed and fix 1 is immediately actionable.

**Still unknown:** actual pipe diameters in and out, float valve size, the real pipe routes,
and where the single outlet splits.

## 📋 The field list — everything now blocked on someone walking the ground

Consolidated 2026-08-21. Nothing here needs money; all of it needs a person and a morning.
This supersedes nothing above — it is the list of things **only a site visit can answer.**

### With a watch, at the rompecargas *(settles the acute failure)*
1. **Close the outlet. Time the chamber filling.** 2.000 L ÷ seconds = **inflow in L/s**.
2. **Shut the inlet, open the outlet. Time it draining.** = **outflow in L/s**.
   If outflow > inflow, the diagnosis is confirmed and the free fix is actionable that day.

### While standing there
3. **Pipe diameters, in and out.** The whole gradient argument assumes they match — confirm it.
4. **Float valve size and condition.** Inspect and clean; **do not redesign**.
5. **Is there a ventosa on the inlet leg?** The 2003 plan shows one on the *casa* leg and none
   here. If the inlet crests just before the chamber, that is where air is trapping.
6. **Where does the single outlet split, and what does each branch feed?**

### Before anything else — the cheapest source we have
6b. **Talk to whoever has been updating the plan.** `[owner, 2026-08-21]` The water markings
   have been maintained on paper for twenty years by someone who knows where the lines run —
   that person is the **real repository of this system**, and they are free. Every question on
   this list that is currently "unknown" is probably answerable in one conversation: which T
   feeds Bebedero 1, where the pipe is aerial, which ventosas exist, what was rerouted and when.
   **Do this before commissioning a survey**, not after — it tells the surveyor where to look
   and stops us paying someone to rediscover it.

### 🔴 The bocatomas are off our land — and unmapped

`[owner, 2026-08-22]` *"They are not in our land. They are to the east. I can't get the name of
the exact creek… we probably even have some more paperwork for the water rights."*

**Every litre this farm uses enters through two intakes on somebody else's property.** That is
the largest single dependency in the operation, and we currently have **no coordinates, no
creek name, and no sight of the paperwork.**

Why this outranks the distribution puzzles: the pipes can be traced any afternoon. **A water
right cannot be recovered in an afternoon**, and it fails exactly when a drought makes it
matter — which is the scenario this whole project exists for.

#### To find, when Manuel has time

| Document | What to read off it |
|---|---|
| **Concesión de aguas — CORANTIOQUIA** (the regional authority for the suroeste) | The **expediente number**, the **flow granted in L/s**, the **source named**, and above all the **expiry date**. Concesiones are time-limited and must be renewed |
| **Servidumbre de acueducto** over the land the intakes sit on | Whether it is written and **registered** — a handshake does not survive the sale of that property |
| Any correspondence about the quebradas | Which creek, and whether any restriction has ever been imposed |

#### The three questions that matter most

1. **Is the concesión current, or has it lapsed?** An expired one is a vulnerability nobody
   notices until the authority or a neighbour raises it.
2. **How many L/s are we legally entitled to?** That is the ceiling on supply, and it may be
   lower than what we take. Worth knowing *before* comparing it to the ~10–17 m³/día estimate.
3. ~~Who owns the land the bocatomas sit on, and does the easement survive a sale?~~
   **✅ Closed** `[owner, 2026-08-22]`: *"we have the servidumbre, and it's been like that for
   over 50 years, and we've never had an issue."* Fifty years of continuous, undisputed use is
   strong on its own — in Colombian law an apparent, continuous easement of this age is about as
   settled as it gets. **Not a live risk.**

> ### But keep the two separate
> **Servidumbre** = the right to cross their land — *private law, against the landowner.* Settled.
> **Concesión de aguas** = the right to **take the water at all** — *public law, against the State.*
>
> **Fifty years of easement says nothing about the concesión.** In a declared drought it is
> CORANTIOQUIA that restricts abstraction, and a perfect easement is no help if the abstraction
> right has lapsed. Questions 1 and 2 stay open.

⚠️ In a declared drought CORANTIOQUIA can restrict abstraction. **A farm whose paperwork is in
order is in a very different position from one whose is not.**

### The open questions, to settle on site
6c. **Where do Bebederos 5, 6 and 7 connect?** `[hypothesis, Manuel concurs 2026-08-22]` The
   source must be above ~717 m, and only the **ramal norte** qualifies nearby. Most likely
   **a T at or just before Bebedero 3** (729 m, 311 m away, +15 m of head). The 3 → 4 leg passes
   closer at 262 m but sits at ~719 m — 5 m of head is thin for 300 m of pipe.
   **Not visible in the orthophoto. Look for the split around Bebedero 3.**

### Along the lines
7. **Walk the pipes with a GPS track**, not paper. Same walk, same person, real coordinates.
   **Record construction type as you go** — buried, deep-trenched, surface-laid, or aerial —
   because the terrain model is blind to all four `[owner, 2026-08-21]`.
7b. **Photograph every creek crossing**, and note where the pipe **lifts off the ground**. Those
   lift-off points are now the prime air-trap candidates, and they are also the easiest places
   to fit a ventosa.
8. **Check the 2003 ventosa at 5.796878, −75.612092** — still there? still working?
   **A seized ventosa is indistinguishable from no ventosa.**
9. **Sweep the 2003 plan for more ventosas.** Manuel, 2026-08-21: *"There are probably more air
   vent markers."* Only one has been transcribed so far. Each one found tells us where the
   original designers knew air collects — which is exactly where the humps are.
10. **The T del norte** — is the split fixed, or is there a valve? Can it be balanced?

### With a level, on the ridge *(unlocks the gravity route)*
11. **Run a level along the candidate route**, against the represa's **lowest expected working
    level**, not its full level. The margin is 0.50 m against a model with ±2–5 m error;
    nothing gets bought until this is measured.
12. **Check the on-farm variant too** (Option B). It needs no permission, so it can be
    surveyed tomorrow.

### Not on the ground, but pending
13. **Impuesto predial bill** — which predios, what área.
14. **Certificado de tradición for 023-16153**, and the northern-triangle linderos.
15. **Nine unknown neighbour owners**, Bellavista first.

---

## 🟡 The gravity route through El Guaico — plausible, unproven, and worth surveying

**Manuel's idea, 2026-08-21**, reading a highlighted 25 m contour in the viewer: if the line
follows the contour around the hill instead of over it, the represa could feed the tanques
intermedios **by gravity, through the neighbour's land.**

Tested against the terrain model with a **minimax route search** (lowest achievable summit
between the two points):

| Constraint | Highest point the route must cross | Verdict |
|---|---|---|
| **Staying on our own land** | **784.6 m** | must climb **6.6 m** above the represa → **pump required** |
| **Allowed through EL GUAICO** | **777.8 m** | **never rises above the represa surface** → gravity plausible |
| Route length | 767 m (vs 716 m on-farm) | +51 m |
| Land crossed | **83 of 98 samples in EL GUAICO** (023-16154) | needs a **servidumbre** |

> **The 7 m difference between those two rows is the robust finding.** It is far larger than
> the terrain model's error, so "the neighbour's route is dramatically better" is solid.

### But the margin is inside the noise, and that is the whole story

The route **undulates along a ridge at ~777 m for its first 420 m.** The binding constraint is
at **323 m along, where the ground reaches 777.5 m — leaving 0.50 m of head.**

| | |
|---|---|
| Design gradient on the limiting section | **0.155 %** |
| Flow at 2″ | **0.50 L/s ≈ 43 m³/día** |
| Flow at 3″ | 1.45 L/s ≈ 126 m³/día |
| Estimated demand | ~10–17 m³/día |

So **2″ carries 2.5–4× demand** — the hydraulics work *if the profile is real.*

> ### ⚠️ 0.50 m of head, from a model with ±2–5 m vertical error.
> The margin is **below the noise floor.** This is a candidate worth surveying, **not a design.**
> Nothing should be bought against it until someone runs a level along that ridge.

Two further cautions, both real:

- **The represa's working level, not its full level, sets the margin.** Draw it down 1 m in a
  verano and a 0.5 m margin is gone. The route must be surveyed against the **lowest** level
  the reservoir is expected to reach — which is precisely when the water is most needed.
- **A long, nearly flat line with several local high points is the exact profile that air-locks**
  — the lesson from the rompecargas above. Any build needs **ventosas at every summit**, designed
  in from the start rather than retrofitted.

### Even if pure gravity fails, this changes the pump project

The current pump case is built on lifting **33 m** out of the represa. This route needs
**no lift at all — only friction.** If the survey finds the ridge 1 m too high, the answer is a
**short cut-and-cover trench at one saddle**, or a small in-line booster, not a 33 m lift with
solar panels and a caseta. `[derived]`

**That makes the field survey the cheapest high-value action in the whole water project.**
See [`pump-costing.md`](pump-costing.md), whose premise this may retire.

### And the neighbour is no longer a dependency

Manuel, 2026-08-21: *"we will need agreement from our neighbors, and that is not a given."*
Correct — so the same search was re-run **restricted to our own land**:

| | Route | Lift needed | Permission |
|---|---|---|---|
| **A** | Through EL GUAICO | **none — pure gravity** | **servidumbre required** |
| **B** | **Our land only, contour-routed** | **6.6 m, over one 195 m hump** | **none** |
| C | The original direct line | ~33 m | none — but retire it |

Option B's route is 716 m, and **only 195 m of it (from 60 m to 255 m along) sits above the
represa.** Pump over that one hump and gravity carries the remaining ~460 m.

| Duty at 0.25 L/s, 45 % wire-to-water | Power |
|---|---|
| **Option B — 6.6 m, say 10 m with friction** | **~36–54 W** |
| Option C — the 33 m lift in `pump-costing.md` | ~196 W |

> **A quarter of the power, and therefore roughly a quarter of the solar array.**
> Option B needs nobody's signature.

That reframes the negotiation with El Guaico from a **dependency into an optimisation** — and
it is a far better position to negotiate from, because we can walk away.

#### If we do go and ask them

`[advice, not legal counsel]` The instrument is a **servidumbre de acueducto**. Practical notes:

- **The ask is small.** A buried 2″ pipe along a ridge, no surface structures, no traffic. It
  does not impede lemon growing — they can plant over it.
- **Offer a tap-off.** They irrigate; water has value to them. A connection point costs us
  almost nothing and turns an imposition into a benefit. That is the difference between a
  favour and a deal.
- **Get it written and registered**, so it survives a sale of *either* property. Los Búhos
  next door has just changed hands; El Guaico could too. A handshake with the current owner is
  worth nothing to their buyer.
- **Do not survey their side without asking first.** 83 of 98 route samples are on their land,
  so the conversation genuinely comes before the level run.

### Does the gravity route need its own rompecargas?

**No.** Total fall is **15.6 m ≈ 1.5 bar** — even the cheapest pipe class sold in Colombia
(RDE 32.5, 125 psi ≈ 8.6 bar) is over five times that.

| | Gradient |
|---|---|
| Average over the whole route | **2.03 %** |
| **The limiting section (first 323 m)** | **0.155 %** ← this governs the pipe size |
| The back half, once it starts dropping | ~4.2 % |

> The existing system needs a rompecargas because it drops **49 m** in one leg and **106 m** to
> the house. This route drops 15.6 m in total. **The gravity route removes the very component
> that is failing.**

**What it needs instead is ventosas.** A nearly flat line running just under its hydraulic
grade line is exactly where air collects — the same failure as above. Budget an air valve at
every hump on that first flat stretch, designed in from the start.

**Cheapest de-risking move:** trenching the ridge crossing down ~1 m turns 0.50 m of head into
1.5 m, roughly **tripling** the flow and lifting the margin clear of the terrain model's error.
`[derived]`

Drawn in the viewer as **"Ruta gravedad (candidata)"** (green, off by default), from
`operations/land/geo/gravity-route-candidate.geojson`. The trace is **orientative** — it is the
model's best line, not a surveyed one.

## 🟢 But the pump is small — and the break-pressure tank is why

The confirmed profile, now that every point has a real coordinate:

| | Elevation | |
|---|---|---|
| Tanques altos (entrada) | **811 m** | 5.795199, −75.602603 |
| **Tanque rompecargas** | **798 m** | 5.797126, −75.606162 |
| **Represa (el lago)** | **778 m** | 5.796346, −75.605185 |
| Tanques intermedios | **762 m** | 5.797095, −75.609996 |
| Casa principal | 705 m | |

The reservoir sits in a hollow **20 m below the rompecargas — and only 138 m from it.**

> ### That is the connection point. Not the mid tanks.
> Pumping to the mid tanks means 539 m of pipe over an 18 m ridge. Pumping to the
> **rompecargas** means **138 m of pipe and 20 m of lift** — and from there the water is
> already *in the existing network*, flowing on by gravity to the mid tanks (−36 m) and the
> house (−93 m). No new distribution to build.

### What that pump looks like

Design head ~25 m (20 m static plus friction over a short run), 55% efficiency:

| Task | Flow | Power | Energy |
|---|---|---|---|
| Cover daily herd demand (9,576 L) over 8 h | 0.33 L/s | **148 W** | 1.2 kWh |
| Cover daily herd demand over 4 h | 0.67 L/s | 297 W | 1.2 kWh |
| Refill the whole mid cluster (60,000 L) in 12 h | 1.39 L/s | 619 W | 7.4 kWh |

**This is a domestic-sized pump, not civil works.**

### The solar resource, measured

Manuel's "we get a lot of sun" checks out, and the useful part is *how steady* it is
`[S45, ERA5 2016–2026]`:

| | kWh/m²/day (= peak sun hours) |
|---|---|
| Annual mean | **5.26** |
| Best month (**agosto**) | 5.81 |
| Worst month (noviembre) | **4.79** |

Two things follow, and the second is the more useful:

- **The spread is tiny** — 4.79 to 5.81 across the whole year. That is the equatorial
  advantage: no winter to oversize against, so an array sized on the worst month is barely
  larger than one sized on the average. Solar here is *predictable*, which is worth as much as
  it being abundant.
- **The sunniest month is August — the middle of the mid-year dry season.** Peak sun arrives
  with peak water demand. The drought that threatens the supply delivers the energy to move
  it.

Sizing on the worst month, at 75% system efficiency:

| Duty | Array |
|---|---|
| Cover daily herd demand (1.2 kWh/day) | **~334 Wp** — a single modern panel |
| Refill the whole mid cluster daily (7.4 kWh/day) | ~2,060 Wp |

**A single panel covers the cattle.** The larger array is only needed if you want to refill
60,000 L every day, which you would not.

_All figures here are engineering estimates from the terrain model and standard hydraulics,
not a quotation. A real design needs pipe sizing, a proper friction calculation and someone
who does this for a living._

### The gravity option through El Guaico — short, but the data can't confirm it

Manuel raised a third possibility: a **fully gravity-fed** line from the lake to the mid
tanks, routed **through the southern neighbour, El Guaico** — who run a **lemon operation, not
cattle**, and might permit a temporary crossing during a genuine crisis.

I searched the terrain model for the shortest route that never rises above the lake's surface.

| | |
|---|---|
| **Total length** | **759 m** |
| **Crossing El Guaico** | **662 m — 87% of it** |
| On our own land | ~97 m |
| Average gradient | **2.11%** — a healthy slope for a gravity main |
| **Vertical clearance at the tightest point** | **0.2 m** |

> ### ✅ Confirmed on the ground by Manuel (2026-08-21): crossing El Guaico, the terrain stays
> below the lake the whole way.
>
> The terrain model gave this only a 0.2 m margin — inside its own ±1–2 m error bar — so from
> the desk it was unresolvable. **Manuel's knowledge of the ground settles it.** 759 m of pipe
> at a 2.11% gradient: no pump, no power, no fuel, nothing to fail.

**This is now the best technical option available**, and the obstacle is no longer engineering
— it is 662 m of pipe across somebody else's land.

### Why it can't stay on our own land

Keeping inside our boundary means going **over the hill the rompecargas sits on** — and the
rompecargas is at **798 m, the top of that hill, 20 m above the lake**. Manuel asked exactly
the right question: could a gravity hose simply run over a 20 m rise?

> ### No — and it isn't close. That is a siphon, and 20 m is beyond what physics permits.
>
> A siphon works because **atmospheric pressure pushes** water up the rising leg. The ceiling
> is set by atmospheric pressure alone, and at our 778 m elevation that supports only
> **9.4 m of water column** — falling to roughly **6–7 m in practice**, because dissolved air
> comes out of solution at the crest and accumulates until the column breaks.
>
> We would need **20 m: more than double the theoretical limit and about triple the practical
> one.** No pipe diameter, material or workmanship changes this. It is a property of the
> atmosphere, not of the plumbing.

So the choice is binary: **cross El Guaico and use gravity, or stay on our land and pump.**
There is no third option over the hill — which is very likely why the rompecargas sits exactly
where it does.

**The negotiation is the other half.** 662 m of buried line through a lemon orchard is a real
ask, but a modest one: temporary, buried, no structures, and lemons need water too — a shared
interest in a drought is a better opening than a favour. Worth knowing the answer to the
survey *before* asking, so the conversation is about a specific line rather than a hypothesis.

### Getting power to it — the part that actually decides this

Manuel (2026-08-21): the pump site has no power. Three ways to fix that, and the choice is
less obvious than it looks because **the load is so small**.

| Option | Fit | Notes |
|---|---|---|
| **Solar, no battery** | ✅ best fit | 148–619 W is two or three panels. **No batteries needed** — see below |
| **Grid tap** | 🟡 workable | A line already runs from the east house to the west house, passing near the lake. Needs a new **contador** and the connection work |
| **Diesel generator** | 🔴 poor fit | Wildly oversized for 150–600 W, and needs fuel hauled and a person to start it |

> #### The tank is already the battery
> This is the point that makes solar unusually attractive here. Solar's normal weakness is
> storing energy — batteries are where the cost, the weight and the failures live. **We don't
> need to store energy, because we're storing water.** The pump runs while the sun shines and
> fills a 60,000 L tank; the cattle drink from the tank all night. A day of cloud costs
> nothing, because the tank is days deep. This is the standard architecture for solar
> livestock watering and it fits our situation almost exactly.

> #### And an argument against leaning only on the grid
> Colombia's electricity is heavily hydroelectric, and IDEAM warns that this El Niño will cut
> reservoir levels and **hydroelectric generation** along with everything else `[S44]`. So
> grid supply is under stress from *the same event* we are building this to survive. A grid
> tap that fails in a national rationing episode fails exactly when we need the pump most.
>
> The same logic condemns the generator, harder: diesel needs fuel hauled up and a person to
> start it, in the week when fuel and attention are scarcest. A generator sized for 600 W of
> real load would run at a few percent of capacity, burning fuel to produce mostly heat.

**Suggested shape, subject to quotes:** solar as the primary, with the grid tap as a booster
if the contador turns out to be cheap — the two combine well, since the pump is small enough
that either can carry it alone. **Get prices for the meter and connection before assuming
solar wins**; if the line genuinely passes close, that number could be small.

📄 **Partly priced now** — see [`pump-costing.md`](pump-costing.md): the pump itself is only
~COP 500,000, EPM's published connection charges are ~COP 500,000, but **the meter, acometida
and any line extension are not published by EPM at all** and could dominate the budget. The
free **factibilidad del servicio** request is what turns that into a number.

**What to price:**
1. The **contador** and connection from the existing east–west line, including whatever the
   utility requires.
2. A **solar pump kit** — pump, controller, ~400 Wp of panel, mounting. Ask specifically for a
   *batteryless* configuration pumping to a tank.
3. The **pipe run** — 138 m, plus the fitting into the rompecargas.
4. Security. A pump and panels out by a lake, far from the house, is a theft question as much
   as an engineering one — and worth asking about before siting anything.

## The scale of what is behind that pump

The reservoir sits at **778 m** `[IGAC terrain model, at Manuel's coordinate]`, with a mapped
surface of **0.56 ha (5,647 m²)** `[IGAC 1:5000]`. Set against the rest of the system:

| | Elevation | Relative to the lake |
|---|---|---|
| Top tanks | 811 m | 33 m **above** — a pump would be needed |
| **Mid tanks** | **762 m** | **16 m BELOW the lake** |
| Main house | 705 m | 73 m below |
| Lowest ground | 627 m | 151 m below |

### The volume dwarfs everything else

Depth is unknown, so this is a range, not a figure:

| Mean depth | Stored volume | Versus the ~130,000 L of tanks |
|---|---|---|
| 1 m | 5.6 million L | **43×** |
| 1.5 m | 8.5 million L | 65× |
| 2 m | 11.3 million L | **87×** |

Even at the shallowest assumption, the lake holds **roughly 590 days of herd demand** at
9,576 L/day — against 13.6 days for the entire tank system.

> **The farm's largest water asset is disconnected from the farm's water system**, in the
> year of a forecast historic El Niño, while every litre we do use arrives through two
> surface intakes on quebradas that the same El Niño is expected to dry.

Two caveats, honestly:

- **Depth is a guess.** Measuring it — a weighted line from a boat, a dozen readings — is
  cheap and turns the most important number here from a range into a fact. **This is the
  single highest-value measurement on the farm right now.**
- **The lake is not immune to drought either.** It loses water to evaporation and depends on
  runoff to refill. But it is *stored* water, which a flowing quebrada is not — that is
  exactly the difference that matters when the streams drop.

Also worth checking: a **second water body of 0.81 ha at 776 m sits ~260 m south**, just
*outside* our mapped boundary. Given how close it is, worth confirming whether it is ours.

### 🔴 The north side has no buffer

Manuel (2026-08-21): a **T-junction on the main, between the rompecargas and the mid tanks,
splits the farm into a north branch and a south branch.**

> **The south side has the mid tanks (~60,000 L) as its reservoir. The north side has no
> storage at all** — it is fed straight off the line.

That asymmetry matters more than it sounds, and it changes how failure looks:

- **If inflow stops, the two halves fail on completely different clocks.** The south coasts on
  60,000 L — days. **The north runs dry as soon as the line does — hours.**
- So the 10–14 day autonomy figure in this document is **an average that describes neither
  half.** It is roughly right for the south and badly wrong for the north.
- It also reframes the cheapest possible improvement: **putting even one modest tank on the
  north branch** buys that half its own buffer. A 10,000 L tank is far cheaper than a pump, a
  pipeline or a negotiation with a neighbour — and it converts the north side from
  zero-autonomy to days.

**Open questions:** how many bebederos hang off each branch, how many hectares and how many
head each side normally carries, and whether the T can be valved to favour one side when
supply is short. That last one is free and might be the difference between losing half the
farm's water and losing none of it.

📍 Marker pending Manuel's coordinate — it will render as a **square** (circles are reserved
for tanks).

### The system in one picture

```
  2 bocatomas on 2 quebradas          ← the only inflow, both surface water
            │
            ▼
  TOP TANKS · entrance · 811 m        50,000 L main + 20,000 L reserve
  (manual switchover)                 = 70,000 L
            │
            ▼
  MID TANKS · 5.797095,-75.609996     3 × ~20,000 L = ~60,000 L
             762 m                    ← 49 m below the top tanks, 860 m away
            │
      ┌─────┴─────┐
      ▼           ▼
   the house    ~half the bebederos in that area
   (garden =
   discretionary)
```

**Total storage ≈ 130,000 L**, roughly double what this document assumed before Manuel
described the mid cluster. That is the single biggest correction here, and it is good news.

### The head budget, now that both ends are fixed

| Leg | Drop | Distance | Static pressure |
|---|---|---|---|
| Top tanks (811 m) → mid tanks (762 m) | **49 m** | ~860 m | ~4.8 bar |
| Mid tanks (762 m) → main house (705 m) | **57 m** | ~694 m | ~5.6 bar |
| Mid tanks → lowest ground on the farm (627 m) | 135 m | — | ~13.2 bar |

**Both working legs sit around 5–6 bar** — comfortably inside ordinary pipe rating, and
gravity-fed throughout. That is a much healthier picture than the single-stage assumption
this document started with, where the house appeared to hang off 106 m of head at ~10.4 bar.

**The two tanks in series are doing real work**: the mid cluster acts as a break-pressure
stage as well as storage, splitting one punishing drop into two mild ones. Whoever designed
this knew what they were doing. The remaining over-pressure question applies only to whatever
runs *below* the mid tanks toward the low ground.

⚠️ **There are no tanks beside the main house** `[owner, 2026-08-21]` — an earlier version of
the map implied otherwise, which was a rendering fault on my side, not a fact.

### What the data independently confirms

The terrain backs the shape of this exactly, which raises confidence in the rest:

| Claim | Check | Verdict |
|---|---|---|
| "The entrance is the highest point" | Entrance sits at **814.9 m**; the **highest ground in the parcel (822.3 m) is 40–48 m away** | ✅ confirmed `[IGAC terrain model]` |
| "The tanks are at the top, water goes down from there" | Elevation falls **monotonically east→west**: 800 m mean in the entrance band, 660 m at the river | ✅ confirmed |
| "Two built sites — little house at the entrance, big house southwest" | The cadastre maps **exactly two building sites** inside the parcel: 14×10 m at the entrance (813 m), and a 60×30 m + 19×10 m pair in the southwest (705 m) | ✅ `[owner, corroborated by IGAC 1:5000]` |

> **So the whole farm lies below the tanks — every hectare of it.** The lowest ground is
> 627 m, 186 m below the tank site. In principle nothing here needs a pump.

### ⚠️ The flip side: this may be too much pressure, not too little

Head converts to pressure at roughly **1 bar per 10.2 m** of water column. So:

| From the tanks (811 m) to… | Drop | Static pressure |
|---|---|---|
| The big house (705 m) | **106 m** | **~10.4 bar** |
| The lowest ground (627 m) | **184 m** | **~18 bar** |

Common pressure-pipe classes sit in the region of 10–14 bar _(needs confirming against what
is actually installed — `[unsourced]`)_. If that is right, **the lower reaches of this system
run at or beyond ordinary pipe rating**, which means one of three things:

- there are **break-pressure tanks or pressure-reducing valves** along the line that we
  haven't recorded yet — most likely, and the 2003 plan's *ventosa* hints at deliberate
  design; or
- the pipe is a heavier class than standard; or
- **it bursts periodically** and everyone treats that as normal.

**This is now a specific thing to ask the pipe survey to look for**, and it is cheap to check
while someone is already walking the line. Worth knowing before we spend anything on the
network, because "add more pressure" would be exactly the wrong instinct here.

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

0aa. ✅ **Mid tanks located** — 5.797095, −75.609996, 762 m.
0ab. **How much does the house actually use?** It is the one load we can switch off, so its
   size is the size of that lever.
0ac. **Which bebederos are on the mid cluster and which on the top tanks?** Manuel says the
   mid tanks feed "about half" of those in that area — so the two stages fail at different
   times, and knowing which potreros hang off which decides what we lose first.
0ad. **Where exactly is the break-pressure tank?** The coordinate Manuel sent
   (5.796346, −75.605185, 778 m) lands within ~19 m of the IGAC-mapped reservoir, so I have
   read it as **the lake**. If it was actually the rompecargas, say so and I'll swap them.
0ae. **How deep is the lake?** The highest-value cheap measurement available.
0af. **Is the 0.81 ha water body ~260 m south of it ours?** It sits just outside our boundary.
0. **The two external sources** — what are they (nacimientos? a bocatoma on a quebrada? a
   veredal aqueduct)? Where? Is the water right a **concesión de aguas** from Corantioquia,
   and is it current? A source outside the farm we don't fully control is the single biggest
   risk in this whole system.
0b. **Are the two tanks interconnected**, or does each serve its own line?
0c. **Does the big house share a line with the cattle troughs?** If so, domestic demand and
   stock water compete in verano — a classic and avoidable failure.
0d. **Roughly how many bebederos**, and which potreros have natural water versus depending
   entirely on the tanks? This is the map that decides verano carrying capacity.
0e. **The big reservoir** — what feeds it, and what does it serve? Do cattle drink from it
   directly?
0f. **Any break-pressure tanks or valves** along the lines (see the pressure note above)?
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
