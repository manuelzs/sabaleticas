# Modernizing the map — from a 2003 paper plano to real geometry

> **Status: plan proposed 2026-08-21, awaiting Manuel's input on the two asks at the bottom.**
> The goal: replace "a scan of a hand-drawn plan from 2003" with **actual coordinates** we can
> measure, query and hand to anyone.

## Why bother (beyond it being nice to have)

Real geometry isn't decoration — it changes what we can compute:

- **Areas become measured, not transcribed.** Every per-hectare number in this repo currently
  rests on figures copied off a 23-year-old scan, one of which doesn't reconcile (the
  ~10.33 ha gap in [`../plano-2003.md`](../plano-2003.md)). With polygons, area is computed
  and that whole class of error disappears.
- **Per-potrero productivity becomes possible.** The prize in
  [`../pasture.md`](../pasture.md) is *kg of gain per hectare per potrero* — which needs each
  paddock's true area, not a block estimate.
- **Water planning needs distance and elevation.** "Which potreros can be watered in verano"
  ([`../../water/README.md`](../../water/README.md)) is a question about pipe runs and height
  differences. You cannot answer it off a paper plan.
- **It survives.** Paper plans get lost, and this one already had to be pieced together.

## Format decision: GeoJSON canonical, KML for the field

**Canonical: GeoJSON** (WGS84 lat/lon, EPSG:4326), one file per layer, in this folder.

It's the right choice for this repo specifically, for the same reason the data layer is CSV:
GeoJSON is **plain text, so it diffs cleanly in git** and every change is auditable. It also
happens that **GitHub renders a `.geojson` file as an interactive map automatically** — so
these become viewable in the browser with no tooling. And it opens in QGIS (free), Google
Earth, Python, and essentially everything else.

**For the field / phone: export KML.** Google Earth on a phone is how Manuel or the mayordomo
will actually look at this standing in a potrero. KML is generated *from* the GeoJSON, never
edited by hand — same derived-artifact rule as `sabaleticas.db`.

Deliberately **not** shapefile: it's a 1990s multi-file binary format that diffs terribly and
would fight the repo's whole design.

### Layers

| File | Contents |
|---|---|
| `boundary.geojson` | The predio outline — one polygon, the legal-ish extent |
| `potreros.geojson` | One polygon per fenced paddock, with `name`, computed `area_ha`, grass, water access |
| `water.geojson` | Springs, tanks, reservoirs, represa, troughs (points); pipeline, quebradas, river (lines) |
| `infrastructure.geojson` | House, corrals, gates, roads, báscula if one exists |

## Three routes to the boundary, best first

### 1. Pull the official cadastral polygon — try this first, it may take ten minutes

Colombia's cadastral data is public, and **IGAC's Consulta Catastral geovisor lets you export
a predio's terrain polygon directly as GeoJSON or shapefile** — which is exactly the artifact
we want, from the authoritative source, for free. Antioquia also runs its own
descentralizado viewer, **GeoAntioquia** (`geovisor.antioquia.gov.co/GeoAntioquia`), covering
113 of the department's 125 municipios with predio-level data — La Pintada may sit there
rather than in the national set, so both are worth trying.

To look the predio up you need **one** of:

- the **número predial / cédula catastral** — it's printed on the **impuesto predial** bill;
- the **matrícula inmobiliaria** — it's on the **escritura**;
- or just the location on the map, clicking the parcel.

This route is strictly better than anything we can produce ourselves: it's official, it's
already digital, and it costs nothing. **If it works, routes 2 and 3 become optional.**

### 2. GPS the mojones — the strong fallback, and useful regardless

The 2003 plan marks **mojones** (boundary monuments) at the vertices — labelled `M7`, `M8`,
`M9`, `M10`, `M11`, `M12`, `M13` and so on around the perimeter. If those stones are still in
the ground, each one is a **surveyed corner**, and standing on it with a phone gives it a real
coordinate.

This is worth doing **even if route 1 succeeds**, because it does something route 1 can't:

> With **4 or more well-spread mojones** tied to real coordinates, I can **georeference the
> entire 2003 scan** — warp the whole raster into real-world position. That drags the historic
> **water network, spring locations and old potrero lines** into real coordinates with it.
> That information exists nowhere else, and this is the only way to rescue it.

Even better than corner points, if the perimeter is walkable or drivable: **record a
continuous GPS track around the fence line.** That yields the polygon directly rather than
interpolating between corners.

**On accuracy — worth being clear so you don't over- or under-invest:**

| Method | Rough accuracy | Good enough for |
|---|---|---|
| Phone GPS, standing still ~1 min per point | ~3–5 m (better on dual-frequency phones) | Everything we want to do — grazing planning, areas, water layout |
| Topógrafo with RTK/GNSS | centimetres | Legal boundary disputes, titling |

For our purposes **the phone is fine.** On a 193 ha farm a 5 m error is noise — a 5 ha potrero
is ~225 m across, so 5 m is about 2%. Do **not** hire a topógrafo for grazing planning; only
for a legal boundary question, which we don't currently have. Tip: stand still for a minute
per point and let the reading settle, and note the accuracy figure the app shows.

### 3. Trace from satellite imagery — the fallback that needs nothing from anyone

Most of our boundary is made of things visible from space: **Ruta 25** on the east, the **Río
Poblanco** on the west. And the plan gives the lengths of the two survey lines — **Hacienda
Texas 2922.18 m** (north) and **Lote No. 2 2395.96 m**, plus **Fernando González 1251.26 m**
and **Hda. La Perla 271.80 m** (south) — which constrain the rest. Good enough for planning,
not good enough to rely on for anything legal.

## For the potreros specifically — don't vectorize the 2003 lines

The 2003 paddock layout is **superseded**: Manuel confirms the farm has been subdivided
further since, and an updated plan is coming. Tracing those old lines would be careful work
producing a known-wrong answer.

Better, in order:

1. **Wait for the updated plan** if it's coming soon — then digitize once, correctly.
2. **Trace current fence lines from recent high-resolution satellite imagery.** Fence lines
   usually show up as vegetation and colour breaks, and grazing pressure differences make
   paddock edges surprisingly visible from above. I can do a first pass; Manuel or the
   mayordomo corrects names and any invisible lines.
3. **Walk or drive them with a GPS track app** — most accurate, most effort, best done for
   the paddocks we care most about rather than all of them.

The 2003 plan stays valuable for what only it has: **the historic water network and the
original block names.**

## The two asks

1. **Look for the número predial** on an impuesto predial bill (or the matrícula on the
   escritura) and send it. That unlocks route 1, which is the cheapest path to an
   authoritative boundary by a wide margin.
2. **When someone is next walking the fence line, take GPS points on any mojones still
   standing** — 4+ spread around the perimeter, or a continuous track if that's easier. Send
   them however they come out (KML, GPX, screenshots of coordinates, a list of numbers).

With either one I can produce `boundary.geojson` and we stop guessing at the denominator.

---

**Sources for the cadastral routes:** [IGAC — Consulta
Catastral](https://geoportal.igac.gov.co/contenido/consulta-catastral) ·
[IGAC — Datos Abiertos
Catastro](https://geoportal.igac.gov.co/contenido/datos-abiertos-catastro) ·
[GeoAntioquia
announcement](https://antioquia.gov.co/index.php/antioquiacuenta/gobernacion-de-antioquia-presento-geoantioquia-el-nuevo-visor-geografico-del-departamento)
· [Datos Abiertos Antioquia](https://open-data-gobantioquia.hub.arcgis.com/)
