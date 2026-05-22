# Turnover — is the herd cycling or accumulating?

> Tests the **low-turnover hypothesis** in [`../financials/diagnosis.md`](../financials/diagnosis.md):
> *do cattle cycle through, or sit and accumulate while monthly costs run?*
>
> ⚠️ **Read this first — major caveat (2026-05-22).** An earlier version of this doc claimed
> the low-turnover hypothesis was "structurally confirmed" from the herd **age pyramid** (142
> females at finishing age, 7 overdue at 3–5 years). **That claim is retracted.** The age data
> came from the SINIGAN/ICA roster, and per the owner the per-animal age/identity in that
> system is **not reliable**: in version 5 you only entered head counts (no animal selection);
> in version 6 the catalog animals can't be traced to real animals, so which ones — and their
> ages — are effectively arbitrary. So we cannot use the age breakdown as evidence. What
> remains below is only what doesn't depend on it.

## Status: suspected, not confirmed

Low turnover is still the **leading suspect** (alongside subscale fixed cost and the weak
selling channel), but with the age data removed we **cannot yet confirm it**. Confirming it
needs the owner's own lot records (see *How to actually measure this*).

## What we can still say (not age-dependent)

- **Herd size ≈ 266 head** (SINIGAN count). Treat as approximate — even the count carries
  some version-5-era uncertainty — but it's the best head number we have.
- **Stocking ≈ 1.33 animales/ha** (266 ÷ 200 ha). Against benchmarks (national "losing"
  ~0.87/ha; rotated target 1–2/ha) the farm is **not under-stocked**. So if there *is* a
  turnover problem, it's a velocity problem, not a lack of animals.
- **Sale cadence ≈ 4.5 valid guías/month** over Jan 2025 – May 2026, in **small lots**
  (the few head counts we pulled run single-digit to ~14) — from real GSMI movement guías
  ([`movements.md`](movements.md)). High frequency of small lots is a real, observed pattern.

## What we can NOT say yet

- That the herd is full of finish-age or overdue females — **retracted** (bad age data).
- Head sold per year / herd residence time — still blocked: GSMI's head count lives inside
  each guide PDF and only ~5 were pulled, so even the cadence can't be turned into a head
  figure.

## How to actually measure this (the reliable path)

The owner keeps (or can reconstruct) **written lot records**: for each animal, which lot it
**entered with and when**, and **when it left**. That is the trustworthy source — independent
of the SINIGAN ages. From entry/exit dates we get the real numbers this doc was reaching for:

- **Days-on-farm per animal** → actual residence time and whether animals sit too long.
- **Head in vs. head out per period** → true turnover, no age guesswork.
- Combined with the sale records being gathered ([`../financials/owner-records-request.md`](../financials/owner-records-request.md)),
  the full velocity picture.

So the turnover question is **parked on the owner's lot records**, not on SINIGAN. When those
arrive, we add an entry/exit table and compute residence time directly.

## The one directional note that's safe

Selling in small lots ~weekly is, on its own, a weak-channel and small-batch signal (ties to
the selling-channel hypothesis). But whether the herd is *accumulating* — the actual turnover
claim — waits for the lot records. No action on finish-age "backlog" until we have real ages.
