# Outbound movements (GSMI) — sales cadence & channels

Source: **SINIGAN GSMI guías**, Sabaleticas origin. Pulled 2026-05-21/22 from V5
(history) + V6 (2 newest). Data: [`../data/gsmi_movements.csv`](../data/gsmi_movements.csv)
→ `gsmi_movements` table. **84 guides, 75 valid** (9 ANULADA), **Jan 2025 – May 2026**.

> **Correction note:** an earlier version of this file (from an incomplete pull of 35
> guides) claimed "100% direct-to-slaughter, 0% auction." **That was wrong.** The full
> pull surfaced a large comisionista/consignación channel and sales to the Medellín
> livestock market. Corrected below.
>
> **Scope note:** these are recent guides (current SINIGAN version). Older sales under
> prior software versions are not captured and we're not chasing them — the goal is
> recent cadence + lot sizes, not a complete archive.

## Cadence — frequent, small, steady

**~4.7 valid sales/month** across the window (range 1–10/month). This is *high
frequency* — roughly a sale a week, in small lots. That's the signature of selling
animals a few at a time rather than batching into larger, better-priced lots.

## Lot sizes — small (the head counts we pulled)

| Date | Head | Class | Destination | Channel |
|---|---|---|---|---|
| 2026-05-11 | 10 | hembras 2–3 | Central de Sacrificio Riosucio | owner direct |
| 2026-04-28 | 6 | hembras 2–3 | Frigorífico Fredonia | owner direct |
| 2026-03-26 | **14** | **machos 2–3** | **Sociedad Central Ganadera** (Medellín market) | comisionista |
| 2026-03-12 | 6 | hembras 2–3 | Frigorífico Fredonia | owner direct |
| 2026-02-09 | 1 | hembras 2–3 | El Lucero (a farm) | owner direct |

Small lots — **single digits to ~14**. Pattern in the sample: **hembras 2–3 años go to
slaughter plants**; **the born-on-farm machos go to the Central Ganadera market** (and in
a bigger lot, 14). Single-animal sales happen (the "1") — per owner, often a **forced
sale** (e.g. an animal hurt in an accident) offloaded to a local butcher/plant.
*(Only 5 head counts pulled — the app is buggy and counts live inside each guide PDF;
this is a representative sample, not the full total.)*

## Channels — heavy use of comisionistas & consignación

| Cut | Split (of 75 valid) |
|---|---|
| **Comisionista-handled** (ELUPI SAS 38, Agroequina 9) | **47 (63%)** |
| Owner direct (Silvia) | 28 (37%) |
| **Consignación** payment | **50 (67%)** |
| PSE (paid direct) | 25 (33%) |

**Destinations (valid):** Frigorífico Municipal de Fredonia **38**, Sociedad Central
Ganadera (Medellín livestock market) **17**, Frigocentro 4, Riosucio 3, Amagá 2,
Frigotún 1, Matadero La Virginia 1, Cárnicos Especializados 1; plus **sales to other
farms** — La Fortuna 3, El Lucero, Los Alticos, La Guaimaralá, San Joaquín (live cattle).

So the real channel mix:
- **~half to one municipal slaughter plant (Fredonia)** — local, small-capacity buyers.
- **~23% through Sociedad Central Ganadera** — the Medellín market *does* give price
  discovery; this is the one competitive channel, and it's where the machos go.
- **The rest** scattered across small plants and direct farm sales.
- **Two-thirds run through comisionistas on consignación** — meaning a middleman sells
  on Sabaleticas' behalf and takes a cut; the farm is largely a **price-taker**.

## What this means for the diagnosis (H6)

Revised from "no price discovery at all" to something more precise: **high-frequency
small-lot selling, mostly via comisionistas on consignación.** The likely leaks:
- **Commission fees** on ~63% of sales.
- **Small-lot pricing** — frequent tiny lots don't command volume pricing; this ties
  back to turnover (H1): you can only sell small if you're not finishing batches.
- Under-using the one real-market channel (Central Ganadera) for the females.

## Still missing (comes from owner's records)

- **Prices** — GSMI never has them. Realized $/kg per sale is the key gap.
- **Total head sold** — only 5 lot sizes pulled; the rest need each guide's PDF or the
  owner's books.
