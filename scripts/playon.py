#!/usr/bin/env python3
"""Build the playón outline from captured points.

The playón is NOT a potrero and must never be one. It is government land — the strip
between our cadastral lindero and the midpoint of the Río Poblanco — that we use and
that both surveys draw. Filing it as an enclosure would put land we do not own into a
layer that means "land we own", add it to the 169 ha and to the audit denominator, and
inflate every per-hectare figure with sand.

Not with nothing, though: a few animals CAN be raised there and some people do it. The
reason it stays out of the carrying capacity is not that it is barren, it is that it is
paid for in labour — the animals go in by day and someone walks back for them every
night — and that the river can rise and take them. A bad paddock gives less beef; this
one can take the herd. So it lives here, alone,
with its own area reported and summed into nothing.

Its boundary is a photograph with a date, not a measurement: Manuel — the river moves
literally every month. Cadastre, the 2003 plan and the 2007 survey each drew a different
bank and all three may have been right on the day. So the ring carries the date it was
marked, and correcting one against another is meaningless.

    python3 scripts/playon.py puntos.json          # replace the ring
    python3 scripts/playon.py puntos.json --add    # extend it (marking in sittings)
    python3 scripts/playon.py puntos.json --lindero  # close the landward side on the lindero

--lindero is the normal case. The playón only has ONE edge worth marking — the river's.
Its other edge IS our boundary, so it is not marked by hand: the return leg is spliced
from the lindero's own vertices, the same rule the fence corrections follow. Closing it
with a straight line instead would cut across our own paddocks.

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


def retorno_por_lindero(pts, dmax=320.0):
    """The landward leg, taken from the lindero itself between the traverse's two ends.

    Manuel marks the WESTERN edge only — the river's, the one that moves. The eastern
    edge is our own boundary and is never marked by hand: the return leg is spliced from
    the lindero's vertices, the rule the fence corrections already follow. A straight
    line back would cut clean across our own paddocks.

    Picking the run needs care. The nearest single vertex is not enough — that chose the
    wrong end of Sabaleticas and returned a 1,566 m jump. Instead each ring contributes
    its CONTIGUOUS run of vertices facing the traverse, walked so that the traverse point
    it faces counts DOWN: the outbound leg runs north to south, so the return runs south
    to north. Where the walk changes parcel the two rings do not meet, and that gap is
    printed rather than bridged in silence — it is a real notch in the cadastre.
    """
    b = json.loads((GEO / "boundary.geojson").read_text(encoding="utf-8"))
    rings = {}
    for f in b["features"]:
        g = f["geometry"]
        nm = f["properties"].get("name") or f["properties"].get("nombre")
        polys = [g["coordinates"]] if g["type"] == "Polygon" else g["coordinates"]
        for poly in polys:
            rings[nm] = [tuple(c[:2]) for c in poly[0]][:-1]

    def d_m(u, v):
        return math.hypot((u[0] - v[0]) * LON2M, (u[1] - v[1]) * LAT2M)

    def cerca(v):
        """(distance, index) of the traverse point this boundary vertex faces."""
        return min(((d_m(v, p), i) for i, p in enumerate(pts)))

    def ubicar(p):
        best = (1e9, None, None)
        for nm, r in rings.items():
            for i, v in enumerate(r):
                d = d_m(v, p)
                if d < best[0]:
                    best = (d, nm, i)
        return best

    d0, r0, i0 = ubicar(pts[0])
    d1, r1, i1 = ubicar(pts[-1])
    print(f"  extremos sobre el lindero: {d0:.1f} m «{r0}» · {d1:.1f} m «{r1}»")
    if max(d0, d1) > 5.0:
        raise SystemExit("error: los extremos del trazo no caen sobre el lindero; "
                         "no hay por dónde cerrar sin inventar línea")

    def corrida(nm, i):
        """The contiguous run of ring vertices facing the traverse, through index i."""
        r = rings[nm]
        n = len(r)
        if cerca(r[i])[0] > dmax:
            return [i]
        run = [i]
        k = i
        while len(run) < n and cerca(r[(k + 1) % n])[0] <= dmax:
            k = (k + 1) % n
            run.append(k)
        k = i
        while len(run) < n and cerca(r[(k - 1) % n])[0] <= dmax:
            k = (k - 1) % n
            run.insert(0, k)
        return run

    def bajando(nm, i, desde_el_final):
        """That run, ordered so the traverse point it faces counts down, trimmed at i."""
        run = corrida(nm, i)
        if cerca(rings[nm][run[0]])[1] < cerca(rings[nm][run[-1]])[1]:
            run = run[::-1]                     # now facing high index -> low
        j = run.index(i)
        return run[j:] if desde_el_final else run[:j + 1]

    if r0 == r1:
        run = corrida(r0, i1)
        if cerca(rings[r0][run[0]])[1] < cerca(rings[r0][run[-1]])[1]:
            run = run[::-1]
        a, z = run.index(i1), run.index(i0)
        return [rings[r0][k] for k in run[a:z + 1]]

    fin = bajando(r1, i1, True)                 # from the south end, heading north
    ini = bajando(r0, i0, False)                # up to the north end

    # Hand over where the two parcels come CLOSEST, not where the distance cut-off
    # happened to fall. Trimming at the cut-off left each run a spur into the inland
    # notch between them; the two spurs crossed, and the ring swallowed Poblanco.
    mejor = min(((d_m(rings[r1][u], rings[r0][v]), a, z)
                 for a, u in enumerate(fin) for z, v in enumerate(ini)))
    salto, a, z = mejor
    podado = (len(fin) - a - 1) + z
    fin, ini = fin[:a + 1], ini[z:]
    print(f"  el retorno cambia de predio: «{r1}» → «{r0}», con {salto:.1f} m entre los "
          f"dos anillos (no se rellena: es un entrante real del catastro)")
    if podado:
        print(f"  {podado} vértice(s) del entrante podados en el relevo")
    return [rings[r1][k] for k in fin] + [rings[r0][k] for k in ini]


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
    if "--lindero" in sys.argv[2:]:
        pts = pts + [(round(c[0], 6), round(c[1], 6)) for c in retorno_por_lindero(pts)]
    # Collapse near-coincident neighbours. Two of these were reported as ring
    # self-intersections: the last marked point sits 0.2 m from the lindero vertex it
    # lands on, and the IGAC boundary carries a vertex repeated exactly. Both are
    # zero-length wobbles, not crossings, but they are indistinguishable from real ones
    # once the ring is in a viewer.
    limpio = [pts[0]]
    for c in pts[1:]:
        if math.hypot((c[0] - limpio[-1][0]) * LON2M,
                      (c[1] - limpio[-1][1]) * LAT2M) >= 0.5:
            limpio.append(c)
    if len(limpio) < len(pts):
        print(f"  {len(pts) - len(limpio)} vértice(s) coincidentes fundidos")
    pts = limpio

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
            "sub2": f"{ha} ha · pastoreo marginal, fuera de la carga",
            "tipo_tierra": "playon",
            "area_ha": ha,
            "propiedad": "Estado (cauce y playón del Río Poblanco)",
            "en_area_de_pastoreo": False,
            "pastoreo_marginal": True,
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
