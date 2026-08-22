"""Mark a potrero's audit state, anchored to a point instead of to its number.

    python3 scripts/estado_potrero.py "Potrero 8" final ["nota"]
    python3 scripts/estado_potrero.py Serengueti por_subdividir

Numbering is by area and reshuffles whenever a face appears or disappears, so the state
is stored against a point well inside the polygon — the same trick the names use. Say the
number you can see on the map right now; this resolves it to a point.
"""
import json
import math
import sys
from pathlib import Path

GEO = Path(__file__).resolve().parent.parent / "operations/land/geo"
POT = GEO / "potreros-cerrados.geojson"
EST = GEO / "potreros-estado.json"


def inside(p, ring):
    x, y = p
    c = False
    n = len(ring)
    for i in range(n):
        a, b = ring[i], ring[(i + 1) % n]
        if (a[1] > y) != (b[1] > y) and \
           x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]:
            c = not c
    return c


def anchor(ring):
    """A point safely INSIDE the ring. The centroid of a concave potrero can fall
    outside it, and then the state would follow nothing."""
    cx = sum(p[0] for p in ring[:-1]) / (len(ring) - 1)
    cy = sum(p[1] for p in ring[:-1]) / (len(ring) - 1)
    if inside((cx, cy), ring):
        return [round(cx, 6), round(cy, 6)]
    xs = sorted(p[0] for p in ring)
    ys = sorted(p[1] for p in ring)
    best, bd = None, -1.0
    for i in range(1, 41):
        for j in range(1, 41):
            q = (xs[0] + (xs[-1] - xs[0]) * i / 41, ys[0] + (ys[-1] - ys[0]) * j / 41)
            if not inside(q, ring):
                continue
            d = min(math.hypot(q[0] - a[0], q[1] - a[1]) for a in ring)
            if d > bd:
                bd, best = d, q
    return [round(best[0], 6), round(best[1], 6)]


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        return 1
    quien, estado = sys.argv[1], sys.argv[2]
    nota = sys.argv[3] if len(sys.argv) > 3 else ""

    pots = json.loads(POT.read_text(encoding="utf-8"))["features"]
    hit = [f for f in pots if f["properties"].get("nombre") == quien]
    if not hit:
        print(f"no encuentro «{quien}». Hay: "
              + ", ".join(sorted(f["properties"]["nombre"] for f in pots)))
        return 1
    f = hit[0]
    pt = anchor(f["geometry"]["coordinates"][0])

    d = json.loads(EST.read_text(encoding="utf-8"))
    ring = f["geometry"]["coordinates"][0]
    prev = [e for e in d["estados"] if inside(e["punto"], ring)]
    for e in prev:
        d["estados"].remove(e)
    ent = {"punto": pt, "estado": estado}
    if nota:
        ent["nota"] = nota
    ent["fuente"] = f"[owner, 2026-08-22] Manuel lo marcó como «{estado}» " \
                    f"sobre el {quien} de la corrida del 2026-08-22."
    d["estados"].append(ent)
    EST.write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding="utf-8")
    antes = f" (antes: {prev[0]['estado']})" if prev else ""
    print(f"  {quien} ({f['properties']['area_ha']} ha) → {estado}{antes}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
