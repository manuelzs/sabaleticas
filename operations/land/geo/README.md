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

## The 41-hectare question

**This is the finding that matters.**

| Source | Area |
|---|---|
| 2003 survey plan, "Hacienda El Guaico — Lote No. 1" | **193.41 ha** |
| Cadastre today, "AP 1 SABALETITAS" | **151.85 ha** |
| **Gap** | **41.56 ha** |
| Adjacent parcel "AP 2 PARTE ALTA" (023-16155) | **41.16 ha** |

The gap and that neighbouring parcel match to within **0.4 ha (1%)**. The naming — *AP 1* and
*AP 2* — points the same way. So the 2003 Lote No. 1 almost certainly comprised both, and
they have since been separated.

**Per Manuel (2026-08-21): AP 2 "Parte Alta" was part of the old farm but now belongs to a
neighbour.** Which raises his question, and it's a good one:

> *"I don't know if the data here is wrong, or we might be paying for stuff that isn't ours
> in taxes."*

The geometry supports the concern being real rather than theoretical: AP 2 is **not
contiguous** with AP 1 — it sits southeast of the entrance, separated from it. A detached
parcel carrying a sibling name from the same subdivision is exactly the shape of thing that
stays attached to the wrong cadastral account for years without anyone noticing.

### How to settle it — two checks, in order

**1. The impuesto predial bill (free, decisive, and you already have it).** Look at which
**número predial / matrícula** the bill is issued against. If it shows only
`053900001000000020058…` / **023-16153**, there is no problem — we simply record 151.85 ha
and move on. If it also carries `…0059…` / **023-16155**, we are being billed for land we
don't own, and it is worth recovering.

**2. A certificado de tradición y libertad for matrícula 023-16155.** This names the legal
owner outright and settles it beyond argument. Order online at
[certificados.supernotariado.gov.co](https://certificados.supernotariado.gov.co/certificado)
— roughly **$18,700 COP**, paid by PSE, PDF in minutes. Worth pulling **023-16153** at the
same time to confirm our own title cleanly, including any mortgages or limitations, which we
would want on record anyway.

If it turns out we have been paying, the route is a **corrección de área / revisión de avalúo**
with Catastro Antioquia, plus a claim for what was overpaid.

### Why the answer changes the farm's numbers

Until this is settled, **the denominator under every per-hectare figure in this repo is
uncertain** — including the one that decides how hard the coming verano will be:

| If the titled area is… | Potrero (ha) | Head/ha at 266 | Against the 1–2/ha rotated benchmark |
|---|---|---|---|
| 193.41 ha (2003 plan) | 158.67 | **1.68** | near the top of the range |
| **151.85 ha (cadastre)** | **~117–125** | **~2.13–2.27** | **above the range — overstocked** |

The lower figure assumes the non-potrero land (playón 21.90, sapal 5.52, rastrojos,
cañaverales, guaduales, represas — 34.74 ha in total) sits mostly inside AP 1, which it should,
since it is the river-edge land on the western boundary.

**If the cadastre is right, we are carrying more cattle than the land is rated for**, which
would compound with the water question ([`../../water/README.md`](../../water/README.md)) in
the worst possible way going into a dry season — and it would strengthen the case that the
answer to a tight verano is *fewer head*, not *more water*.

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
