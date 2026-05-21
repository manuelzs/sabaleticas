# Herd

Two levels of record, because the operation needs both:

- **Individual animal** — each has an ear tag and a weight history (we weigh individually).
- **Lote (batch)** — how we buy and sell. Every animal belongs to a lote, and the
  lote carries the source (proveedor / where bought), purchase, and sale.

Tracking both is what lets us eventually answer: *which sources give us the best
gain and margin?*

## Files

| File / folder | Purpose |
|---|---|
| [`inventory.md`](inventory.md) | The current, dated, reconcilable count by class |
| [`lotes/`](lotes/) | One file per lote — purchase, animals, weights, sale, margin |
| [`lotes/_TEMPLATE.md`](lotes/_TEMPLATE.md) | Copy this to start a new lote |
| `movements.md` | (later) births, deaths, transfers — the ledger that reconciles inventory |

## Key metrics we compute per animal and per lote

| Metric | Formula | Why it matters |
|---|---|---|
| **Kilos gained** | exit weight − entry weight | The product we actually sell in ceba |
| **GDP** (ganancia diaria de peso / ADG) | kilos gained ÷ days on farm | How fast we're putting on weight |
| **Cost per kg gained** | (purchase + inputs allocated) ÷ kilos gained | The real cost of the gain |
| **Margin** | sale value − purchase cost − allocated inputs | Did this lote/animal make money? |
| **Margin per day** | margin ÷ days on farm | Lets us compare lotes of different durations |

## Workflow when a lote comes in

1. Copy `lotes/_TEMPLATE.md` → `lotes/YYYY-MM-<source>-NN.md`.
2. Fill in purchase: date, source, count, total/avg weight, price (total & per kg).
3. List the animals with entry weights.
4. Add weighings as you do them; add the sale when it happens.
5. I compute kilos gained, GDP, cost/kg, and margin, and roll it into the source comparison.
