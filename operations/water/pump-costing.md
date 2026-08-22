# Costing the reservoir pump — what's published and what isn't

> ### ⚠️ The premise of this document is now in doubt — read [`README.md`](README.md) first.
> This was costed against a **~25 m lift**. Two cheaper routes have since been found on the
> terrain model: a **contour line through El Guaico needing no pump at all**, and a variant
> **entirely on our own land needing ~6.6 m of lift — roughly a quarter of the power, and
> nobody's permission.** The prices below remain good; **the duty they were chosen for may not
> survive a field survey.** Do not buy against this document yet.

> Researched 2026-08-21. **Every price below was read off a live page**; anything that could
> only be found in a search snippet is marked unconfirmed and should not be used.
> Duty as costed: **~25 m of head** (20 m static + friction), 138 m of pipe, from the reservoir
> up to the rompecargas.

## The pump itself — cheaper than expected

Source: **bombeo.co**, the one large Colombian pump retailer that publishes head, flow and
price together. Prices stated by the site as **IVA included**, read 2026-08-21.
(Homecenter, MercadoLibre and several others block automated fetching, so nothing from them
is verified here.)

### ⚠️ Read the specs correctly, or you will buy the wrong pump

Colombian listings quote **"MCA / GPM" as maximum head and maximum flow *separately*** — the
two ends of the pump curve, never delivered at the same time. So:

> **Any pump whose maximum head is below 25 MCA cannot do this job at all**, at any flow.
> And a pump rated 40 MCA / 7 GPM will deliver well under 7 GPM at our 25 m.

This kills the obvious cheap options. **A ½ HP pump is *not* automatically enough here** —
most on the Colombian market top out below 25 m of head. The flow we need is tiny; **the head
is what sizes the pump.**

### Option (a) — cover daily herd demand, ~0.33 L/s at 25 m

| Brand · model | HP | Max head | Max flow | Price (COP) |
|---|---|---|---|---|
| **Barnes BE 1 10-1 HF** | 1.0 | 35 MCA | 8 GPM | **$430,000** |
| LEO APM75A | 1.0 | 45 MCA | 6 GPM | $440,000 |
| Pearl PEP 07F16S | 0.7 | 30 MCA | 7 GPM | $440,000 |
| Ebara QB-80 | 1.0 | 30 MCA | 7.5 GPM | $500,000 |

Explicitly **unsuitable** despite being cheaper — max head below 25 m: Pearl PEP 05A16L
(20 MCA, $240,000), LEO APM37D (20 MCA, $300,000), Barnes BE 1 5-1 HF (10 MCA, $270,000),
Pedrollo PKm60 (25 MCA — that is its shut-off head, so ≈ zero flow at 25 m).

### Option (b) — refill the mid cluster, ~1.4 L/s at 25 m

| Brand · model | HP | Max head | Max flow | Price (COP) |
|---|---|---|---|---|
| **Barmesa NB150** | 1.5 | 26 MCA | 50 GPM | **$1,560,000** |
| Pedrollo PQ65 | 0.75 | 30 MCA | 26 GPM | $1,120,000 |
| Barmesa NB100 | 1.0 | 24 MCA | 42 GPM | ~~$1,510,000~~ — **24 MCA, unsuitable** |

Only the NB150 has clear margin on both axes. **Get the manufacturer's pump curve before
ordering** — none of these pages publish the full curve.

### Accessories worth buying with it

| Item | Price (COP) | Why |
|---|---|---|
| **Float switch** (Norris 3–10 m) | **$50,000–90,000** | **Dry-run protection.** Drawing from an open reservoir, this is not optional — a pump run dry destroys itself |
| Presostato | $50,000–70,000 | Pressure switch |
| Caja de control (1–1.5 HP) | $520,000–650,000 | |

> **Headline: a working pump for the herd-demand duty is roughly COP 500,000–600,000 with a
> float switch.** That is a small number against everything else in this project.

## Grid connection — the published half

EPM's own charges document (published 09 Apr 2026, **prices without IVA**):

| Charge | COP |
|---|---|
| **Revisión de instalaciones (legalización), medida directa** | **$156,556** |
| **Visita de puesta en servicio — Valor Regional** (La Pintada) | **$341,061** |
| Calibración medidor monofásico | $17,094 |
| Parametrización de medidor | $26,421 |

### And the unpublished half — which is the whole risk

> **EPM does not publish the price of the meter, the acometida, or any line extension.**
> This was verified, not assumed: the two 2026 decrees give only the pricing *methodology* and
> state that unit prices live in annexes that are not on the site. The 2024 annex now 404s.

**So the budget is dominated by an item nobody publishes.** If the existing east–west line
passes close enough to reach with a simple acometida, this is cheap. If it needs poles, it is
quote-driven and could dwarf the pump. **No Colombian source publishes a cost per pole
installed or per metre of low-voltage extension** — this is the number to get first, not last.

### Two procedural findings that save real money

1. **Rural predios must first request a *factibilidad del servicio*** before the connection
   request. La Pintada qualifies. Several of these trámites are **free** — and the factibilidad
   is what produces the acometida quote. **This is the concrete next step, and it costs
   nothing.**
2. **The expensive RETIE certification is probably not required.** The ONAC-accredited
   *dictamen* is only mandatory above **10 kVA**; a 1–1.5 HP pump plus farm load is far below
   that. What is needed is a *declaración de cumplimiento* signed by a technician holding a
   **TE-1 licence** — much cheaper. Published ranges for the full certification run
   $200,000–$2,000,000, so knowing we likely don't need it is worth having.

## Running cost — negligible either way

EPM tariff for **Antioquia Otros Municipios, August 2026**: CU total **960.34 COP/kWh**,
cargo fijo **$9,539** per bill. (Worth noting the tariff rose about **12% between January and
August 2026** — build that into any payback sum.)

| Duty | Monthly electricity |
|---|---|
| Daily herd demand (1.2 kWh/day) | ~$34,600 + $9,539 fixed = **~$44,100/month** |
| Refilling the mid cluster daily (7.4 kWh/day) | ~$213,200 + fixed = ~$222,700/month |

A 1 HP pump running costs roughly **$720 COP per hour** at the full tariff.

> **So running it is trivially cheap. The decision is entirely about connection capex** — and
> that is the one number nobody publishes.

## What this does to the solar-vs-grid call

It sharpens it rather than settling it:

- **Grid**: known charges ~$500,000, **plus an unknown acometida and a potentially large line
  extension**, then ~$44,000/month forever, on a grid that IDEAM expects to be stressed by the
  same El Niño we are preparing for.
- **Solar**: ~334 Wp of panel, no meter, no trámite, no monthly bill, no line extension risk,
  and it works during rationing. Capex not yet priced — that was the half of the research that
  got interrupted.

**The single action that resolves it: request the EPM factibilidad.** It is free, it is the
required first step anyway, and it converts the biggest unknown in this document into a
number. Until then solar looks better mainly because its cost is *knowable*.

## Not verified — do not rely on

- Meter, acometida and line-extension costs (not published by EPM anywhere).
- Pole prices — every retailer either blocked fetching or showed no price.
- Cable encauchetado prices — blocked at every retailer checked.
- Solar pump kit prices in Colombia — research interrupted before this was covered.
