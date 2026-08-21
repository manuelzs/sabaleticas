"""Build a self-contained local map viewer for the farm.

Stdlib only. Reads the canonical GeoJSON in operations/land/geo/, the IGAC
1:5000 layers, and the sampled terrain grid, and writes a single HTML file
that opens straight from disk — no server, no internet, no install.

The orthophoto is referenced relatively (it stays a JPEG next to the HTML)
rather than inlined, so the file stays small enough to open instantly.
"""
import json
from pathlib import Path

# Geographic bounds of the orthophoto, matching the .jgw world files.
BOUNDS = dict(minx=-75.620699, miny=5.791309, maxx=-75.600434, maxy=5.809376)

# name -> (file, kind, colour, width, fill)
LAYERS = [
    ("Linderos",        "boundary.geojson",                 "poly", "#ff1744", 3.0, None),
    ("Cercas (IGAC ⚠ parcial)", "igac-1to5000/Cerca.geojson", "line", "#ffd54f", 1.6, None),
    ("Drenajes",        "igac-1to5000/Drenaje.geojson",     "line", "#4fc3f7", 1.4, None),
    ("Cauces (área)",   "igac-1to5000/Drenaje_R.geojson",   "poly", "#29b6f6", 1.0, "rgba(41,182,246,.35)"),
    ("Depósitos de agua","igac-1to5000/Deposito_Agua_R.geojson","poly","#00e5ff", 2.0, "rgba(0,229,255,.45)"),
    ("Bosque",          "igac-1to5000/Bosque.geojson",      "poly", "#66bb6a", 1.0, "rgba(102,187,106,.20)"),
    ("Vías",            "igac-1to5000/Vias.geojson",        "line", "#ffffff", 1.4, None),
    ("Construcciones",  "igac-1to5000/Construccion_R.geojson","poly","#ff8a65", 1.5, "rgba(255,138,101,.6)"),
    ("Curvas de nivel", "igac-1to5000/Curva_Nivel.geojson",  "line", "#bcaaa4", 0.8, None),
    ("Vecinos",         "neighbours.geojson",               "poly", "#b0bec5", 1.2, None),
]
# Layers that start switched on.
DEFAULT_ON = {"Linderos", "Cercas (IGAC ⚠ parcial)", "Drenajes", "Depósitos de agua"}


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


def _thin(coords, depth=0):
    """Walk a GeoJSON coordinate tree and simplify every ring/line in it."""
    if not isinstance(coords, list) or not coords:
        return coords
    if isinstance(coords[0], (int, float)):
        return coords
    if isinstance(coords[0], list) and coords[0] and isinstance(coords[0][0], (int, float)):
        out = _rdp([list(c[:2]) for c in coords], SIMPLIFY_TOL)
        return out if len(out) >= 2 else coords
    return [_thin(c, depth + 1) for c in coords]


def _round_geom(coords, dp=6):
    if isinstance(coords, list):
        if coords and isinstance(coords[0], (int, float)):
            return [round(float(v), dp) for v in coords[:2]]
        return [_round_geom(c, dp) for c in coords]
    return coords


def _collect(geo_dir: Path):
    """Load each layer down to bare geometry + a display label."""
    out = []
    for name, rel, kind, colour, width, fill in LAYERS:
        path = geo_dir / rel
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
            label = (props.get("name") or props.get("NOMBRE")
                     or props.get("DIRECCION") or "")
            feats.append({"t": g["type"],
                          "c": _round_geom(_thin(g["coordinates"])),
                          "l": str(label)[:60]})
        if feats:
            out.append({"name": name, "kind": kind, "colour": colour,
                        "width": width, "fill": fill, "on": name in DEFAULT_ON,
                        "features": feats})
    return out


def build(root: Path) -> Path:
    geo = root / "operations" / "land" / "geo"
    layers = _collect(geo)
    dem_path = geo / "terrain-grid.json"
    dem = json.loads(dem_path.read_text()) if dem_path.exists() else None
    # Gap-filled composite preferred; fall back to the pure IGAC ortho.
    ortho = ""
    for cand in ("orthophoto.jpg", "orthophoto-igac-05m.jpg"):
        if (geo / cand).exists():
            ortho = cand
            break

    payload = json.dumps({"bounds": BOUNDS, "layers": layers, "dem": dem,
                          "ortho": ortho}, separators=(",", ":"))
    out = geo / "viewer.html"
    out.write_text(HTML.replace("/*__DATA__*/", payload), encoding="utf-8")
    return out


HTML = r"""<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<title>Hacienda Sabaleticas — visor</title>
<style>
 :root{--bg:#12161a;--panel:#1b2128;--ink:#e6edf3;--muted:#8b98a5;--line:#2c343d}
 *{box-sizing:border-box} html,body{margin:0;height:100%;overflow:hidden;
   background:var(--bg);color:var(--ink);font:13px/1.45 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
 #wrap{position:fixed;inset:0}
 canvas{position:absolute;inset:0;cursor:crosshair;display:block}
 .panel{position:absolute;background:var(--panel);border:1px solid var(--line);
   border-radius:10px;box-shadow:0 6px 24px rgba(0,0,0,.45)}
 #side{top:12px;left:12px;width:232px;padding:12px 14px}
 #side h1{margin:0 0 2px;font-size:14px;letter-spacing:.2px}
 #side .sub{color:var(--muted);font-size:11px;margin-bottom:10px}
 label{display:flex;align-items:center;gap:8px;padding:3px 0;cursor:pointer}
 label input{accent-color:#4fc3f7;margin:0}
 .sw{width:14px;height:4px;border-radius:2px;flex:none}
 #read{bottom:12px;left:12px;padding:9px 12px;font-variant-numeric:tabular-nums;min-width:232px}
 #read b{color:var(--muted);font-weight:500}
 #tools{top:12px;right:12px;padding:10px 12px;width:222px}
 button{background:#263039;color:var(--ink);border:1px solid var(--line);
   border-radius:7px;padding:5px 9px;font:inherit;cursor:pointer}
 button:hover{background:#2f3b46}
 button.on{background:#0b5c72;border-color:#0e7f9c}
 #mout{margin-top:8px;color:var(--muted);font-size:12px;line-height:1.5}
 #mout .big{color:var(--ink);font-size:13px}
 .hint{color:var(--muted);font-size:11px;margin-top:6px}
 #scale{position:absolute;bottom:14px;right:14px;text-align:center;color:#fff;
   text-shadow:0 1px 3px #000;font-size:11px}
 #scale div{height:5px;border:2px solid #fff;border-top:none}
</style></head><body><div id="wrap">
<canvas id="cv"></canvas>

<div class="panel" id="side">
  <h1>Hacienda Sabaleticas</h1>
  <div class="sub">151.85 ha · La Pintada, Antioquia</div>
  <div id="layers"></div>
  <div class="hint">Arrastra para mover · rueda para zoom</div>
  <div class="hint">⚠ Las <b>cercas</b> del IGAC están incompletas: faltan muchas y varios
  potreros no cierran. Sirven de esqueleto, no son el mapa de potreros.</div>
</div>

<div class="panel" id="tools">
  <button id="btnMeasure">Medir</button>
  <button id="btnClear">Limpiar</button>
  <button id="btnReset">Vista inicial</button>
  <div id="mout">Pulsa <b>Medir</b> y haz clic en dos o más puntos.</div>
</div>

<div class="panel" id="read">
  <div><b>lat</b> <span id="rlat">—</span> &nbsp; <b>lon</b> <span id="rlon">—</span></div>
  <div><b>altura</b> <span id="rele">—</span></div>
</div>

<div id="scale"><div id="sbar" style="width:100px"></div><span id="slab">—</span></div>
</div>
<script>
const D = /*__DATA__*/;
const B = D.bounds, cv = document.getElementById('cv'), cx = cv.getContext('2d');
let W=0,H=0, view={x:0,y:0,s:1}, img=null, measuring=false, pts=[];

/* ---- projection: plate carrée, matching the orthophoto's world file ---- */
const LON2M = 111320*Math.cos((B.miny+B.maxy)/2*Math.PI/180), LAT2M = 110574;
function fx(lon){ return (lon-B.minx)/(B.maxx-B.minx); }
function fy(lat){ return 1-(lat-B.miny)/(B.maxy-B.miny); }
function toScreen(lon,lat){ return [fx(lon)*view.s+view.x, fy(lat)*view.s*aspect()+view.y]; }
function toGeo(px,py){
  return [B.minx+((px-view.x)/view.s)*(B.maxx-B.minx),
          B.miny+(1-(py-view.y)/(view.s*aspect()))*(B.maxy-B.miny)];
}
function aspect(){ return ((B.maxy-B.miny)*LAT2M)/((B.maxx-B.minx)*LON2M); }
function dist(a,b){
  const dx=(b[0]-a[0])*LON2M, dy=(b[1]-a[1])*LAT2M; return Math.hypot(dx,dy);
}

/* ---- terrain lookup ---- */
function elev(lon,lat){
  const d=D.dem; if(!d) return null;
  const i=Math.round((lon-d.minx)/d.dlon), j=Math.round((lat-d.miny)/d.dlat);
  if(i<0||j<0||j>=d.ny||i>=d.nx) return null;
  return d.grid[j][i];
}

/* ---- drawing ---- */
function ringPath(coords){
  cx.beginPath();
  for(let k=0;k<coords.length;k++){
    const p=toScreen(coords[k][0],coords[k][1]);
    k?cx.lineTo(p[0],p[1]):cx.moveTo(p[0],p[1]);
  }
}
function drawGeom(g,kind,fill){
  const t=g.t,c=g.c;
  const polys = t==='MultiPolygon'?c : t==='Polygon'?[c] : null;
  if(polys){
    for(const poly of polys){
      cx.beginPath();
      for(const ring of poly){
        for(let k=0;k<ring.length;k++){
          const p=toScreen(ring[k][0],ring[k][1]);
          k?cx.lineTo(p[0],p[1]):cx.moveTo(p[0],p[1]);
        }
        cx.closePath();
      }
      if(fill){cx.fillStyle=fill;cx.fill('evenodd');}
      cx.stroke();
    }
    return;
  }
  const lines = t==='MultiLineString'?c : t==='LineString'?[c] : [];
  for(const line of lines){ ringPath(line); cx.stroke(); }
}
function draw(){
  cx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  cx.clearRect(0,0,W,H);
  cx.fillStyle='#0d1114'; cx.fillRect(0,0,W,H);
  if(img){
    const a=toScreen(B.minx,B.maxy), b=toScreen(B.maxx,B.miny);
    cx.imageSmoothingQuality='high';
    cx.drawImage(img,a[0],a[1],b[0]-a[0],b[1]-a[1]);
  }
  for(const L of D.layers){
    if(!L.on) continue;
    cx.strokeStyle=L.colour; cx.lineWidth=L.width; cx.lineJoin='round';
    for(const f of L.features) drawGeom(f,L.kind,L.fill);
  }
  if(pts.length){
    cx.strokeStyle='#fff'; cx.lineWidth=2; cx.setLineDash([6,5]);
    cx.beginPath();
    pts.forEach((p,k)=>{const s=toScreen(p[0],p[1]); k?cx.lineTo(s[0],s[1]):cx.moveTo(s[0],s[1]);});
    cx.stroke(); cx.setLineDash([]);
    pts.forEach(p=>{const s=toScreen(p[0],p[1]);
      cx.fillStyle='#ff1744';cx.strokeStyle='#fff';cx.lineWidth=2;
      cx.beginPath();cx.arc(s[0],s[1],5,0,7);cx.fill();cx.stroke();});
  }
  scaleBar();
}
function scaleBar(){
  const per = view.s/((B.maxx-B.minx)*LON2M);      // px per metre
  let m=1; const targets=[10,25,50,100,250,500,1000,2000];
  for(const t of targets){ if(t*per<=130) m=t; }
  document.getElementById('sbar').style.width=(m*per)+'px';
  document.getElementById('slab').textContent = m>=1000?(m/1000)+' km':m+' m';
}

/* ---- interaction ---- */
function resize(){
  W=innerWidth;H=innerHeight;
  cv.width=W*devicePixelRatio;cv.height=H*devicePixelRatio;
  cv.style.width=W+'px';cv.style.height=H+'px';draw();
}
function reset(){
  const s=Math.min(W/1, H/aspect())*0.92;
  view={s:s, x:(W-s)/2, y:(H-s*aspect())/2}; draw();
}
let drag=null;
cv.addEventListener('mousedown',e=>{drag={x:e.clientX,y:e.clientY,vx:view.x,vy:view.y,moved:false};});
addEventListener('mouseup',e=>{
  if(drag && !drag.moved && measuring){
    pts.push(toGeo(e.clientX,e.clientY)); report(); draw();
  }
  drag=null;
});
addEventListener('mousemove',e=>{
  if(drag){
    if(Math.abs(e.clientX-drag.x)+Math.abs(e.clientY-drag.y)>3) drag.moved=true;
    view.x=drag.vx+(e.clientX-drag.x); view.y=drag.vy+(e.clientY-drag.y); draw();
  }
  const g=toGeo(e.clientX,e.clientY), z=elev(g[0],g[1]);
  document.getElementById('rlat').textContent=g[1].toFixed(6);
  document.getElementById('rlon').textContent=g[0].toFixed(6);
  document.getElementById('rele').textContent = z?z.toFixed(0)+' m':'sin dato';
});
cv.addEventListener('wheel',e=>{
  e.preventDefault();
  const k=Math.exp(-e.deltaY*0.0016), old=view.s;
  view.s=Math.max(200,Math.min(400000,view.s*k));
  const r=view.s/old;
  view.x=e.clientX-(e.clientX-view.x)*r;
  view.y=e.clientY-(e.clientY-view.y)*r;
  draw();
},{passive:false});

function report(){
  const o=document.getElementById('mout');
  if(pts.length<2){o.innerHTML='Punto 1 marcado. Haz clic en el siguiente.';return;}
  let tot=0; for(let i=1;i<pts.length;i++) tot+=dist(pts[i-1],pts[i]);
  const a=elev(pts[0][0],pts[0][1]), b=elev(pts[pts.length-1][0],pts[pts.length-1][1]);
  let h='<div class="big"><b>distancia</b> '+(tot>=1000?(tot/1000).toFixed(2)+' km':tot.toFixed(0)+' m')+'</div>';
  if(a!=null&&b!=null){
    const d=b-a;
    h+='<div class="big"><b>desnivel</b> '+(d>0?'+':'')+d.toFixed(0)+' m</div>';
    h+='<div>'+(d<-2
      ? '↓ baja '+Math.abs(d).toFixed(0)+' m — <b>fluye por gravedad</b>'
      : d>2 ? '↑ sube '+d.toFixed(0)+' m — <b>necesita bombeo</b>'
            : 'prácticamente al mismo nivel')+'</div>';
    if(tot>0&&Math.abs(d)>0) h+='<div><b>pendiente</b> '+(100*d/tot).toFixed(1)+'%</div>';
  }
  o.innerHTML=h;
}
document.getElementById('btnMeasure').onclick=e=>{
  measuring=!measuring; e.target.classList.toggle('on',measuring);
  document.getElementById('mout').innerHTML = measuring
    ? 'Haz clic en dos o más puntos.' : 'Pulsa <b>Medir</b> y haz clic en dos o más puntos.';
};
document.getElementById('btnClear').onclick=()=>{pts=[];report();draw();
  document.getElementById('mout').innerHTML='Pulsa <b>Medir</b> y haz clic en dos o más puntos.';};
document.getElementById('btnReset').onclick=reset;

const box=document.getElementById('layers');
D.layers.forEach((L,i)=>{
  const id='L'+i;
  box.insertAdjacentHTML('beforeend',
    `<label><input type="checkbox" id="${id}" ${L.on?'checked':''}>
     <span class="sw" style="background:${L.colour}"></span>${L.name}</label>`);
  setTimeout(()=>document.getElementById(id).onchange=e=>{L.on=e.target.checked;draw();});
});

addEventListener('resize',resize);
if(D.ortho){
  img=new Image();
  img.onload=()=>{resize();reset();};
  img.onerror=()=>{img=null;resize();reset();};
  img.src=D.ortho;
} else { resize(); reset(); }
</script></body></html>
"""
