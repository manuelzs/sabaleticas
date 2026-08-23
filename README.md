# Trueground

**[owner, 2026-08-22] El nombre de la plataforma es Trueground.** La finca sigue siendo
Hacienda Sabaleticas; Trueground es lo que la administra, y está pensado para servir a
más de una finca aunque hoy sólo corra sobre ésta.

El nombre viene de *ground truth*: en teledetección, ir al sitio a verificar lo que la
imagen afirma. Es el ciclo de trabajo de este repositorio y su única regla dura —
**nada se afirma sin haberlo verificado, y lo que no está verificado se marca como tal**.
El catastro dice que hay una cerca, Manuel camina, no hay cerca, y el dato cambia con
firma y fecha. De ahí también salen las dos mitades del sistema: lo **derivado** (avisos,
que una regla calcula y se apagan solos) y lo **afirmado** (tiquetes y datos, que alguien
dijo y quedan firmados). Ver `dashboard/ARCHITECTURE.md`.

Working repository for running and advising a cattle operation. Mostly markdown:
profiles, processes, financial statements, herd records, and decision notes that
build up over time into a clear picture of the business.

## Snapshot

| | |
|---|---|
| **Herd size** | ~266 head |
| **Land** | **170.73 ha** — two parcels, one matrícula, spanning La Pintada and Santa Bárbara |
| **Location** | Colombia |
| **Currency** | COP (Colombian pesos) |
| **Units** | Metric (kg, hectares) |
| **Operation type** | _TBD — to be captured_ |

## How this repo is organized

| Folder | What lives here |
|---|---|
| [`profile.md`](profile.md) | The operation at a glance — the single source of truth for the basics |
| [`data/`](data/) | **Canonical structured data** — one CSV per table + `schema.sql`. The DB is built from here |
| [`context/`](context/) | Raw context dumps from the owner. Unstructured first, organized later |
| [`herd/`](herd/) | Generated reports + narrative on the animals (inventory, lote summaries) |
| [`financials/`](financials/) | P&L, costs, revenue, break-even, balance sheet |
| [`operations/`](operations/) | The yearly cycle, processes, calendar, labor, infrastructure |
| [`operations/water/`](operations/water/README.md) | Water & verano carrying capacity — active project |
| [`operations/land/geo/`](operations/land/geo/README.md) | Turning the 2003 paper plano into real geometry (GeoJSON) |
| [`dashboard/`](dashboard/README.md) | **Farm dashboard project** — the map app + the plan for live operational data |
| [`decisions/`](decisions/) | Decision log — what we chose, why, and what happened |

## Data architecture

Hybrid by design:

- **Structured data → SQLite, backed by CSV.** The canonical truth is `data/*.csv`
  (one file per table — clean git diffs, full audit trail of every record). The
  queryable `sabaleticas.db` is *derived* but **committed** for convenience (a working
  DB on clone). Rebuild it with `scripts/build_db.sh`. **Rule:** the CSVs are
  authoritative — after changing any CSV, rebuild and commit `sabaleticas.db` in the
  same change so they never drift. Schema and views live in [`data/schema.sql`](data/schema.sql).
- **Narrative + reports → markdown.** Profiles, processes, decisions, and
  generated summaries (per-lote margin, source leaderboard) are human-readable
  markdown.

Tables: `sources`, `lotes`, `animals`, `weighings`, `sales`, `costs`, `gsmi_movements`, `price_benchmarks`.

## CLI (`sabaleticas`)

A stdlib-only Python package (`sabaleticas/`), packaged with `pyproject.toml` (hatchling).
`prices fetch` also needs the `pdftotext` system binary (poppler).

**Run it** (any of):
- `uv run sabaleticas <cmd>` — no setup; uv handles the env
- `uv sync` once, then `sabaleticas <cmd>`
- `python -m sabaleticas <cmd>` — from the repo, no install

| Command | What it does |
|---|---|
| `sabaleticas build` | Rebuild `sabaleticas.db` from `data/*.csv` (same as `scripts/build_db.sh`) |
| `sabaleticas prices show` | Show current market-price benchmarks |
| `sabaleticas prices fetch [--dry-run]` | Pull the latest **Central Ganadera Medellín** boletín, parse macho/hembra cebada $/kg, append to `price_benchmarks.csv`, rebuild. Run weekly. |
| `sabaleticas movements` | Summarize GSMI sales cadence & channels |
| `sabaleticas map` | Build + open the **farm dashboard** ([`dashboard/`](dashboard/)) — orthophoto, layers, elevation readout, gravity-feed measure, optional 3D terrain |
Views: `animal_gain` (gain + ADG per animal), `lote_margin`, `source_leaderboard`.

## Working agreement

- The owner brings ground truth; the advisor (Claude) structures it, finds the
  numbers that matter, and flags what's missing or doesn't add up.
- Nothing here is assumed. If a fact isn't captured, it's marked _TBD_.
- We start by capturing context, then build the financial and operational
  picture piece by piece.
