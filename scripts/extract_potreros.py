"""Turn the fence lines into closed enclosures — the faces of a planar graph.

IGAC's `Cerca` layer is 70 disconnected fence fragments; the farm boundary closes many
of the enclosures they only partly enclose, so both go into one graph. Vertices within
`TOL` metres are treated as the same point — that is noding, not invention: the fences
genuinely meet there and the coordinates differ by centimetres.

What comes out:
  potreros-cerrados.geojson   the enclosures that already close, with computed areas
  cercas-abiertas.geojson     every loose fence end, so the gaps are a visible work list

Anything that does not close stays out. A potrero we guessed at would be worse than none.
"""
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GEO = ROOT / "operations/land/geo"
TOL = 2.0                      # metres — coordinate noise, not a real gap
CIERRES = "cercas-cierres.json"  # closures Manuel dictates, by gap number
LON2M = 111320.0 * math.cos(math.radians(5.796))
LAT2M = 110574.0


def load_lines(tag=False):
    out = []
    cer = json.loads((GEO / "igac-1to5000/Cerca.geojson").read_text(encoding="utf-8"))
    for f in cer["features"]:
        g = f["geometry"]
        if g["type"] == "LineString":
            out.append([tuple(c[:2]) for c in g["coordinates"]])
        elif g["type"] == "MultiLineString":
            out += [[tuple(c[:2]) for c in p] for p in g["coordinates"]]
    n_cerca = len(out)
    bnd = json.loads((GEO / "boundary.geojson").read_text(encoding="utf-8"))
    for f in bnd["features"]:
        g = f["geometry"]
        rings = [g["coordinates"]] if g["type"] == "Polygon" else g["coordinates"]
        for poly in rings:
            for r in poly:
                out.append([tuple(c[:2]) for c in r])
    return (out, n_cerca) if tag else out


def node_lines(lines, tol=TOL):
    """Split every segment where another line's endpoint lands on it.

    This is the whole problem. IGAC's fences genuinely meet — one ends *on* another —
    but the junction is not a vertex on the line being touched, so a naive graph never
    sees it. 57 of 60 loose ends sit within 5 m of another fence, median 0 m: they are
    touching, not gapped. Noding turns a pile of fragments into a connected network.
    """
    ends = []
    for l in lines:
        ends += [l[0], l[-1]]
    out = []
    for l in lines:
        new_l = [l[0]]
        for a, b in zip(l, l[1:]):
            ax, ay = a[0] * LON2M, a[1] * LAT2M
            bx, by = b[0] * LON2M, b[1] * LAT2M
            dx, dy = bx - ax, by - ay
            dd = dx * dx + dy * dy
            hits = []
            for p in ends:
                px, py = p[0] * LON2M, p[1] * LAT2M
                t = 0.0 if dd == 0 else ((px - ax) * dx + (py - ay) * dy) / dd
                if t <= 1e-9 or t >= 1 - 1e-9:
                    continue
                if math.hypot(px - (ax + t * dx), py - (ay + t * dy)) <= tol:
                    hits.append((t, p))
            for _, p in sorted(hits):
                if p != new_l[-1]:
                    new_l.append(p)
            new_l.append(b)
        out.append(new_l)
    return out


def build(lines):
    """Planar graph over the fence vertices, with points within TOL merged.

    NOT grid rounding. Two vertices 5 cm apart straddling a cell boundary round to
    different cells and stay disconnected — which is exactly what was happening here,
    and why a network that visually closes produced almost no faces. Cluster by actual
    proximity instead: hash into cells of side TOL, then union anything within TOL
    across the 3x3 neighbourhood.
    """
    pts = []
    for l in lines:
        pts += list(l)
    cell = {}
    for i, p in enumerate(pts):
        c = (int(p[0] * LON2M // TOL), int(p[1] * LAT2M // TOL))
        cell.setdefault(c, []).append(i)

    par = list(range(len(pts)))
    def find(x):
        while par[x] != x:
            par[x] = par[par[x]]
            x = par[x]
        return x
    def union(a, b):
        ra, rb = find(a), find(b)
        if ra != rb:
            par[ra] = rb
    for c, idx in cell.items():
        near = []
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                near += cell.get((c[0] + dx, c[1] + dy), [])
        for i in idx:
            xi, yi = pts[i][0] * LON2M, pts[i][1] * LAT2M
            for j in near:
                if j <= i:
                    continue
                if math.hypot(xi - pts[j][0] * LON2M, yi - pts[j][1] * LAT2M) <= TOL:
                    union(i, j)

    kof, pos, n = {}, {}, 0
    for i, p in enumerate(pts):
        r = find(i)
        if r not in kof:
            kof[r] = n
            pos[n] = p
            n += 1
    key_of = {i: kof[find(i)] for i in range(len(pts))}

    adj, at = {}, 0
    for l in lines:
        ks = [key_of[at + i] for i in range(len(l))]
        at += len(l)
        for a, b in zip(ks, ks[1:]):
            if a == b:
                continue
            adj.setdefault(a, set()).add(b)
            adj.setdefault(b, set()).add(a)
    for k in list(pos):
        adj.setdefault(k, set())
    return pos, adj


def prune(adj):
    """Dangling ends bound no face, so strip them before tracing.

    The work list is the *tips* — the loose ends as they exist today. Pruning cascades
    back along a whole dangling chain, and reporting every vertex of that chain would
    bury the handful of places someone actually has to go and close.
    """
    tips = [v for v, n in adj.items() if len(n) == 1]
    stack = list(tips)
    while stack:
        v = stack.pop()
        ns = adj.get(v)
        if not ns or len(ns) != 1:
            continue
        (w,) = ns
        ns.clear()
        adj[w].discard(v)
        if len(adj[w]) == 1:
            stack.append(w)
    for v in [v for v, n in adj.items() if not n]:
        adj.pop(v)
    return tips


def faces(pos, adj):
    """Walk every directed edge, always taking the next neighbour clockwise.

    Each walk closes one face of the planar subdivision. The walk ends when it revisits
    a directed edge it has already consumed — that is the face closing on itself.
    """
    def ang(a, b):
        return math.atan2((pos[b][1] - pos[a][1]) * LAT2M, (pos[b][0] - pos[a][0]) * LON2M)
    order = {v: sorted(ns, key=lambda w: ang(v, w)) for v, ns in adj.items()}
    used, out = set(), []
    for u in list(adj):
        for v in list(adj[u]):
            if (u, v) in used:
                continue
            cyc, a, b = [], u, v
            while (a, b) not in used:
                used.add((a, b))
                cyc.append(a)
                ring = order[b]
                nxt = ring[(ring.index(a) - 1) % len(ring)]   # next clockwise
                a, b = b, nxt
            if len(cyc) >= 3:
                out.append(cyc)
    return out


def inside(pt, polys):
    """Ray casting. Faces can also form OUTSIDE our land, between our fence and a
    neighbour's — those are their paddocks, not ours."""
    x, y = pt
    for poly in polys:
        c = False
        for ring in poly:
            j = len(ring) - 1
            for i in range(len(ring)):
                xi, yi = ring[i][0], ring[i][1]
                xj, yj = ring[j][0], ring[j][1]
                if ((yi > y) != (yj > y)) and (x < (xj - xi) * (y - yi) / (yj - yi) + xi):
                    c = not c
                j = i
        if c:
            return True
    return False


def agua_de(ring, net, drenajes, depositos, tol=25.0):
    """Which water sources serve this enclosure.

    Troughs are built ON boundaries, deliberately, so one serves several paddocks — a
    trough within `tol` of the ring counts as serving it, not only one inside it. Natural
    water counts too: a creek crossing the paddock or a pond inside it.

    An enclosure with nothing is the useful case: either a trough we have not mapped, or
    a paddock that genuinely has no water.
    """
    def d_ring(p):
        best = 1e9
        for i in range(len(ring)):
            a, b = ring[i], ring[(i + 1) % len(ring)]
            ax, ay = a[0] * LON2M, a[1] * LAT2M
            bx, by = b[0] * LON2M, b[1] * LAT2M
            px, py = p[0] * LON2M, p[1] * LAT2M
            dx, dy = bx - ax, by - ay
            dd = dx * dx + dy * dy
            t = 0.0 if dd == 0 else max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / dd))
            best = min(best, math.hypot(px - (ax + t * dx), py - (ay + t * dy)))
        return best

    poly = [ring]
    out = []
    for n in net["nodes"]:
        if n["tipo"] not in ("bebedero", "tanque", "represa") or not n.get("geo"):
            continue
        if inside(n["geo"], [poly]) or d_ring(n["geo"]) <= tol:
            out.append({"id": n["id"], "nombre": n["nombre"], "tipo": n["tipo"],
                        "confianza": n.get("pos_confianza", "?")})
    for l in drenajes:
        if any(inside(p, [poly]) for p in l):
            out.append({"id": None, "nombre": "drenaje", "tipo": "natural",
                        "confianza": "IGAC"})
            break
    for r in depositos:
        cx = sum(p[0] for p in r) / len(r)
        cy = sum(p[1] for p in r) / len(r)
        if inside((cx, cy), [poly]):
            out.append({"id": None, "nombre": "depósito de agua", "tipo": "natural",
                        "confianza": "IGAC"})
            break
    return out


def area_m2(ring):
    if len(ring) < 3:
        return 0.0
    s = 0.0
    for i in range(len(ring)):
        x1, y1 = ring[i]
        x2, y2 = ring[(i + 1) % len(ring)]
        s += (x1 * LON2M) * (y2 * LAT2M) - (x2 * LON2M) * (y1 * LAT2M)
    return s / 2.0


def main():
    bnd = json.loads((GEO / "boundary.geojson").read_text(encoding="utf-8"))
    OURS = []
    for f in bnd["features"]:
        g = f["geometry"]
        OURS += [g["coordinates"]] if g["type"] == "Polygon" else g["coordinates"]

    lines, n_cerca = load_lines(tag=True)
    before = sum(len(l) for l in lines)
    lines = node_lines(lines)
    print(f"  noding: {before} → {sum(len(l) for l in lines)} vértices")
    pos, adj = build(lines)
    print(f"  grafo: {len(adj)} nodos, {sum(len(v) for v in adj.values())//2} aristas")
    # vertex ids that exist only because of the parcel outline
    bpts = {p for l in lines[n_cerca:] for p in l}
    bkeys = {k for k, p in pos.items() if p in bpts}

    # Loose ends, numbered STABLY. The numbers are how Manuel refers to a gap out loud
    # ("connect 38 and 41"), so they must survive a re-run — including a re-run where
    # earlier closures have already removed some of them. Existing numbers are matched
    # by position and kept; only genuinely new gaps get new ones.
    tips = sorted([v for v, n in adj.items() if len(n) == 1],
                  key=lambda v: (-pos[v][1], pos[v][0]))
    prev = {}
    f_prev = GEO / "cercas-abiertas.geojson"
    if f_prev.exists():
        for ft in json.loads(f_prev.read_text(encoding="utf-8"))["features"]:
            c = ft["geometry"]["coordinates"]
            prev[(round(c[0], 6), round(c[1], 6))] = ft["properties"].get("n")
    num, taken = {}, {n for n in prev.values() if n}
    for v in tips:
        p = (round(pos[v][0], 6), round(pos[v][1], 6))
        if prev.get(p):
            num[v] = prev[p]
    nxt = 1
    for v in tips:
        if v in num:
            continue
        while nxt in taken:
            nxt += 1
        num[v] = nxt
        taken.add(nxt)
    by_num = {n: v for v, n in num.items()}

    # closures dictated by Manuel, as graph edges
    cierres, hechos = [], 0
    f_c = GEO / CIERRES
    if f_c.exists():
        for c in json.loads(f_c.read_text(encoding="utf-8"))["cierres"]:
            a, b = c[0], c[1]
            motivo = c[2] if len(c) > 2 else ""
            va, vb = by_num.get(a), by_num.get(b)
            if va is None or vb is None:
                print(f"  ⚠ cierre {a}–{b}: número no encontrado")
                continue
            d_m = math.hypot((pos[vb][0] - pos[va][0]) * LON2M,
                             (pos[vb][1] - pos[va][1]) * LAT2M)
            flag = "  ⚠ muy largo, ¿número equivocado?" if d_m > 120 else ""
            print(f"    cierre {a}–{b}: {d_m:6.1f} m{flag}")
            adj[va].add(vb)
            adj[vb].add(va)
            cierres.append((a, b, pos[va], pos[vb], motivo, round(d_m)))
            hechos += 1
    if hechos:
        print(f"  cierres aplicados: {hechos}")

    fs = faces(pos, adj)

    polys, fuera = [], 0
    for cyc in fs:
        ring = [pos[k] for k in cyc]
        a = area_m2(ring)
        if a < 0:                                # clockwise = an outer face, skip
            continue
        if a < 200:                              # slivers from noding, not paddocks
            continue
        cx = sum(p[0] for p in ring) / len(ring)
        cy = sum(p[1] for p in ring) / len(ring)
        if not inside((cx, cy), OURS):           # a neighbour's enclosure, not ours
            fuera += 1
            continue
        if sum(1 for k in cyc if k in bkeys) / len(cyc) > 0.9:
            continue                             # this face IS a parcel outline, not a potrero
        polys.append((a, ring))
    polys.sort(key=lambda t: -t[0])

    # water sources per enclosure
    net = json.loads((GEO / "water-network.json").read_text(encoding="utf-8"))
    dre, dep = [], []
    fd = GEO / "igac-1to5000/Drenaje.geojson"
    if fd.exists():
        for f in json.loads(fd.read_text(encoding="utf-8"))["features"]:
            g = f["geometry"]
            if g["type"] == "LineString":
                dre.append([tuple(c[:2]) for c in g["coordinates"]])
            elif g["type"] == "MultiLineString":
                dre += [[tuple(c[:2]) for c in p] for p in g["coordinates"]]
    fp = GEO / "igac-1to5000/Deposito_Agua_R.geojson"
    if fp.exists():
        for f in json.loads(fp.read_text(encoding="utf-8"))["features"]:
            g = f["geometry"]
            rings_ = [g["coordinates"]] if g["type"] == "Polygon" else g["coordinates"]
            for poly in rings_:
                dep.append([tuple(c[:2]) for c in poly[0]])

    feats = []
    sin_agua = []
    for i, (a, ring) in enumerate(polys, 1):
        fuentes = agua_de(ring, net, dre, dep)
        # No mapped trough is NOT the same as "watered by the creek". It may mean the
        # paddock really relies on the quebrada — which matters, because in a verano the
        # creek may not be there — or simply that we have not mapped its trough yet.
        # Both stay open until Manuel says which.
        conducida = [f for f in fuentes if f["tipo"] != "natural"]
        if not fuentes:
            sin_agua.append((i, a / 10000, "ninguna fuente conocida — POR CONFIRMAR"))
        elif not conducida:
            sin_agua.append((i, a / 10000, "sin bebedero mapeado — POR CONFIRMAR"))
        feats.append({"type": "Feature", "properties": {
            "tipo": "potrero", "nombre": f"Potrero {i}", "n": i,
            "area_ha": round(a / 10000, 2), "area_m2": round(a),
            "agua": fuentes,
            "sin_agua": not fuentes,
            "solo_natural": bool(fuentes) and not conducida,
            "agua_por_confirmar": not conducida,
            "agua_nota": ("" if conducida else
                "[por confirmar] No hay bebedero mapeado en este potrero. Puede que el ganado "
                "tome de la quebrada, o puede que haya un bebedero que todavía no ubicamos. "
                "No asumir lo uno ni lo otro."),
            "fuente": f"[derived {TOL} m] Cara cerrada del grafo Cerca IGAC + linderos. "
                      "Geometría heredada del catastro; el NOMBRE real lo da Manuel.",
            "confianza": "geometría: media (catastro 1:5000) · nombre: pendiente"},
            "geometry": {"type": "Polygon",
                         "coordinates": [[[round(x, 6), round(y, 6)] for x, y in ring + [ring[0]]]]}})
    (GEO / "potreros-cerrados.geojson").write_text(
        json.dumps({"type": "FeatureCollection", "features": feats}, indent=1,
                   ensure_ascii=False), encoding="utf-8")

    dfeats = [{"type": "Feature", "properties": {
        "tipo": "cerca_abierta", "nombre": f"Cerca abierta {num[k]}", "n": num[k],
        "fuente": "[derived] Extremo de cerca que no conecta con nada. El número es "
                  "estable entre corridas: sirve para dictar cierres."},
        "geometry": {"type": "Point", "coordinates": [round(pos[k][0], 6), round(pos[k][1], 6)]}}
        for k in sorted(tips, key=lambda v: num[v]) if len(adj.get(k, ())) <= 1]
    (GEO / "cercas-abiertas.geojson").write_text(
        json.dumps({"type": "FeatureCollection", "features": dfeats}, indent=1,
                   ensure_ascii=False), encoding="utf-8")

    cfeats = [{"type": "Feature", "properties": {
        "tipo": "cierre", "nombre": f"Cierre {a}–{b}", "longitud_m": dm,
        "motivo": mot or "sin especificar",
        "fuente": "[owner] Cierre dictado por Manuel. No es una cerca física: cierra el "
                  "POTRERO, que es lo que importa para el ganado."},
        "geometry": {"type": "LineString", "coordinates": [
            [round(pa[0], 6), round(pa[1], 6)], [round(pb[0], 6), round(pb[1], 6)]]}}
        for a, b, pa, pb, mot, dm in cierres]
    (GEO / "cercas-cierres.geojson").write_text(
        json.dumps({"type": "FeatureCollection", "features": cfeats}, indent=1,
                   ensure_ascii=False), encoding="utf-8")

    # Cross-check against the water graph. Manuel's insight: a fence gap is often a
    # trough with the fence split so cattle drink from both sides — so every closure is
    # a candidate water point, and one that is FAR from anything we know is a trough the
    # water network is missing.
    wf = GEO / "water-network.json"
    if wf.exists() and cierres:
        net = json.loads(wf.read_text(encoding="utf-8"))
        pts = [n for n in net["nodes"] if n.get("geo")]
        # Only closures that might BE water are worth checking against the water graph.
        # A quiebrapatas reported as a "new water point" is noise, and noise is how a
        # useful check gets ignored.
        NO_AGUA = ("quiebrapatas", "puerta", "portillo", "saladero")
        AGUA = ("bebedero", "tanque", "agua", "abrevadero")
        print("  contra la red de agua:")
        for a, b, pa, pb, mot, _ in cierres:
            m = (mot or "").lower()
            if any(w in m for w in NO_AGUA) and not any(w in m for w in AGUA):
                continue
            mid = ((pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2)
            d, n = min((( math.hypot((mid[0]-x["geo"][0])*LON2M,
                                     (mid[1]-x["geo"][1])*LAT2M), x) for x in pts),
                       key=lambda t: t[0])
            known = any(w in m for w in AGUA)
            tag = ("coincide con" if d < 25 else
                   "cerca de" if d < 80 else
                   ("NUEVO — falta en la red · lo más cercano" if known
                    else "sin identificar · lo más cercano"))
            print(f"    {a}–{b}: {tag} {n['nombre']} ({d:.0f} m)")

    if sin_agua:
        print("  ⚠ potreros sin bebedero mapeado (fuente por confirmar):")
        for i, ha, why in sin_agua:
            print(f"      Potrero {i}: {ha:5.2f} ha — {why}")
    tot = sum(a for a, _ in polys) / 10000
    print(f"  {len(polys)} potreros cerrados · {tot:.1f} ha en total"
          + (f"  ({fuera} descartados por caer fuera del lindero)" if fuera else ""))
    for i, (a, _) in enumerate(polys[:8], 1):
        print(f"      Potrero {i}: {a/10000:6.2f} ha")
    print(f"  {len(dfeats)} extremos de cerca sin conectar → cercas-abiertas.geojson")


if __name__ == "__main__":
    main()
