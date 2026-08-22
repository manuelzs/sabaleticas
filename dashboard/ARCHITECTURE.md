# How the app should be organised

> **Design note, 2026-08-22.** Written before building the P&ID, because the choice
> made here decides whether the next five features fit or fight.

## The two axes Manuel identified

> *"We have two orthogonal concepts: **views** — diagram, geospatial, and later
> regular CRUD-type stuff. The orthogonal axis is the **subsystem** one: water
> management, cattle. The geospatial tab also includes the water and the cattle."*

| | |
|---|---|
| **Views** — *how* you look | geospatial map · schematic (P&ID) · tables/CRUD · charts |
| **Subsystems** — *what* you look at | **agua** · **ganado** · **predio** (land, boundaries, potreros) |

## The third axis: cross-cutting concerns

`[Manuel, 2026-08-22]` *"We might build some sort of ticket tracking app that can track work
tickets across the different subsystems."*

A ticket system is **neither a view nor a subsystem** — it is a thing that *attaches to*
entities in any subsystem. "Replace the float valve at `rompecargas`". "Confirm where
`beb-5` really is". "Weigh lote 42."

And it is not alone. **Sensor readings work exactly the same way**: a level for
`rompecargas` attaches to that node. So does a photo, or a scanned concesión.

> ### The unifying idea: attachments key on entity id.
> Subsystems own **entities**. Cross-cutting concerns own **attachments** that reference
> entity ids. Any view can render the attachments it cares about — a map marker showing an
> open ticket, a schematic symbol showing a live level.

This has one consequence worth acting on **now**, because it is painful to retrofit:

> **Entity ids must be globally unique, not unique per subsystem.**
> `agua:rompecargas`, `predio:potrero-bilbao`, `ganado:lote-42`. Today the water graph uses
> bare ids like `rompecargas`; that is fine while there is one subsystem, and it will collide
> the moment there are two.

### We already have a proto-ticket system, by accident

[`../operations/water/inventory.md`](../operations/water/inventory.md) is generated from
`pos_confianza` on each node. **`baja` means "someone has to go and check this"** — which is a
ticket in everything but name, and the file is already a work list sorted by urgency.

A real ticket system would make that explicit and, crucially, let Manuel **close items**.
Until then, the generated inventory does the job and costs nothing to maintain.

## Why this is not a matrix

The obvious move is a grid of view × subsystem. It breaks immediately:

- **The map is inherently cross-subsystem.** Troughs, potreros, boundaries and cattle
  positions belong on *one* surface. A "cattle map" and a "water map" as separate things
  would be worse than what we have.
- **The P&ID is water-only.** A schematic of a cattle herd is meaningless.
- **Tables are subsystem-shaped**, and always will be.

So the axes are real, but the cells are not uniform. The structure that actually works:

> ### Subsystems are **data providers**. Views are **renderers**.
> A subsystem publishes what it can contribute. Each view consumes what it understands.
> The map is simply the one renderer that accepts contributions from **everybody**.

```
subsystem                       what it publishes
─────────────────────────────────────────────────────────────
agua      water-network.json    → map layers · schematic · tables
predio    boundary, contours…   → map layers ·      —     · tables
ganado    herd, lotes, moves    → map layers ·      —     · tables · charts

view          consumes
─────────────────────────────────────────────────────────────
MapView       map layers from ALL subsystems, grouped by source
SchematicView the schematic from whoever offers one (today: agua)
TableView     tables from the active subsystem
```

Adding cattle later means **publishing layers**, not editing the map.

## The UI concept: workspaces

Tabs are **workspaces**, not views and not subsystems — a workspace is *a subsystem plus
the view that is primary for it*. That is why Manuel's three tabs are not all the same
kind of thing, and that is fine:

| Tab | Primary view | Also available |
|---|---|---|
| **Ganado** | tables | map (cattle layers highlighted), charts |
| **Geoespacial** | the map, **everything on** | — |
| **Agua** | the **P&ID** | map (water layers), tables, the inventory |

**Geoespacial is the shared surface.** The other tabs are lenses onto the same data with
different defaults. Nothing is duplicated — the same water node is one record, drawn in
two places.

## What to build now, and what to leave

Build the **seam**, not the cathedral:

1. **Group the map's layer list by subsystem** (Agua · Predio · Ganado). ~20 lines, and it
   makes the structure visible before anything depends on it.
2. **Three tabs**, with Geoespacial as the default — it is the one that works today.
3. **The P&ID lives in the Agua tab**, reading `water-network.json` through its `pid`
   layout coordinates.
4. **Ganado is a placeholder** until there is data. Do not design it in the dark.

Deliberately deferred: routing/URLs, per-view state persistence beyond what exists, and
any CRUD editing. None of it is needed to know the shape is right.

## Rules this has to keep

Carried from [`README.md`](README.md), and none of them change here:

1. **The dashboard renders; it never owns data.** Subsystems own data. Views are views.
2. **Offline first**, single file, stdlib only, no build step.
3. **Derived numbers are derived** — see `sabaleticas/network.py`, where length, drop and
   gradient are computed rather than stored.
4. **Identity in one place** — [`../farm.json`](../farm.json). A second farm swaps the data,
   not the app.

## The one thing that makes sensors work

Live readings key on **node id**. `water-network.json` already has stable ids, so a level
reading for `rompecargas` lights up **both** the map marker and the schematic symbol with
no extra plumbing. That is the real reason to do the graph refactor before the P&ID rather
than after.
