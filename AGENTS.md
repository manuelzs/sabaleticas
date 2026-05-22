# AGENTS.md — working brief for Hacienda Sabaleticas

Read this first. It's the onboarding context for any agent/session working in this repo.
(Companion: [`README.md`](README.md) for the human-facing layout; [`profile.md`](profile.md)
for the operation snapshot.)

## What this is

A working advisory repo for **Hacienda Sabaleticas**, a real cattle operation owned by
Manuel. **It is losing money every month — the whole point of this project is to find out
why and turn it around.** You are the ongoing business advisor: structure the owner's
ground-truth data, find the numbers that matter, research best practice, and flag what's
missing or doesn't add up. Be direct and data-driven; the owner explicitly says *don't
trust his recollection if it conflicts with the data.*

## The operation (facts)

- **Location:** La Pintada, suroeste de Antioquia, Colombia — *tierra caliente*, ~550–600 m, Cauca valley. Vereda La Bocana.
- **Land:** ~200 ha. **Herd:** ~266 head (per SINIGAN, May 2026).
- **Model:** **ceba de hembras** — buys **females**, fattens on pasture, sells on weight. Females are the deliberate strategy (≈256 hembras / 10 machos).
- **Born-on-farm calves:** some purchased females arrive pregnant; calves are born here, raised to weaning, sold then — **not fattened**. The few machos are these.
- **Currency/units:** COP and metric (kg, hectares) everywhere. Use Colombian terms (ceba, levante, GDP = ganancia diaria de peso, potrero, carga, en pie, gordo/flaco, comisionista, consignación…).

## How to work here (conventions)

- **Commits:** small, logical, committed as you go. **Never add a co-author** (global user rule). Commit only when work is real; the derived DB is committed too (see below).
- **Data integrity:** **never invent statistics.** In research, cite sources by `[S#]` from `research/sources.md`; mark unsourced claims; label regional/foreign proxies. Mark unknowns `TBD`.
- **Scope discipline (SINIGAN):** the owner has **one predio = Sabaleticas**. Other predios shown in the app are a known bug — never pull or mix them.
- **Tone:** terse, direct, proactive. Manuel is technical (engineer/founder).

## Repo map

| Path | What |
|---|---|
| `profile.md` | Operation at a glance + the core problem |
| `data/*.csv` + `data/schema.sql` | **Canonical** structured data + schema/views |
| `sabaleticas.db` | Derived SQLite (committed; rebuilt from CSVs) |
| `sabaleticas/` + `pyproject.toml` | The `sabaleticas` CLI (Python, stdlib-only, uv) |
| `scripts/build_db.sh` | Rebuilds the DB from CSVs |
| `financials/` | `diagnosis.md` (why we're losing money — 6 hypotheses), P&L/costs (TBD) |
| `herd/` | `inventory.md`, `movements.md` (GSMI sales analysis), `lotes/` template |
| `research/` | Sourced knowledge base — `sources.md` (S1–S41), `topics/`, overview |
| `operations/` | Yearly cycle, `pasture.md` (land/grazing/forage plan) |
| `experiments/` | On-farm trial methodology + template |
| `decisions/` | Decision log |

## Data layer

- **CSVs are the source of truth** (clean git diffs). `sabaleticas.db` is **derived** —
  rebuild after any CSV change and commit both so they never drift. Transient
  `sabaleticas.db-*` files are gitignored.
- Tables: `sources`, `lotes`, `animals`, `weighings`, `sales`, `costs`, `gsmi_movements`, `price_benchmarks`.
- Views: `animal_gain` (gain + ADG/animal), `lote_margin`, `source_leaderboard`.
- Query with `sqlite-utils query sabaleticas.db "…" --table` or `sqlite3`.

## The CLI (`sabaleticas`)

Stdlib-only; `prices fetch` needs `pdftotext` (poppler). Run via `uv run sabaleticas …`,
`python -m sabaleticas …`, or `sabaleticas …` after `uv sync`.

- `sabaleticas build` — rebuild the DB
- `sabaleticas prices show` — current market benchmarks
- `sabaleticas prices fetch [--dry-run]` — pull the latest **Central Ganadera Medellín** boletín → `price_benchmarks.csv` (run weekly)
- `sabaleticas movements` — GSMI sales cadence & channels

## Research library

`research/` is a traceable, growing knowledge base. **Cite `[S#]`** from `research/sources.md`.
Topic docs: economics-and-benchmarks, pasture-forage-grazing, ceba-de-hembras,
selling-and-channels, failure-modes-and-fixes, grain-finishing, price-benchmarks. Sourced
from AGROSAVIA, Fedegán, CIPAV, CONtexto Ganadero, Central Ganadera, universities.

## SINIGAN (system of record) — how to pull data

- **What it is:** ICA's national cattle ID/traceability system (SNIITA). Holds the animal
  roster and **GSMI movement guías** (every sale/shipment). **No weights, no prices.**
- **Access:** via the Chrome DevTools MCP. Login `cata.santamaria@gmail.com` ("Silvia") —
  has reCAPTCHA, so **ask Manuel to log in manually**, then navigate.
- **Two versions:** **V6** = `app.sinigan.co` (new, buggy, only recent guides). **V5** =
  `sinigan.ica.gov.co` (older, has the history; ASP.NET, also buggy — postbacks via
  `form.submit()` with `__EVENTTARGET`/`__EVENTARGUMENT`, not `__doPostBack` which the JS
  sandbox blocks). In V5 you must pick the **SABALETICAS** establishment (not OAXACA).
- **Expect bugginess** — pages reset, pagination flakes. Persist; re-search as needed.

## Key findings so far

- **Channels (GSMI, Jan 2025–May 2026, 75 valid sales, ~4.7/month):** **63% via comisionistas
  on consignación** (ELUPI SAS, Agroequina) → the farm is a **price-taker**. ~half to
  Frigorífico Municipal de Fredonia (slaughter), ~23% to **Sociedad Central Ganadera** (the
  Medellín market — real price discovery), rest scattered + some live sales to other farms.
  Small lots (single digits to ~14). Hembras → slaughter plants; machos → Central Ganadera.
- **Diagnosis (`financials/diagnosis.md`):** leading suspects **H1 (low turnover) + H4
  (subscale fixed cost) + H6 (weak channel)**. Ceba is a velocity business; the herd looks
  like it accumulates and dribbles out cheaply.
- **Market benchmark (Medellín, Apr 2026):** hembra cebada ~**9,671 COP/kg**, macho cebado
  ~**11,644**; hembra ~17% below macho. Antioquia/Medellín is a strong selling region.
- **Grain finishing:** researched — poor fit in Colombia (imported grain, no marbling premium).

## What's pending (the real unlock)

1. **Manuel's own cost + sale-price records (last 12 mo)** — GSMI has no prices. This is the
   #1 blocker: it enables the P&L, realized $/kg per channel vs. the Medellín benchmark, and
   confirms which hypothesis bites. When it arrives, load into `sales`/`costs`/`lotes`.
2. **Weighing discipline** — no GDP data yet ("báscula"). Encourage it; it unlocks the core ceba metrics.
3. **Farm maps** → `operations/land/` to lay out potreros + a grazing rotation (biggest cheap lever).
4. Re-extract the full 266-animal roster from SINIGAN when V6 is up.

## Style note

The word "ranch" still appears in research prose meaning "the farm" — that's fine. The
project/CLI/db/folder were renamed ranch→sabaleticas on 2026-05-22; the git repo folder is
now `sabaleticas` (was `rancher`).
