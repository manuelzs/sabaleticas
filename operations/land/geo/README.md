# Geometry — the official boundary, and an open question about 41 hectares

> **Status: boundary found and saved, 2026-08-21.** Pulled live from **Catastro Antioquia**,
> confirmed visually by Manuel. One material discrepancy remains open — see
> [The 41-hectare question](#the-41-hectare-question), which is both a data problem and a
> possible **money** problem.

## What's here

| File | What it is |
|---|---|
| `boundary.geojson` | **The official parcel** — "AP 1 SABALETITAS", **151.85 ha**. Canonical |
| `boundary.kml` | Same, derived, for Google Earth on a phone. **Never hand-edit** |
| `candidate-ap2-parte-alta.geojson` | "AP 2 PARTE ALTA", 41.16 ha — **not ours per Manuel**, kept only because of the discrepancy below |
| `neighbours.geojson` | The six surrounding predios, for context and orientation |
| `parcels-overview.svg` | Quick visual of all of the above, north up |

GeoJSON is canonical: plain text, clean git diffs, and GitHub renders it as an interactive
map on its own. KML is derived for field use.

## Where it came from

The national route failed, informatively. IGAC's *Consulta Catastral* on
[Colombia en Mapas](https://www.colombiaenmapas.gov.co/) answered a coordinate query at the
farm entrance with:

> *"No se encontró información asociada. Para consultar esta información debe contactar al
> gestor catastral: **CATASTRO ANTIOQUIA**."*

Antioquia is a **gestor catastral descentralizado**, so La Pintada will never appear in the
national base. The real source is the department's own published service, which backs the
[GeoAntioquia](https://geovisor.antioquia.gov.co/GeoAntioquia) viewer:

```
https://geodatos.antioquia.gov.co/server/rest/services/Catastro/BCGS_Catastro_Publico/MapServer
  layer 10 = R LC Terreno Predio   (rural parcels, with matrícula + NPN)
```

It serves GeoJSON directly (`f=geojson&outSR=4326`), so the boundary needs no conversion.

## The parcel

| Field | Value |
|---|---|
| **Name in the cadastre** | **AP 1 SABALETITAS** *(cadastral typo — "Sabaletitas" for Sabaleticas)* |
| **Número predial nacional** | `053900001000000020058000000000` |
| **Matrícula inmobiliaria** | **023-16153** |
| Ficha catastral | 13902419 |
| Municipio | La Pintada, Antioquia (05390) |
| **Computed area** | **151.85 ha** (geodesic, from the polygon — not transcribed) |
| Perimeter | 6,697 m · 367 vertices |
| Extent | 5.7888–5.8078 N, 75.5949–75.6191 W (~2.7 km × 2.1 km) |

**Confirmed by Manuel (2026-08-21)** on the rendered map, misspelling and all.

Two independent checks agree it's the right parcel: the farm entrance lands on its eastern
tip, and its neighbours are exactly the ones the 2003 plan names — **HACIENDA TEXAS** to the
north and **EL GUAICO** to the south.

### The neighbours

| Predio | ha | Matrícula |
|---|---|---|
| Rancho Los Toros | 316.92 | 023-5441 |
| **El Guaico** | 132.44 | 023-16154 |
| Casoja | 71.89 | 023-8398 |
| **Hacienda Texas** | 53.06 | 023-14591 |
| Fca La Esmeralda | 22.61 | 023-23120 |
| Fca El Verdún | 8.78 | 023-23121 |

Note **023-16153 (Sabaleticas), 023-16154 (El Guaico), 023-16155 (AP 2 Parte Alta)** are
**consecutive matrículas** — they were registered in the same act. That is the fingerprint of
the four-way subdivision described in [`../location.md`](../location.md), and it confirms the
tenure story independently.

Also worth noting: **Fca La Esmeralda and Fca El Verdún were created in the cadastre only in
December 2025** (the others date from May 2025), and both were split from the same parent
parcel. "Verdún" is one of the potrero names on the 2003 plan, at the northern end near the
road. Whether that is a coincidence of naming or a piece that came out of the old farm is
unresolved.

## Area: 170.73 ha across two parcels — 22.68 ha still unexplained

> ### 🔴 Correction (2026-08-21): the farm spans two municipalities.
> Manuel noticed the boundary layer was cutting off a considerable piece of land in the
> northwest. He was right, and the cause was mine: **I queried Catastro Antioquia for La
> Pintada only.**
>
> Searching by **matrícula** instead of by municipality returns **two parcels under the same
> title 023-16153**:
>
> | Parcel | Municipio | NPN prefix | Area |
> |---|---|---|---|
> | AP 1 SABALETITAS | **La Pintada** | 05390 | 151.85 ha |
> | **LO 1 EL GUAICO** | **Santa Bárbara** | **05679** | **18.88 ha** |
> | | | **Total** | **170.73 ha** |
>
> Same matrícula means **one legal property**, administered by two municipal cadastres. The
> Santa Bárbara piece sits to the **northwest**, exactly where Manuel said land was missing.
>
> **Lesson for this repo:** query cadastral data by **matrícula**, not by municipality. A
> municipal query silently truncates any property that crosses a boundary — and it does so
> without any error, which is the dangerous kind of wrong.

### The remaining gap

| Figure | Source | |
|---|---|---|
| **170.73 ha** | Cadastre, both parcels, 2026 | Best evidence |
| 193.41 ha | 2003 survey plan, "Lote No. 1" | A real document |
| **22.68 ha** | The gap | **Still unexplained** |

Finding the Santa Bárbara parcel closed **19 of the 41.56 ha** we could not previously
account for. The remainder is still open, and the candidates below are unchanged.

## The older reading — kept for the record

**Use 151.85 ha.** `[cadastre — parcel AP 1 SABALETITAS, matrícula 023-16153, area computed
from the official polygon]`. It is the only figure here that comes from a system of record
rather than from memory, and Manuel's read of the rendered map agrees with it
`[owner, corroborated by cadastre]`.

### The discrepancy has not gone away

| Figure | Source | Status |
|---|---|---|
| **151.85 ha** | Cadastre, AP 1 SABALETITAS, 2026 | Best evidence |
| 193.41 ha | 2003 survey plan, "Lote No. 1" | A real document, describing a larger parcel |
| ~200 ha | Owner, at project kickoff | **Unsourced and wrong** — carried unchallenged from the first commit |
| **41.56 ha** | The gap | **Unexplained** |

Two documents disagree by 41.56 ha and **we do not know why.** That is not resolved by
preferring one of them. Either the 2003 parcel was later reduced, or the two describe
different things.

### What I got wrong, and what's left

I first read AP 2 Parte Alta (41.16 ha) as the missing piece, since it closes the gap to
within 1%. **The geometry kills that**: AP 1 and AP 2 are **149 m apart**, and Lote No. 1 was
drawn as a *single contiguous outline*, so it cannot be the two of them. The area match is a
coincidence. Manuel separately states AP 2 belongs to his cousin, who inherited it in the
same subdivision `[owner, unverified — the next-week check tests this]`.

A remaining **hypothesis, not a finding** — two parcels adjacent to our northern boundary,
both created in the cadastre only in **December 2025** (neighbours date from May 2025), both
split from the same parent:

| Parcel | ha | Note |
|---|---|---|
| Fca La Esmeralda | 22.61 | `location.md` lists "Casa La Esmeralda" as a family parcel |
| **Fca El Verdún** | 8.78 | **"Verdún" is a potrero on the 2003 plan**, at the northern end (7.08 ha there) |
| Subtotal | 31.39 | **still leaves ~10.2 ha unaccounted** |

**What would actually settle it:** the *certificado de tradición y libertad* for **023-16153**.
It lists the property's whole chain of title — every segregation and sale — so it would show
directly whether land was split off our parcel since 2003, and when. Worth ordering alongside
the tax check.

## The tax question — checking next week

Parked to next week. The concern, in Manuel's words:

>  *"We might be paying for stuff that isn't ours in taxes"* — potentially across the ~20
> years since the subdivision.

**The risk is lower than it first looked, but not zero.** AP 2 has its own matrícula
(023-16155) and was inherited by the cousin, so it should carry its own predial account —
which is the normal case and means no overpayment. Worth verifying anyway, because the cost
of checking is near zero and the exposure, if it exists, is two decades deep.

### The two checks

**1. The impuesto predial bill (free, decisive, already in hand).** Check which **número
predial / matrícula** it is issued against, and on what **área**. Expected and correct:
`053900001000000020058…` / **023-16153** / **151.85 ha**. Two ways it could be wrong — it
also carries `…0059…` / 023-16155, *or* it bills the right predio at an inflated area (e.g.
still ~193 ha from the 2003 plan). **The second is the likelier failure and the easier one to
miss**, since the predio number would look perfectly right.

**2. A certificado de tradición y libertad for matrícula 023-16155.** This names the legal
owner outright and settles it beyond argument. Order online at
[certificados.supernotariado.gov.co](https://certificados.supernotariado.gov.co/certificado)
— roughly **$18,700 COP**, paid by PSE, PDF in minutes. Worth pulling **023-16153** at the
same time to confirm our own title cleanly, including any mortgages or limitations, which we
would want on record anyway.

If it turns out we have been paying, the route is a **corrección de área / revisión de avalúo**
with Catastro Antioquia, plus a claim for what was overpaid.

## What the confirmed area does to the herd numbers

This is the consequence that outranks the tax question:

| Basis | Potrero (ha) | Head/ha at 266 | Against the 1–2/ha rotated benchmark |
|---|---|---|---|
| Old assumption, 193.41 ha | 158.67 | 1.68 | near the top of the range |
| **Confirmed, 151.85 ha** | **~117–125** | **~2.13–2.27** | **above the range** |

The potrero figure assumes the non-grazing land (playón 21.90, sapal 5.52, rastrojos,
cañaverales, guaduales, represas — 34.74 ha on the 2003 plan) sits inside our parcel, which
the satellite check confirms: it is the river-edge land along the western boundary, and that
boundary is ours.

> **We are carrying more cattle than the land is rated for.** Not dramatically — but we are
> over the benchmark, not under it, and that is the opposite of what "266 head on 200
> hectares" suggested when this project started.

It compounds badly with the verano ([`../../water/README.md`](../../water/README.md)): being
overstocked *before* dry-season water shrinks the usable paddocks is how crowding turns
severe. And it points question six in the water project — *more water, or fewer head?* —
firmly toward **fewer head**, which is what the turnover diagnosis wants anyway.

## Aerial imagery — 0.5 m orthophoto

**IGAC flies La Pintada at 50 cm and publishes it.** The service is
`mapas.igac.gov.co/image/rest/services/orto/orto05390lapintada/ImageServer` (4-band, native
pixel 0.5 m, EPSG:9377). Its footprint covers **essentially the whole farm** — the no-data
edges of the export fall outside our boundary, in the surrounding padding.

That is a true **orthophoto**: orthorectified, so terrain displacement is removed and you can
measure distances and areas straight off it. An ordinary satellite view can't be trusted that
way on hilly ground like ours.

| File | What it is |
|---|---|
| `orthophoto-igac-05m.jpg` | **The photo.** IGAC 0.5 m orthophoto, 4488 × 3996, ~2.2 × 2.0 km. Archival copy |
| `orthophoto-boundary.jpg` | Same imagery with the parcel boundary and a 500 m scale bar — the working/field map |
| `*.jgw` | World files. Put one beside its JPEG and QGIS / ArcGIS / Google Earth Pro place it automatically at the right spot on Earth |

Both are in plain WGS 84 lat/lon (EPSG:4326), north up. Gaps at the frame margins are filled
from Esri World Imagery (max native zoom here is z18 ≈ 0.59 m/px, so it is the fallback, not
the primary).

### What the imagery shows

Three known things check out, and one is new:

- **The western boundary follows the Río Poblanco exactly** — the braided channel is clearly
  visible and the parcel line traces it. Confirms [`../location.md`](../location.md).
- **The northeastern boundary is a single long straight survey line** (~1,377 m), running from
  the entrance up to the north — consistent with the plan's ruled boundary against the
  northern neighbour.
- **The entrance falls exactly on the eastern tip** of the parcel.
- **New, and the useful part: fence lines are plainly visible.** At 50 cm the hedgerows and
  vegetation breaks that divide the potreros are unmistakable, along with farm tracks, the
  house, and individual trees. **The current potreros can be traced from this imagery** — we
  do not have to wait for the new survey to get a usable potrero map.
- **Water bodies are visible inside the boundary** on the eastern side — candidate
  represas/reservoirs, and directly useful to the verano work
  ([`../../water/README.md`](../../water/README.md)), which needs exactly this inventory.
- A **planted block with regular rows** is visible in the south — worth identifying on the
  ground (cañaveral? fruit?), and interesting next to the parked citrus question in
  [`../../../strategy/diversification.md`](../../../strategy/diversification.md).

## Still to do

- **Settle the 41 ha** (above) and fix the area everywhere.
- **Potreros** — the 2003 layout is superseded and Manuel has an updated plan coming, so
  digitizing the old lines would be careful work producing a known-wrong answer. Do it once,
  from the new plan, or trace current fence lines off recent satellite imagery.
- **Water layer** — locate springs, tanks, reservoirs and pipe runs as geometry; feeds the
  verano capacity work directly.
- **GPS on the mojones** is now optional for the boundary (we have an official one) but still
  valuable for one thing: **4+ points would let us georeference the 2003 scan** and rescue its
  historic water network into real coordinates.

---

**Sources:** [IGAC — Consulta Catastral](https://geoportal.igac.gov.co/contenido/consulta-catastral)
· [Colombia en Mapas](https://www.colombiaenmapas.gov.co/)
· [GeoAntioquia](https://geovisor.antioquia.gov.co/GeoAntioquia)
· [SNR — Certificado de Tradición y Libertad](https://certificados.supernotariado.gov.co/certificado)

## The local viewer — `sabaleticas map`

```
sabaleticas map            # build it and open it
sabaleticas map --no-open  # just write the file
```

Writes `viewer.html` (~1.2 MB) and opens it in the browser. **No server, no internet, no
install** — it reads straight off the disk. Built by `sabaleticas/map.py`, stdlib-only like
the rest of the CLI; the page itself is plain HTML canvas and vanilla JavaScript, **no
mapping library**. Rebuild it any time the underlying GeoJSON changes.

What it does:

- **Basemap** is our own 0.5 m orthophoto (`orthophoto.jpg`), not online tiles — so it works
  offline and is sharper than anything a tile service gives for this area.
- **Layers** toggle on and off: linderos, cercas, drenajes, depósitos de agua, bosque, vías,
  construcciones, curvas de nivel, vecinos.
- **Cursor readout** — latitude, longitude and **elevation** anywhere on the map, from the
  IGAC terrain model sampled onto a 30 m grid (`terrain-grid.json`).
- **Measure tool** — click two or more points for distance, **elevation difference**, and
  slope. It states plainly whether water would *flow by gravity* or *need pumping* between
  the points.

That last feature is the point of the whole thing. "Can this tank reach that potrero without
a pump?" is the central question of the verano work
([`../../water/README.md`](../../water/README.md)), and it is now answerable in two clicks.

### ⚠️ The `Cerca` layer is not the potrero map

Per Manuel (2026-08-21), and visible in the viewer: IGAC's fence layer is **incomplete** —
many fences are missing and several enclosures do not close, which suggests automated or
photo-interpreted capture rather than a survey. The fences it *does* show are probably all
real; the set is just partial, and it is **not topological**, so potrero polygons cannot be
derived from it.

Treat it as a **skeleton**. The real potrero map still has to come from tracing the
orthophoto (fence lines are legible at 50 cm), Manuel's updated plan, or GPS — see
[`../pasture.md`](../pasture.md).

## Using the data in real GIS

Everything here is standard, so no conversion is needed:

- **QGIS** (free, [qgis.org](https://qgis.org)) — drag `boundary.geojson`, the files in
  `igac-1to5000/`, and `orthophoto.jpg` straight onto the canvas. The `.jgw` world file next
  to each JPEG places the imagery automatically.
- **Google Earth Pro** — open `boundary.kml`.
- Anything else — it is all WGS 84 lat/lon (EPSG:4326) GeoJSON.
