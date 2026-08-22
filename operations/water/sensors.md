# Telemetry for the water system — design notes

> **Status: design notes only, 2026-08-21.** Nothing bought, nothing built.
> **Prices are deliberately absent.** Manuel can order from Amazon US with effectively free
> shipping, so US pricing is what matters — but anything quoted here from memory would be a
> number without provenance, which this project does not do
> ([`../../AGENTS.md`](../../AGENTS.md)). **Research it properly before ordering.**

## The rule that decides whether this is worth doing

> ### Fix first, measure second.
> A level sensor would have *told* Manuel the rompecargas was emptying. It would not have
> stopped it. Throttling the outlet costs nothing
> ([`README.md`](README.md#fixes-cheapest-first)).
>
> Telemetry earns its keep **verifying the fix held**, and as **early warning** as the verano
> deepens — not as a substitute for the fix.

## Why LoRa, not cellular

Manuel, 2026-08-21: *"lora is perfect. I like radio stuff."* It also happens to be the right
answer:

| | Cellular (LTE-M / NB-IoT / 4G) | **LoRa** |
|---|---|---|
| Recurring cost | **One SIM and one monthly fee per node** | **None** — one gateway serves all nodes |
| Coverage risk | Rural suroeste coverage is unknown per point | Our own link budget, our own gateway |
| With 4–5 tank points | Recurring cost dominates hardware within a year or two | Flat |

**The terrain is on our side.** The tanques altos sit at **811 m**, over **100 m above the main
house** at 705 m. A gateway on high ground has line of sight over most of the farm. Radio likes
hills, and this farm is nothing but hills.

Open question: whichever house has internet becomes the gateway site. Manuel has mentioned
**cameras and temperature sensors already at the house** — that is the existing backhaul and
the natural pilot.

## Where sensors pay, in order

| | Point | What it answers |
|---|---|---|
| 1 | **Rompecargas** (798 m) | The diagnosed failure, and the **leading indicator** of the whole cascade |
| 2 | **Tanques intermedios** (762 m) | **Days of autonomy remaining** — the number nobody can state today |
| 3 | **Tanques altos** (811 m) | Whether the bocatomas are keeping up. **Becomes the critical one if the verano bites** |
| 4 | **Represa** (778 m) | Only if the gravity route or a pump goes ahead |

## The rompecargas is a hard site, and that shapes the choice

`[owner, 2026-08-21]` It is a **buried concrete chamber**, roughly **1 m² by 1–2 m deep**, with
a **lid flush to the ground**. Three consequences:

- **No sun in the pit.** The panel cannot live down there.
- **Radio does not escape a concrete box well.** The signal has to get out through the lid.
  → **Standard fix: sensor inside, radio and panel above ground** on a short stub, joined by a
  cable. Same pattern as an instrumented water-meter pit.
- **Skip the ultrasonic here.** At 1 m² across and 1–2 m deep the beam cone hits the walls, and
  condensation on the transducer is a known killer in confined damp spaces.
  → **What we actually need from this tank is not a curve — it is *full / low / dry*.**
  **Two float switches** answer that, cost almost nothing, and are far more robust.

Save ultrasonic sensors for the **wide poly tanks**, where they work well.

## Power is not the hard part

A node that reads every 15 minutes and **sleeps properly** uses single-digit milliamp-hours per
day. One 18650 cell runs for **months with no sun at all**.

- **Oversize the panel deliberately** — not because the load needs it, but so that three rainy
  weeks in a row do not matter.
- **Use LiFePO4, not ordinary Li-ion.** It tolerates heat far better, and it is hot there.
- The classic failure is a node that dies in the third rainy week because it was never really
  sleeping. Budget for that, not for the panel.

**The genuinely hard parts are sealing the enclosure and getting the signal out of the pit.**

## The near-free option that should be tried first

> A **sight tube on the outside of the rompecargas** and a **daily photo** would have caught
> this months ago, and costs almost nothing.

The operation is losing money every month. That deserves to be tried before any hardware —
and it doubles as the calibration reference for whatever sensor eventually goes in.

It also fits the dashboard's own design rule: **recording has to be faster than not recording**
([`../../dashboard/README.md`](../../dashboard/README.md)).

## What is deliberately not decided here

- **Prices.** See the note at the top.
- **LoRaWAN (a full stack, standard, ChirpStack-style) vs plain point-to-point LoRa.** For four
  or five nodes on one farm, point-to-point is simpler; LoRaWAN buys a standard and better
  tooling. Not worth deciding until the first node exists.
- **Whether the existing house sensors expose an API** we can reuse for backhaul — still one of
  the dashboard's open questions.
