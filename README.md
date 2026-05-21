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
  queryable `ranch.db` is *derived*: rebuild it anytime with `scripts/build_db.sh`.
  It's gitignored. Schema and analytical views live in [`data/schema.sql`](data/schema.sql).
- **Narrative + reports → markdown.** Profiles, processes, decisions, and
  generated summaries (per-lote margin, source leaderboard) are human-readable
  markdown.

Tables: `sources`, `lotes`, `animals`, `weighings`, `sales`, `costs`.
Views: `animal_gain` (gain + ADG per animal), `lote_margin`, `source_leaderboard`.

## Working agreement

- The owner brings ground truth; the advisor (Claude) structures it, finds the
  numbers that matter, and flags what's missing or doesn't add up.
- Nothing here is assumed. If a fact isn't captured, it's marked _TBD_.
- We start by capturing context, then build the financial and operational
  picture piece by piece.
