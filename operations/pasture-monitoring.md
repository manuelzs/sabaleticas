# Watching the pasture from space — what works, what doesn't

> Researched 2026-08-21. **Parked for later discussion** — captured now so it isn't lost.
> Relevant to [`pasture.md`](pasture.md) (rotation) and [`water/README.md`](water/README.md)
> (dry-season stress).

## The short version

**The free option is genuinely free and we are far too small to ever need a paid tier.** A
full-farm NDVI request over 170 ha is a 123 × 123 pixel image costing ~0.077 processing units.
The free Copernicus quota is **10,000 units/month** — pulling an image *every single day* would
use **2.3 units/month, about 0.02% of the allowance.**

> **Cost is not the constraint. Cloud is, and then calibration.**

## Tools

| Tool | Verdict |
|---|---|
| **Copernicus Browser** (`browser.dataspace.copernicus.eu`) | ✅ **Start here.** Free account, upload paddock polygons as KML/GeoJSON, chart NDVI per paddock over time, filter by cloud, export. Commercial use is fine — Sentinel data is free and open |
| **Auravant** (`auravant.com`) | ✅ **The find.** Argentine, Spanish-first, and it has a **módulo de ganadería with grazing-circuit planning in the FREE tier**, up to 1,000 ha. Our 170 ha fits with 6× headroom. Worth a five-minute signup — *not confirmed it serves Colombia* |
| ~~EO Browser~~ | ❌ **Dead** — sunset 20 March 2026. Any guide recommending it is stale |
| ~~Planet NICFI~~ | ❌ **Dead**, and worse than reported: the programme ended Jan 2025 *and* Norway's replacement procurement was cancelled Sept 2025 after a legal challenge. The successor product is paid and **non-commercial only** |
| Google Earth Engine | ⚠️ A working farm probably **fails** the non-commercial eligibility test. There is a usage-only "Limited" plan that would cost pennies at our scale, but it needs a billing account |
| EOSDA / Agromonitoring / OneSoil / Farmonaut | ❌ Minimum tiers start at 1,000 ha, or pricing is now contact-sales. Overpriced or opaque at our size |
| Colombian institutions (Agronet, UPRA, IDEAM, AGROSAVIA, Fedegán) | ❌ **Nothing farm-level.** Agronet's crop monitoring covers the Orinoquía only |

## The three things that actually limit this

### 1. Cloud — the binding constraint

Twelve months of observations over the farm's bounding box (211 scenes):

| | Landsat | Sentinel-2 |
|---|---|---|
| Median cloud cover | **88%** | **76%** |
| **Scenes under 10% cloud** | **0** | **0** — *in a full year* |
| Scenes under 20% cloud | 1 | 5 → roughly **one every 64 days** |

⚠️ **Caveat that matters:** that is scene-level cloud over a 110 km tile including the high
Andes, not over our 170 ha. The farm can be clear inside a 76%-cloudy tile, so the real
farm-level rate is better. But the direction is unambiguous: **plan around month-scale gaps,
clustered in the growing season.**

### 2. NDVI saturates exactly where the decision lives

Red reflectance goes flat once leaf area index passes ~2, and NDVI is essentially saturated by
LAI 3–4. **A well-grown tropical grass paddock at grazing entry is comfortably past that** —
which is precisely the state a rotation decision needs to measure.

Two corroborations, one uncomfortably local:

- **Kikuyu pasture in Antioquia, Sentinel-2: NDVI vs biomass R² = 0.13.** Canopy *height* did
  far better at 0.42.
- 88 Landsat images over northern Antioquia dairy farms 1995–2014 found **no detectable NDVI
  trend across two decades** of management variation.

The nearest good analogue to us — CIAT's farm in Cauca, *Brachiaria*, rotational grazing —
reached **R² 0.60 from Sentinel-2** and **0.76 from a drone**, and its best satellite predictor
was **NDRE, not NDVI**. Worth noting the drone beat the satellite on the same paddocks.

**Saturation-resistant alternatives at the same 10 m: EVI2 and WDRVI.** Red-edge indices do
better still but drop to 20 m.

### 3. Our trees will bias it, and not by a little

In a silvopastoral trial with the same grass, same site, same day, **pasture under trees read
NDVI ~0.4 against ~0.6 in full sun — a 0.2 offset from the trees alone.** The errors don't
cancel: shaded grass is darker, but a tree crown has its own high NDVI, and the mix shifts with
solar angle, so **the same paddock reads differently in January and June with identical
forage.**

That matters here specifically: **we have ~47 ha of forest and gallery woodland**
([`land/geo/README.md`](land/geo/README.md)), much of it threaded along the quebradas and
through the paddocks. Every published study in this system handled trees by *excluding* them,
not correcting for them.

Also counter-intuitive: **standing dead material pushes NDVI down while dry matter goes up.**
In verano the index moves the wrong way.

## If we do this

1. **Copernicus Browser + Auravant free.** Zero cost. Skip every paid tier.
2. **Do not expect kg of dry matter from NDVI without ground truth.** Uncalibrated NDVI→biomass
   equations carry RMSE of **566–1,307 kg DM/ha**; calibrated against a rising-plate meter,
   **255 kg**. That 4–5× difference is the entire decision margin for a rotation.
3. **Use it for relative paddock ranking on a single date**, not absolute biomass. "Which
   paddock has recovered most" is answerable; "how many kilos are in this paddock" is not.
4. **Erode paddock polygons by one pixel and mask the trees.**
5. **It needs the potrero layer first** — like everything else in
   [`../dashboard/README.md`](../dashboard/README.md).

> **Honest framing: this is a cheap, useful *relative* indicator and a poor absolute one.**
> It will tell us which paddocks are recovering fastest and when the farm greens up after
> rain. It will not tell us what to stock, and on our tree-threaded paddocks it needs care.
