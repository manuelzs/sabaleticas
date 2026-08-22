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

### Alerting closes the loop

`[Manuel, 2026-08-22]` *"We can probably also eventually develop an alert system that connects
to the sensors. Everything is connected."*

He is right, and it falls out of the same shape rather than needing new machinery:

```
sensor reading  →  attaches to entity id  →  rule fires  →  raises a ticket on the same id
```

**An alert is just a ticket nobody typed.** "Rompecargas below 20 % for two hours" becomes an
open item against `agua:rompecargas`, visible on the map marker, on the schematic symbol, and
in the work list — because all three already resolve attachments by id.

That is the argument for getting the attachment model right before building any of the three:
sensors, tickets and alerts are **one mechanism wearing three hats.**

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

### Why cross-cutting concerns still get a tab

If readings and tickets attach to entities, why not show them only on entities?

Because there are two different questions, and only one is answerable in context:

| Question | Answered where |
|---|---|
| *"How full is the rompecargas?"* | **On the entity** — a level inside the tank symbol, on map and schematic alike |
| *"Is my telemetry alive? Which node has not reported since Tuesday?"* | **Nowhere** — no entity badge can tell you about the node that went silent |
| *"What work is open across the whole farm?"* | **Nowhere** — a badge shows one item, not a queue |

So **Trabajo** and **Sensores** are management views over the attachment set, and they sit
after a divider in the tab bar because they are a different axis, not another subsystem.

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

## When a tab is justified

> ### A subsystem earns a tab when it offers a view the shared surface cannot.

| | Earns one? | Because |
|---|---|---|
| **Agua** | **yes, today** | the **schematic** — General can never show it, and it is where you reason about the *system* rather than the *ground* |
| **Predio** | not yet | its map is General with fewer checkboxes. It activates when potreros bring a **table** — names, área, pendiente, pasto, acceso a agua. That is content, not layers |
| **Ganado** | not yet | no data |

**Layer scoping alone is not a tab.** If the only difference is which checkboxes are visible,
that is a filter on the shared surface, and pretending otherwise teaches the user nothing.

## The UI concept: workspaces

Tabs are **workspaces**, not views and not subsystems — a workspace is *a subsystem plus
the view that is primary for it*. That is why Manuel's three tabs are not all the same
kind of thing, and that is fine:

| Tab | Primary view | Also available |
|---|---|---|
| **General** | the map, every subsystem's layers | 3D |
| **Ganado** | tables | map (cattle layers highlighted), charts |
| **General** | the map, **everything on** — the shared surface | — |
| **Agua** | the **P&ID** | map (water layers), tables, the inventory |

**General is the shared surface.** The other tabs are lenses onto the same data with
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

## A rule the schematic taught us

Bebedero 9 appeared connected to the ventosa. It was **not a data divergence** — the map's
GeoJSON is generated from the graph on every build, so the two cannot disagree, and both said
`t-1 → beb-9`. It was the **renderer inventing a claim**:

```
T-1 at 747 m, Bebedero 9 at 732 m  →  the router put the horizontal run at 739.5 m
The ventosa sits at 739 m, in the same lane  →  the pipe drew straight through it
```

> ### When an axis carries meaning, the renderer may not use it freely.
> On this diagram Y **is elevation**, so a horizontal segment at height Z asserts *"this happens
> at Z metres."* A generic flowchart router treats Y as empty space. Here that produces a
> confident, false statement about what is connected to what.

The fix generalises: **route by search, not by formula.** Generate candidate polylines, score
them against every symbol box, and take the cleanest — collisions dominate, then non-orthogonal
segments, then bend count. Verified at 23 edges, zero crossings, zero diagonals.

**The wider lesson for the views:** a view that shows uncertain data must not *manufacture*
certainty through layout. The dashed hypothetical edges, the "cota desconocida" band and the
confidence dots all exist for the same reason — the drawing must never look more confident than
the data behind it.

## Time is a dimension of confidence

`[Manuel, 2026-08-22]` *"Anything that we log in time should display a warning, or not display
the data, when the data is stale — across all the different possible visualisations."*

Two distinct things, both now enforced:

### 1 · A value has a shelf life
`VIGENCIA_H` in `src/00-core.js` says how long a measurement stays representative:
**temperatura 3 h · nivel 24 h · conteo 30 d**. Past it → *envejecido*; past 3× → **obsoleto**,
and **no view may show the number any more**:

- the **map chip** stops printing the value and prints *"sin dato vigente"* plus the age
- the **schematic** will not fill a tank from an obsolete level
- the **card** greys the figure to a dash

> A stale reading is not wrong. It has simply stopped being a statement about *now*, and
> showing it as one is a lie the interface tells by omission.

### 2 · The data has a horizon
Different failure, same family. Movements are logged continuously **in real life**; the repo
holds them only up to a date. **Silence after that date means "not yet given to us", never
"nothing happened"** — and a chart that just stops invites the wrong reading.

So both cattle views open with the horizon, and the monthly chart marks the end of the record
with a red rule and hatched ground beyond it.

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
