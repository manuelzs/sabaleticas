/* ---- findings: rules over data, not prose ------------------------------
   Every sentence a view shows has to be GENERATED. A paragraph written by hand
   describes this farm on this day; point the app at a second farm and someone has
   to write it again. So observations live here as rules: each one tests the data
   and, if it fires, emits a short templated line.

   This is the same mechanism as a sensor alert — a rule fires, a finding attaches
   to an entity. Alerts and insights differ only in what they watch. */
const SEV={alta:['#ff5252','alta'], media:['#ffd54f','media'], info:['#4fc3f7','info']};
const pct=(a,b)=>b?Math.round(a/b*100):0;
const dias=ts=>Math.round(ageHours(ts)/24);

const RULES=[
  { id:'hato-obsoleto', sev:'alta', ir:'ganado/hato',
    run:D=>{ if(!D.herd) return;
      const f=freshness(D.herd.fecha,'conteo');
      if(f.estado==='fresco') return;
      return {t:`Conteo del hato sin actualizar`, v:`${dias(D.herd.fecha)} d`,
              d:`vigencia ${Math.round(f.vigencia/24)} d`}; } },

  { id:'concentracion-etaria', sev:'media', ir:'ganado/hato',
    run:D=>{ if(!D.herd) return;
      const by={};
      for(const g of D.herd.grupos) by[g.clase]=(by[g.clase]||0)+g.head;
      const band=['1–2 años','2–3 años'].reduce((s,k)=>s+(by[k]||0),0);
      const p=pct(band,D.herd.total);
      if(p<60) return;
      return {t:`Hato concentrado en 1–3 años`, v:`${p} %`,
              d:`${band} de ${D.herd.total} reses`}; } },

  { id:'guias-sin-conteo', sev:'alta', ir:'ganado/movimientos',
    run:D=>{ const M=D.movements||[]; if(!M.length) return;
      const sin=M.filter(m=>!(+m.head>0)).length;
      const p=pct(sin,M.length);
      if(p<20) return;
      return {t:`Guías sin conteo de reses`, v:`${p} %`, d:`${sin} de ${M.length}`}; } },

  { id:'concentracion-destino', sev:'media', ir:'ganado/movimientos',
    run:D=>{ const M=D.movements||[]; if(!M.length) return;
      const c={}; for(const m of M) c[m.destino||'—']=(c[m.destino||'—']||0)+1;
      const [dest,n]=Object.entries(c).sort((a,b)=>b[1]-a[1])[0];
      const p=pct(n,M.length);
      if(p<40) return;
      return {t:`Concentración de destino`, v:`${p} %`, d:dest}; } },

  { id:'horizonte-movimientos', sev:'media', ir:'ganado/movimientos',
    run:D=>{ const f=(D.movements||[]).map(m=>m.mov_date).filter(Boolean).sort();
      if(!f.length) return;
      const d=dias(f[f.length-1]);
      if(d<30) return;
      return {t:`Sin movimientos cargados`, v:`${d} d`, d:`último ${f[f.length-1]}`}; } },

  { id:'guias-varadas', sev:'alta', ir:'ganado/guias',
    run:D=>{ const M=(D.movements||[]).filter(m=>ABIERTO.includes(m.estado)
               && ageHours(m.mov_date)/24>30);
      if(!M.length) return;
      const peor=Math.max(...M.map(m=>Math.round(ageHours(m.mov_date)/24)));
      return {t:`Guías abiertas hace más de 30 d`, v:`${M.length}`,
              d:`la más antigua, ${peor} d`}; } },

  { id:'potreros-sin-agua-conducida', sev:'media', ir:'general/mapa',
    run:D=>{ const L=(D.layers||[]).find(l=>l.name.indexOf('Potreros')===0);
      if(!L) return;
      const mal=L.features.filter(f=>f.sinAgua || f.soloNatural);
      if(!mal.length) return;
      const ha=mal.reduce((s,f)=>s+(f.areaHa||0),0);
      return {t:`Potreros sin bebedero mapeado`, v:`${mal.length}`,
              d:`${ha.toFixed(1)} ha · fuente por confirmar`}; } },

  { id:'lecturas-obsoletas', sev:'media', ir:'sensores/lecturas',
    run:D=>{ const R=Object.values(D.readings||{});
      const old=R.filter(r=>freshness(r.ts,r.magnitud).estado==='obsoleto');
      if(!old.length) return;
      return {t:`Lecturas fuera de vigencia`, v:`${old.length}`,
              d:old.map(r=>r.magnitud).join(', ')}; } },

  { id:'sin-telemetria', sev:'info', ir:'sensores/fuentes',
    run:D=>{ const S=(D.sources&&D.sources.fuentes)||[];
      const plan=S.filter(f=>f.estado==='planificado').length;
      if(!plan) return;
      return {t:`Fuentes planificadas sin conectar`, v:`${plan}`, d:`de ${S.length}`}; } },

  { id:'red-imposible', sev:'alta', ir:'agua/esquema',
    run:D=>{ if(!D.net) return;
      const by={}; for(const n of D.net.nodes) by[n.id]=n;
      const bad=D.net.edges.filter(e=>{ const a=by[e.from],b=by[e.to];
        return !e.hipotetica && a&&b && a.cota_m!=null && b.cota_m!=null && b.cota_m>a.cota_m;});
      if(!bad.length) return;
      return {t:`Tramos que suben`, v:`${bad.length}`, d:`imposible por gravedad`}; } },

  /* Names the points rather than counting them. A count sends you looking; a list
     tells you what to take to the field. These were briefly nine hand-written tickets
     until the duplication showed up — the rule already knew, it just would not say. */
  { id:'posiciones-sin-confirmar', sev:'info', ir:'agua/esquema',
    run:D=>{ if(!D.net) return;
      const baja=D.net.nodes.filter(n=>n.pos_confianza==='baja');
      if(!baja.length) return;
      return {t:`Puntos por medir en campo`, v:`${baja.length}`,
              d:baja.map(n=>n.nombre||n.id).join(' · ')}; } },

  /* Same reasoning: a dashed line on the schematic is a claim we have not verified,
     and there were four tickets restating it by hand before this rule existed. */
  { id:'conexiones-hipoteticas', sev:'info', ir:'agua/esquema',
    run:D=>{ if(!D.net) return;
      const by={}; for(const n of D.net.nodes) by[n.id]=n;
      const h=D.net.edges.filter(e=>e.hipotetica);
      if(!h.length) return;
      const nom=e=>`${(by[e.from]||{}).nombre||e.from} → ${(by[e.to]||{}).nombre||e.to}`;
      return {t:`Conexiones sin confirmar`, v:`${h.length}`,
              d:h.map(nom).join(' · ')}; } },
];

function findings(){
  const out=[];
  for(const r of RULES){
    let f=null;
    try{ f=r.run(D); }catch(e){ f=null; }
    if(f) out.push(Object.assign({id:r.id, sev:r.sev, ir:r.ir}, f));
  }
  const order={alta:0,media:1,info:2};
  return out.sort((a,b)=>order[a.sev]-order[b.sev]);
}

function renderDrawer(){
  const F=findings(), el=document.getElementById('drawer');
  el.innerHTML=`<div class="dhead">Avisos<span class="n">${F.length}</span></div>` +
    (F.length ? F.map(f=>{
      const [col]=SEV[f.sev];
      return `<button class="fnd" style="--acc:${col}" data-ir="${f.ir}">
        <div class="fv">${f.v}</div>
        <div class="ft">${f.t}</div>
        <div class="fd">${f.d||''}</div></button>`;}).join('')
      : `<div class="fd" style="padding:14px 16px">Nada que reportar.</div>`);
  for(const b of el.querySelectorAll('.fnd')) b.onclick=()=>{
    const [t,v]=b.dataset.ir.split('/'); navGo(t,v); toggleDrawer(false); };
  const badge=document.getElementById('navAvisos');
  if(badge){
    const alta=F.filter(f=>f.sev==='alta').length;
    badge.textContent=F.length;
    badge.className = alta ? 'badge alta' : (F.length ? 'badge' : 'badge cero');
  }
}
/* The same findings as a page. The drawer is for glancing from wherever you are; the
   view is for reading them next to the tickets, which is where the two kinds of
   attention belong side by side. One source, two surfaces. */
function renderAvisos(){
  const F=findings();
  document.getElementById('page').innerHTML=
    `<h2>Avisos <small class="muted">${F.length}</small></h2>
     <p class="muted">Derivados: los calcula una regla sobre los datos cada vez que abres
     la página. Aparecen solos y desaparecen solos. Lo que hay que <b>decidir</b> vive en
     Pendientes.</p>` +
    (F.length ? `<div class="tks">` + F.map(f=>{
      const [col,lab]=SEV[f.sev];
      return `<div class="tk" style="border-left-color:${col}">
        <div class="tkh"><b>${f.v}</b> ${f.t}
          <span class="nopos">${lab}</span></div>
        <div class="tkt">${f.d||''}</div></div>`;}).join('') + `</div>`
      : `<p class="muted">Nada que reportar.</p>`);
}

function toggleDrawer(on){
  const el=document.getElementById('drawer');
  const open = on===undefined ? !el.classList.contains('open') : on;
  el.classList.toggle('open',open);
  if(open) renderDrawer();
}
