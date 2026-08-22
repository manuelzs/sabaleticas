"""Move a dictated vertex, taking every closure that shares it along with it.

    python3 scripts/mover_vertice.py  <lon_viejo> <lat_viejo>  <lon_nuevo> <lat_nuevo>  ["motivo"]

A vertex is almost never used once. The junction where the perpendicular fence meets 28–29 is
in TWO closures; moving it in one and not the other would tear the network apart silently —
the graph would simply stop connecting there and a potrero would quietly reopen. So the move
is by POSITION, not by closure: every reference within TOL is moved together, and the count is
reported so a move that hits fewer references than expected is visible.
"""
import json
import math
import sys
from pathlib import Path

GEO = Path(__file__).resolve().parent.parent / "operations/land/geo"
LON2M = 111320.0 * math.cos(math.radians(5.796))
LAT2M = 110574.0
TOL = 1.5           # metres: same vertex, allowing for rounding


def main():
    if len(sys.argv) < 5:
        print(__doc__)
        return 1
    ox, oy, nx, ny = (float(v) for v in sys.argv[1:5])
    motivo = sys.argv[5] if len(sys.argv) > 5 else ""
    d = math.hypot((nx - ox) * LON2M, (ny - oy) * LAT2M)

    f = GEO / "cercas-cierres.json"
    doc = json.loads(f.read_text(encoding="utf-8"))
    tocados = []

    def cerca(p):
        return math.hypot((p[0] - ox) * LON2M, (p[1] - oy) * LAT2M) < TOL

    for i, c in enumerate(doc["cierres"]):
        if isinstance(c, dict) and c.get("polilinea"):
            for j, p in enumerate(c["polilinea"]):
                if cerca(p):
                    c["polilinea"][j] = [round(nx, 6), round(ny, 6)]
                    tocados.append(f"polilínea [{i}] vértice {j}")
        elif isinstance(c, list):
            for j in (0, 1):
                if isinstance(c[j], list) and cerca(c[j]):
                    c[j] = [round(nx, 6), round(ny, 6)]
                    tocados.append(f"par [{i}] extremo {j}")

    if not tocados:
        print(f"  ningún cierre usa {ox},{oy} — nada que mover")
        return 1
    doc.setdefault("_movimientos", []).append({
        "de": [round(ox, 6), round(oy, 6)], "a": [round(nx, 6), round(ny, 6)],
        "metros": round(d, 1), "refs": tocados,
        "motivo": motivo or "[owner] ajuste fino para seguir mejor el drenaje"})
    f.write_text(json.dumps(doc, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"  movido {d:.1f} m · {len(tocados)} referencia(s): {', '.join(tocados)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
