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
  if(t==='Point'||t==='MultiPoint'){
    const ps = t==='Point'?[c]:c;
    const shp = g.shp || 'circle', r=6;
    for(const p of ps){
      const s=toScreen(p[0],p[1]); const [x,y]=s;
      cx.fillStyle=cx.strokeStyle; cx.beginPath();
      if(shp==='square')        cx.rect(x-r,y-r,2*r,2*r);
      else if(shp==='triangle'){cx.moveTo(x,y-r-1);cx.lineTo(x+r+1,y+r);cx.lineTo(x-r-1,y+r);cx.closePath();}
      else if(shp==='diamond'){ cx.moveTo(x,y-r-1);cx.lineTo(x+r+1,y);cx.lineTo(x,y+r+1);cx.lineTo(x-r-1,y);cx.closePath();}
      else if(shp==='house'){   cx.moveTo(x-r,y+r);cx.lineTo(x-r,y-1);cx.lineTo(x,y-r-2);
                                cx.lineTo(x+r,y-1);cx.lineTo(x+r,y+r);cx.closePath();}
      else if(shp==='vent'){    // ventosa: an arrow, for the air leaving the line
                                const w=r*0.40;
                                cx.moveTo(x,y-r-2); cx.lineTo(x+r,y-1); cx.lineTo(x+w,y-1);
                                cx.lineTo(x+w,y+r); cx.lineTo(x-w,y+r); cx.lineTo(x-w,y-1);
                                cx.lineTo(x-r,y-1); cx.closePath();}
      else                      cx.arc(x,y,r-0.5,0,7);
      cx.fill();
      cx.save(); cx.strokeStyle='#0b0e11'; cx.lineWidth=2; cx.stroke(); cx.restore();
    }
    return;
  }
  const lines = t==='MultiLineString'?c : t==='LineString'?[c] : [];
  for(const line of lines){ ringPath(line); cx.stroke(); }
}
/* ---- point capture: bank cursor positions instead of screenshotting them ---- */
let lastG=null, captured=[];
try{ captured=JSON.parse(localStorage.getItem('sab_captured')||'[]'); }catch(e){ captured=[]; }
function capSave(){
  try{ localStorage.setItem('sab_captured',JSON.stringify(captured)); }catch(e){}
  const el=document.getElementById('rcapn'); if(el) el.textContent=captured.length;
}
addEventListener('keydown',e=>{
  if(e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName||'')) return;
  const k=(e.key||'').toLowerCase();
  if(k==='c' && lastG){ captured.push(Object.assign({n:captured.length+1},lastG)); capSave(); }
  else if(k==='x'){ captured=[]; capSave(); }
});

/* Live readings on the map. A reading carries its AGE as prominently as its value —
   a manual note from three weeks ago should not look like a fresh one, and the colour
   of the dot says which it is. Same data the schematic and the Sensores list use. */
let showReadings=true;
try{ const v=localStorage.getItem('sab_readings'); if(v!==null) showReadings=(v==='1'); }catch(e){}

function drawReadings(){
  if(!showReadings) return;
  const R=D.readings; if(!R || !Object.keys(R).length) return;
  const seen={};
  for(const L of D.layers){
    if(!L.on) continue;
    for(const f of L.features){
      if(f.t!=='Point' || !f.eid || seen[f.eid]) continue;
      const rs=Object.keys(R).filter(k=>k.split('|')[0]===f.eid).map(k=>R[k]);
      if(!rs.length) continue;
      seen[f.eid]=1;
      const p=toScreen(f.c[0],f.c[1]);
      let dy=-27;                       // clear of the feature's own label
      for(const r of rs){
        const a=(typeof readingAge==='function') ? readingAge(r.ts) : {col:'#00e676'};
        const txt=`${r.valor} ${r.unidad||''}`.trim();
        cx.font='bold 12px system-ui';
        const w=cx.measureText(txt).width;
        cx.fillStyle='rgba(8,12,16,.88)';
        cx.beginPath(); cx.roundRect(p[0]+11, p[1]+dy-11, w+22, 17, 8); cx.fill();
        cx.strokeStyle=a.col+'66'; cx.lineWidth=1; cx.stroke();
        cx.beginPath(); cx.arc(p[0]+18, p[1]+dy-2.5, 3, 0, 7); cx.fillStyle=a.col; cx.fill();
        cx.fillStyle='#e6edf3'; cx.textAlign='left';
        cx.fillText(txt, p[0]+25, p[1]+dy+2);
        dy-=20;
      }
    }
  }
}

/* ---- hover highlight: light up the contour nearest the cursor ---- */
let hoverC=null;                       // {L,f} of the contour under the pointer
const HOVER_PX=12;                     // how close the cursor has to get
function isContour(L){ return L.name.indexOf('Curvas')===0; }
function lighten(hex,t){
  const v=parseInt(hex.slice(1),16);
  const m=(c)=>Math.round(c+(255-c)*t);
  return `rgb(${m((v>>16)&255)},${m((v>>8)&255)},${m(v&255)})`;
}
function bboxOf(f){
  if(f._bb) return f._bb;
  let a=1e9,b=1e9,c=-1e9,d=-1e9;
  (function walk(co){
    if(typeof co[0]==='number'){
      if(co[0]<a)a=co[0]; if(co[1]<b)b=co[1];
      if(co[0]>c)c=co[0]; if(co[1]>d)d=co[1];
    } else co.forEach(walk);
  })(f.c);
  return f._bb=[a,b,c,d];
}
function segDist(px,py,ax,ay,bx,by){
  const dx=bx-ax, dy=by-ay, dd=dx*dx+dy*dy;
  let t = dd ? ((px-ax)*dx+(py-ay)*dy)/dd : 0;
  t = t<0?0:t>1?1:t;
  return Math.hypot(px-(ax+t*dx), py-(ay+t*dy));
}
function findContour(px,py){
  let best=null, bd=HOVER_PX;
  for(const L of D.layers){
    if(!L.on || !isContour(L)) continue;
    for(const f of L.features){
      const bb=bboxOf(f);
      const p0=toScreen(bb[0],bb[3]), p1=toScreen(bb[2],bb[1]);   // top-left, bottom-right
      if(px<p0[0]-HOVER_PX||px>p1[0]+HOVER_PX||py<p0[1]-HOVER_PX||py>p1[1]+HOVER_PX) continue;
      const lines = f.t==='LineString' ? [f.c] : f.c;
      for(const ln of lines){
        let prev=toScreen(ln[0][0],ln[0][1]);
        for(let k=1;k<ln.length;k++){
          const cur=toScreen(ln[k][0],ln[k][1]);
          const d=segDist(px,py,prev[0],prev[1],cur[0],cur[1]);
          if(d<bd){ bd=d; best={L,f}; }
          prev=cur;
        }
      }
    }
  }
  return best;
}
function draw(){
  cx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  cx.clearRect(0,0,W,H);
  cx.fillStyle='#0d1114'; cx.fillRect(0,0,W,H);
  drawSurroundings();
  if(img && baseOn){
    const a=toScreen(B.minx,B.maxy), b=toScreen(B.maxx,B.miny);
    cx.save(); cx.globalAlpha=baseOp; cx.imageSmoothingQuality='high';
    cx.drawImage(img,a[0],a[1],b[0]-a[0],b[1]-a[1]);
    cx.restore();
  }
  drawPlano();
  for(const L of D.layers){
    if(!L.on) continue;
    cx.lineWidth=L.width; cx.lineJoin='round';
    for(const f of L.features){
      cx.strokeStyle = f.col || L.colour;
      if(f.dash) cx.setLineDash(f.dash);      // dashed = the connection is unconfirmed
      drawGeom(f,L.kind,L.fill);
      if(f.dash) cx.setLineDash([]);
    }
    // labels for named features (water infrastructure etc.), only when zoomed in enough
    const labelZoom = (L.name.indexOf('Vecinos')===0) ? 700 : 3000;
    if(view.s>labelZoom) for(const f of L.features){
      if(!f.l) continue;
      let p0=null;
      if(f.t==='Point') p0=f.c;
      else if(f.kind!=='line' && (f.t==='Polygon'||f.t==='MultiPolygon')){
        const ring = f.t==='Polygon'? f.c[0] : f.c[0][0];   // centroid of the outer ring
        let sx=0, sy=0;
        for(const c of ring){ sx+=c[0]; sy+=c[1]; }
        p0=[sx/ring.length, sy/ring.length];
      }
      if(!p0) continue;
      const s0=toScreen(p0[0],p0[1]);
      const isPoly = f.t!=='Point';
      if(isPoly){
        // Neighbour parcels: large centred label, name on top, detail beneath.
        const parts=f.l.split(' · ');
        const name=parts[0];                       // predio
        const sub=parts[1]||'';                    // propietario
        const sub2=parts.slice(2).join(' · ');     // lado + área
        cx.textAlign='center';
        cx.font='bold 19px system-ui'; cx.lineWidth=5;
        cx.strokeStyle='rgba(0,0,0,.9)'; cx.strokeText(name,s0[0],s0[1]);
        cx.fillStyle='#ffffff'; cx.fillText(name,s0[0],s0[1]);
        let dy=0;
        if(sub){                                   // owner line only when we know it
          dy=18;
          cx.font='bold 13px system-ui'; cx.lineWidth=4;
          cx.strokeStyle='rgba(0,0,0,.9)'; cx.strokeText(sub,s0[0],s0[1]+dy);
          cx.fillStyle='#ffd54f'; cx.fillText(sub,s0[0],s0[1]+dy);
        }
        if(sub2){
          cx.font='11px system-ui'; cx.lineWidth=3.5;
          cx.strokeStyle='rgba(0,0,0,.9)'; cx.strokeText(sub2,s0[0],s0[1]+dy+15);
          cx.fillStyle='#cfd8dc'; cx.fillText(sub2,s0[0],s0[1]+dy+15);
        }
        cx.textAlign='left';
      } else {
        cx.font='bold 13px system-ui'; cx.lineWidth=3.5;
        cx.strokeStyle='rgba(0,0,0,.8)'; cx.strokeText(f.l,s0[0]+9,s0[1]-7);
        cx.fillStyle= f.col || L.colour; cx.fillText(f.l,s0[0]+9,s0[1]-7);
      }
      cx.lineWidth=L.width;
    }
  }
  drawReadings();
  if(hoverC && hoverC.L.on){                       // the curve under the cursor, lit up
    const {L,f}=hoverC;
    cx.save();
    cx.lineJoin='round'; cx.lineCap='round';
    cx.shadowColor=lighten(L.colour,.5); cx.shadowBlur=10;
    cx.strokeStyle=lighten(L.colour,.65); cx.lineWidth=L.width+2.5;
    drawGeom(f,L.kind,null);
    cx.restore();
  }
  if(mpOn){
    mpPairs.forEach((q,i)=>{
      const a=toScreen(q.planGeo[0],q.planGeo[1]), b2=toScreen(q.geo[0],q.geo[1]);
      cx.strokeStyle='rgba(255,255,255,.55)'; cx.lineWidth=1.5;
      cx.beginPath(); cx.moveTo(a[0],a[1]); cx.lineTo(b2[0],b2[1]); cx.stroke();
      cx.fillStyle='#e0c9a6'; cx.beginPath(); cx.arc(a[0],a[1],4,0,7); cx.fill();
      cx.fillStyle='#00e676'; cx.beginPath(); cx.arc(b2[0],b2[1],4,0,7); cx.fill();
      cx.font='bold 13px system-ui';
      cx.strokeStyle='rgba(0,0,0,.85)'; cx.lineWidth=3;
      cx.strokeText(i+1,b2[0]+8,b2[1]-6);
      cx.fillStyle='#fff'; cx.fillText(i+1,b2[0]+8,b2[1]-6);
    });
    if(mpPending){ const p=toScreen(mpPending[0],mpPending[1]);
      cx.fillStyle='#e0c9a6'; cx.strokeStyle='#000'; cx.lineWidth=2;
      cx.beginPath(); cx.arc(p[0],p[1],6,0,7); cx.fill(); cx.stroke(); }
  }
  if(calStep>=0) for(let k=0;k<calPts.length;k++){
    const s0=toScreen(calPts[k][0],calPts[k][1]);
    cx.fillStyle = k%2 ? '#00e676' : '#e0c9a6';   // green = photo, cream = drawing
    cx.strokeStyle='#000'; cx.lineWidth=2;
    cx.beginPath(); cx.arc(s0[0],s0[1],6,0,7); cx.fill(); cx.stroke();
    cx.fillStyle='#fff'; cx.font='bold 12px system-ui';
    cx.fillText((k%2?'FOTO ':'DIBUJO ')+(Math.floor(k/2)+1), s0[0]+9, s0[1]-6);
  }
  drawOverlay();
  if(pts.length){
    cx.strokeStyle='#fff'; cx.lineWidth=2; cx.setLineDash([6,5]);
    cx.beginPath();
    pts.forEach((p,k)=>{const s=toScreen(p[0],p[1]); k?cx.lineTo(s[0],s[1]):cx.moveTo(s[0],s[1]);});
    cx.stroke(); cx.setLineDash([]);
    pts.forEach(p=>{const s=toScreen(p[0],p[1]);
      cx.fillStyle='#ff1744';cx.strokeStyle='#fff';cx.lineWidth=2;
      cx.beginPath();cx.arc(s[0],s[1],5,0,7);cx.fill();cx.stroke();});
    for(let i=1;i<pts.length-1;i++){          // arc + value at each interior vertex
      const A=angleAt(pts[i-1],pts[i],pts[i+1]); if(A===null) continue;
      const b=toScreen(pts[i][0],pts[i][1]);
      const a=toScreen(pts[i-1][0],pts[i-1][1]), c=toScreen(pts[i+1][0],pts[i+1][1]);
      const a1=Math.atan2(a[1]-b[1],a[0]-b[0]), a2=Math.atan2(c[1]-b[1],c[0]-b[0]);
      let d=a2-a1; while(d>Math.PI)d-=2*Math.PI; while(d<-Math.PI)d+=2*Math.PI;
      cx.strokeStyle='#ffd54f'; cx.lineWidth=2; cx.setLineDash([]);
      cx.beginPath(); cx.arc(b[0],b[1],26,a1,a1+d,d<0); cx.stroke();
      const mid=a1+d/2;
      cx.font='bold 13px system-ui';
      cx.strokeStyle='rgba(0,0,0,.85)'; cx.lineWidth=3;
      cx.strokeText(A.toFixed(1)+'°', b[0]+Math.cos(mid)*38-12, b[1]+Math.sin(mid)*38+4);
      cx.fillStyle='#ffd54f';
      cx.fillText(A.toFixed(1)+'°', b[0]+Math.cos(mid)*38-12, b[1]+Math.sin(mid)*38+4);
    }
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
/* --- session persistence: pan, zoom, 3D camera --- */
let saveT=null;
function saveView(){
  clearTimeout(saveT);
  saveT=setTimeout(()=>{ try{
    localStorage.setItem('sab_view', JSON.stringify({
      x:view.x, y:view.y, s:view.s, is3d:is3d, cam:cam, exag:exag}));
  }catch(e){} }, 300);
}
function restoreView(){
  try{
    const v=JSON.parse(localStorage.getItem('sab_view')||'null');
    if(!v || !isFinite(v.s) || v.s<=0) return false;
    view={x:v.x, y:v.y, s:v.s};
    if(v.cam) cam=v.cam;
    if(typeof v.exag==='number'){ exag=v.exag;
      const e=document.getElementById('exag'); if(e){e.value=exag;
        document.getElementById('exagv').textContent=exag+'×';} }
    if(v.is3d && D.tex && D.mesh) setTimeout(()=>set3d(true),0);
    return true;
  }catch(e){ return false; }
}
function reset(){
  const s=Math.min(W/1, H/aspect())*0.92;
  view={s:s, x:(W-s)/2, y:(H-s*aspect())/2}; saveView(); draw();
}
let drag=null;
cv.addEventListener('mousedown',e=>{
  if(planoAlign && PL.on){ drag={x:e.clientX,y:e.clientY,plon:PL.lon,plat:PL.lat,plano:true,moved:false}; return; }
  drag={x:e.clientX,y:e.clientY,vx:view.x,vy:view.y,moved:false};});
addEventListener('mouseup',e=>{
  if(drag && !drag.plano && drag.moved) saveView();
  if(drag && drag.plano){ savePlano(); drag=null; return; }
  if(drag && !drag.moved && mpOn){ mpClick(toGeo(e.clientX,e.clientY)); drag=null; return; }
  if(drag && !drag.moved && calStep>=0){ calClick(toGeo(e.clientX,e.clientY)); drag=null; return; }
  if(drag && !drag.moved && drawing){
    const g=toGeo(e.clientX,e.clientY);
    if(!draft) draft={tipo:document.getElementById('dtype').value,geom:[]};
    draft.geom.push(g);
    if(GEOM[draft.tipo]==='point') finishDraft(); else draw();
  } else if(drag && !drag.moved && measuring){
    pts.push(toGeo(e.clientX,e.clientY)); report(); draw();
  }
  drag=null;
});
addEventListener('mousemove',e=>{
  if(drag && drag.plano){
    drag.moved=true;
    const g0=toGeo(drag.x,drag.y), g1=toGeo(e.clientX,e.clientY);
    PL.lon=drag.plon+(g1[0]-g0[0]); PL.lat=drag.plat+(g1[1]-g0[1]); draw();
  } else if(drag){
    if(Math.abs(e.clientX-drag.x)+Math.abs(e.clientY-drag.y)>3) drag.moved=true;
    view.x=drag.vx+(e.clientX-drag.x); view.y=drag.vy+(e.clientY-drag.y); draw();
  }
  const g=toGeo(e.clientX,e.clientY), z=elev(g[0],g[1]);
  document.getElementById('rlat').textContent=g[1].toFixed(6);
  document.getElementById('rlon').textContent=g[0].toFixed(6);
  document.getElementById('rele').textContent = z?z.toFixed(0)+' m':'sin dato';
  const sl=slopeAt(g[0],g[1]);
  lastG={lon:+g[0].toFixed(6), lat:+g[1].toFixed(6),
         elev_m: z!=null?+z.toFixed(0):null, slope_deg: sl?+sl.deg.toFixed(1):null};
  document.getElementById('rslp').textContent =
    sl ? `${sl.deg.toFixed(1)}° (${sl.pct.toFixed(0)} %)` : 'sin dato';
  if(!is3d){
    const hc=findContour(e.clientX,e.clientY);
    const nf=hc?hc.f:null, of=hoverC?hoverC.f:null;
    if(nf!==of){ hoverC=hc; draw(); }               // only repaint when it actually changes
    document.getElementById('rcurw').style.display = hoverC?'block':'none';
    if(hoverC) document.getElementById('rcur').textContent=hoverC.f.l||'—';
  }
});
cv.addEventListener('wheel',e=>{
  e.preventDefault();
  if(planoAlign && PL.on){ PL.w*=Math.exp(-e.deltaY*0.0012); savePlano(); draw(); return; }
  const k=Math.exp(-e.deltaY*0.0016), old=view.s;
  view.s=Math.max(200,Math.min(400000,view.s*k));
  const r=view.s/old;
  view.x=e.clientX-(e.clientX-view.x)*r;
  view.y=e.clientY-(e.clientY-view.y)*r;
  saveView(); draw();
},{passive:false});

/* interior angle at vertex b, in a local metric frame */
function angleAt(a,b,c){
  const v1=[(a[0]-b[0])*LON2M,(a[1]-b[1])*LAT2M];
  const v2=[(c[0]-b[0])*LON2M,(c[1]-b[1])*LAT2M];
  const n1=Math.hypot(...v1), n2=Math.hypot(...v2);
  if(n1<1e-6||n2<1e-6) return null;
  const cs=Math.max(-1,Math.min(1,(v1[0]*v2[0]+v1[1]*v2[1])/(n1*n2)));
  return Math.acos(cs)*180/Math.PI;
}
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
  // three or more points: interior angles, and the area if it closes a triangle
  if(pts.length>=3){
    const angs=[];
    for(let i=1;i<pts.length-1;i++){
      const A=angleAt(pts[i-1],pts[i],pts[i+1]);
      if(A!==null) angs.push({i:i+1,A});
    }
    if(angs.length){
      h+='<div style="margin-top:6px"><b>ángulos</b> '+
        angs.map(x=>`en pt${x.i}: <b>${x.A.toFixed(1)}°</b>`).join(' · ')+'</div>';
    }
    if(pts.length===3){
      const s1=dist(pts[0],pts[1]), s2=dist(pts[1],pts[2]);
      const A=angs.length?angs[0].A:null;
      if(A!==null){
        const ar=0.5*s1*s2*Math.sin(A*Math.PI/180);
        h+=`<div><b>triángulo</b> ${s1.toFixed(0)} m × ${s2.toFixed(0)} m @ ${A.toFixed(1)}°`+
           ` → <b>${(ar/10000).toFixed(3)} ha</b> (${ar.toFixed(0)} m²)</div>`;
      }
    }
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

/* --- background imagery: independent on/off + opacity, so backgrounds can be
       combined or all switched off to see the vectors alone --- */
let baseOn=true, baseOp=1.0;
try{
  const b=localStorage.getItem('sab_base'); if(b!==null) baseOn=(b==='1');
  const o=localStorage.getItem('sab_baseop'); if(o!==null) baseOp=parseFloat(o);
}catch(e){}
setTimeout(()=>{
  const cb=document.getElementById('baseOn'), sl=document.getElementById('baseOp');
  cb.checked=baseOn; sl.value=Math.round(baseOp*100);
  cb.onchange=e=>{ baseOn=e.target.checked;
    try{localStorage.setItem('sab_base',baseOn?'1':'0');}catch(x){} draw(); };
  sl.oninput=e=>{ baseOp=e.target.value/100;
    try{localStorage.setItem('sab_baseop',String(baseOp));}catch(x){} draw(); };
});

let LSTATE={};
try{ LSTATE=JSON.parse(localStorage.getItem('sab_layers')||'{}'); }catch(e){}
D.layers.forEach(L=>{ if(L.name in LSTATE) L.on=!!LSTATE[L.name]; });
const saveLayers=()=>{ try{
  const o={}; D.layers.forEach(L=>o[L.name]=L.on);
  localStorage.setItem('sab_layers',JSON.stringify(o));
}catch(e){} };

/* The layer list is grouped by the subsystem each layer belongs to, and can be
   scoped to one of them. Finca shows everything; a subsystem view shows its own. */
const box=document.getElementById('layers');
const GRUPO={agua:'Agua', predio:'Predio', ganado:'Ganado'};
function buildLayers(only){
  box.innerHTML='';
  const groups={};
  D.layers.forEach((L,i)=>{ const g=L.grupo||'predio'; (groups[g]=groups[g]||[]).push([L,i]); });
  const keys=Object.keys(groups).sort();
  if((!only || only==='datos') && D.readings && Object.keys(D.readings).length){
    box.insertAdjacentHTML('beforeend',
      `<div class="grp">Datos</div>
       <label><input type="checkbox" id="Lrd" ${showReadings?'checked':''}>
       <span class="sw" style="background:#00e676"></span>Lecturas en vivo</label>`);
    document.getElementById('Lrd').onchange=e=>{
      showReadings=e.target.checked;
      try{ localStorage.setItem('sab_readings',showReadings?'1':'0'); }catch(x){}
      if(!isPid && !is3d) draw();};
  }
  for(const g of keys){
    if(only && g!==only) continue;
    if(!only && keys.length>1)
      box.insertAdjacentHTML('beforeend',`<div class="grp">${GRUPO[g]||g}</div>`);
    for(const [L,i] of groups[g]){
      const id='L'+i;
      box.insertAdjacentHTML('beforeend',
        `<label><input type="checkbox" id="${id}" ${L.on?'checked':''}>
         <span class="sw" style="background:${L.colour}"></span>${L.name}</label>`);
      document.getElementById(id).onchange=e=>{
        L.on=e.target.checked; saveLayers();
        if(isPid) drawPid(); else if(is3d) render3d(); else draw();};
    }
  }
}
buildLayers(null);

addEventListener('resize',resize);
if(D.ortho){
  img=new Image();
  img.onload=()=>{resize(); if(!restoreView()) reset(); draw();};
  img.onerror=()=>{img=null;resize(); if(!restoreView()) reset(); draw();};
  img.src=D.ortho;
} else { resize(); if(!restoreView()) reset(); draw(); }
