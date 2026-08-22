"""Generate the water-point verification checklist from the canonical GeoJSON.

The point of this file is that nobody maintains the checklist by hand. Position
confidence lives on each feature as `pos_confianza`; this reads it back out and
writes operations/water/inventory.md. Re-run it whenever the geodata changes:

    python3 scripts/water_inventory.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
import sys; sys.path.insert(0, str(ROOT))
from sabaleticas import network as N
GEO = ROOT / "operations/land/geo"
OUT = ROOT / "operations/water/inventory.md"

ORDER = ["contradicha", "baja", "media", "alta"]
HEAD = {
    "contradicha": ("🔴 Contradicted by the terrain — the position is wrong",
                    "**Do not walk to these expecting to find something.** The elevation proves "
                    "the plotted point cannot do what it is recorded as doing. They need "
                    "relocating, not confirming."),
    "baja":  ("🟠 Approximate — needs confirming on the ground",
              "**This is the visit list.** Positions from the 2003 plan's hand annotations, or "
              "given from memory. Existence is credible; location is not."),
    "media": ("🟡 Good, worth a glance",
              "Probably right to within a few metres. Confirm opportunistically if you are "
              "passing, but do not make a trip."),
    "alta":  ("🟢 Confirmed — do not spend time on these",
              "Identified against the orthophoto or the cadastre. **Already reality.**"),
}
TIPO = {"bebedero": "Bebedero", "tanque": "Tanque", "derivacion": "T / derivación",
        "rompecargas": "Rompecargas", "casa": "Casa", "represa": "Represa",
        "ventosa": "Ventosa", "nacimiento": "Nacimiento", "bocatoma": "Bocatoma"}


def main():
    net = N.load(GEO)
    pts = net["nodes"]
    buckets = {k: [] for k in ORDER}
    for n in pts:
        buckets.get(n.get("pos_confianza", "baja"), buckets["baja"]).append(n)
    problems = N.check(net)

    L = ["# Water points — what is confirmed and what is not",
         "",
         "> **Generated from `../land/geo/water-network.json`.** Do not edit by hand —",
         "> run `python3 scripts/water_inventory.py`. Position confidence is stored per feature",
         "> as `pos_confianza`, so this file cannot drift from the map.",
         "",
         f"**{len(pts)} points total.** " + " · ".join(
             f"{len(buckets[k])} {k}" for k in ORDER if buckets[k]),
         "",
         "Manuel, 2026-08-22: *\"when I go to confirm at the farm, I don't want to have to go to",
         "every single one of these places if I already know the reality.\"*",
         ""]
    for k in ORDER:
        if not buckets[k]:
            continue
        title, blurb = HEAD[k]
        L += [f"## {title}", "", blurb, "",
              "| | Punto | Cota | Por qué |", "|---|---|---|---|"]
        for p in sorted(buckets[k], key=lambda x: x.get("nombre", "")):
            L.append(f"| {TIPO.get(p.get('tipo'), p.get('tipo', ''))} "
                     f"| **{p.get('nombre', '')}** "
                     f"| {p.get('cota_m', '—')} m "
                     f"| {p.get('pos_motivo', '')} |")
        L.append("")
    if problems:
        L = L[:5] + [
            "## 🔴 Physically impossible as recorded",
            "",
            "Found automatically by `sabaleticas/network.py` — these edges run **uphill**, "
            "which a gravity system cannot do. The endpoints, not the pipe, are wrong.",
            "",
            "| Tramo | Problema |", "|---|---|"] + [
            f"| `{p['edge']}` | {p['problema']} — {p.get('detalle','')} |" for p in problems] + [""] + L[5:]
    OUT.write_text("\n".join(L), encoding="utf-8")
    print(f"wrote {OUT.relative_to(ROOT)} — " +
          ", ".join(f"{len(buckets[k])} {k}" for k in ORDER))


if __name__ == "__main__":
    main()
