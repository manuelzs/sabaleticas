# Rancher

Working repository for running and advising a cattle operation. Mostly markdown:
profiles, processes, financial statements, herd records, and decision notes that
build up over time into a clear picture of the business.

## Snapshot

| | |
|---|---|
| **Herd size** | ~266 head |
| **Land** | ~200 hectares |
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
Views: `animal_gain` (gain + ADG per animal), `lote_margin`, `source_leaderboard`.

## Working agreement

- The owner brings ground truth; the advisor (Claude) structures it, finds the
  numbers that matter, and flags what's missing or doesn't add up.
- Nothing here is assumed. If a fact isn't captured, it's marked _TBD_.
- We start by capturing context, then build the financial and operational
  picture piece by piece.
