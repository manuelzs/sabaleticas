#!/usr/bin/env python3
"""Build the playón outline from captured points.

The playón is NOT a potrero and must never be one. It is government land — the strip
between our cadastral lindero and the midpoint of the Río Poblanco — that we use and
that both surveys draw. Filing it as an enclosure would put land we do not own into a
layer that means "land we own", add it to the 169 ha and to the audit denominator, and
inflate every per-hectare figure with what Manuel calls rock. So it lives here, alone,
with its own area reported and summed into nothing.

Its boundary is a photograph with a date, not a measurement: Manuel — the river moves
literally every month. Cadastre, the 2003 plan and the 2007 survey each drew a different
bank and all three may have been right on the day. So the ring carries the date it was
marked, and correcting one against another is meaningless.

    python3 scripts/playon.py puntos.json          # replace the ring
    python3 scripts/playon.py puntos.json --add    # extend it (marking in sittings)

puntos.json is a list of [lon, lat] in walking order, or the objects the viewer's point
capture banks — {"lon":…, "lat":…} — in either case straight from `sab_captured`.
"""
import json
import math
import sys
from pathlib import Path

GEO = Path(__file__).resolve().parent.parent / "operations" / "land" / "geo"
DEST = GEO / "playon.geojson"
LON2M = 111320.0 * math.cos(math.radians(5.796))
LAT2M = 110574.0
FECHA = "2026-08-22"


def area_ha(ring):
    """Shoelace in metres. Good to a few m² at this size and latitude."""
    s = 0.0
    for (x0, y0), (x1, y1) in zip(ring, ring[1:]):
        s += (x0 * LON2M) * (y1 * LAT2M) - (x1 * LON2M) * (y0 * LAT2M)
    return abs(s) / 2.0 / 10000.0


def leer(path):
    raw = json.loads(Path(path).read_text(encoding="utf-8"))
    pts = []
    for p in raw:
        if isinstance(p, dict):
            pts.append((round(float(p["lon"]), 6), round(float(p["lat"]), 6)))
        else:
            pts.append((round(float(p[0]), 6), round(float(p[1]), 6)))
    return pts


def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    nuevos = leer(sys.argv[1])
    add = "--add" in sys.argv[2:]

    previos = []
    if add and DEST.exists():
        d = json.loads(DEST.read_text(encoding="utf-8"))
        anillo = d["features"][0]["geometry"]["coordinates"][0]
        previos = [tuple(c) for c in anillo[:-1]]        # drop the repeated close
    pts = previos + [p for p in nuevos if p not in previos]
    if len(pts) < 3:
        raise SystemExit(f"error: {len(pts)} punto(s); un anillo necesita 3")

    ring = pts + [pts[0]]
    ha = round(area_ha(ring), 2)
    feat = {
        "type": "Feature",
        "properties": {
            "_id": "tierra:playon",
            "nombre": "Playón",
            "name": "Playón",
            "sub2": f"{ha} ha · uso, no pastoreo",
            "tipo_tierra": "playon",
            "area_ha": ha,
            "propiedad": "Estado (cauce y playón del Río Poblanco)",
            "en_area_de_pastoreo": False,
            "en_area_del_predio": False,
            "marcado": FECHA,
            "estilo": "discontinuo",
            "fuente": (f"[owner, {FECHA}] Contorno marcado punto a punto por Manuel sobre "
                       "los dos levantamientos, que ambos lo dibujan. NO es potrero: es "
                       "tierra del Estado que usamos. No suma al predio (170,73 ha "
                       "catastrales) ni al área de pastoreo. Ver operations/land/playon.md."),
        },
        "geometry": {"type": "Polygon", "coordinates": [[list(c) for c in ring]]},
    }
    DEST.write_text(json.dumps({"type": "FeatureCollection", "features": [feat]},
                               indent=1, ensure_ascii=False), encoding="utf-8")
    print(f"playón: {len(pts)} vértices, {ha} ha  →  {DEST.name}")
    print("  (no entra en las 169 ha de potreros ni en la auditoría)")


if __name__ == "__main__":
    main()
