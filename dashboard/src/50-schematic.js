/* ================= Esquema hidráulico (P&ID) =================
   A second renderer over the SAME graph as the map. Y is real elevation, because in a
   gravity system height IS the logic: what sits above can feed what sits below, and that
   has to be readable at a glance. X is a hand-placed lane per branch, for legibility only.

   Transform is base -> scale -> offset, exactly like the map, so the wheel can zoom about
   the cursor instead of sliding the drawing around. */
const cvp=document.getElementById('cvp'), cxp=cvp.getContext('2d');
let isPid=false, pv={ox:0,oy:0,s:1}, PB=null;

function pidNodes(){ return (D.net&&D.net.nodes||[]).filter(n=>n.pid); }
function pidBounds(){
  const ns=pidNodes(), xs=ns.map(n=>n.pid[0]), ys=ns.map(n=>n.pid[1]);
  return {x0:Math.min(...xs), x1:Math.max(...xs), y0:Math.min(...ys), y1:Math.max(...ys)};
}
function pidFit(){
  const b=pidBounds(), padL=92, padR=190, padT=70, padB=74;
  PB={b, padL, padT,
      w:(W-padL-padR)/Math.max(1,(b.x1-b.x0)),
      h:(H-padT-padB)/Math.max(1,(b.y1-b.y0))};
  pv={ox:0, oy:0, s:1};
}
function pidBase(p){ return [PB.padL+(p[0]-PB.b.x0)*PB.w, PB.padT+(PB.b.y1-p[1])*PB.h]; }
function pidXY(n){ const b=pidBase(n.pid); return [b[0]*pv.s+pv.ox, b[1]*pv.s+pv.oy]; }
function pidYof(z){ return pidBase([0,z])[1]*pv.s+pv.oy; }
const fmtL=v=>v==null?'':v.toLocaleString('es-CO')+' L';

/* Tanks are drawn large and hollow on purpose: the interior is where a level will go
   once there is sensor data. Until then it reads as an empty vessel, which is honest. */
function pidTank(x,y,n,col,k){
  const units=n.unidades&&n.unidades.length||1;
  const w=Math.max(46, 22*units)*k, h=34*k;
  const x0=x-w/2, y0=y-h/2;
  cxp.fillStyle='rgba(8,12,16,.95)'; cxp.fillRect(x0,y0,w,h);
  const lvl=n.nivel_pct;                                   // filled in when sensors exist
  if(lvl!=null){ cxp.fillStyle=col+'55';
    cxp.fillRect(x0, y0+h*(1-lvl/100), w, h*lvl/100); }
  cxp.strokeStyle=col; cxp.lineWidth=2.2*Math.min(1.6,k); cxp.strokeRect(x0,y0,w,h);
  if(units>1){                                             // three vessels, one group
    cxp.strokeStyle=col+'88'; cxp.lineWidth=1;
    for(let u=1;u<units;u++){ const ux=x0+w*u/units;
      cxp.beginPath(); cxp.moveTo(ux,y0+2); cxp.lineTo(ux,y0+h-2); cxp.stroke(); }
  }
  if(lvl==null && k>0.7){                                  // dashed waterline = no reading
    cxp.strokeStyle='rgba(255,255,255,.18)'; cxp.setLineDash([4,4]); cxp.lineWidth=1;
    cxp.beginPath(); cxp.moveTo(x0+3,y-h*0.1); cxp.lineTo(x0+w-3,y-h*0.1); cxp.stroke();
    cxp.setLineDash([]);
  }
  return {hx:w/2, hy:h/2};
}
function pidSymbol(x,y,n,col,k){
  const t=n.tipo, r=9*k;
  if(t==='tanque') return pidTank(x,y,n,col,k);
  cxp.beginPath();
  if(t==='rompecargas'){ cxp.rect(x-r*1.6,y-r*1.1,r*3.2,r*2.2); }
  else if(t==='bebedero'){ cxp.moveTo(x-r*1.3,y-r*0.8); cxp.lineTo(x+r*1.3,y-r*0.8);
                           cxp.lineTo(x+r*0.8,y+r*0.8); cxp.lineTo(x-r*0.8,y+r*0.8); cxp.closePath(); }
  else if(t==='casa'){ cxp.moveTo(x-r,y+r); cxp.lineTo(x-r,y-r*0.2); cxp.lineTo(x,y-r*1.3);
                       cxp.lineTo(x+r,y-r*0.2); cxp.lineTo(x+r,y+r); cxp.closePath(); }
  else if(t==='represa'){ cxp.ellipse(x,y,r*2.1,r*1.1,0,0,7); }
  else if(t==='bocatoma'){ cxp.moveTo(x,y-r*1.2); cxp.lineTo(x+r*1.2,y+r*0.8);
                           cxp.lineTo(x-r*1.2,y+r*0.8); cxp.closePath(); }
  else if(t==='ventosa'){ const w=r*0.42;
      cxp.moveTo(x,y-r*1.4); cxp.lineTo(x+r,y-r*0.1); cxp.lineTo(x+w,y-r*0.1);
      cxp.lineTo(x+w,y+r); cxp.lineTo(x-w,y+r); cxp.lineTo(x-w,y-r*0.1);
      cxp.lineTo(x-r,y-r*0.1); cxp.closePath(); }
  else if(t==='valvula'){ cxp.moveTo(x-r,y-r*0.8); cxp.lineTo(x,y); cxp.lineTo(x-r,y+r*0.8);
      cxp.closePath(); cxp.moveTo(x+r,y-r*0.8); cxp.lineTo(x,y); cxp.lineTo(x+r,y+r*0.8);
      cxp.closePath(); }
  else { cxp.arc(x,y,r*0.72,0,7); }
  cxp.fillStyle = (t==='derivacion') ? col : 'rgba(8,12,16,.95)';
  cxp.fill();
  if(n.cota_nominal){ cxp.setLineDash([4,3]); }            // placed by inference, not measured
  cxp.strokeStyle=col; cxp.lineWidth=2*Math.min(1.6,k); cxp.stroke(); cxp.setLineDash([]);
  const W_={rompecargas:1.6, bebedero:1.3, represa:2.1, bocatoma:1.2, casa:1.0,
            ventosa:1.0, valvula:1.0}[t] || 0.72;
  return {hx:r*W_, hy:r*1.3};
}

/* Symbol size without drawing it — edges must be routed before nodes are painted. */
function symExtent(n,k){
  const r=9*k;
  if(n.tipo==='tanque'){
    const units=n.unidades&&n.unidades.length||1;
    return {hx:Math.max(46,22*units)*k/2, hy:34*k/2};
  }
  const W_={rompecargas:1.6, bebedero:1.3, represa:2.1, bocatoma:1.2, casa:1.0,
            ventosa:1.0, valvula:1.0}[n.tipo] || 0.72;
  return {hx:r*W_, hy:r*1.3};
}

/* ---- edge routing -------------------------------------------------------
   In this diagram Y *means* elevation, so a horizontal run at height Z is a claim
   that something happens at Z metres. A router that picks Y freely will sooner or
   later draw a line straight through an unrelated symbol, and the diagram then lies
   about what is connected to what — which is exactly what happened between T-1,
   Bebedero 9 and the ventosa, whose elevations differ by half a metre.

   So: generate several candidate polylines, score them against every symbol box,
   and take the cleanest. Collisions dominate the score; bends only break ties. */
function segHitsBox(a,b,r){
  const x0=Math.min(a[0],b[0])-1, x1=Math.max(a[0],b[0])+1;
  const y0=Math.min(a[1],b[1])-1, y1=Math.max(a[1],b[1])+1;
  return !(x1<r.x0 || x0>r.x1 || y1<r.y0 || y0>r.y1);
}
function routeScore(path,boxes){
  let hits=0, diag=0;
  for(let i=0;i<path.length-1;i++){
    const a=path[i], b=path[i+1];
    if(Math.abs(a[0]-b[0])>2 && Math.abs(a[1]-b[1])>2) diag++;   // not orthogonal
    for(const r of boxes) if(segHitsBox(a,b,r)) hits++;
  }
  return hits*100 + diag*12 + (path.length-2); // collisions ≫ diagonals ≫ bend count
}
function routeEdge(P,Q,boxes){
  const cands=[[P,Q]];
  cands.push([P,[P[0],Q[1]],Q]);                       // down this lane, in level
  cands.push([P,[Q[0],P[1]],Q]);                       // across, then down
  const mids=[(P[0]+Q[0])/2];
  for(const d of [22,-22,40,-40,64,-64,90,-90])
    mids.push((P[0]+Q[0])/2+d, P[0]+d, Q[0]+d);
  for(const cx of mids){
    cands.push([P,[cx,P[1]],[cx,Q[1]],Q]);             // the S: out, along, in level
    const s=Math.sign(Q[1]-P[1])*16 || 16;
    cands.push([P,[P[0],P[1]+s],[cx,P[1]+s],[cx,Q[1]],Q]);   // with a short stub first
  }
  let best=cands[0], bs=Infinity;
  for(const c of cands){ const sc=routeScore(c,boxes); if(sc<bs){ bs=sc; best=c; } }
  return {path:best, clean:bs<100};
}

function drawPid(){
  if(!D.net) return;
  if(!W||!H) resize();          // may be called before the async basemap sized the canvas
  if(!PB) pidFit();
  cvp.width=W*devicePixelRatio; cvp.height=H*devicePixelRatio;
  cvp.style.width=W+'px'; cvp.style.height=H+'px';
  cxp.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  cxp.fillStyle='#06080a'; cxp.fillRect(0,0,W,H);
  const by={}; for(const n of D.net.nodes) by[n.id]=n;
  const b=pidBounds(), k=Math.max(.55,Math.min(1.8,pv.s));

  /* elevation axis — the reason this layout is worth having */
  cxp.font='11px system-ui'; cxp.textAlign='left';
  const real=pidNodes().filter(n=>!n.cota_nominal).map(n=>n.pid[1]);
  const zTop=Math.max(...real);
  for(let z=Math.ceil(b.y0/25)*25; z<=zTop; z+=25){
    const y=pidYof(z); if(y<16||y>H-24) continue;
    cxp.strokeStyle='rgba(255,255,255,.07)'; cxp.lineWidth=1;
    cxp.beginPath(); cxp.moveTo(50,y); cxp.lineTo(W-8,y); cxp.stroke();
    cxp.fillStyle='rgba(255,255,255,.38)'; cxp.fillText(z+' m',8,y+4);
  }
  const yN=pidYof(zTop)-26;                     // above this line, heights are inferred
  if(yN>14&&yN<H){
    cxp.strokeStyle='rgba(255,255,255,.13)'; cxp.setLineDash([6,5]); cxp.lineWidth=1;
    cxp.beginPath(); cxp.moveTo(50,yN); cxp.lineTo(W-8,yN); cxp.stroke(); cxp.setLineDash([]);
    cxp.fillStyle='rgba(255,255,255,.3)'; cxp.font='italic 11px system-ui';
    cxp.fillText('cota desconocida — posición nominal',56,yN-6);
  }

  /* symbol boxes, so no pipe is ever drawn through a node it does not touch */
  const NB={};
  for(const n of pidNodes()){
    const [x,y]=pidXY(n), S=symExtent(n,k);
    NB[n.id]={x0:x-S.hx-3, x1:x+S.hx+3, y0:y-S.hy-3, y1:y+S.hy+3};
  }
  for(const e of D.net.edges){
    const a=by[e.from], c=by[e.to];
    if(!a||!a.pid||!c||!c.pid) continue;
    const p=pidXY(a), q=pidXY(c);
    const boxes=Object.keys(NB).filter(id=>id!==e.from&&id!==e.to).map(id=>NB[id]);
    const {path}=routeEdge(p,q,boxes);
    const uphill = a.cota_m!=null && c.cota_m!=null && c.cota_m>a.cota_m && !e.hipotetica;
    cxp.strokeStyle = uphill ? '#ff5252' : (e.hipotetica ? '#78909c' : '#b388ff');
    cxp.lineWidth = (uphill?3:2.4)*Math.min(1.4,k);
    cxp.setLineDash(e.hipotetica ? [7,6] : []);
    cxp.beginPath(); cxp.moveTo(path[0][0],path[0][1]);
    for(let i=1;i<path.length;i++) cxp.lineTo(path[i][0],path[i][1]);
    cxp.stroke(); cxp.setLineDash([]);
    if(uphill){
      let li=0, lw=-1;                       // label on the longest horizontal run
      for(let i=0;i<path.length-1;i++){
        if(Math.abs(path[i][1]-path[i+1][1])>2) continue;
        const w=Math.abs(path[i][0]-path[i+1][0]); if(w>lw){ lw=w; li=i; }
      }
      const mx=(path[li][0]+path[li+1][0])/2, my=path[li][1];
      const txt='▲ sube '+(c.cota_m-a.cota_m)+' m';
      cxp.font='bold 11px system-ui'; cxp.textAlign='center';
      const tw=cxp.measureText(txt).width;
      cxp.fillStyle='rgba(6,8,10,.92)';                    // chip, so it never gets lost
      cxp.fillRect(mx-tw/2-5, my-16, tw+10, 14);
      cxp.fillStyle='#ff5252'; cxp.fillText(txt,mx,my-5);
    }
  }

  const CONF={alta:'#00e676', media:'#ffd54f', baja:'#ff9100', contradicha:'#ff5252'};
  const boxes=[];
  const hits=(a)=>boxes.some(b=>!(a.x1<b.x0||a.x0>b.x1||a.y1<b.y0||a.y0>b.y1));
  for(const n of pidNodes()){
    const [x,y]=pidXY(n);
    const col=(D.tipoColour||{})[n.tipo]||'#90a4ae';
    const S=pidSymbol(x,y,n,col,k);
    const lines=[(n.nombre||n.id).replace(/\s*\(.*?\)\s*/g,' ').trim()];
    const sub=[ n.cota_m!=null ? n.cota_m+' m' : (n.cota_nominal?'cota ?':''),
                n.capacidad_l ? fmtL(n.capacidad_l) : '' ].filter(Boolean).join(' · ');
    if(sub) lines.push(sub);
    if(n.unidades) lines.push(n.unidades.length+' × '+fmtL(n.unidades[0].capacidad_l)+' · unión ?');
    cxp.font='bold 12px system-ui';
    const wpx=Math.max(...lines.map((t,i)=>{ cxp.font=(i?'11px':'bold 12px')+' system-ui';
                                             return cxp.measureText(t).width; }));
    const hpx=lines.length*12+6, gap=S.hx+12;
    let placed=null;
    for(const side of (n.pid[0]>=44 ? [1,-1] : [-1,1])){
      for(const dy of [0,-16,16,-30,30,-44,44]){
        const tx = x + side*gap, ty = y-2+dy;
        const box={x0: side>0?tx:tx-wpx, x1: side>0?tx+wpx:tx, y0:ty-11, y1:ty-11+hpx};
        if(!hits(box)){ placed={tx,ty,side,box}; break; }
      }
      if(placed) break;
    }
    if(!placed){ const tx=x+gap; placed={tx,ty:y-2,side:1,
      box:{x0:tx,x1:tx+wpx,y0:y-13,y1:y-13+hpx}}; }
    boxes.push(placed.box);
    cxp.textAlign = placed.side>0 ? 'left' : 'right';
    lines.forEach((t,i)=>{
      cxp.font=(i?'11px':'bold 12px')+' system-ui';
      cxp.fillStyle = i===0 ? '#dfe6ea' : (i===1?'rgba(255,255,255,.45)':'rgba(255,255,255,.3)');
      cxp.fillText(t, placed.tx, placed.ty + i*12);
    });
    if(Math.abs(placed.ty-(y-2))>4){          // label was nudged: tie it back to its symbol
      cxp.strokeStyle='rgba(255,255,255,.16)'; cxp.lineWidth=1;
      cxp.beginPath(); cxp.moveTo(x+placed.side*(S.hx+2), y);
      cxp.lineTo(placed.tx-placed.side*3, placed.ty-4); cxp.stroke();
    }
    cxp.beginPath(); cxp.arc(x-placed.side*(S.hx+6), y-S.hy-4, 3.2, 0, 7);
    cxp.fillStyle=CONF[n.pos_confianza||'baja']; cxp.fill();
  }

  cxp.textAlign='left'; cxp.font='11px system-ui';
  let lx=60, ly=H-14;
  for(const [c,t] of [['#00e676','confirmado'],['#ffd54f','bueno'],['#ff9100','aproximado'],
                      ['#ff5252','contradicho / imposible'],['#78909c','conexión hipotética']]){
    cxp.beginPath(); cxp.arc(lx,ly-4,3.4,0,7); cxp.fillStyle=c; cxp.fill();
    cxp.fillStyle='rgba(255,255,255,.55)'; cxp.fillText(t,lx+9,ly);
    lx += cxp.measureText(t).width + 30;
  }
}

function setPid(on){
  isPid=on;
  if(on && is3d) set3d(false);
  document.getElementById('cv').style.display = on ? 'none' : 'block';
  cvp.style.display = on ? 'block' : 'none';
  document.getElementById('btnPid').classList.toggle('on',on);
  document.getElementById('btn3d').style.display = on ? 'none' : 'inline-block';
  for(const id of ['side','read','scale']) document.getElementById(id).style.display = on?'none':'';
  for(const id of ['btnMeasure','btnClear','btnReset'])
    { const b=document.getElementById(id); if(b) b.style.display = on?'none':''; }
  const h=document.getElementById('mout'); if(h) h.style.display = on?'none':'';
  if(on) drawPid(); else draw();
}
if(D.net && D.net.nodes && D.net.nodes.some(n=>n.pid)){
  const b=document.getElementById('btnPid');
  b.style.display='inline-block';
  b.onclick=()=>setMode(isPid?'mapa':'esquema');
  let pd=null;
  cvp.addEventListener('mousedown',e=>{pd={x:e.clientX,y:e.clientY,ox:pv.ox,oy:pv.oy};});
  addEventListener('mouseup',()=>{pd=null;});
  addEventListener('mousemove',e=>{ if(!pd||!isPid)return;
    pv.ox=pd.ox+(e.clientX-pd.x); pv.oy=pd.oy+(e.clientY-pd.y); drawPid();});
  cvp.addEventListener('wheel',e=>{
    e.preventDefault();
    const old=pv.s;
    pv.s=Math.max(0.3,Math.min(4,pv.s*Math.exp(-e.deltaY*0.0016)));
    const r=pv.s/old;                       // zoom about the cursor, like the map
    pv.ox=e.clientX-(e.clientX-pv.ox)*r;
    pv.oy=e.clientY-(e.clientY-pv.oy)*r;
    drawPid();
  },{passive:false});
  addEventListener('resize',()=>{ if(isPid){ PB=null; drawPid(); } });
}

