"""One-time migration: flat GeoJSON -> an explicit node/edge graph.

Connectivity was only ever encoded in feature *names* ("T-1 -> Bebedero 9"), which
is how a startswith match silently severed the north branch. This rebuilds the
network from geometry: every LineString endpoint is matched to the nearest node,
and lines that pass through a node are split into separate edges there.

Derived numbers (length, drop, gradient) are NOT carried over. They are computed
from the graph on render, so they can never go stale when a node moves.
"""
import json, math, re, unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "operations/land/geo/water-infrastructure.geojson"
OUT = ROOT / "operations/land/geo/water-network.json"

LON2M = 111320.0 * math.cos(math.radians(5.796))
LAT2M = 110574.0
SNAP_M = 2.0                      # a line endpoint this close to a node IS that node
DERIVED = {"longitud_m", "desnivel_m", "gradiente_pct"}   # recomputed, never stored

# Readable ids for the things we talk about constantly.
ID = {
    "Casa de la entrada": "casa-entrada",
    "Tanque principal 1": "tanque-alto-1",
    "Tanque principal 2": "tanque-alto-2",
    "Tanque rompecargas": "rompecargas",
    "Casa principal": "casa-principal",
    "Tanques intermedios": "tanques-intermedios",
    "Represa principal": "represa",
    "T del norte": "t-norte",
    "T-1 abajo de intermedios": "t-1",
    "T-2 abajo de intermedios": "t-2",
    "T-3 abajo de intermedios": "t-3",
    "T-4 arriba de intermedios": "t-4",
    "Ventosa": "ventosa-1",
}


def slug(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    s = re.sub(r"\(.*?\)", "", s).strip().lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def node_id(nombre):
    for k, v in ID.items():
        if nombre.startswith(k):
            return v
    m = re.match(r"Bebedero (\d+)", nombre)
    if m:
        return f"beb-{m.group(1)}"
    return slug(nombre)


def dm(a, b):
    return math.hypot((b[0] - a[0]) * LON2M, (b[1] - a[1]) * LAT2M)


def main():
    feats = json.loads(SRC.read_text(encoding="utf-8"))["features"]
    nodes, edges, warn = [], [], []

    for f in feats:
        g, p = f["geometry"], dict(f["properties"])
        if g["type"] not in ("Point", "Polygon"):
            continue
        nombre = p.pop("nombre", "")
        n = {"id": node_id(nombre), "tipo": p.pop("tipo", ""), "nombre": nombre,
             "cota_m": p.pop("altura_m", None)}
        if g["type"] == "Point":
            n["geo"] = [round(c, 6) for c in g["coordinates"]]
        else:                                   # the represa: a point plus its outline
            ring = g["coordinates"][0]
            n["geo"] = [round(sum(c[0] for c in ring) / len(ring), 6),
                        round(sum(c[1] for c in ring) / len(ring), 6)]
            n["poligono"] = g["coordinates"]
        for k in ("pos_confianza", "pos_motivo"):
            if k in p:
                n[k] = p.pop(k)
        n["props"] = {k: v for k, v in p.items() if k not in DERIVED}
        nodes.append(n)

    byid = {n["id"]: n for n in nodes}
    assert len(byid) == len(nodes), "duplicate node ids"

    def snap(pt):
        best, bd = None, SNAP_M
        for n in nodes:
            d = dm(n["geo"], pt)
            if d < bd:
                best, bd = n["id"], d
        return best

    for f in feats:
        g, p = f["geometry"], dict(f["properties"])
        if g["type"] != "LineString":
            continue
        nombre = p.pop("nombre", "")
        coords = g["coordinates"]
        hits = [(i, snap(c)) for i, c in enumerate(coords)]
        chain = [(i, nid) for i, nid in hits if nid]
        if len(chain) < 2:
            warn.append(f"{nombre}: only {len(chain)} endpoint(s) matched a node — skipped")
            continue
        props = {k: v for k, v in p.items() if k not in DERIVED}
        for (i0, a), (i1, b) in zip(chain[:-1], chain[1:]):
            via = [[round(c[0], 6), round(c[1], 6)] for c in coords[i0 + 1:i1]]
            e = {"id": f"{a}--{b}", "from": a, "to": b, "nombre": nombre}
            if via:
                e["via"] = via
            if p.get("estilo") == "discontinuo":
                e["estilo"] = "discontinuo"
            e["props"] = props
            edges.append(e)

    net = {"meta": {
        "descripcion": "Red hidráulica de Hacienda Sabaleticas como grafo explícito.",
        "regla": "La conectividad vive en from/to por ID, NUNCA en el nombre. "
                 "Longitudes, desniveles y gradientes se CALCULAN, no se guardan.",
        "generado_desde": "water-infrastructure.geojson, migración 2026-08-22",
        "vistas": "geo = mapa (lon/lat). pid = diagrama esquemático (x/y), aún sin asignar.",
    }, "nodes": nodes, "edges": edges}
    OUT.write_text(json.dumps(net, indent=1, ensure_ascii=False), encoding="utf-8")

    print(f"{len(nodes)} nodes, {len(edges)} edges -> {OUT.relative_to(ROOT)}")
    for w in warn:
        print("  WARN", w)
    print("\nedges:")
    for e in edges:
        a, b = byid[e["from"]], byid[e["to"]]
        d = dm(a["geo"], b["geo"])
        dz = (a["cota_m"] - b["cota_m"]) if None not in (a["cota_m"], b["cota_m"]) else None
        print(f"  {e['from']:>20s} -> {b['id']:<20s} {d:5.0f} m"
              + (f"  {dz:+4d} m  {dz/d*100:5.1f}%" if dz is not None and d else ""))
    orphans = [n["id"] for n in nodes
               if not any(e["from"] == n["id"] or e["to"] == n["id"] for e in edges)]
    print("\nnodes with no connection:", orphans or "none")


if __name__ == "__main__":
    main()
