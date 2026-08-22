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
| **JS split into `src/*.js`**, concatenated by the builder — no bundler | ✅ |
| **Subsystem tabs × views**, routed in the hash (`#agua/esquema`) | ✅ |
| **Sensores tab** — readings + sources, first DOM view | ✅ |
| **Readings render everywhere** — map chip, schematic tank fill, list — by entity id | ✅ |
| **Freshness model** — values expire and views stop asserting them | ✅ |
| **Ganado tab** — hato and movimientos, from real SINIGAN and GSMI data | ✅ |
| `check_js.py` — catches identifiers called but never declared, on every build | ✅ |

## Open

### 1 · Navigation — ✅ **built, seam only**
`Finca · Agua · Predio · Ganado(off)`, each with its own views, routed in the hash.
Layers are grouped by subsystem and scoped to the active tab. **No framework** — a ~90-line
registry and router; the heavy lifting is canvas, which a framework would not help with.

**Deliberately absent:** the `Trabajo` tab (no tickets yet), tables, and anything for Ganado
before there is cattle data.

### 2 · Globally unique entity ids — 🔴 **high priority, next session**
`agua:rompecargas` rather than `rompecargas`. A rename today; a migration once readings and
tickets reference the old ids.

### 2b · One entity-type registry — 🔴 **same refactor as the ids**
`[Manuel, 2026-08-22]` *"All the T junctions use a square. It should be only defined in one
place. If I wanted to change the icon for T junctions, we should just change one line."*

Right now a type's appearance is spread across **three** places: `TIPO_COLOUR` and `TIPO_SHAPE`
in `sabaleticas/map.py`, and the symbol drawing in `50-schematic.js`. One registry should own
**id, label, colour, map symbol, schematic symbol, and what attributes the type carries**
(a tank has capacity and a level; a junction has a valve state).

That registry is also what the future table and ticket views read to know how to render a type,
so it is not only cosmetic.

### 3 · Attachment model — ✅ **half built**
Readings work: `data/readings.csv` → latest per entity+magnitude → rendered by the map, the
schematic and the Sensores list, all resolving by entity id. **A manual note and an automated
reading are the same object**, differing only in `origen` and expected freshness.

Still to come: **tickets and alerts on the same mechanism**, and the `Trabajo` tab.

### 3b · Collecting Hikvision automatically
The house system is the pilot. `operations/sensors/sources.json` holds what we know and the
minimal test (`/ISAPI/System/deviceInfo`). Needs the panel model and network access before
any code is worth writing.

### 4 · Compound indicators — `general/estado` ✅ **first version built**

Three computed (autonomía de agua **8–12 días**, reserva por animal, carga) and four shown as
blocked, each naming what it waits on. Every indicator lists its inputs and takes the
confidence of the **worst** one.

Still to add — the table below. And a **`scraped` origin** for readings, when we poll IGAC or
price sources.

Candidates still to build, roughly by value. The blocked ones double as an argument for
collecting what they wait on.

| Indicator | Combines | Decides | Blocked on |
|---|---|---|---|
| **Días de autonomía de agua** | almacenamiento × hato × L/res/día | cuándo vender o acarrear agua | conteo fresco; L/res sin medir |
| **Autonomía del ramal norte** | tanques altos × reses del norte | el ramal sin almacenamiento es el que primero se seca | qué bebederos cuelgan de dónde |
| **Lo que compraría la represa** | volumen del lago × demanda diaria | pone precio a la ruta por gravedad: *"la represa vale N días de hato"* | profundidad del lago |
| **Área efectiva de pastoreo** | área abierta − pendiente >15° − distancia al bebedero | la carga real no es reses ÷ hectáreas | potreros |
| **Carga por potrero** | reses × potrero × pendiente | dónde poner cercas y agua | potreros + registro de movidas |
| **Costo por res por día vs ganancia diaria** | costos × hato × kilos | si cada animal paga su renta | contabilidad + báscula |
| **Capital inmovilizado vs pérdida mensual** | hato × valor × P&G | una pérdida sobre capital quieto es peor que sobre uno que rota | contabilidad |
| **Riesgo de verano** | autonomía × pronóstico | cuántos días de margen quedan | fuente de clima |

> **The one Manuel already valued** — storage against herd size — is the template: it turned two
> inert facts into a date on the calendar.

### 5 · Slope-shaded surface
The cursor reports slope already. Missing: the coloured surface in 2D and on the 3D mesh.
**A third of the farm is ≥15°**, and cattle under-graze steep ground.

### 6 · Potrero polygons
The data work is in [`../PLAN.md`](../PLAN.md); the app side is a layer plus, eventually,
per-potrero attributes. **This is what unblocks Ganado.**

### 7 · Deferred on purpose
Tables/CRUD · charts · per-view state persistence beyond the hash · anything for Ganado
before there is cattle data.

## Rules

1. **The dashboard renders; it never owns data.**
2. **Derived numbers are derived** — length, gradient, area, all computed.
3. **Offline first**, single file, stdlib only, no build step.
4. **Never look more confident than the data.** Dashed hypotheticals, confidence dots, the
   *cota desconocida* band, and a router that cannot draw a connection that does not exist.
5. **Labels may be written. Claims must be computed — and both must be readable.**
   A *label* names what you are looking at and is identical on every farm; writing it is fine.
   A *claim* asserts something about **this** data, so it must be derived and must vanish when
   its condition does. **And a claim nobody can parse is worthless however correct it is** —
   prefer a number with a plain label over a clever sentence.
   > The test: would this sentence still be true on a different farm tomorrow?
6. **Every number must answer a question someone actually has.** *"85 guías"* is a fact about
   the extract, not the business. Prefer windows, rates and shares over totals of what we happen
   to hold.
7. **Everything measured is a reading.** One series for herd counts, tank levels and
   temperature. `origen` distinguishes `manual` · `automatico` · `scraped`.
8. **Flows, stocks and coverage draw differently.** Event strips or cumulative curves for flows;
   step lines for stocks; coverage always drawn and never interpolated.
9. **Reach across subsystems wherever it decides something.** A figure from one subsystem
   describes; a figure from two decides.
