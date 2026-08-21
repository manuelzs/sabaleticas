# Why are we losing money? — working diagnosis

> Status: **hypotheses, not conclusions.** We confirm or kill each one against real
> numbers. The point of this doc is to aim the data-gathering at the likely leaks.

## How ceba actually makes (or loses) money

Profit on a fattened animal is:

```
margin = sale_value − purchase_value − costs_while_on_farm
```

The trap is that **sale_value − purchase_value is NOT just "the kilos we added × price."**
Thin/young cattle usually sell at a **higher price per kilo** than fat/heavy cattle.
So as an animal gets heavier, its price/kg tends to *fall*. You're fighting that
compression with the kilos you add. The math only works if:

1. You add **enough kilos** (high GDP — ganancia diaria de peso, kg/day), and
2. You add them **fast** (fewer days = less fixed cost burned per animal), and
3. The **price spread** (buy $/kg vs. sell $/kg) doesn't eat the gain.

Three levers, and a loss usually means at least one is broken.

## Five hypotheses for Sabaleticas

| # | Hypothesis | Why it's plausible here | Kills/confirms with |
|---|---|---|---|
| **H1** | **Low turnover** — cattle accumulate instead of cycling through. Costs are monthly; sales are rare. **Leading suspect, not yet confirmed** ([`../herd/turnover.md`](../herd/turnover.md)): age pyramid (low-confidence) + adequate stocking (~1.33/ha) + ~4.5 small-lot guías/month all lean toward accumulation, but the strongest piece (ages) is only roughly right. | The herd is 256 females, few sales events; capital and pasture likely tied up. | **Owner's lot records** (entry/exit dates → days-on-farm, head in vs. out) — the reliable confirmation, independent of SINIGAN ages. |
| **H2** | **Low GDP** — pasture can't push enough daily gain, so animals take too long and fixed costs eat the margin. | Tierra caliente pasture varies hugely with management; no weighing discipline yet. | Weighings over time → compute GDP. |
| **H3** | **Adverse price spread** — buying females at a high $/kg and selling fattened at a lower $/kg, so the gain doesn't cover the compression. | Females can be discounted by the market vs. males (research pending). | Purchase $/kg vs. sale $/kg, side by side. |
| **H4** | **Subscale fixed costs** — 200 ha + labor spread over too little throughput. High cost per head per month. | Monthly cash burn regardless of sales. | Monthly fixed costs ÷ head actually turned over. |
| **H5** | **Low-value calf flow** — born-on-farm calves sold cheap at weaning, never adding value. | Stated: calves raised to weaning, not fattened, sold then. | Calf sale prices vs. cost to raise them. |
| **H6** | **Weak selling channel** — high-frequency small lots, mostly via comisionistas on consignación (farm is a price-taker); commission fees + small-lot pricing. | **GSMI data** (75 valid sales, Jan 2025–May 2026, ~4.7/month): **63% comisionista-handled, 67% consignación**; ~half to one slaughter plant (Fredonia), ~23% to the Central Ganadera market; lot sizes single-digit to ~14 ([`../herd/movements.md`](../herd/movements.md)). | Prices (GSMI lacks them) → realized $/kg per channel vs. Central Ganadera/Medellín averages; commission rates. |

My early bet, before seeing numbers: **H1 + H4 + H6 together** — a herd that sits and
slowly accumulates while monthly costs run, and the few animals that *do* sell go out
in small lots to regional butchers at weak prices. Ceba is a *turnover* business sold
into a *discovered price*; cattle that don't move, or that move cheaply, don't pay. But
we test it, we don't assume it.

## What the Colombia research adds (see [`../research/colombia-cattle-profitability.md`](../research/colombia-cattle-profitability.md))

The research moved two priors and handed us benchmarks to measure against:

- **H3 is now structural, not just possible.** In Colombia, $/kg *falls* as cattle
  get heavier (2025: macho levante ~$10,013/kg vs. gordo ~$9,021/kg) **and** females
  sell at a ~10–15% discount to males. A *ceba de hembras* fights **both** headwinds
  at once. So the margin can only come from a wide **buy-spread** on cheap females
  plus **cheap kilos of gain** — never from the sale price. We must measure our actual
  buy $/kg vs. sell $/kg before defending the female strategy.
- **H1/H4 confirmed as the dominant driver.** The profitable AGROSAVIA cases show
  **monthly return tracks cycle velocity**: the shortest, highest-GDP cycle (0.85
  kg/day, ~9 months) had the best monthly return. Long cycles spread fixed cost
  (land ~25%, labor ~18% of total) over too few sales — fixed cost per kg roughly
  *doubles*. This is exactly the failure mode the herd composition hints at.

### Benchmarks to measure ourselves against

| Metric | Losing / national avg | Profitable target (tropical) |
|---|---|---|
| GDP (kg/day) | ~0.35 | 0.5–0.7 pasture; 0.8–1.0+ with supplement/SSP |
| Carga (animales/ha) | ~0.87 | 1 (verano) – 2 (invierno) rotated; 3–5 SSP |
| kg carne/ha/year | 120–150 | 350 → 960+ (intensified rotation) |
| Months to finish | ~40 | ≤12–14 |

At **266 head on 158.67 ha of actual potrero (1.68/ha — revised 2026-08-21 from the 2003
survey plan, [`../operations/land/plano-2003.md`](../operations/land/plano-2003.md))** with no
weighing yet, we don't know our GDP or turnover — but those are the first numbers to
establish, because they decide everything. Note the revision cuts the other way from what you
might hope: we are **more** densely stocked than we thought, so "buy more cattle" is off the
table as a fix and the carga benchmark is already met.

## The minimal data to find the leak

We don't need perfect books. A rough version of these three, for the **last 12 months**,
is enough to build a first P&L and see which hypothesis bites:

1. **Monthly costs** — even a single rough monthly total, ideally split into
   labor / inputs (sal, melaza, drogas, vacunas) / land / other.
2. **Sales** — every sale: date, how many head, total kg, total COP.
3. **Purchases** — every purchase: date, how many head, total kg, total COP, source.

From just these I can produce: a 12-month cash P&L, head turned over per year,
realized buy-vs-sell $/kg spread, and cost per head per month. That alone will
likely show the problem.

## Next: capital tied up

Separately worth knowing — the **current value of the herd** (266 head × market
value). A monthly cash loss on top of a large, slow-moving capital base is a
different (worse) problem than a small operation finding its feet. We'll size it
once we have a per-kg market value.
