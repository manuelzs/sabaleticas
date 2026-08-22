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
    for f in cercas_propias(write=False):
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


def node_lines(lines, tol=TOL, extra=()):
    """Split every segment where another line's endpoint lands on it.

    This is the whole problem. IGAC's fences genuinely meet — one ends *on* another —
    but the junction is not a vertex on the line being touched, so a naive graph never
    sees it. 57 of 60 loose ends sit within 5 m of another fence, median 0 m: they are
    touching, not gapped. Noding turns a pile of fragments into a connected network.
    """
    ends = list(extra)
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


def cercas_propias(write=True):
    """Split IGAC's fences into ours and the neighbours'.

    A fence with any vertex inside the boundary is ours. So is one lying just outside it —
    a perimeter fence is built on the line, not on the surveyor's idea of it, so a few
    metres of offset is normal. Beyond that it is somebody else's paddock and only creates
    faces we then have to discard.

    The split is clean here: 9 fences sit within 10 m of the boundary, 8 sit beyond 50 m,
    and nothing lies between. The raw IGAC download is never modified.
    """
    bnd = json.loads((GEO / "boundary.geojson").read_text(encoding="utf-8"))
    polys = []
    for f in bnd["features"]:
        g = f["geometry"]
        polys += [g["coordinates"]] if g["type"] == "Polygon" else g["coordinates"]

    def d_bnd(p):
        best = 1e9
        for poly in polys:
            for ring in poly:
                for i in range(len(ring) - 1):
                    a, b = ring[i], ring[i + 1]
                    ax, ay = a[0] * LON2M, a[1] * LAT2M
                    bx, by = b[0] * LON2M, b[1] * LAT2M
                    px, py = p[0] * LON2M, p[1] * LAT2M
                    dx, dy = bx - ax, by - ay
                    dd = dx * dx + dy * dy
                    t = 0.0 if dd == 0 else max(0.0, min(1.0,
                        ((px - ax) * dx + (py - ay) * dy) / dd))
                    best = min(best, math.hypot(px - (ax + t * dx), py - (ay + t * dy)))
        return best

    # Manual exclusions: a fence the rule keeps but Manuel knows is not ours. Named by
    # the number of a loose end on it, which is how he can point at one on the map.
    excl_pts = []
    f_ex = GEO / "cercas-excluidas.json"
    if f_ex.exists():
        reg = {}
        f_r = GEO / "cercas-numeracion.json"
        if f_r.exists():
            reg = json.loads(f_r.read_text(encoding="utf-8"))["puntos"]
        for e in json.loads(f_ex.read_text(encoding="utf-8"))["excluir"]:
            p = reg.get(str(e["por_extremo"])) if "por_extremo" in e else e.get("punto")
            if p:
                excl_pts.append((tuple(p), e.get("motivo", "")))

    cer = json.loads((GEO / "igac-1to5000/Cerca.geojson").read_text(encoding="utf-8"))
    ours, theirs = [], []
    for f in cer["features"]:
        g = f["geometry"]
        ls = [g["coordinates"]] if g["type"] == "LineString" else g["coordinates"]
        pts = [tuple(c[:2]) for l in ls for c in l]
        dentro = any(inside(p, [polys[i]]) for p in pts for i in range(len(polys)))
        # A real perimeter fence HUGS the boundary along its length. Brushing it at one
        # point does not make it ours: a 2,183 m neighbour's fence was qualifying on a
        # single vertex within 10 m, with none of the other 65 inside anything.
        pegado = sum(1 for p in pts if d_bnd(p) <= 10.0) / len(pts)
        keep = dentro or pegado >= 0.5
        for q, mot in excl_pts:
            if any(math.hypot((p[0] - q[0]) * LON2M, (p[1] - q[1]) * LAT2M) < 2.0 for p in pts):
                keep = False
        (ours if keep else theirs).append(f)
    if write:
        (GEO / "cercas-propias.geojson").write_text(
            json.dumps({"type": "FeatureCollection", "features": ours}, indent=1,
                       ensure_ascii=False), encoding="utf-8")
        print(f"  cercas: {len(ours)} propias, {len(theirs)} del vecino (descartadas)")
    return ours


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


def sirve_a(ring, pts, tol=8.0):
    """Which point features serve this enclosure — inside it, or on its edge.

    Both cases are real and neither is a rule. A trough or saladero built ON a boundary
    serves several paddocks; an older one sits in the MIDDLE of a single enclosure, and a
    trough can sit anywhere at all if that is where the land needed it `[owner, 2026-08-22]`.
    So the test is "inside, or ON the ring" — not "inside, or anywhere nearby".

    `tol` is for coordinate error, not for reach. At 25 m a saladero 21 m outside a paddock
    was being credited to it; a feature that genuinely shares a boundary reads 0.0 m.
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
    out = []
    for p in pts:
        g = p.get("geo")
        if not g:
            continue
        dentro = inside(g, [[ring]])
        d = d_ring(g)
        if dentro or d <= tol:
            out.append({"id": p.get("id"), "nombre": p.get("nombre"),
                        "donde": "dentro" if dentro else "en el lindero",
                        "confianza": p.get("pos_confianza", "?")})
    return out


def agua_de(ring, net, drenajes, depositos, tol=8.0):
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

    cercas_propias()
    lines, n_cerca = load_lines(tag=True)

    # A gap does not always close onto another gap. Often a fence simply RUNS ON and
    # meets another fence in a T. The faithful move is to continue it in its own
    # direction until it hits something — not to drop a perpendicular, which would
    # invent a corner that is not there. Written as [13, "@extend"].
    # Closures can also name an ENTITY: [13, "agua:beb-3"]. Several fences meeting at a
    # trough is the common case, and saying so records WHY they meet — which a pair of
    # numbers or a bare geometric extension does not.
    ents = {}
    wn = GEO / "water-network.json"
    if wn.exists():
        for n in json.loads(wn.read_text(encoding="utf-8"))["nodes"]:
            if n.get("geo"):
                ents[n["id"]] = tuple(n["geo"])
    gi = GEO / "ganado-infraestructura.geojson"
    if gi.exists():
        for f in json.loads(gi.read_text(encoding="utf-8"))["features"]:
            if f["properties"].get("_id"):
                ents[f["properties"]["_id"]] = tuple(f["geometry"]["coordinates"])

    f_reg0 = GEO / "cercas-numeracion.json"
    reg0 = json.loads(f_reg0.read_text(encoding="utf-8"))["puntos"] if f_reg0.exists() else {}
    ext_pts, ext_for = [], {}
    f_c0 = GEO / CIERRES
    if f_c0.exists():
        for c in json.loads(f_c0.read_text(encoding="utf-8"))["cierres"]:
            if c[1] in ents:
                ext_pts.append(ents[c[1]])
                continue
            if c[1] != "@extend":
                continue
            p = reg0.get(str(c[0]))
            if not p:
                continue
            p = tuple(p)
            # the fence's own heading, from the vertex before its loose end
            # the registry holds the SNAPPED position, which need not equal any raw
            # vertex — match by proximity, not equality
            def near(q):
                return math.hypot((q[0] - p[0]) * LON2M, (q[1] - p[1]) * LAT2M) <= TOL
            hd = None
            for l in lines:
                if len(l) < 2:
                    continue
                if near(l[0]):
                    hd = (l[0][0] - l[1][0], l[0][1] - l[1][1])
                elif near(l[-1]):
                    hd = (l[-1][0] - l[-2][0], l[-1][1] - l[-2][1])
                if hd:
                    p = l[0] if near(l[0]) else l[-1]      # use the real vertex
                    break
            if not hd:
                print(f"  ⚠ extender {c[0]}: no se halló la cerca de origen")
                continue
            hx, hy = hd[0] * LON2M, hd[1] * LAT2M
            n_ = math.hypot(hx, hy) or 1.0
            hx, hy = hx / n_, hy / n_
            px, py = p[0] * LON2M, p[1] * LAT2M
            best, bt = None, 1e9
            for l in lines:
                for a, b in zip(l, l[1:]):
                    if a == p or b == p:
                        continue
                    ax, ay = a[0] * LON2M, a[1] * LAT2M
                    bx, by = b[0] * LON2M, b[1] * LAT2M
                    ex, ey = bx - ax, by - ay
                    den = hx * (-ey) - hy * (-ex)
                    if abs(den) < 1e-12:
                        continue
                    rx, ry = ax - px, ay - py
                    t = (rx * (-ey) - ry * (-ex)) / den      # along the ray
                    u = (hx * ry - hy * rx) / den            # along the segment
                    if t > 0.05 and 0.0 <= u <= 1.0 and t < bt:
                        bt, best = t, (px + hx * t, py + hy * t)
            # A straight extension only works if a fence actually crosses the ray. Often
            # the fence it should meet ENDS right there instead, so the ray slips past its
            # endpoint and runs on for hundreds of metres. Cap it, and fall back to the
            # nearest point on the nearest fence — at a few metres the two are the same
            # thing, and a 362 m edge is never what anyone meant.
            CAP, NEAR = 60.0, 20.0
            how = "cruce"
            if not best or bt > CAP:
                best, bd = None, NEAR
                for l in lines:
                    for a, b in zip(l, l[1:]):
                        if a == p or b == p:
                            continue
                        ax, ay = a[0] * LON2M, a[1] * LAT2M
                        bx, by = b[0] * LON2M, b[1] * LAT2M
                        dx, dy = bx - ax, by - ay
                        dd = dx * dx + dy * dy
                        t2 = 0.0 if dd == 0 else max(0.0, min(1.0,
                            ((px - ax) * dx + (py - ay) * dy) / dd))
                        fx, fy = ax + t2 * dx, ay + t2 * dy
                        d2 = math.hypot(px - fx, py - fy)
                        if d2 < bd:
                            bd, best, bt = d2, (fx, fy), d2
                how = "punto más cercano"
            if best:
                pt = (best[0] / LON2M, best[1] / LAT2M)
                ext_pts.append(pt)
                ext_for[c[0]] = (pt, bt)
                print(f"    extender {c[0]}: {bt:.1f} m ({how})")
            else:
                print(f"  ⚠ extender {c[0]}: nada por delante a menos de {CAP:.0f} m "
                      f"ni cerca a menos de {NEAR:.0f} m")

    before = sum(len(l) for l in lines)
    lines = node_lines(lines, extra=ext_pts)
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
    # The registry is the authority and is append-only: a number, once given, is never
    # reused — not when its gap closes and drops out of cercas-abiertas, and not when the
    # input fences change. Manuel dictates closures by number, so recycling one turns a
    # correct instruction into a 685 m edge. That happened once; hence this file.
    f_reg = GEO / "cercas-numeracion.json"
    reg = json.loads(f_reg.read_text(encoding="utf-8")) if f_reg.exists() \
        else {"puntos": {}}
    known = {(round(v[0], 6), round(v[1], 6)): int(k) for k, v in reg["puntos"].items()}
    num, taken = {}, set(known.values())
    for v in tips:
        p = (round(pos[v][0], 6), round(pos[v][1], 6))
        if p in known:
            num[v] = known[p]
    nxt = 1
    for v in tips:
        if v in num:
            continue
        while nxt in taken:
            nxt += 1
        num[v] = nxt
        taken.add(nxt)
        reg["puntos"][str(nxt)] = [round(pos[v][0], 6), round(pos[v][1], 6)]
    f_reg.write_text(json.dumps(reg, indent=1, ensure_ascii=False), encoding="utf-8")

    # closures reference numbers that may already be closed, so resolve through the registry
    by_num = {n: v for v, n in num.items()}
    for k, p in reg["puntos"].items():
        if int(k) in by_num:
            continue
        best, bd = None, 3.0
        for v in adj:
            d = math.hypot((pos[v][0] - p[0]) * LON2M, (pos[v][1] - p[1]) * LAT2M)
            if d < bd:
                best, bd = v, d
        if best is not None:
            by_num[int(k)] = best
    # closures dictated by Manuel, as graph edges
    cierres, hechos = [], 0
    f_c = GEO / CIERRES
    if f_c.exists():
        for c in json.loads(f_c.read_text(encoding="utf-8"))["cierres"]:
            a, b = c[0], c[1]
            motivo = c[2] if len(c) > 2 else ""
            es_cerca = bool(c[3]) if len(c) > 3 else False
            if b in ents:
                va = by_num.get(a)
                pt = ents[b]
                # The junction must sit exactly ON the entity. Snapping to whatever vertex
                # happens to be nearest put all three fences on a point 3.3 m west of the
                # trough, which drew as a dogleg — the fences meet AT the trough, so the
                # node goes there and is created if it does not exist.
                vb, bd2 = None, 0.5
                for v in adj:
                    d2 = math.hypot((pos[v][0] - pt[0]) * LON2M, (pos[v][1] - pt[1]) * LAT2M)
                    if d2 < bd2:
                        vb, bd2 = v, d2
                if vb is None:
                    vb = ("ent", b)
                    pos[vb] = pt
                    adj.setdefault(vb, set())
                if va is None:
                    print(f"  ⚠ {a} → {b}: no se pudo enganchar")
                    continue
                d_m = math.hypot((pos[vb][0] - pos[va][0]) * LON2M,
                                 (pos[vb][1] - pos[va][1]) * LAT2M)
                flag = "  ⚠ muy largo" if d_m > 60 else ""
                print(f"    {a} → {b}: {d_m:6.1f} m{flag}")
                adj[va].add(vb)
                adj[vb].add(va)
                cierres.append((a, b.split(":")[-1], pos[va], pos[vb], motivo, round(d_m), es_cerca))
                hechos += 1
                continue
            if b == "@extend":
                tgt = ext_for.get(a)
                if not tgt:
                    print(f"  ⚠ extender {a}: sin objetivo")
                    continue
                pt, dist = tgt
                va = by_num.get(a)
                vb, bd2 = None, 3.0
                for v in adj:
                    d2 = math.hypot((pos[v][0] - pt[0]) * LON2M, (pos[v][1] - pt[1]) * LAT2M)
                    if d2 < bd2:
                        vb, bd2 = v, d2
                if va is None or vb is None:
                    print(f"  ⚠ extender {a}: no se pudo enganchar")
                    continue
                adj[va].add(vb)
                adj[vb].add(va)
                cierres.append((a, "→", pos[va], pos[vb], motivo, round(dist), es_cerca))
                hechos += 1
                continue
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
            cierres.append((a, b, pos[va], pos[vb], motivo, round(d_m), es_cerca))
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

    # Names attach to a POINT, not to a number. Ranking is by area and reshuffles the
    # moment a new enclosure closes, so a name bound to "Potrero 2" would wander.
    f_nom = GEO / "potreros-nombres.json"
    nombres = json.loads(f_nom.read_text(encoding="utf-8"))["nombres"] \
        if f_nom.exists() else []

    # salt points, from the cattle-infrastructure layer
    saladeros = []
    fg = GEO / "ganado-infraestructura.geojson"
    if fg.exists():
        for f in json.loads(fg.read_text(encoding="utf-8"))["features"]:
            if f["properties"].get("tipo") == "saladero":
                saladeros.append({"id": f["properties"].get("_id"),
                                  "nombre": f["properties"].get("nombre"),
                                  "pos_confianza": f["properties"].get("pos_confianza"),
                                  "geo": f["geometry"]["coordinates"]})

    feats = []
    sin_agua = []
    sin_sal = []
    for i, (a, ring) in enumerate(polys, 1):
        fuentes = agua_de(ring, net, dre, dep)
        sal = sirve_a(ring, saladeros)
        if not sal:
            sin_sal.append(i)
        # No mapped trough is NOT the same as "watered by the creek". It may mean the
        # paddock really relies on the quebrada — which matters, because in a verano the
        # creek may not be there — or simply that we have not mapped its trough yet.
        # Both stay open until Manuel says which.
        conducida = [f for f in fuentes if f["tipo"] != "natural"]
        if not fuentes:
            sin_agua.append((i, a / 10000, "ninguna fuente conocida — POR CONFIRMAR"))
        elif not conducida:
            sin_agua.append((i, a / 10000, "sin bebedero mapeado — POR CONFIRMAR"))
        prop = next((n for n in nombres if inside(n["punto"], [[ring]])), None)
        feats.append({"type": "Feature", "properties": {
            "tipo": "potrero",
            "nombre": prop["nombre"] if prop else f"Potrero {i}",
            "n": i, "nombrado": bool(prop),
            "area_ha": round(a / 10000, 2), "area_m2": round(a),
            "agua": fuentes,
            "sal": sal,
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
        "motivo": mot or "sin especificar", "es_cerca": _c,
        "fuente": "[owner] Cierre dictado por Manuel. No es una cerca física: cierra el "
                  "POTRERO, que es lo que importa para el ganado."},
        "geometry": {"type": "LineString", "coordinates": [
            [round(pa[0], 6), round(pa[1], 6)], [round(pb[0], 6), round(pb[1], 6)]]}}
        for a, b, pa, pb, mot, dm, _c in cierres]
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
        for a, b, pa, pb, mot, _, _c in cierres:
            m = (mot or "").lower()
            if _c:                                    # it is a fence, not a water point
                continue
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
    if saladeros:
        con = len(feats) - len(sin_sal)
        print(f"  saladero asignado: {con} de {len(feats)} potreros"
              + (f" (sin saladero MAPEADO: {', '.join(map(str, sin_sal))})" if sin_sal else ""))
    grandes = [f for f in feats if f["properties"]["area_ha"] >= 20]
    for f in grandes:
        f["properties"]["probable_resto"] = True
        f["properties"]["nota"] = (
            "⚠ Cara muy grande. Casi seguro NO es un potrero sino el RESTO todavía sin "
            "subdividir: las cercas interiores que lo parten aún tienen huecos abiertos. "
            "Se irá partiendo a medida que se cierren.")
    if grandes:
        print("  ⚠ caras ≥20 ha (probable resto sin subdividir): "
              + ", ".join(f'{f["properties"]["nombre"]} {f["properties"]["area_ha"]} ha'
                          for f in grandes))
    named = sum(1 for f in feats if f["properties"].get("nombrado"))
    if named:
        print(f"  con nombre: {named} de {len(feats)}")
    inf = [{"type": "Feature", "properties": {
        "tipo": "cerca_inferida", "nombre": f"Cerca {a}–{b}", "longitud_m": dm,
        "fuente": f"[owner] {mot}",
        "por_que_falta": "El IGAC no la capturó — normalmente porque el dosel tapa la vista."},
        "geometry": {"type": "LineString", "coordinates": [
            [round(pa[0], 6), round(pa[1], 6)], [round(pb[0], 6), round(pb[1], 6)]]}}
        for a, b, pa, pb, mot, dm, c_ in cierres if c_]
    (GEO / "cercas-inferidas.geojson").write_text(
        json.dumps({"type": "FeatureCollection", "features": inf}, indent=1,
                   ensure_ascii=False), encoding="utf-8")
    if inf:
        print(f"  cercas reales que el IGAC no vio: {len(inf)}")

    tot = sum(a for a, _ in polys) / 10000
    print(f"  {len(polys)} potreros cerrados · {tot:.1f} ha en total"
          + (f"  ({fuera} descartados por caer fuera del lindero)" if fuera else ""))
    for i, (a, _) in enumerate(polys[:8], 1):
        print(f"      Potrero {i}: {a/10000:6.2f} ha")
    print(f"  {len(dfeats)} extremos de cerca sin conectar → cercas-abiertas.geojson")


if __name__ == "__main__":
    main()
