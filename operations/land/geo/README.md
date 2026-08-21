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

## Area: settled at 151.85 ha

**Manuel confirmed (2026-08-21): we own only AP 1. "AP 2 Parte Alta" belongs to his cousin,**
who inherited it as part of the same subdivision. So:

> ### **Sabaleticas = 151.85 ha.** That is the number to use everywhere.

### A correction to an earlier reading

I initially flagged that AP 2's 41.16 ha almost exactly closes the gap between AP 1
(151.85 ha) and the 2003 plan's Lote No. 1 (193.41 ha), and treated that as evidence they
were once one parcel. **That inference was wrong**, for a reason the geometry settles:

> **AP 1 and AP 2 are 149 m apart** — genuinely detached, not merely road-separated. Lote
> No. 1 was drawn in 2003 as a *single contiguous outline*, so it cannot simply be AP 1 plus
> AP 2. The area match is a coincidence.

**The 41.56 ha gap is still real** — the 2003 parcel was bigger than what we hold — but AP 2
is not where it went. Better candidates, both adjacent to our northern boundary and both
**created in the cadastre only in December 2025** (the surrounding parcels date from May
2025), and both split from the same parent:

| Parcel | ha | Note |
|---|---|---|
| Fca La Esmeralda | 22.61 | `location.md` already lists "Casa La Esmeralda" as a family parcel |
| **Fca El Verdún** | 8.78 | **"Verdún" is a potrero name on the 2003 plan**, at the northern end near the road (7.08 ha there) |
| Subtotal | 31.39 | leaves ~10.2 ha still unexplained |

That is a hypothesis, not a finding. It does **not** change our area — 151.85 ha is confirmed
either way — it only bears on the history.

## The tax question — check on Monday

Parked to Monday (out of office hours). The concern, in Manuel's words:

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
