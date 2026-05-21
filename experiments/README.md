# On-farm experiments

Where we run our own trials to get numbers that are actually about Sabaleticas —
because the published Colombian research is thin, regional, and often a proxy (see
[`../research/`](../research/) and the decision log entry of 2026-05-21).

## Why this matters

The literature gives us *hypotheses*. A trial run here, on our animals, our pasture,
our climate, gives us *answers we can trust*. The Córdoba supplement trial that found
supplementation **cut** profit 5–17% is exactly why: a borrowed result can point the
wrong way for our conditions. We test before we invest.

## Minimum rigor (so we can trust the result)

Farm trials are noisy. A few rules keep them honest:

1. **Control vs. treatment.** Always compare against an untreated group run *at the
   same time* — never "before vs. after" alone (season and pasture confound it).
2. **Comparable animals.** Split a single lote so both groups start with similar
   weight, age, sex, and condition. Randomize who goes in which group.
3. **Enough animals.** Individual variation is large; a handful per group can't show a
   real effect. Bigger groups = more trustworthy signal.
4. **Same conditions.** Same period, comparable potreros. Change *one* thing (the
   treatment), not several.
5. **Measure with the báscula.** Entry weight, periodic weighings, exit weight, for
   every animal in both groups.
6. **Cost it.** Track the full cost of the treatment. The question is never "did they
   gain more?" — it's "did the extra gain pay for the extra cost?"
7. **Decide the rule up front.** Before starting, write what result would change the
   decision (e.g. "supplement must add > X g/day to break even at feed price Y").

## How it plugs into the data layer

The CSV→SQLite model already supports this: animals carry per-animal weighings over
time, so we tag each animal into `control` / `treatment`, then compare **GDP and
cost-per-kg-gained between groups** with a query. (When we run the first trial we'll
add a simple `treatment` tag — no schema change needed before then.)

## Candidate experiments (when ready)

| Trial | Question | Notes |
|---|---|---|
| **Finishing supplement** | Does ~1 kg concentrate/day in the last ~60 days add enough gain to beat the feed cost *here*? | Tests the Córdoba caveat locally. Needs local feed prices first. |
| **Rotational vs. continuous grazing** | How much GDP / carga do we gain by subdividing and rotating a block of pasture? | Hardest to randomize (paddock-level); design carefully. |
| **Forage / potrero performance** | Which grasses & potreros produce the best gain? | Emerges from grazing records over time — observational, not a controlled trial. |

> Source/proveedor performance ("which lots perform best") is answered by the
> `source_leaderboard` view in the data layer — that's observational analysis of normal
> operations, not an experiment, so it lives with the herd data, not here.

## Files

- [`_TEMPLATE.md`](_TEMPLATE.md) — copy to design and record a trial.
