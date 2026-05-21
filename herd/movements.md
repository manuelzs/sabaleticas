# Outbound movements (GSMI) — sales channel analysis

Source: **SINIGAN GSMI guías**, Sabaleticas origin only. Pulled 2026-05-21 from V5
(history, Jan 2025–Apr 2026) + V6 (the 2 most recent, Apr–May 2026). Data in
[`../data/gsmi_movements.csv`](../data/gsmi_movements.csv) → `gsmi_movements` table.

**Big caveat:** GSMI has **no prices** and the list view has **no head counts** (the
count lives inside each guide PDF). So this tells us *when, where, and how often* cattle
left — the **cadence and channel** — but not yet *how many* or *for how much*. Head
counts and prices come from opening each guide or from the owner's own records.

## What the guides show

**37 guides total; 28 valid** (9 are ANULADA — voided, see below).

### Every sale goes to a slaughter plant — never an auction

| Destination | Type | Valid guides |
|---|---|---|
| Frigorífico Municipal de Fredonia | municipal slaughter plant (Antioquia) | 15 |
| Frigocentro S.A. | slaughter plant | 4 |
| Central de Sacrificio de Riosucio | municipal slaughter plant (Caldas) | 3 |
| Planta de Faenado Amagá (PLAFA) | municipal slaughter plant (Antioquia) | 2 |
| Frigotún (Otún) | slaughter plant (Pereira) | 1 |
| Matadero La Virginia | slaughter plant (Risaralda) | 1 |
| Cárnicos Especializados (Guayabito) | slaughter plant | 1 |
| **El Lucero** (José Diniel Vásquez) | **another predio — a live sale, not slaughter** | 1 |

**Almost everything is "GSMI a planta de beneficio" — cattle sent to municipal
slaughter plants.** There is **not one sale through a subasta / feria / concentración
ganadera** — i.e. no competitive price discovery, ever. This is hypothesis **H6** in
[`../financials/diagnosis.md`](../financials/diagnosis.md) confirmed in the record: the
weakest possible channel for price. The municipal-plant route is exactly how cattle
reach local butchers ("regional butchers" matches), and the buyer set is scattered
across many small plants in Antioquia/Caldas/Risaralda — no anchored, volume buyer.

### Cadence: frequent, small, steady — not batched

Roughly **1–3 movements per month**, nearly every month, Jan 2025 → May 2026. The two
guides we have head counts for were **6 and 10 head** — small lots. Frequent small
shipments to slaughter plants is the opposite of building **uniform volume lots** for an
auction. It ties H6 (channel) to H1 (turnover): dribbling animals out a few at a time.

### A process red flag: 24% of guides voided (ANULADA)

9 of 37 guides are ANULADA — including **five on a single day (2025-10-20)** all to
Fredonia, all "Pendiente Confirmación ACH." That looks like repeated failed attempts to
issue one guide (payment/system friction). Worth understanding — wasted effort, and a
sign the selling process itself is rough.

## What this does and doesn't prove

- **Confirms (H6):** no price discovery — 100% direct-to-plant, 0% auction.
- **Supports (H1):** small, frequent shipments rather than batched volume sales.
- **Still unknown:** total head sold, lot sizes (beyond the 2 samples), and — since GSMI
  never has them — **prices**. These come from the owner's records (which will also let
  us compute realized $/kg vs. auction averages).

## To do

- Get **head counts** per guide (open each guide PDF, or from owner records).
- Compare realized prices to **Feria de Medellín** averages once prices arrive.
- Understand the **El Lucero** sale (live animals to another farm?) and the **ANULADA cluster**.
