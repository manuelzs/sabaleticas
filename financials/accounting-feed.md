# The accounting feed — how to read the first reports

> **Status: incoming, ~close of August 2026** (noted 2026-08-21). Manuel has asked the
> accountant for the **P&L, balance sheet, cash flow, and whatever else her software
> produces**. This is the unblock the whole advisory has been waiting on
> ([`../data-inventory.md`](../data-inventory.md)).

## How to use this doc

**Don't send the accountant a list of requirements.** Per Manuel (2026-08-21): she works from
accounting software, so what it outputs is what we get. He has already asked for the full set
of standard reports. **We take the first delivery as it comes, read it, and only then ask for
anything specific we turn out to need.**

So this is a **reading guide, not a request** — what to look for when it lands, and the one
structural trap to check for before drawing any conclusion from the numbers.

## ⚠️ The trap: cattle are inventory, not an expense

In *ceba*, the herd is **stock in trade**. Money spent buying females isn't consumed — it's
converted into an asset that walks around and gains weight. How the accountants treat that
decides whether the report tells us anything:

| If they treat cattle purchases as… | The monthly P&L will… | And that means |
|---|---|---|
| **An expense when bought** | Show a **loss in any month we buy**, and a profit in any month we sell — regardless of real performance | A growing herd looks like a failing business |
| **Inventory (asset), expensed as cost of sale when sold** | Match cost to the revenue it produced | Correct, and what we want |

There's a second half to it. Even with proper inventory treatment, the report will miss the
thing that actually happened on the farm: **the herd gained weight.** Kilos added are real
value created, and no accounting entry records them until the animal is sold. So:

> **A monthly P&L can show a loss in a month where the operation genuinely got richer** —
> because 266 animals each put on a few kilos and nothing recorded it.

This isn't a reason to distrust the accountants. It's the reason we need **both**: their cash
and accrual picture, *and* our own kilos-and-margin picture from weights and lot records.
Neither one alone answers "are we making money."

## What to check when it arrives

### The things that decide whether the numbers mean anything

1. **Are cattle purchases separated from operating costs, or blended into one expense line?**
   The single most important thing to establish, for the reason above.
2. **How is the herd treated** — inventory or expense? If inventory, is there an **opening and
   closing herd value each month**? The **balance sheet** should answer this, which is why
   asking for the full report set was the right call. The movement in herd value is closer to
   real economic profit than the P&L line itself.
3. **Are operating costs split by category** — labor, feed, health, pasture, transport, admin,
   finance? A single "gastos" total tells us nothing about where the leak is.
4. **Is revenue line by line, or only a monthly total?** Line by line lets us tie their
   figures to the GSMI movement guías we already have
   ([`../herd/movements.md`](../herd/movements.md)) and finally compute realized $/kg.
   A monthly total still gives us the cash picture — just not the per-channel one.
5. **Are commissions and transport netted out of revenue, or shown separately?** With ~63% of
   sales through comisionistas, a commission silently deducted from revenue hides a real cost.

### Nice to find, not worth chasing yet

6. Loan interest, taxes and insurance on their own lines.
7. **Impuesto predial** and the predio/área it is liquidated on — would answer the
   [land question](../operations/land/geo/README.md) for free if it happens to be itemized.
8. **Historical months.** If the software can produce them, twelve months of history is worth
   far more than twelve months of waiting.

**Only after reading the first delivery** do we go back with anything specific — and then it
should be a short list of things we genuinely could not work around, not a wish list.

### What they almost certainly won't have

- **Kilos.** Weights don't live in accounting. Still comes from the báscula.
- **Which lote a sale came from.** Still comes from Manuel's records.

Those two remain the gap, and they're what turn a P&L into a diagnosis. Worth being explicit
about that so nobody assumes the accounting feed closes it.

## When it lands

1. Load into the canonical CSVs — `sales`, `costs`, `lotes` — and rebuild the database.
2. Produce the first **12-month cash P&L**, **cost per head per month**, and **realized $/kg
   by channel** against the Central Ganadera benchmark.
3. Test the six hypotheses in [`diagnosis.md`](diagnosis.md) against real numbers, and kill
   the ones that don't survive.
4. Size the **capital tied up in the herd** — a monthly loss on top of a large, slow-moving
   capital base is a different and worse problem than a small one finding its feet.
