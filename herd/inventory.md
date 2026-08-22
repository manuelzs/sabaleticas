# Inventory

The current, dated, reconcilable count. Source: **SINIGAN registry** (one predio,
Sabaleticas), pulled 2026-05-21. All animals VIVO.

**As of:** 2026-05-21 · **Source:** SINIGAN/SNIITA V6 · **Total: 266**

> ⚠️ **STALE as of 2026-08-21.** Manuel is **actively selling a good number of animals**,
> ahead of further price falls. The real head count is **below 266 and moving**. Every
> per-head and per-hectare figure in this repo still uses 266 and should be read as a
> **conservative upper bound** until we get a fresh count. Re-pull from SINIGAN, or take
> Manuel's number, once the sales settle.

## By sex

| Sex | Head |
|---|---|
| Hembras | 256 |
| Machos | 10 |
| **Total** | **266** |

## By grupo etario (SINIGAN age classes) — ⚠️ approximate, low confidence

> Per the owner, this breakdown is **roughly right but low-confidence** — use it as an
> approximate signal, not as confirmed evidence. It's imprecise because exact age often isn't
> known even at purchase, so animals get assigned to a group; and the SINIGAN per-animal
> identity is shaky (version 5 recorded only head counts; version 6's catalog animals can't
> be traced to the real herd). The total (~266) is a usable approximate count. The owner can
> validate the ages better later; his written lot records are the reliable source.


| Grupo etario | Head |
|---|---|
| Hembras 2–3 años | 135 |
| Hembras 1–2 años | 102 |
| Hembras 9–12 meses | 10 |
| Hembras 3–5 años | 7 |
| Hembras 3–9 meses | 1 |
| Hembras < 3 meses | 1 |
| Machos 3–9 meses | 5 |
| Machos 2–3 años | 4 |
| Machos 1–2 años | 1 |
| **Total** | **266** |

## Notes

- Animals show **no DIN assigned** (`---`) and `SIN NOMBRE` in SINIGAN — these are
  system IDs, not physical ear tags. The operational tag question is open.
- The 10 machos + the 2 youngest hembra categories (3–9 mo, <3 mo) are most likely
  **born-on-farm calves** from pregnant purchases. To be confirmed against weights.
- ❓ Full per-animal roster (266 SINIGAN IDs) not yet extracted — V6 went down
  mid-pull. Re-extract when it recovers or via V5.

> Reconciliation rule: this total must equal the sum of active animals across the
> lote files / `animals.csv` once operational data is loaded. SINIGAN is the
> independent check on our own count.
