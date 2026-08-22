/* ================= 2003 plan overlay (georeferencing by eye) ================= */
// Baseline from Manuel's 2-point calibration, 2026-08-21. Kept as the default so a cleared
// browser doesn't lose it. Note rot ~11.7 deg: the scan is NOT square to north.
const PL_DEF={lon:-75.61149926450808, lat:5.798895465699878,
              w:0.026100033061401445, rot:11.737867318836926, op:0.52, on:false};
let PL=Object.assign({},PL_DEF), planoImg=null, planoAlign=false;
try{ PL=Object.assign(PL, JSON.parse(localStorage.getItem('sab_plano')||'{}')); }catch(e){}
const savePlano=()=>{ try{localStorage.setItem('sab_plano',JSON.stringify(PL));}catch(e){} };

/* 3x3 context imagery — loaded only when the neighbours layer is switched on */
let surImg=null, surTried=false;
function neighboursOn(){
  const L=D.layers.find(l=>l.name.indexOf('Vecinos')===0);
  return !!(L && L.on);
}
function drawSurroundings(){
  if(!baseOn) return;
  if(!D.surroundings || !neighboursOn()) return;
  if(!surImg && !surTried){
    surTried=true;
    surImg=new Image();
    surImg.onload=()=>draw();
    surImg.onerror=()=>{surImg=null;};
    surImg.src=D.surroundings.src;
    return;
  }
  if(!surImg || !surImg.complete) return;
  const b=D.surroundings.bounds;
  const a=toScreen(b.minx,b.maxy), c=toScreen(b.maxx,b.miny);
  cx.save(); cx.globalAlpha=0.85*baseOp; cx.imageSmoothingQuality='high';
  cx.drawImage(surImg, a[0],a[1], c[0]-a[0], c[1]-a[1]);
  cx.restore();
}
function drawPlano(){
  if(!PL.on || !planoImg) return;
  if(mpModel){ drawPlanoWarped(); return; }
  const ar = planoImg.naturalHeight/planoImg.naturalWidth;
  const wDeg = PL.w;
  const hDeg = wDeg*ar*(LON2M/LAT2M);          // keep true ground aspect
  const c = toScreen(PL.lon, PL.lat);
  const px = wDeg/(B.maxx-B.minx)*view.s;
  const py = hDeg/(B.maxy-B.miny)*view.s*aspect();
  cx.save();
  cx.globalAlpha = PL.op;
  cx.translate(c[0], c[1]);
  cx.rotate(PL.rot*Math.PI/180);
  cx.imageSmoothingQuality='high';
  cx.drawImage(planoImg, -px/2, -py/2, px, py);
  cx.restore();
  if(planoAlign){
    cx.save(); cx.strokeStyle='#e0c9a6'; cx.lineWidth=2; cx.setLineDash([8,6]);
    cx.translate(c[0],c[1]); cx.rotate(PL.rot*Math.PI/180);
    cx.strokeRect(-px/2,-py/2,px,py); cx.restore();
  }
}
document.getElementById('planoOn').checked = PL.on;
document.getElementById('planoBox').style.display = PL.on?'block':'none';
document.getElementById('planoOp').value = Math.round(PL.op*100);
document.getElementById('planoOn').onchange=e=>{
  PL.on=e.target.checked; savePlano();
  document.getElementById('planoBox').style.display=PL.on?'block':'none';
  if(PL.on && !planoImg){
    planoImg=new Image();
    planoImg.onload=()=>draw();
    planoImg.src=D.plano;
  } else draw();
};
document.getElementById('planoOp').oninput=e=>{ PL.op=e.target.value/100; savePlano(); draw(); };
document.getElementById('planoAlign').onclick=e=>{
  planoAlign=!planoAlign; e.target.classList.toggle('on',planoAlign);
  document.getElementById('planoHint').innerHTML = planoAlign
    ? '<b>Alineando.</b> Arrastra el plano · rueda = escala · ⟲⟳ = giro.'
    : 'Enciende <b>Alinear</b>: arrastra para mover, rueda para escalar, ⟲⟳ para girar. Se guarda solo.';
  draw();
};
document.getElementById('planoRotL').onclick=()=>{PL.rot-=0.5;savePlano();draw();};
document.getElementById('planoRotR').onclick=()=>{PL.rot+=0.5;savePlano();draw();};
document.getElementById('planoReset').onclick=()=>{
  const on=PL.on, op=PL.op; PL=Object.assign({},PL_DEF); PL.on=on; PL.op=op; savePlano();
  mpPairs=[]; mpModel=MP_SEED; mpPending=null; mpSave();
  document.getElementById('planoHint').textContent='Reiniciado.'; draw();};

/* --- two-point calibration: match a feature on the plan to the same feature on the photo --- */
let calStep=-1, calPts=[];
const CAL_MSG=[
 '<b>1a · DIBUJO</b> — clic sobre el rasgo tal como aparece en el <b>plano a mano</b> ' +
   '(las líneas de lápiz). Sube la opacidad para verlo mejor.',
 '<b>1b · FOTO</b> — clic sobre ese <b>mismo sitio real</b> en la <b>foto aérea</b> de abajo ' +
   '(pasto, árboles, río). Baja la opacidad para verla.',
 '<b>2a · DIBUJO</b> — otro rasgo en el <b>plano a mano</b>, lo más lejos posible del primero.',
 '<b>2b · FOTO</b> — ese mismo sitio real en la <b>foto aérea</b>.'];
function calClick(g){
  calPts.push(g); calStep++;
  if(calStep<4){ document.getElementById('planoHint').innerHTML=CAL_MSG[calStep]; draw(); return; }
  // metric frame
  const M=p=>[p[0]*LON2M, p[1]*LAT2M];
  const [p1,q1,p2,q2]=calPts.map(M);
  const dp=[p2[0]-p1[0],p2[1]-p1[1]], dq=[q2[0]-q1[0],q2[1]-q1[1]];
  const lp=Math.hypot(...dp), lq=Math.hypot(...dq);
  if(lp<1e-6){ document.getElementById('planoHint').innerHTML='Puntos demasiado juntos. Reintenta.'; calStep=-1; calPts=[]; return; }
  const sc=lq/lp;
  const th=Math.atan2(dq[1],dq[0])-Math.atan2(dp[1],dp[0]);   // radians, geo frame
  const C=M([PL.lon,PL.lat]);
  const v=[C[0]-p1[0], C[1]-p1[1]];
  const nc=[ q1[0]+sc*(v[0]*Math.cos(th)-v[1]*Math.sin(th)),
             q1[1]+sc*(v[0]*Math.sin(th)+v[1]*Math.cos(th)) ];
  PL.lon=nc[0]/LON2M; PL.lat=nc[1]/LAT2M;
  PL.w*=sc; PL.rot-=th*180/Math.PI;
  savePlano(); calStep=-1; calPts=[];
  document.getElementById('planoCal').classList.remove('on');
  document.getElementById('planoHint').innerHTML=
    `Calibrado: escala ×${sc.toFixed(3)}, giro ${(-th*180/Math.PI).toFixed(2)}°. ` +
    `Si quedó al revés, pulsa ⟲⟳ o vuelve a calibrar.`;
  draw();
}
document.getElementById('planoCal').onclick=e=>{
  if(calStep>=0){ calStep=-1; calPts=[]; e.target.classList.remove('on');
    document.getElementById('planoHint').textContent='Calibración cancelada.'; draw(); return; }
  if(!PL.on){ document.getElementById('planoHint').textContent='Enciende el plano primero.'; return; }
  planoAlign=false; document.getElementById('planoAlign').classList.remove('on');
  calStep=0; calPts=[]; e.target.classList.add('on');
  document.getElementById('planoHint').innerHTML=CAL_MSG[0];
  draw();
};

if(D.plano && PL.on){ planoImg=new Image(); planoImg.onload=()=>draw(); planoImg.src=D.plano; }



/* Draw the plan under a fitted affine/homography by splitting it into a grid of
   quads and drawing each with its own affine — canvas 2D has no native homography. */
function drawPlanoWarped(){
  const N=14, w=planoImg.naturalWidth, h=planoImg.naturalHeight;
  cx.save(); cx.globalAlpha=PL.op;
  for(let j=0;j<N;j++) for(let i=0;i<N;i++){
    const u0=i/N,u1=(i+1)/N, v0=j/N,v1=(j+1)/N;
    const A=toScreen(...applyModel(mpModel,u0,v0));
    const Bp=toScreen(...applyModel(mpModel,u1,v0));
    const C=toScreen(...applyModel(mpModel,u0,v1));
    const sx=u0*w, sy=v0*h, sw=w/N, sh=h/N;
    const a=(Bp[0]-A[0])/sw, b=(Bp[1]-A[1])/sw;
    const c=(C[0]-A[0])/sh,  d=(C[1]-A[1])/sh;
    cx.save();
    cx.setTransform(a*devicePixelRatio,b*devicePixelRatio,c*devicePixelRatio,
                    d*devicePixelRatio,
                    (A[0]-a*sx-c*sy)*devicePixelRatio,(A[1]-b*sx-d*sy)*devicePixelRatio);
    cx.drawImage(planoImg, sx-0.5, sy-0.5, sw+1, sh+1, sx-0.5, sy-0.5, sw+1, sh+1);
    cx.restore();
  }
  cx.restore();
  cx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}

/* ================= multi-point georeferencing =================
   Capture as many (plan -> photo) pairs as you like, then fit progressively richer
   models and keep whichever actually explains the data:
     similarity  4 dof  (2+ pts)  move / uniform scale / rotate
     affine      6 dof  (3+ pts)  + independent x,y scale + shear
     homography  8 dof  (4+ pts)  + perspective  (a phone photo of a flat sheet)
   Residuals are reported per model so we can see WHY the plan misfits, not just fix it. */
let mpOn=false, mpPending=null, mpPairs=[], mpModel=null;
// Affine fitted on 10 control points, 2026-08-21: RMS 10.99 m, max 21.3 m
// (point [1] rejected as a bad correspondence; was 43.6 m on the 2-point placement).
const MP_SEED={kind:'affine',m:[3016.821047, -396.429896, -8375371.412631, -749.564114, -2153.961365, 642717.013749]};
mpModel=MP_SEED;
try{ const r=JSON.parse(localStorage.getItem('sab_plano_pairs')||'null');
     if(r){ mpPairs=r.pairs||[]; mpModel=r.model||MP_SEED; } }catch(e){}
const mpSave=()=>{ try{localStorage.setItem('sab_plano_pairs',
  JSON.stringify({pairs:mpPairs,model:mpModel}));}catch(e){} };

/* geo <-> image UV under the CURRENT similarity placement */
function geoToUv(g){
  if(mpModel && mpModel.kind==='affine'){          // invert the fitted affine
    const m=mpModel.m, X=g[0]*LON2M, Y=g[1]*LAT2M;
    const det=m[0]*m[4]-m[1]*m[3];
    const dx=X-m[2], dy=Y-m[5];
    return [ ( m[4]*dx - m[1]*dy)/det, (-m[3]*dx + m[0]*dy)/det ];
  }
  const ar=planoImg? planoImg.naturalHeight/planoImg.naturalWidth : 0.74;
  const hDeg=PL.w*ar*(LON2M/LAT2M);
  let dx=(g[0]-PL.lon)*LON2M, dy=(g[1]-PL.lat)*LAT2M;
  const r=-PL.rot*Math.PI/180;                      // undo screen rotation -> geo
  const x= dx*Math.cos(r)+dy*Math.sin(r);
  const y=-dx*Math.sin(r)+dy*Math.cos(r);
  return [ x/(PL.w*LON2M)+0.5, 0.5-y/(hDeg*LAT2M) ];
}
/* least squares via normal equations */
function solve(A,b){
  const n=A[0].length, N=[], r=[];
  for(let i=0;i<n;i++){ N.push(new Array(n).fill(0)); r.push(0); }
  for(let k=0;k<A.length;k++){
    for(let i=0;i<n;i++){ r[i]+=A[k][i]*b[k];
      for(let j=0;j<n;j++) N[i][j]+=A[k][i]*A[k][j]; } }
  for(let i=0;i<n;i++){                              // gaussian elimination
    let p=i; for(let k=i+1;k<n;k++) if(Math.abs(N[k][i])>Math.abs(N[p][i])) p=k;
    [N[i],N[p]]=[N[p],N[i]]; [r[i],r[p]]=[r[p],r[i]];
    if(Math.abs(N[i][i])<1e-12) return null;
    for(let k=i+1;k<n;k++){ const f=N[k][i]/N[i][i];
      for(let j=i;j<n;j++) N[k][j]-=f*N[i][j]; r[k]-=f*r[i]; } }
  const x=new Array(n).fill(0);
  for(let i=n-1;i>=0;i--){ let sm=r[i];
    for(let j=i+1;j<n;j++) sm-=N[i][j]*x[j]; x[i]=sm/N[i][i]; }
  return x;
}
function fitAffine(pairs){                            // uv -> metric geo
  const A=[],b=[];
  for(const q of pairs){ const [u,v]=q.uv, g=q.geo;
    A.push([u,v,1,0,0,0]); b.push(g[0]*LON2M);
    A.push([0,0,0,u,v,1]); b.push(g[1]*LAT2M); }
  const m=solve(A,b); return m? {kind:'affine',m} : null;
}
function fitHomography(pairs){
  const A=[],b=[];
  for(const q of pairs){ const [u,v]=q.uv; const X=q.geo[0]*LON2M, Y=q.geo[1]*LAT2M;
    A.push([u,v,1,0,0,0,-u*X,-v*X]); b.push(X);
    A.push([0,0,0,u,v,1,-u*Y,-v*Y]); b.push(Y); }
  const h=solve(A,b); return h? {kind:'homog',h} : null;
}
function applyModel(M,u,v){
  if(M.kind==='affine'){ const m=M.m;
    return [(m[0]*u+m[1]*v+m[2])/LON2M, (m[3]*u+m[4]*v+m[5])/LAT2M]; }
  const h=M.h, d=h[6]*u+h[7]*v+1;
  return [ (h[0]*u+h[1]*v+h[2])/d/LON2M, (h[3]*u+h[4]*v+h[5])/d/LAT2M ];
}
function rms(M,pairs){
  let s=0;
  for(const q of pairs){ const p=applyModel(M,q.uv[0],q.uv[1]);
    const dx=(p[0]-q.geo[0])*LON2M, dy=(p[1]-q.geo[1])*LAT2M; s+=dx*dx+dy*dy; }
  return Math.sqrt(s/pairs.length);
}
function simRms(pairs){                               // residual of the current 2-pt fit
  let s=0;
  for(const q of pairs){ const g=q.planGeo;
    const dx=(g[0]-q.geo[0])*LON2M, dy=(g[1]-q.geo[1])*LAT2M; s+=dx*dx+dy*dy; }
  return Math.sqrt(s/pairs.length);
}
function mpFit(){
  const n=mpPairs.length, out=[];
  out.push(`<b>${n} pares</b> · error actual (2 pts): <b>${simRms(mpPairs).toFixed(0)} m</b>`);
  let best=null;
  if(n>=3){ const a=fitAffine(mpPairs); if(a){ const e=rms(a,mpPairs);
    out.push(`afín (6 gl): ${e.toFixed(1)} m`); best={M:a,e,name:'afín'}; } }
  if(n>=4){ const hh=fitHomography(mpPairs); if(hh){ const e=rms(hh,mpPairs);
    out.push(`homografía (8 gl): ${e.toFixed(1)} m`);
    if(!best||e<best.e*0.9) best={M:hh,e,name:'homografía'}; } }
  if(best){ mpModel=best.M; mpSave();
    out.push(`→ usando <b>${best.name}</b>`);
    const worst=mpPairs.map((q,i)=>{ const p=applyModel(best.M,q.uv[0],q.uv[1]);
      return {i:i+1,d:Math.hypot((p[0]-q.geo[0])*LON2M,(p[1]-q.geo[1])*LAT2M)}; })
      .sort((x,y)=>y.d-x.d).slice(0,3);
    out.push('peores: '+worst.map(w=>`#${w.i} ${w.d.toFixed(0)}m`).join(' · '));
  } else out.push(n<3?'faltan puntos para afín (3)':'');
  document.getElementById('planoHint').innerHTML=out.join('<br>');
  draw();
}
document.getElementById('planoMulti').onclick=e=>{
  if(!PL.on){ document.getElementById('planoHint').textContent='Enciende el plano primero.'; return; }
  mpOn=!mpOn; e.target.classList.toggle('on',mpOn);
  planoAlign=false; document.getElementById('planoAlign').classList.remove('on');
  calStep=-1;
  document.getElementById('planoHint').innerHTML = mpOn
    ? `<b>${mpPairs.length} pares.</b> Clic en el <b>DIBUJO</b>, luego el mismo sitio en la <b>FOTO</b>. ` +
      `Repite por toda la finca — <b>la imagen no se moverá</b>. Cuando tengas ~10, avísame y yo hago el ajuste.`
    : 'Captura pausada.';
  draw();
};
document.getElementById('planoUndo').onclick=()=>{
  if(mpPending){ mpPending=null; }
  else if(mpPairs.length) mpPairs.pop();
  mpSave();
  document.getElementById('planoHint').innerHTML=
    `<b>${mpPairs.length} pares.</b> Clic en el <b>DIBUJO</b>, luego en la <b>FOTO</b>.`;
  draw();
};
function mpClick(g){
  if(!mpPending){ mpPending=g;
    document.getElementById('planoHint').innerHTML=
      `Par ${mpPairs.length+1}: ahora el mismo sitio en la <b>FOTO</b>.`; draw(); return; }
  mpPairs.push({uv:geoToUv(mpPending), planGeo:mpPending, geo:g});
  mpPending=null; mpSave();
  // Deliberately NO re-fitting here. Warping the plan mid-capture moves the very features
  // being clicked, which makes accurate clicking impossible. Capture first, fit later.
  const last=mpPairs[mpPairs.length-1];
  const off=Math.hypot((last.planGeo[0]-last.geo[0])*LON2M,(last.planGeo[1]-last.geo[1])*LAT2M);
  document.getElementById('planoHint').innerHTML=
    `<b>${mpPairs.length} pares capturados</b> (desfase de este: ${off.toFixed(0)} m).<br>` +
    `Sigue marcando por toda la finca. La imagen <b>no se moverá</b> mientras capturas.`;
  draw();
}

