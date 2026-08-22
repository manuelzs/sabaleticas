# Terrain & climate — measured, not assumed

> Pulled 2026-08-21 from IGAC's digital terrain model and the ERA5 reanalysis archive.
> Provenance convention per [`../../../AGENTS.md`](../../../AGENTS.md).

Two things this project had been guessing at are now measured. Both matter for the verano
work ([`../../water/README.md`](../../water/README.md)) and for grazing.

## Terrain `[IGAC MDT, 5 m — mdt05390lapintada]`

Sampled on a 30 m grid across the parcel (1,670 points inside the boundary).

| | |
|---|---|
| Lowest point | **628 m** (the Río Poblanco edge, west) |
| Median | **703 m** |
| Highest point | **821 m** |
| **Vertical range** | **191 m** |

> ### ⚠️ This corrects the profile
> `profile.md` carried **"~550–600 m"** from the start — unsourced, and **wrong by roughly
> 100–200 m**. The farm actually runs **628–821 m**. Two independent sources agree: the IGAC
> terrain model, and the ERA5 grid cell (reported elevation 736 m). Still *tierra caliente*
> (below 1,000 m), so the operational framing holds — but the number was wrong.

### Slope

| Band | Share of the farm |
|---|---|
| Gentle, under 7° | 24% |
| Moderate, 7–15° | 54% |
| **Steep, 15–25°** | **21%** |
| Very steep, over 25° | 1% |

Median slope **10.8°**, maximum **30.7°**. So this is genuinely hilly ground, and about
**22% of it is steep**. Two consequences worth carrying into the pasture work:

- **Cattle under-graze steep ground.** They walk it less, camp on the flats, and burn energy
  getting up and down — so effective grazing area is smaller than the map area, and gain per
  animal suffers. Steep paddocks also get grazed unevenly rather than uniformly.
- **Erosion risk** on that 22% is real, especially where it is bare in verano.

### The part that is good news: 191 m of head

For water, this vertical range is an **asset**. A spring or tank up at 800 m can serve
paddocks hundreds of metres below **entirely by gravity** — no pump, no fuel, no maintenance
bill. That is very likely why the 2003 plan shows a piped network with a ventosa (an
air-release valve, which is what you fit when a line climbs over a high point).

**Concrete next step for the water project:** once the tanks and springs are located, we can
read each one's elevation off this terrain model and work out exactly which potreros each can
reach by gravity. That question — *what can we water without a pump?* — is now answerable
from the desk.

## Climate `[ERA5 reanalysis via Open-Meteo, 2015–2025]`

⚠️ **Provenance caveat:** ERA5 is a **model reanalysis on a ~25 km grid, not a rain gauge on
the farm.** It is reliable for the *shape* of the year and for comparing one year against
another; it should not be treated as a measurement of what fell at Sabaleticas. A local IDEAM
station record would be better and is worth chasing.

⚠️ **Unresolved conflict, flagged 2026-08-21.** A second ERA5 pull for the same point returned
**~3,067 mm/year** — more than double the figure below — with a different monthly shape (driest
**Dec–Feb**, wettest **Apr–May and Oct–Nov**). Two reanalysis extractions for one location
should not disagree by 2×; the likely cause is a different underlying model (ERA5 vs ERA5-Land,
which diverge sharply in mountains) or a different period. **Neither is a rain gauge.** Until an
IDEAM station record settles it, treat every rainfall figure here as indicative only — and note
that the *bimodal shape* is consistent across sources even where the totals are not.

Annual rainfall averages **~1,397 mm**. Median month, against reference evapotranspiration:

| Month | Rain (mm) | ET0 (mm) | Balance |
|---|---|---|---|
| ene | 57 | 126 | **−69** |
| feb | 73 | 115 | **−42** |
| mar | 106 | 129 | **−23** |
| abr | 176 | 113 | +63 |
| may | 102 | 111 | −8 |
| jun | 60 | 115 | **−55** |
| **jul** | **22** | **132** | **−110** |
| **ago** | **48** | **145** | **−98** |
| sep | 64 | 129 | **−65** |
| oct | 179 | 119 | +60 |
| nov | 175 | 106 | +69 |
| dic | 78 | 116 | **−38** |

**Only three months of the year are in surplus: April, October and November.**

### The finding that matters: the *mid-year* dry season is the harsh one

| Dry season | Cumulative deficit |
|---|---|
| **May–September** | **−336 mm** over 5 months |
| December–March | −172 mm over 4 months |

This runs against the usual framing. In Colombia "verano" normally brings Dec–Mar to mind,
but at this site the **June–September window is roughly twice the moisture deficit**, and
**July–August is the single deepest point of the year**. Any verano plan that only braces for
December is bracing for the wrong season.

### Where 2026 stands

| | |
|---|---|
| Rainfall Jan–Aug 2026 vs normal | **+0%** — dead average for the year to date |
| **August 2026 (to the 15th)** | **10 mm vs 48 mm normal — 79% below** |
| Water balance, last 90 days | **−252 mm** |
| That 90-day window ranked against 2015–2025 | ~5th driest of 12 — **dry, but not exceptional** (2018, 2017, 2020 and 2023 were all drier) |

So: **the year overall is normal, but right now is sharply dry** — which is exactly what the
calendar predicts for August. Nothing in the record so far says 2026 is an outlier.

> **Open question for Manuel:** when you say a big verano is coming, do you mean the
> **December–March** one, or the fact that we are **in the deepest part of the mid-year one
> right now**? The answer changes the planning horizon completely — one is a forecast to
> prepare for, the other is a condition to manage this week. And if there is an El Niño
> signal behind the expectation, that is worth pulling in, since it is the main thing that
> would push a year outside the range above.
