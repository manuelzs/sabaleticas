const D = /*__DATA__*/;
const B = D.bounds, cv = document.getElementById('cv'), cx = cv.getContext('2d');
/* header comes from farm.json + the cadastral boundary — never hard-coded here */
document.getElementById('fname').textContent = D.farm.name;
document.getElementById('fsub').textContent  = D.farm.subtitle;
document.title = D.farm.name + ' — visor';
addEventListener('load',()=>capSave());
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

/* Slope from the terrain grid itself, not from the contours — the contours were
   derived from this grid, so going back to it is strictly more information.
   Horn's 3x3 operator, the standard GIS estimator. */
function slopeAt(lon,lat){
  const d=D.dem; if(!d) return null;
  const i=Math.round((lon-d.minx)/d.dlon), j=Math.round((lat-d.miny)/d.dlat);
  if(i<1||j<1||j>=d.ny-1||i>=d.nx-1) return null;
  const w=[[-1,0,1].map(a=>d.grid[j-1][i+a]),
           [-1,0,1].map(a=>d.grid[j  ][i+a]),
           [-1,0,1].map(a=>d.grid[j+1][i+a])];
  for(const r of w) for(const v of r) if(v==null) return null;
  const cxm=d.dlon*LON2M, cym=d.dlat*LAT2M;
  const dzdx=((w[0][2]+2*w[1][2]+w[2][2])-(w[0][0]+2*w[1][0]+w[2][0]))/(8*cxm);
  const dzdy=((w[2][0]+2*w[2][1]+w[2][2])-(w[0][0]+2*w[0][1]+w[0][2]))/(8*cym);
  const g=Math.hypot(dzdx,dzdy);
  return {deg: Math.atan(g)*180/Math.PI, pct: g*100};
}

