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
import sys
from pathlib import Path

from . import network

# Farm identity and map extent live in farm.json, not here — one place to edit
# when this is pointed at a different farm.
GEO_REL = "../operations/land/geo"          # dashboard/ -> geo/, as the browser sees it

# Which subsystem each layer belongs to. The Finca view shows them all, grouped;
# a subsystem view shows only its own. See dashboard/ARCHITECTURE.md.
LAYER_GROUP = {
    "Linderos": "predio", "Cercas": "predio", "Vecinos (con nombre)": "predio",
    "Bosque": "predio", "Vías": "predio", "Construcciones": "predio",
    "Curvas 5 m": "predio", "Curvas 25 m": "predio",
    "Ganado: infraestructura": "ganado",
    "Cercas (bajo dosel)": "predio",
    "Potreros (cerrados)": "predio", "Cercas abiertas": "predio",
    "Cierres (dictados)": "predio",
    "Drenajes": "agua", "Cauces (área)": "agua", "Depósitos de agua": "agua",
    "Agua: infraestructura": "agua", "Ruta gravedad (candidata)": "agua",
}

# Never simplified: their vertices are the analysis, and the edge picker reports them
# back as coordinates we then act on.
EXACTAS = {"Linderos", "Cercas", "Cercas (bajo dosel)", "Potreros (cerrados)",
           "Cercas abiertas", "Cierres (dictados)", "Ganado: infraestructura",
           "Agua: infraestructura"}

# label, file (relative to geo/), kind, colour, width, fill
LAYERS = [
    ("Linderos",                "boundary.geojson",                    "poly", "#ff1744", 3.0, None),
    ("Cercas",                  "cercas-propias.geojson",              "line", "#ff2ecc", 1.7, None),
    ("Cercas (bajo dosel)",     "cercas-inferidas.geojson",            "line", "#ff8ae2", 1.7, None),
    ("Drenajes",                "igac-1to5000/Drenaje.geojson",        "line", "#4fc3f7", 1.4, None),
    ("Cauces (área)",           "igac-1to5000/Drenaje_R.geojson",      "poly", "#29b6f6", 1.0, "rgba(41,182,246,.35)"),
    ("Depósitos de agua",       "igac-1to5000/Deposito_Agua_R.geojson","poly", "#00e5ff", 2.0, "rgba(0,229,255,.45)"),
    ("Agua: infraestructura",   "water-infrastructure.geojson",        "line", "#b388ff", 2.6, None),
    ("Curvas 5 m",              "contours-5m.geojson",                 "line", "#f0cd7a", 0.9, None),
    ("Curvas 25 m",             "contours-25m.geojson",                "line", "#ffb74d", 1.4, None),
    ("Bosque",                  "igac-1to5000/Bosque.geojson",         "poly", "#66bb6a", 1.0, "rgba(102,187,106,.20)"),
    ("Vías",                    "igac-1to5000/Vias.geojson",           "line", "#ffffff", 1.4, None),
    ("Construcciones",          "igac-1to5000/Construccion_R.geojson", "poly", "#ff8a65", 1.5, "rgba(255,138,101,.6)"),
    ("Mojones 2007 (aprox.)",  "mojones-2007.geojson",                "line", "#ffd54f", 1.6, None),
    ("Vecinos (con nombre)",   "neighbours.geojson",                  "poly", "#b0bec5", 1.6, None),
    ("Ruta gravedad (candidata)","gravity-route-candidate.geojson",     "line", "#00e676", 3.0, None),
    # "poly", not "line": the layer holds the corral as a POLYGON, and a line-kind
    # layer never labels its polygons. Points in it are unaffected — drawGeom
    # branches on the geometry, not on the layer kind.
    ("Ganado: infraestructura", "ganado-infraestructura.geojson",     "poly", "#ce93d8", 2.0,
     "rgba(161,136,127,.22)"),
    ("Potreros (cerrados)",     "potreros-cerrados.geojson",           "poly", "#ffee58", 2.2, "rgba(255,238,88,.16)"),
    ("Cercas abiertas",         "cercas-abiertas.geojson",             "line", "#ff5252", 1.0, None),
    ("Cierres (dictados)",      "cercas-cierres.geojson",              "line", "#00e676", 2.6, None),
]
DEFAULT_ON = {"Linderos", "Cercas", "Cercas (bajo dosel)", "Potreros (cerrados)", "Cercas abiertas", "Cierres (dictados)",
              "Ganado: infraestructura", "Drenajes",
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


# Per-feature symbology comes from the single entity-type registry, so changing an
# icon is one line in dashboard/entity-types.json rather than five files.
def _types(dash: Path):
    f = dash / "entity-types.json"
    return json.loads(f.read_text(encoding="utf-8"))["tipos"] if f.exists() else {}


def _owners(geo: Path):
    """Hand-maintained owner names, keyed by matrícula. The cadastre omits owners."""
    f = geo / "neighbour-owners.json"
    if not f.exists():
        return {}
    try:
        return json.loads(f.read_text(encoding="utf-8")).get("predios", {})
    except Exception:
        return {}


def _farm(root: Path, geo: Path):
    """Farm identity for the page header.

    Area and municipios are *derived from the cadastral boundary*, never typed, so
    the header cannot drift out of step with the data the map draws. The farm has
    two parcels under one matrícula, in two different municipalities.
    """
    cfg = json.loads((root / "farm.json").read_text(encoding="utf-8"))
    feats = json.loads((geo / "boundary.geojson").read_text(encoding="utf-8")).get("features", [])
    area = sum((f.get("properties") or {}).get("area_ha") or 0 for f in feats)
    muni = []
    for f in feats:
        m = ((f.get("properties") or {}).get("municipio") or "").split(" (")[0].strip()
        if m and m not in muni:
            muni.append(m)
    cfg["area_ha"] = round(area, 2)
    cfg["municipios"] = muni
    where = " y ".join(muni) if muni else cfg.get("departamento", "")
    cfg["subtitle"] = f"{area:,.2f} ha · {where} · {cfg.get('departamento','')}".replace(",", " ")
    return cfg


def _series(path: Path):
    """The full time series per (entity, magnitude), oldest first.

    A herd count and a tank level are the same kind of thing: a value, an entity, a
    date. Keeping them in one series means a trend is one mechanism, not two.
    """
    if not path.exists():
        return {}
    import csv
    out = {}
    with path.open(encoding="utf-8") as f:
        for r in csv.DictReader(f):
            if not r.get("entidad") or not r.get("ts"):
                continue
            out.setdefault(f"{r['entidad']}|{r['magnitud']}", []).append(
                {k: (v or "") for k, v in r.items()})
    for v in out.values():
        v.sort(key=lambda r: r["ts"])
    return out


def _latest_readings(path: Path):
    """Most recent value per (entity, magnitude).

    A reading is entity + magnitude + value + when + how it was obtained. A hand-written
    one counts exactly as much as an automated one — only `origen` and the freshness we
    should expect differ. That is what lets the viewer show levels today, with no hardware.
    """
    if not path.exists():
        return {}
    import csv
    out = {}
    with path.open(encoding="utf-8") as f:
        for r in csv.DictReader(f):
            if not r.get("entidad") or not r.get("ts"):
                continue
            key = f"{r['entidad']}|{r['magnitud']}"
            if key not in out or r["ts"] > out[key]["ts"]:
                out[key] = {k: (v or "") for k, v in r.items()}
    return out


def _movements(path: Path):
    """GSMI movement guides, as issued. Nothing is filtered or filled in — several
    carry no head count at all, and that gap is worth seeing rather than hiding."""
    if not path.exists():
        return []
    import csv
    with path.open(encoding="utf-8") as f:
        return [{k: (v or "") for k, v in r.items()} for r in csv.DictReader(f)]


def _collect(geo: Path, TIPOS):
    out = []
    owners = _owners(geo)
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
            item_sub2, item_mal = None, False
            label = props.get("name") or props.get("DIRECCION") or ""
            if props.get("tipo") == "potrero" and props.get("area_ha"):
                # Manuel: nothing special on the ones he has confirmed, a marker on the
                # ones he has not. So a clean map is a finished map, and "not audited yet"
                # looks the same as "audited and wrong" — both still need him.
                est = props.get("estado")
                label = props.get("nombre", "")
                if est != "final":
                    label += " ?"
                # The area rides in the quiet third line, like the neighbours' — it is
                # reference, not headline. Bold yellow made every paddock shout its size.
                sub2 = f"{props['area_ha']} ha"
                if est and est != "final":
                    sub2 += f" · {est.replace('_', ' ')}"
                item_sub2, item_mal = sub2, est != "final"
            if props.get("lado") and props.get("area_ha"):      # neighbours: name / owner / side+area
                who = (owners.get(props.get("matricula") or "", {}) or {}).get("owner", "")
                label = (f"{props['name']} · {who}"
                         f" · {props['lado']} · {props['area_ha']} ha"
                         f" · {props.get('municipio','')}")
            if not label and props.get("elev"):
                label = f"{props['elev']} m"
            # Layers whose geometry is ANALYSED, not just looked at, are never thinned.
            # SIMPLIFY_TOL is ~2.2 m, which quietly drops near-collinear vertices — and it
            # drops different ones from different rings, so two potreros sharing a fence
            # rendered as two lines a few metres apart. Manuel reported that as a duplicate
            # edge to delete; nothing was wrong in the data, only in what the viewer showed.
            # Potreros, cercas and linderos come to ~1,500 vertices in total, so thinning
            # them buys nothing and costs the ability to point at a real edge.
            coords = g["coordinates"] if name in EXACTAS else _thin(g["coordinates"])
            item = {"t": g["type"], "c": _round_geom(coords),
                    "l": str(label)[:120], "kind": kind}
            if item_sub2 is not None:
                item["sub2"] = item_sub2
                if item_mal:
                    item["mal"] = 1        # unconfirmed: the NAME is coloured, not just marked
            for k, dst in (("sin_agua", "sinAgua"), ("agua_por_confirmar", "soloNatural"),
                           ("area_ha", "areaHa")):
                if props.get(k) is not None:
                    item[dst] = props[k]
            if props.get("_id"):
                item["eid"] = props["_id"]     # so readings can attach to this feature
            if props.get("estilo") == "discontinuo":   # unconfirmed connection
                item["dash"] = [9, 7]
            tipo = props.get("tipo")
            if tipo in TIPOS:
                item["col"] = TIPOS[tipo]["color"]
                item["shp"] = TIPOS[tipo].get("mapa", "circle")
                item["l"] = (label if props.get("tipo") == "potrero"
                             else str(props.get("nombre") or label))[:60]
            feats.append(item)
        if feats:
            out.append({"name": name, "kind": kind, "colour": colour, "width": width,
                        "fill": fill, "on": name in DEFAULT_ON, "features": feats,
                        "grupo": LAYER_GROUP.get(name, "predio")})
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
    # The water system is authored as a graph; the GeoJSON the map draws is
    # generated from it every build, so the two can never disagree.
    if (geo / "water-network.json").exists():
        net = network.write_geojson(geo)
        for p in network.check(net):
            print(f"  ⚠ {p['edge']}: {p['problema']}")
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

    sur_path = geo / "surroundings.json"
    surroundings = json.loads(sur_path.read_text()) if sur_path.exists() else None
    if surroundings and (geo / "surroundings.jpg").exists():
        surroundings["src"] = f"{GEO_REL}/surroundings.jpg"

    plano_path = geo / "plano-overlay.jpg"
    plano = ("data:image/jpeg;base64," + base64.b64encode(plano_path.read_bytes()).decode()
             if plano_path.exists() else "")

    tex_path = geo / "texture-1280.jpg"
    tex = ("data:image/jpeg;base64," + base64.b64encode(tex_path.read_bytes()).decode()
           if tex_path.exists() else "")

    tipos = _types(dash)
    farm = _farm(root, geo)
    net = json.loads((geo / "water-network.json").read_text(encoding="utf-8")) \
        if (geo / "water-network.json").exists() else None

    # Real-time data sources. Cross-cutting: they attach to entities by id, so a
    # reading can surface on the map and on the schematic without extra plumbing.
    src_f = root / "operations" / "sensors" / "sources.json"
    sources = json.loads(src_f.read_text(encoding="utf-8")) if src_f.exists() else None
    readings = _latest_readings(root / "data" / "readings.csv")
    series = _series(root / "data" / "readings.csv")
    herd_f = root / "data" / "herd.json"
    herd = json.loads(herd_f.read_text(encoding="utf-8")) if herd_f.exists() else None
    movements = _movements(root / "data" / "gsmi_movements.csv")

    payload = json.dumps({
        "farm": farm,
        "net": net,                       # the water graph, for the schematic view
        "sources": sources,               # data sources, automated and manual
        "readings": readings,             # latest value per entity+magnitude
        "series": series,                 # the whole history, for trends
        "herd": herd,                     # SINIGAN inventory snapshot
        "movements": movements,           # GSMI movement guides
        "tipos": tipos,                   # the single entity-type registry
        "bounds": farm["bounds"],
        "layers": _collect(geo, tipos),
        "dem": dem,
        "ortho": ortho,
        "mesh": _mesh(dem) if dem else None,
        "tex": tex,
        "plano": plano,
        "surroundings": surroundings,
    }, separators=(",", ":"))

    # The page is assembled from dashboard/src/*.js in filename order. ES modules
    # would be the normal answer, but file:// refuses to load them — and opening
    # straight off the disk is the one constraint we cannot give up. So the builder
    # concatenates: modular in the repo, a single file on disk, no build tooling.
    src = sorted((dash / "src").glob("*.js"))
    if not src:
        raise SystemExit(f"error: no sources in {dash / 'src'}")
    # There is no bundler and no type checker, so a function removed by a careless
    # block-replace fails only at runtime. Warn at build time instead.
    try:
        sys.path.insert(0, str(root / "scripts"))
        import check_js
        check_js.main(quiet=True)
    except Exception:
        pass
    js = "".join(f.read_text(encoding="utf-8") for f in src)

    out = dash / "viewer.html"
    out.write_text(
        tpl.read_text(encoding="utf-8").replace("/*__JS__*/", js).replace("/*__DATA__*/", payload),
        encoding="utf-8")
    return out
