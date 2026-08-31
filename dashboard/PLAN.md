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
| **Avisos drawer** — rules over data, not prose; 9 findings fire today | ✅ |
| **`general/estado`** — compound indicators, each taking its worst input's confidence | ✅ |
| **Herd reconstructed over time** — anchor count + movement ledger, drawn as a step | ✅ |
| **Event strip** for guides — no binning, gaps visible as gaps | ✅ |
| Charts are **hand-written SVG generated from data** — no library, no build step | ✅ |
| **Trabajo tab** — tickets on any entity, two fields and nothing else | ✅ |
| **Derived vs asserted** split written down and enforced (avisos ≠ tiquetes) | ✅ |
| **Deployed**, git-connected, data behind a session cookie | ✅ |
| **One builder, two shapes** — self-contained `viewer.html` and the split shell/app/payload | ✅ |
| Menu shows **one `Cercas` entry** over two layers; leftover closures became `Pasos en la cerca` | ✅ |

## Open

### 0 · What today left loose — 2026-08-22

The platform is named **Trueground** and is live at `trueground.vercel.app` behind a shared
password. Everything below is a consequence of that, and none of it is urgent.

| | What | Why it matters |
|---|---|---|
| **Touch** | Pan, pinch-zoom and tap targets are built for a mouse | The whole point of deploying was the phone. This will bite on the first field visit, and no framework fixes it — it is our own canvas handlers |
| **Writes from the field** | There is a backend and a session now, but every route is read-only | Closing a ticket standing next to the tank, or capturing a point at a trough, is the obvious first write. `POST /api/tickets` against `operations/trabajo/tickets.json` — needs somewhere to persist, since the filesystem on Vercel is read-only |
| **Repo weight** | 389 MB. `dashboard/viewer.html` is 3.4 MB and is committed on **every** build | `dashboard/build/` and `api/_payload.json` are already ignored; `viewer.html` is the one still growing history. Ignoring it costs nothing — it is generated — but changes the habit of rebuilding before commit |
| **Domain** | `trueground.vercel.app` for now | `trueground.ag` / `.farm` are the candidates. Note: Vercel Authentication does not cover custom domains on any plan setting we have, so a custom domain would bypass the gate — the app password would still hold |
| **Password rotation** | One shared password in `TG_PASSWORD`, one secret in `TG_SECRET` | No rotation policy and no way to revoke a single session. Fine for one person; revisit at the second |
| **Vercel MCP plugin** | Sees the teams, returns empty for projects and 404s on this one | Worked around with the CLI + REST. Not ours to fix, but worth remembering before trusting it |
| **Potrero identity** | Tickets reference potreros as `predio:potrero/<nombre>` | Potreros are derived and renumber every run, so the name is the only stable handle. Renaming one orphans its ticket — the view flags it as `no encontrado` rather than dropping it, which is the right failure but not a fix |
| **No tests** | `check_js.py` catches undeclared identifiers; that is the whole safety net | The Python side has none. The planar-graph face extraction is the part that would most repay a fixture: a known fence set in, a known potrero count out |


### 1 · Navigation — ✅ **built, seam only**
`Finca · Agua · Predio · Ganado(off)`, each with its own views, routed in the hash.
Layers are grouped by subsystem and scoped to the active tab. **No framework** — a ~90-line
registry and router; the heavy lifting is canvas, which a framework would not help with.

**`Trabajo` arrived 2026-08-22** with two views — `Pendientes` and `Avisos`. Still deliberately
absent: tables, and anything for Ganado beyond what the data supports.

### 2 · Globally unique entity ids — ✅ **done 2026-08-22**
`agua:rompecargas`, `ganado:hato`, `predio:finca`. The prefix is the subsystem — the same word
as the tab. Migrated by `scripts/namespace_ids.py`; JS refers to them through `ENT` in
`00-core.js` rather than typing the string in four places.

### 2b · One entity-type registry — ✅ **done 2026-08-22**
`[Manuel, 2026-08-22]` *"All the T junctions use a square. It should be only defined in one
place. If I wanted to change the icon for T junctions, we should just change one line."*

Right now a type's appearance is spread across **three** places: `TIPO_COLOUR` and `TIPO_SHAPE`
in `sabaleticas/map.py`, and the symbol drawing in `50-schematic.js`. One registry should own
**id, label, colour, map symbol, schematic symbol, and what attributes the type carries**
(a tank has capacity and a level; a junction has a valve state).

That registry is also what the future table and ticket views read to know how to render a type,
so it is not only cosmetic.

### 3 · Attachment model — ✅ **done 2026-08-22**
Readings work: `data/readings.csv` → latest per entity+magnitude → rendered by the map, the
schematic and the Sensores list, all resolving by entity id. **A manual note and an automated
reading are the same object**, differing only in `origen` and expected freshness.

Tickets now ride the same mechanism: `operations/trabajo/tickets.json` names an entity by id
(`agua:t-2`, `tierra:playon`, `predio:potrero/Rincón`) and the builder resolves it to a name and
a position, so a ticket can point at anything the system knows without new plumbing.

**And the division that came out of building it** — worth keeping, because it decides where
future things go:

> **Avisos are derived, tiquetes are asserted.** A rule runs over the data on every render and
> switches itself off when it stops being true. A ticket is something Manuel decided and only
> he can close. The test: *if the data can tell you, it is an aviso; if only you can tell you,
> it is a tiquete.*
>
> Of the first 22 tickets, **14 were already a rule's job** — nine restated
> `posiciones-sin-confirmar`, four described the dashed connections by hand (that one was a
> **missing rule**, now `conexiones-hipoteticas`). The damage is not repetition: a duplicated
> ticket **lies later**, when the aviso clears itself and the ticket stays. Full reasoning in
> `ARCHITECTURE.md`.

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

### 6 · Potrero polygons — 🟡 **in progress**

`scripts/extract_potreros.py` builds a planar graph from IGAC's fences plus the parcel
boundary, nodes it, applies the closures Manuel dictates, and walks the faces.

> #### A fence layer and an enclosure layer are not the same thing
> `[owner, 2026-08-22]` Where there is no physical fence, IGAC is right to leave the gap — but
> the **potrero can still be closed** as far as the cattle are concerned. The fence layer keeps
> its gaps; the potrero layer closes them.
>
> **The reason is stated, never inferred.** A gap may be a quiebrapatas, a trough with the fence
> split so cattle drink from both sides, a saladero, a gate — or fence the satellite simply
> could not see. Manuel names it; we do not guess from geometry.
>
> ⚠️ **And not from the Bosque layer either.** Most of the forest *does* have fence; the imagery
> cannot see it under canopy. Gap-near-forest is a **visibility** correlation, not a barrier.

Closures come in three shapes, because fences meet in three ways:

| | |
|---|---|
| `[a, b]` | two loose ends join |
| `[n, "@extend"]` | a fence dies in a **T** on another fence — two endpoints cannot say that |
| `[n, "agua:beb-3"]` | several fences **converge on a thing** — a trough, a saladero |

The third is the best one to use when it applies: it records *why* they meet, so the closure
survives as knowledge rather than as geometry.

Loose ends are numbered **north to south, stably across runs**, so a number Manuel says out
loud stays valid after other gaps close. Closures live in `cercas-cierres.json` as pairs of
numbers, draw green, and are flagged if implausibly long.
The data work is in [`../PLAN.md`](../PLAN.md); the app side is a layer plus, eventually,
per-potrero attributes. **This is what unblocks Ganado.**

### 6b · Charts — when a library would earn its place
All charts are inline SVG emitted from the data (`trendMark`, `eventStrip`, `herdChart`,
`barRow` — under 150 lines total). No library, because the page must open from `file://` with
no build step, and because the honesty behaviours are the point: a strip that **refuses to bin**,
a step line that **stops rather than interpolating**, a sparkline that says *"1 medición"*
instead of drawing a flat line. Those fight a generic library's defaults.

**Revisit if** we want interactive zoom, crosshairs or linked brushing on long series. `uPlot`
would be the candidate — small and canvas-based — but it needs vendoring.

### 7 · Deferred on purpose
Tables/CRUD · charts · per-view state persistence beyond the hash · anything for Ganado
before there is cattle data.

## Rules

1. **The dashboard renders; it never owns data.**
2. **Derived numbers are derived** — length, gradient, area, all computed.
3. **Single file, stdlib only, no build step** — and now also a split shell/app/payload for the
   deployment, emitted by the *same* builder so the two cannot drift. Offline is no longer a
   requirement (`[owner, 2026-08-22]` there is connectivity across the farm), but the
   self-contained file stays because it is the fastest edit-rebuild-reload loop we have.
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
