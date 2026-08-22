/* ================= edge picker =================
   Manuel needs to point at a specific LINE, not describe it. Hovering lights up the
   segment under the cursor across every visible layer; a click selects it, ⌘/Ctrl-click
   adds to the selection. The picks are written to localStorage so they can be read back
   verbatim instead of being reconstructed from a screenshot. */
let edgeMode=false, hoverE=null, picks=[];
try{ picks=JSON.parse(localStorage.getItem('sab_aristas')||'[]'); }catch(e){ picks=[]; }
const pickSave=()=>{ try{localStorage.setItem('sab_aristas',JSON.stringify(picks));}catch(e){} };
const EDGE_PX=14;

/* Contours are excluded: there are thousands of them and they already have their own
   hover. Everything else — cercas, potreros, linderos, vecinos, agua — is fair game. */
function edgePickable(L){ return L.on && !isContour(L) && L.kind!=='point'; }

/* every segment of a feature, whatever its geometry type */
function eachSeg(f, cb){
  const t=f.t, c=f.c;
  const rings = t==='LineString' ? [c]
              : t==='MultiLineString' ? c
              : t==='Polygon' ? c
              : t==='MultiPolygon' ? [].concat.apply([],c) : [];
  rings.forEach((r,ri)=>{ for(let k=1;k<r.length;k++) cb(r[k-1],r[k],ri,k-1); });
}
function edgeKey(p){ return p.capa+'|'+p.fi+'|'+p.ri+'|'+p.si; }

function findEdge(px,py){
  let best=null, bd=EDGE_PX;
  D.layers.forEach(L=>{
    if(!edgePickable(L)) return;
    L.features.forEach((f,fi)=>{
      const bb=bboxOf(f);
      const p0=toScreen(bb[0],bb[3]), p1=toScreen(bb[2],bb[1]);
      if(px<p0[0]-EDGE_PX||px>p1[0]+EDGE_PX||py<p0[1]-EDGE_PX||py>p1[1]+EDGE_PX) return;
      eachSeg(f,(a,b,ri,si)=>{
        const sa=toScreen(a[0],a[1]), sb=toScreen(b[0],b[1]);
        const d=segDist(px,py,sa[0],sa[1],sb[0],sb[1]);
        if(d<bd){ bd=d; best={capa:L.name, col:L.colour, etiqueta:f.l||null, eid:f.eid||null,
                              fi, ri, si, a:[+a[0].toFixed(6),+a[1].toFixed(6)],
                              b:[+b[0].toFixed(6),+b[1].toFixed(6)],
                              largo_m:+dist(a,b).toFixed(1)}; }
      });
    });
  });
  return best;
}

function drawEdges(){
  if(!edgeMode) return;
  const seg=(p,w,col,glow)=>{
    const sa=toScreen(p.a[0],p.a[1]), sb=toScreen(p.b[0],p.b[1]);
    cx.save(); cx.lineCap='round';
    if(glow){ cx.shadowColor=glow; cx.shadowBlur=12; }
    cx.strokeStyle=col; cx.lineWidth=w;
    cx.beginPath(); cx.moveTo(sa[0],sa[1]); cx.lineTo(sb[0],sb[1]); cx.stroke();
    cx.restore();
    return [sa,sb];
  };
  if(hoverE && !picks.some(p=>edgeKey(p)===edgeKey(hoverE))) seg(hoverE,5,'rgba(255,255,255,.9)','#fff');
  picks.forEach((p,i)=>{
    const [sa,sb]=seg(p,5,'#ff4081','#ff4081');
    [sa,sb].forEach(s=>{ cx.fillStyle='#fff'; cx.strokeStyle='#7a0032'; cx.lineWidth=2;
      cx.beginPath(); cx.arc(s[0],s[1],4.5,0,7); cx.fill(); cx.stroke(); });
    const mx=(sa[0]+sb[0])/2, my=(sa[1]+sb[1])/2;
    cx.font='bold 12px system-ui'; cx.textAlign='center';
    cx.fillStyle='rgba(8,12,16,.9)';
    cx.beginPath(); cx.arc(mx,my,10,0,7); cx.fill();
    cx.strokeStyle='#ff4081'; cx.lineWidth=1.5; cx.stroke();
    cx.fillStyle='#fff'; cx.fillText(i+1,mx,my+4); cx.textAlign='left';
  });
}

function edgeList(){
  const el=document.getElementById('eout'); if(!el) return;
  document.getElementById('enum').textContent=picks.length;
  el.innerHTML = picks.length ? picks.map((p,i)=>
    `<div style="display:flex;gap:6px;padding:3px 0;border-top:1px solid var(--line)">
       <b style="color:#ff4081">${i+1}</b>
       <div style="flex:1;line-height:1.45">
         <span style="color:${p.col}">${p.capa}</span>${p.etiqueta?' · <b>'+p.etiqueta+'</b>':''}
         <div style="color:var(--muted);font-size:11px">${p.largo_m} m ·
           ${p.a[1].toFixed(6)},${p.a[0].toFixed(6)} → ${p.b[1].toFixed(6)},${p.b[0].toFixed(6)}</div>
       </div>
       <a href="#" data-i="${i}" class="edel" style="color:#ef5350;text-decoration:none">✕</a>
     </div>`).join('')
    : '<span style="color:var(--muted)">Pasa el cursor sobre una línea y haz clic. '+
      '⌘/Ctrl+clic añade a la selección.</span>';
  el.querySelectorAll('.edel').forEach(a=>a.onclick=ev=>{
    ev.preventDefault(); picks.splice(+a.dataset.i,1); pickSave(); edgeList(); draw(); });
}

function edgeClick(px,py,add){
  const e=findEdge(px,py);
  if(!e){ if(!add){ picks=[]; pickSave(); edgeList(); draw(); } return; }
  const k=edgeKey(e), at=picks.findIndex(p=>edgeKey(p)===k);
  if(add) at>=0 ? picks.splice(at,1) : picks.push(e);
  else picks = at>=0 && picks.length===1 ? [] : [e];
  pickSave(); edgeList(); draw();
}

function setEdgeMode(on){
  edgeMode=on; hoverE=null;
  const b=document.getElementById('btnEdges'); if(b) b.classList.toggle('on',on);
  const p=document.getElementById('epanel'); if(p) p.style.display=on?'block':'none';
  cv.style.cursor = on?'crosshair':'';
  edgeList(); draw();
}

document.getElementById('btnEdges').onclick=()=>setEdgeMode(!edgeMode);
document.getElementById('btnEdgeClear').onclick=()=>{ picks=[]; pickSave(); edgeList(); draw(); };
document.getElementById('btnEdgeCopy').onclick=()=>{
  const t=JSON.stringify(picks,null,1);
  navigator.clipboard.writeText(t).then(()=>{
    const b=document.getElementById('btnEdgeCopy'); b.textContent='✓';
    setTimeout(()=>b.textContent='Copiar',900);
  }).catch(()=>{});
};
edgeList();
