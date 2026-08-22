# The accounting feed — getting the first report in the right shape

> **Status: incoming.** Manuel has arranged with the accountants for a **monthly P&L report**,
> first one expected at the **close of August 2026** — roughly a week out (noted 2026-08-21).
> This is the unblock the whole advisory has been waiting on
> ([`../data-inventory.md`](../data-inventory.md)).

## Why this doc exists

**We have about a week to influence the format, and that window is worth using.** Asking for
a field before the first report is generated costs a sentence. Asking for it after six months
of reports means re-deriving history from source documents.

More importantly: **a standard accounting P&L can be actively misleading for a ceba
operation.** Not wrong as accounting — wrong as a picture of whether we are making money. The
reason is below, and it is the single most important thing to settle with them.

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

## What to ask for

### The essentials — worth asking now

1. **Cattle purchases and sales separated from operating costs.** Never blended into a single
   expense line. This is the one that matters most.
2. **How the herd is treated** — inventory or expense? If inventory: at what value, and is it
   ever revalued? Is there an **opening and closing herd value each month**? That number, and
   its movement, is closer to real economic profit than the P&L line itself.
3. **Operating costs split by category** — labor, feed (sal, melaza, suplementos), health
   (drogas, vacunas), pasture, transport, admin, finance. A single "gastos" total tells us
   nothing about where the leak is.
4. **Revenue line by line, not just a monthly total** — date, buyer, amount per sale. This is
   what lets us tie their figures to the GSMI movement guías we already have
   ([`../herd/movements.md`](../herd/movements.md)) and finally compute realized $/kg.
5. **Whether commissions and transport are netted out of revenue or shown separately.** With
   ~63% of sales through comisionistas, the commission is a real cost we need to see, not have
   silently deducted.

### Also useful

6. Loan interest, taxes and insurance as their own lines — fixed monthly cash out.
7. **Impuesto predial**, and on which predio and área — which happens to answer next week's
   [land question](../operations/land/geo/README.md) at the same time.
8. Whatever **historical months** they can produce. Twelve months of history is worth more
   than twelve months of waiting.

### What they almost certainly won't have

- **Kilos.** Weights don't live in accounting. Still comes from the báscula.
- **Which lote a sale came from.** Still comes from Manuel's records.

Those two remain the gap, and they're what turn a P&L into a diagnosis. Worth being explicit
about that so nobody assumes the accounting feed closes it.

---

## Para reenviar al contador

> Buenas. Estamos armando el análisis de rentabilidad de la finca y vamos a usar el reporte
> mensual. Para que nos sirva desde el primer envío, ¿sería posible que incluyera lo
> siguiente?
>
> 1. **Compras y ventas de ganado separadas** de los gastos de operación (nunca mezcladas en
>    una sola línea).
> 2. **Cómo se maneja el ganado contablemente**: ¿como inventario o como gasto? Si es
>    inventario, ¿con qué valor, y hay **valor de inventario al inicio y al cierre de cada
>    mes**?
> 3. **Gastos operativos por categoría**: mano de obra, alimentación (sal, melaza,
>    suplementos), sanidad (drogas, vacunas), praderas, transporte, administración,
>    financieros.
> 4. **Ventas detalladas** (fecha, comprador, valor por venta), no solo el total del mes.
> 5. Si las **comisiones y el transporte** se descuentan del ingreso o van en línea aparte.
> 6. Intereses, impuestos y seguros en líneas propias.
> 7. El **impuesto predial**, indicando sobre **qué predio y qué área** se liquida.
> 8. Los **meses anteriores** que puedan generar, si es posible.
>
> Con eso podemos calcular margen real por kilo y costo por cabeza. Mil gracias.

## When it lands

1. Load into the canonical CSVs — `sales`, `costs`, `lotes` — and rebuild the database.
2. Produce the first **12-month cash P&L**, **cost per head per month**, and **realized $/kg
   by channel** against the Central Ganadera benchmark.
3. Test the six hypotheses in [`diagnosis.md`](diagnosis.md) against real numbers, and kill
   the ones that don't survive.
4. Size the **capital tied up in the herd** — a monthly loss on top of a large, slow-moving
   capital base is a different and worse problem than a small one finding its feet.
