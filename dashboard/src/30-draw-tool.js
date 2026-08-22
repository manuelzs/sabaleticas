/* ================= drawing / digitising =================
   UI hidden by default; set DRAW_UI = true to expose the controls again. */
const DRAW_UI=false;
if(DRAW_UI) document.getElementById('drawUI').style.display='block';
const GEOM={tanque:'point',nacimiento:'point',bebedero:'point',
            represa:'polygon',tuberia:'line',potrero:'polygon',otro:'line'};
const DCOL={tanque:'#00e5ff',nacimiento:'#7cffcb',bebedero:'#4dd0e1',represa:'#0091ea',
            tuberia:'#b388ff',potrero:'#ffee58',otro:'#b39ddb'};
let drawn=[], draft=null, drawing=false;
try{ drawn=JSON.parse(localStorage.getItem('sab_drawn')||'[]'); }catch(e){ drawn=[]; }
const save=()=>{ try{localStorage.setItem('sab_drawn',JSON.stringify(drawn));}catch(e){} };

function ringArea(r){           // geodesic, m^2
  const R=6378137, n=r.length; let t=0;
  for(let i=0;i<n;i++){
    const a=r[i], b=r[(i+1)%n];
    t+=(b[0]-a[0])*Math.PI/180*(2+Math.sin(a[1]*Math.PI/180)+Math.sin(b[1]*Math.PI/180));
  }
  return Math.abs(t*R*R/2);
}
function lineLen(l){ let t=0; for(let i=1;i<l.length;i++) t+=dist(l[i-1],l[i]); return t; }
function metric(f){
  const g=GEOM[f.tipo];
  if(g==='polygon'&&f.geom.length>2) return (ringArea(f.geom)/10000).toFixed(2)+' ha';
  if(g==='line'&&f.geom.length>1){ const m=lineLen(f.geom);
    return m>=1000?(m/1000).toFixed(2)+' km':m.toFixed(0)+' m'; }
  if(g==='point'){ const z=elev(f.geom[0][0],f.geom[0][1]); return z?z.toFixed(0)+' m s.n.m.':''; }
  return '';
}
function drawOverlay(){
  for(const f of drawn.concat(draft?[draft]:[])){
    const g=GEOM[f.tipo], col=DCOL[f.tipo]||'#fff';
    cx.strokeStyle=col; cx.lineWidth=f===draft?2.5:2.2; cx.setLineDash(f===draft?[7,5]:[]);
    if(g==='point'){
      for(const p of f.geom){ const s=toScreen(p[0],p[1]);
        cx.fillStyle=col; cx.beginPath(); cx.arc(s[0],s[1],6,0,7); cx.fill();
        cx.strokeStyle='#0b0e11'; cx.lineWidth=2; cx.stroke(); }
    } else if(f.geom.length>1){
      cx.beginPath();
      f.geom.forEach((p,k)=>{const s=toScreen(p[0],p[1]); k?cx.lineTo(s[0],s[1]):cx.moveTo(s[0],s[1]);});
      if(g==='polygon'){ cx.closePath(); cx.fillStyle=col.replace(')',',.18)').replace('#','rgba(');
        cx.fillStyle='rgba(255,255,255,.10)'; cx.fill(); }
      cx.stroke();
    }
    if(f===draft) for(const p of f.geom){ const s=toScreen(p[0],p[1]);
      cx.fillStyle='#fff'; cx.beginPath(); cx.arc(s[0],s[1],3.5,0,7); cx.fill(); }
    cx.setLineDash([]);
    if(f!==draft&&f.nombre&&f.geom.length){
      const c=f.geom[0], s=toScreen(c[0],c[1]);
      cx.fillStyle='#fff'; cx.font='bold 13px system-ui'; cx.strokeStyle='rgba(0,0,0,.8)';
      cx.lineWidth=3; cx.strokeText(f.nombre,s[0]+9,s[1]-8); cx.fillText(f.nombre,s[0]+9,s[1]-8);
    }
  }
}
function renderList(){
  const el=document.getElementById('dlist');
  el.innerHTML = drawn.length? drawn.map((f,i)=>
    `<div style="display:flex;gap:6px;align-items:center;padding:2px 0">
       <span class="sw" style="background:${DCOL[f.tipo]||'#fff'}"></span>
       <span style="flex:1">${f.nombre||f.tipo} <span style="color:var(--muted)">${metric(f)}</span></span>
       <a href="#" data-i="${i}" class="del" style="color:#ef5350;text-decoration:none">✕</a>
     </div>`).join('') : '<span style="color:var(--muted)">Nada dibujado aún.</span>';
  el.querySelectorAll('.del').forEach(a=>a.onclick=e=>{
    e.preventDefault(); drawn.splice(+a.dataset.i,1); save(); renderList(); draw();});
}
function finishDraft(){
  if(!draft) return;
  const g=GEOM[draft.tipo];
  const need = g==='point'?1 : g==='line'?2 : 3;
  if(draft.geom.length<need){ draft=null; draw(); return; }
  const nm=prompt(`Nombre para este ${draft.tipo}:`, draft.tipo);
  if(nm===null){ draft=null; draw(); return; }
  draft.nombre=nm.trim()||draft.tipo;
  drawn.push(draft); draft=null; save(); renderList(); draw();
  document.getElementById('dout').innerHTML='Guardado. Sigue dibujando o pulsa <b>Dibujar</b> para salir.';
}
function setDraw(on){
  drawing=on;
  document.getElementById('btnDraw').classList.toggle('on',on);
  document.getElementById('btnFinish').style.display=on?'inline-block':'none';
  document.getElementById('btnUndo').style.display=on?'inline-block':'none';
  if(on&&measuring){ measuring=false; document.getElementById('btnMeasure').classList.remove('on'); }
  document.getElementById('dout').innerHTML = on
    ? 'Haz clic para poner puntos. <b>Terminar</b> o doble clic para cerrar.'
    : '';
  if(!on){ draft=null; }
  draw();
}
document.getElementById('btnDraw').onclick=()=>setDraw(!drawing);
document.getElementById('btnFinish').onclick=finishDraft;
document.getElementById('btnUndo').onclick=()=>{ if(draft&&draft.geom.length){draft.geom.pop();draw();} };
cv.addEventListener('dblclick',e=>{ if(drawing){ e.preventDefault(); finishDraft(); } });
document.getElementById('btnExport').onclick=()=>{
  const fc={type:'FeatureCollection',features:drawn.map(f=>{
    const g=GEOM[f.tipo];
    const geom = g==='point'? {type:'Point',coordinates:f.geom[0]}
      : g==='line'? {type:'LineString',coordinates:f.geom}
      : {type:'Polygon',coordinates:[f.geom.concat([f.geom[0]])]};
    const pr={tipo:f.tipo,nombre:f.nombre,fuente:'trazado sobre la ortofoto IGAC 0.5 m'};
    if(g==='polygon'&&f.geom.length>2) pr.area_ha=+(ringArea(f.geom)/10000).toFixed(3);
    if(g==='line'&&f.geom.length>1) pr.largo_m=+lineLen(f.geom).toFixed(1);
    if(g==='point'){ const z=elev(f.geom[0][0],f.geom[0][1]); if(z) pr.altura_m=+z.toFixed(1); }
    return {type:'Feature',properties:pr,geometry:geom};
  })};
  const txt=JSON.stringify(fc,null,1);
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([txt],{type:'application/geo+json'}));
  a.download='trazado.geojson'; a.click();
  document.getElementById('dout').innerHTML=
    `Exportadas <b>${drawn.length}</b> geometrías a <b>trazado.geojson</b>.`;
};
renderList();

