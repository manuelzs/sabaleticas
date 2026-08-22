# Turnover — is the herd cycling or accumulating?

> Tests the **low-turnover hypothesis** in [`../financials/diagnosis.md`](../financials/diagnosis.md):
> *do cattle cycle through, or sit and accumulate while monthly costs run?*
>
> **Confidence note (2026-05-22).** The herd age pyramid below is the owner's SINIGAN roster,
> which he says is **roughly right but low-confidence** (exact ages often unknown even at
> purchase, so animals are grouped; and the app's per-animal identity is shaky). So it's an
> **approximate directional signal — not confirmed evidence.** The reliable confirmation is
> the owner's written lot records (entry/exit dates), still pending. An earlier draft called
> this hypothesis "confirmed" from the pyramid; that was overstated and is corrected here.

## Status: leading suspect, not yet confirmed

Low turnover is the **leading suspect**. The signals below all point the same way, but the
strongest piece (the age structure) is low-confidence, so we hold "confirmed" until the lot
records land.

## The age structure — approximate signal, points to accumulation

Reading the SINIGAN buckets *as an approximate picture* of the herd:

| Grupo etario | Head | Read as |
|---|---|---|
| Hembras 3–5 años | ~7 | If real, **overdue** — past normal ceba finish age |
| Hembras 2–3 años | ~135 | Finish-age cohort — should be selling |
| Hembras 1–2 años | ~102 | Levante pipeline filling behind them |
| Hembras < 1 año + machos | ~22 | Mostly born-on-farm |

Even discounted for low confidence, the shape is suggestive: a large block of females
(~135) sitting in the finishing bracket with a full pipeline (~102) behind them. *If* roughly
accurate, that's a herd accumulating finish-age animals rather than draining them into sales.
The ~7 at 3–5 years is the weakest line — small enough to be noise — so we don't lean on it.

## What's firmer (not age-dependent)

- **Herd size ≈ 266 head** (SINIGAN, and now **stale — sales in progress**, so a ceiling).
  **Stocking ≈ 1.9 animales/ha of potrero** `[derived: 266 ÷ ~140 ha, from the cadastral
  170.73 ha]` ([`../operations/land/geo/README.md`](../operations/land/geo/README.md)). Against benchmarks (national "losing" ~0.87/ha; rotated
  target 1–2/ha) the farm is **not under-stocked — it sits near the top of the range**. So
  any turnover problem is about *velocity*, not lack of animals, and adding head would make
  it worse.
- **Sale cadence ≈ 4.5 valid guías/month** (Jan 2025 – May 2026), in **small lots**
  (single-digit to ~14 head), from real GSMI movement guías ([`movements.md`](movements.md)).
  Frequent small lots is a real, observed pattern and is consistent with not finishing batches.

## What we still can't quantify

- Head sold per year / herd residence time — GSMI's head count lives inside each guide PDF
  and only ~5 were pulled, so the cadence can't be turned into a head figure yet.
- A precise age structure — pending the owner validating the pyramid or, better, the lot records.

## How to confirm it properly (the reliable path)

The owner's **written lot records** — for each animal/lot, the entry date and the exit date —
are independent of the SINIGAN ages and give the real numbers:

- **Days-on-farm per lot/animal** → actual residence time, whether animals sit too long.
- **Head in vs. head out per period** → true turnover, no age guesswork.

These feed in via the intake kit (`lote_nombre` on purchases ↔ `lote_origen` on sales —
[`../financials/owner-records-request.md`](../financials/owner-records-request.md)). When they
arrive we compute residence time directly and either confirm or kill this hypothesis.

## Safe takeaway for now

The approximate age picture, the adequate stocking, and the frequent-small-lot sale cadence
all lean the same way — toward a herd that accumulates rather than cycles — but none is
conclusive on its own. Treat low turnover as the **working lead**, validate it with the lot
records, and hold off on finish-age "backlog" actions until the ages are confirmed.
