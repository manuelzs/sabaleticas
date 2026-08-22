"""The water system as a graph, and the views generated from it.

`water-network.json` is canonical. Nodes and edges are joined by **id**, never by
name — connectivity used to live in feature names, which is how one string match
silently severed the north branch.

Everything derived is derived here, never stored: pipe length, elevation drop and
gradient all come from the node coordinates, so they cannot go stale when a node
moves. The same rule as the farm area in the page header.

Two views share this one source:
  * `to_geojson()`  -> the map, in lon/lat
  * the P&ID        -> a schematic, in x/y  (layout lives in `pid` on each node)
"""
import json
import math
from pathlib import Path

LON2M = 111320.0 * math.cos(math.radians(5.796))
LAT2M = 110574.0


def load(geo: Path):
    return json.loads((geo / "water-network.json").read_text(encoding="utf-8"))


def index(net):
    return {n["id"]: n for n in net["nodes"]}


def dist_m(a, b):
    return math.hypot((b[0] - a[0]) * LON2M, (b[1] - a[1]) * LAT2M)


def edge_geometry(net, e, by=None):
    """Full lon/lat path of an edge: node, any intermediate points, node."""
    by = by or index(net)
    return [by[e["from"]]["geo"]] + e.get("via", []) + [by[e["to"]]["geo"]]


def edge_metrics(net, e, by=None):
    """Length along the drawn path, drop and gradient. Always computed."""
    by = by or index(net)
    path = edge_geometry(net, e, by)
    length = sum(dist_m(path[i], path[i + 1]) for i in range(len(path) - 1))
    a, b = by[e["from"]].get("cota_m"), by[e["to"]].get("cota_m")
    drop = (a - b) if None not in (a, b) else None
    grad = (drop / length * 100) if drop is not None and length else None
    return length, drop, grad


def check(net):
    """Physical sanity. Water does not run uphill in a gravity system."""
    by, out = index(net), []
    for e in net["edges"]:
        length, drop, grad = edge_metrics(net, e, by)
        if drop is not None and drop < 0:
            out.append({
                "edge": e["id"], "from": e["from"], "to": e["to"],
                "problema": f"sube {abs(drop):.0f} m — imposible por gravedad",
                "detalle": f"{by[e['from']]['nombre']} ({by[e['from']]['cota_m']} m) → "
                           f"{by[e['to']]['nombre']} ({by[e['to']]['cota_m']} m)"})
    seen = {n["id"] for n in net["nodes"]}
    for e in net["edges"]:
        for side in ("from", "to"):
            if e[side] not in seen:
                out.append({"edge": e["id"], "problema": f"nodo inexistente: {e[side]}"})
    return out


def to_geojson(net):
    """Render the graph as the GeoJSON the map already knows how to draw."""
    by, feats = index(net), []
    for n in net["nodes"]:
        p = {"tipo": n.get("tipo", ""), "nombre": n.get("nombre", "")}
        if n.get("cota_m") is not None:
            p["altura_m"] = n["cota_m"]
        for k in ("pos_confianza", "pos_motivo"):
            if k in n:
                p[k] = n[k]
        p.update(n.get("props", {}))
        p["_id"] = n["id"]
        geom = ({"type": "Polygon", "coordinates": n["poligono"]} if "poligono" in n
                else {"type": "Point", "coordinates": n["geo"]})
        feats.append({"type": "Feature", "properties": p, "geometry": geom})
    for e in net["edges"]:
        length, drop, grad = edge_metrics(net, e, by)
        p = {"tipo": "tuberia", "nombre": e.get("nombre", e["id"]),
             "longitud_m": round(length)}
        if drop is not None:
            p["desnivel_m"] = round(drop, 1)
        if grad is not None:
            p["gradiente_pct"] = round(grad, 1)
        if e.get("estilo"):
            p["estilo"] = e["estilo"]
        p.update(e.get("props", {}))
        p["_id"] = e["id"]
        feats.append({"type": "Feature", "properties": p,
                      "geometry": {"type": "LineString",
                                   "coordinates": edge_geometry(net, e, by)}})
    return {"type": "FeatureCollection", "features": feats}


def write_geojson(geo: Path):
    """Regenerate water-infrastructure.geojson from the graph. Called on every build."""
    net = load(geo)
    (geo / "water-infrastructure.geojson").write_text(
        json.dumps(to_geojson(net), indent=1, ensure_ascii=False), encoding="utf-8")
    return net
