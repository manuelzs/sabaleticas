"""Build the farm dashboard from the canonical geodata.

Stdlib only. Reads the GeoJSON in operations/land/geo/ plus the terrain grid,
injects them into the HTML/JS template in dashboard/, and writes the finished
page there.

The output opens straight from disk — no server, no internet, no install, and
no mapping library. The 2D map is the primary view; 3D terrain is an optional
toggle inside the same page.

The orthophoto is referenced relatively so the page stays small. The 3D
texture must be inlined as a data URI: WebGL refuses to sample a file:// image
into a texture (cross-origin), so a downscaled copy ships inside the HTML.
"""
import base64
import json
from pathlib import Path

# Geographic bounds of the orthophoto, matching the .jgw world files.
BOUNDS = dict(minx=-75.620699, miny=5.791309, maxx=-75.600434, maxy=5.809376)

GEO_REL = "../operations/land/geo"          # dashboard/ -> geo/, as the browser sees it

# label, file (relative to geo/), kind, colour, width, fill
LAYERS = [
    ("Linderos",                "boundary.geojson",                    "poly", "#ff1744", 3.0, None),
    ("Cercas (IGAC ⚠ parcial)", "igac-1to5000/Cerca.geojson",          "line", "#ff2ecc", 1.7, None),
    ("Drenajes",                "igac-1to5000/Drenaje.geojson",        "line", "#4fc3f7", 1.4, None),
    ("Cauces (área)",           "igac-1to5000/Drenaje_R.geojson",      "poly", "#29b6f6", 1.0, "rgba(41,182,246,.35)"),
    ("Depósitos de agua",       "igac-1to5000/Deposito_Agua_R.geojson","poly", "#00e5ff", 2.0, "rgba(0,229,255,.45)"),
    ("Agua: infraestructura",   "water-infrastructure.geojson",        "line", "#b388ff", 2.6, None),
    ("Curvas 5 m",              "contours-5m.geojson",                 "line", "#c9a227", 0.6, None),
    ("Curvas 25 m",             "contours-25m.geojson",                "line", "#ffb74d", 1.4, None),
    ("Bosque",                  "igac-1to5000/Bosque.geojson",         "poly", "#66bb6a", 1.0, "rgba(102,187,106,.20)"),
    ("Vías",                    "igac-1to5000/Vias.geojson",           "line", "#ffffff", 1.4, None),
    ("Construcciones",          "igac-1to5000/Construccion_R.geojson", "poly", "#ff8a65", 1.5, "rgba(255,138,101,.6)"),
    ("Vecinos",                 "neighbours.geojson",                  "poly", "#b0bec5", 1.2, None),
]
DEFAULT_ON = {"Linderos", "Cercas (IGAC ⚠ parcial)", "Drenajes",
              "Depósitos de agua", "Curvas 25 m", "Agua: infraestructura"}

# ~2 m at this latitude. Plenty for a screen that never shows better than 0.5 m/px.
SIMPLIFY_TOL = 0.00002


def _rdp(pts, tol):
    """Ramer-Douglas-Peucker. Keeps shape, drops redundant vertices."""
    if len(pts) < 3:
        return pts
    ax, ay = pts[0]
    bx, by = pts[-1]
    dx, dy = bx - ax, by - ay
    den = dx * dx + dy * dy
    worst, idx = -1.0, 0
    for i in range(1, len(pts) - 1):
        px, py = pts[i]
        if den == 0:
            d = (px - ax) ** 2 + (py - ay) ** 2
        else:
            t = ((px - ax) * dx + (py - ay) * dy) / den
            t = 0.0 if t < 0 else 1.0 if t > 1 else t
            d = (px - ax - t * dx) ** 2 + (py - ay - t * dy) ** 2
        if d > worst:
            worst, idx = d, i
    if worst <= tol * tol:
        return [pts[0], pts[-1]]
    return _rdp(pts[:idx + 1], tol)[:-1] + _rdp(pts[idx:], tol)


def _thin(coords):
    """Walk a GeoJSON coordinate tree and simplify every ring/line in it."""
    if not isinstance(coords, list) or not coords:
        return coords
    if isinstance(coords[0], (int, float)):
        return coords
    if isinstance(coords[0], list) and coords[0] and isinstance(coords[0][0], (int, float)):
        out = _rdp([list(c[:2]) for c in coords], SIMPLIFY_TOL)
        return out if len(out) >= 2 else coords
    return [_thin(c) for c in coords]


def _round_geom(coords, dp=6):
    if isinstance(coords, list):
        if coords and isinstance(coords[0], (int, float)):
            return [round(float(v), dp) for v in coords[:2]]
        return [_round_geom(c, dp) for c in coords]
    return coords


# Per-feature symbology inside a layer, keyed on the `tipo` property. Without this every
# point in a layer renders identically — which had a casa reading as a tanque.
TIPO_COLOUR = {
    "tanque": "#00e5ff", "nacimiento": "#7cffcb", "bebedero": "#4dd0e1",
    "represa": "#0091ea", "rompecargas": "#ffd54f", "bocatoma": "#26c6da", "tuberia": "#b388ff",
    "casa": "#ff8a65", "potrero": "#ffee58",
    "derivacion": "#ff9100", "valvula": "#ffab40",
}

# Marker shape by type. Circles are reserved for tanks and the reservoir.
TIPO_SHAPE = {
    "tanque": "circle", "represa": "circle",
    "derivacion": "square", "valvula": "square", "rompecargas": "square",
    "nacimiento": "triangle", "bocatoma": "triangle",
    "bebedero": "diamond", "casa": "house",
}


def _collect(geo: Path):
    out = []
    for name, rel, kind, colour, width, fill in LAYERS:
        path = geo / rel
        if not path.exists():
            continue
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            continue
        feats = []
        for f in data.get("features", []):
            g = f.get("geometry") or {}
            if not g.get("coordinates"):
                continue
            props = f.get("properties") or {}
            label = props.get("name") or props.get("DIRECCION") or ""
            if not label and props.get("elev"):
                label = f"{props['elev']} m"
            item = {"t": g["type"], "c": _round_geom(_thin(g["coordinates"])),
                    "l": str(label)[:60]}
            tipo = props.get("tipo")
            if tipo in TIPO_COLOUR:
                item["col"] = TIPO_COLOUR[tipo]
                item["shp"] = TIPO_SHAPE.get(tipo, "circle")
                item["l"] = str(props.get("nombre") or label)[:60]
            feats.append(item)
        if feats:
            out.append({"name": name, "kind": kind, "colour": colour, "width": width,
                        "fill": fill, "on": name in DEFAULT_ON, "features": feats})
    return out


def _mesh(dem, step=2):
    """Downsample the terrain grid for the 3D mesh."""
    g, nx, ny = dem["grid"], dem["nx"], dem["ny"]
    ox, oy = nx // step, ny // step
    out = [[None] * ox for _ in range(oy)]
    for j in range(oy):
        for i in range(ox):
            vals = [g[j * step + b][i * step + a]
                    for b in range(step) for a in range(step)
                    if g[j * step + b][i * step + a] is not None]
            if vals:
                out[j][i] = round(sum(vals) / len(vals), 1)
    return {"grid": out, "nx": ox, "ny": oy}


def build(root: Path) -> Path:
    geo = root / "operations" / "land" / "geo"
    dash = root / "dashboard"
    tpl = dash / "map.template.html"
    if not tpl.exists():
        raise SystemExit(f"error: missing template {tpl}")

    dem_path = geo / "terrain-grid.json"
    dem = json.loads(dem_path.read_text()) if dem_path.exists() else None

    ortho = ""
    for cand in ("orthophoto.jpg", "orthophoto-igac-05m.jpg"):
        if (geo / cand).exists():
            ortho = f"{GEO_REL}/{cand}"
            break

    tex_path = geo / "texture-1280.jpg"
    tex = ("data:image/jpeg;base64," + base64.b64encode(tex_path.read_bytes()).decode()
           if tex_path.exists() else "")

    payload = json.dumps({
        "bounds": BOUNDS,
        "layers": _collect(geo),
        "dem": dem,
        "ortho": ortho,
        "mesh": _mesh(dem) if dem else None,
        "tex": tex,
    }, separators=(",", ":"))

    out = dash / "viewer.html"
    out.write_text(tpl.read_text(encoding="utf-8").replace("/*__DATA__*/", payload),
                   encoding="utf-8")
    return out
