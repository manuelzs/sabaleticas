# Dashboard — project plan and to-dos

> The application's own plan. **Farm operations live in [`../PLAN.md`](../PLAN.md)** — water
> fixes, field checks, paperwork. This file is only about the tool.
> Design reasoning: [`ARCHITECTURE.md`](ARCHITECTURE.md) · What exists: [`README.md`](README.md)

## Done

| | |
|---|---|
| 2D map from canonical GeoJSON — layers, cursor elevation, measure, slope | ✅ |
| 3D terrain with vector layers draped on the surface | ✅ |
| 2003 plan overlay with multi-point calibration | ✅ |
| **Water system as a graph**; the map's GeoJSON is generated from it | ✅ |
| **Physical validation** — uphill edges flagged on every build | ✅ |
| **Hydraulic schematic**, Y = real elevation, collision-aware routing | ✅ |
| Point capture (`C`) · contour hover · view in the URL hash | ✅ |
| Generated verification checklist (`water_inventory.py`) | ✅ |

## Open

### 1 · Navigation and the three axes *(next)*
See [`ARCHITECTURE.md`](ARCHITECTURE.md). Build the seam, not the cathedral.

### 2 · Globally unique entity ids
`agua:rompecargas` rather than `rompecargas`. A rename today; a migration once readings and
tickets reference the old ids.

### 3 · Attachment model
Readings, tickets and alerts are **one mechanism**: something keyed to an entity id, rendered
by whichever view cares. Build it when the first sensor lands, not before.

### 4 · Slope-shaded surface
The cursor reports slope already. Missing: the coloured surface in 2D and on the 3D mesh.
**A third of the farm is ≥15°**, and cattle under-graze steep ground.

### 5 · Potrero polygons
The data work is in [`../PLAN.md`](../PLAN.md); the app side is a layer plus, eventually,
per-potrero attributes. **This is what unblocks Ganado.**

### 6 · Deferred on purpose
Tables/CRUD · charts · per-view state persistence beyond the hash · anything for Ganado
before there is cattle data.

## Rules

1. **The dashboard renders; it never owns data.**
2. **Derived numbers are derived** — length, gradient, area, all computed.
3. **Offline first**, single file, stdlib only, no build step.
4. **Never look more confident than the data.** Dashed hypotheticals, confidence dots, the
   *cota desconocida* band, and a router that cannot draw a connection that does not exist.
