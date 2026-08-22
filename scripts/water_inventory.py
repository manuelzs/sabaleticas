"""Generate the water-point verification checklist from the canonical GeoJSON.

The point of this file is that nobody maintains the checklist by hand. Position
confidence lives on each feature as `pos_confianza`; this reads it back out and
writes operations/water/inventory.md. Re-run it whenever the geodata changes:

    python3 scripts/water_inventory.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "operations/land/geo/water-infrastructure.geojson"
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
    feats = json.loads(SRC.read_text(encoding="utf-8"))["features"]
    pts = [f for f in feats if f["geometry"]["type"] == "Point"]
    buckets = {k: [] for k in ORDER}
    for f in pts:
        p = f["properties"]
        buckets.get(p.get("pos_confianza", "baja"), buckets["baja"]).append(f)

    L = ["# Water points — what is confirmed and what is not",
         "",
         "> **Generated from `../land/geo/water-infrastructure.geojson`.** Do not edit by hand —",
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
        for f in sorted(buckets[k], key=lambda x: x["properties"].get("nombre", "")):
            p = f["properties"]
            L.append(f"| {TIPO.get(p.get('tipo'), p.get('tipo', ''))} "
                     f"| **{p.get('nombre', '')}** "
                     f"| {p.get('altura_m', '—')} m "
                     f"| {p.get('pos_motivo', '')} |")
        L.append("")
    OUT.write_text("\n".join(L), encoding="utf-8")
    print(f"wrote {OUT.relative_to(ROOT)} — " +
          ", ".join(f"{len(buckets[k])} {k}" for k in ORDER))


if __name__ == "__main__":
    main()
