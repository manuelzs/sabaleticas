/* ---- navigation: subsystems × views ------------------------------------
   Subsystems are data providers; views are renderers. The map is the one view
   every subsystem can contribute to, which is why "Finca" exists as its own tab
   rather than the map being duplicated inside each subsystem.
   See dashboard/ARCHITECTURE.md. Route lives in the hash: #agua/esquema. */
const NAV=[
  /* The shared surface: every subsystem's layers on one map. Not a subsystem itself —
     it is the orientation view, where water is read against land. */
  {id:'general', label:'General',
   views:[['estado','Estado'],['mapa','Mapa'],['3d','3D']]},
  {id:'agua',   label:'Agua',   views:[['esquema','Esquema'],['mapa','Mapa']]},
  /* A subsystem earns a tab when it offers a view the shared surface cannot.
     Agua does — the schematic. Predio does not yet: its map is General with fewer
     checkboxes. It activates when potreros bring a table (names, área, pendiente,
     pasto, acceso a agua), which is content, not layers. */
  {id:'predio', label:'Predio', views:[], disabled:true,
   why:'se activa con los potreros — hoy sería el mapa General con menos capas'},
  {id:'ganado', label:'Ganado',
   views:[['hato','Hato'],['movimientos','Movimientos'],['guias','Guías abiertas']]},
  /* Cross-cutting: these are not subsystems. Readings and tickets attach to entities
     and surface in context — a level inside a tank symbol, a badge on a marker. What
     earns these tabs is the MANAGEMENT view of them: "is my telemetry alive", "what
     work is open", which no entity-level badge can answer. */
  {id:'trabajo',  label:'Trabajo',  cross:true,
   views:[['pendientes','Pendientes']]},
  {id:'sensores', label:'Sensores', cross:true,
   views:[['lecturas','Lecturas'],['fuentes','Fuentes']]},
];
const NAV_LEGACY={mapa:'general/mapa','3d':'general/3d',esquema:'agua/esquema',
                  'finca/mapa':'general/mapa','finca/3d':'general/3d',
                  'sensores/lista':'sensores/lecturas'};
let route={tab:'general', view:'mapa'};

function navSub(id){ return NAV.find(s=>s.id===id); }

function navRender(){
  const tabs=document.getElementById('tabs'), views=document.getElementById('views');
  tabs.innerHTML=''; views.innerHTML='';
  let sepDone=false;
  for(const s of NAV){
    if(s.cross && !sepDone){                 // the axis changes here, so show it
      const sep=document.createElement('span'); sep.className='sep'; tabs.appendChild(sep);
      sepDone=true;
    }
    const b=document.createElement('button');
    b.textContent=s.label;
    if(s.id===route.tab) b.className='on';
    if(s.disabled){ b.disabled=true; b.title=s.why||''; }
    else b.onclick=()=>navGo(s.id);
    tabs.appendChild(b);
  }
  const av=document.createElement('button');            // findings live in a drawer
  av.innerHTML='Avisos<span class="badge cero" id="navAvisos">0</span>';
  av.onclick=()=>toggleDrawer();
  const sep2=document.createElement('span'); sep2.className='sep';
  tabs.appendChild(sep2); tabs.appendChild(av);
  const sub=navSub(route.tab);
  if(sub && sub.views.length>1) for(const [id,label] of sub.views){
    const b=document.createElement('button');
    b.textContent=label;
    if(id===route.view) b.className='on';
    b.onclick=()=>navGo(route.tab,id);
    views.appendChild(b);
  }
}

/* Views come in two kinds: canvas (mapa, 3d, esquema) and DOM (lista). The DOM ones
   need the map chrome out of the way entirely. */
const PAGE_VIEWS={lecturas:renderLecturas, fuentes:renderFuentes,
                  hato:renderHato, movimientos:renderMovimientos,
                  guias:renderGuias, estado:renderEstado,
                  pendientes:renderTrabajo};

function navApply(){
  const page=PAGE_VIEWS[route.view];
  if(isPid) setPid(false);
  if(is3d && route.view!=='3d') set3d(false);
  if(page){
    document.getElementById('cv').style.display='none';
    for(const id of ['side','read','scale','tools']){
      const el=document.getElementById(id); if(el) el.style.display='none'; }
    document.getElementById('page').style.display='block';
    page();
  } else {
    document.getElementById('page').style.display='none';
    for(const id of ['side','read','scale','tools']){
      const el=document.getElementById(id); if(el) el.style.display=''; }
    if(route.view==='esquema') setPid(true);
    else if(route.view==='3d'){ if(!is3d) set3d(true); }
    else { document.getElementById('cv').style.display='block'; draw(); }
  }
  buildLayers(route.tab==='general' ? null : route.tab); // scope the layer list
  navRender();
  renderDrawer();
  const h=route.tab+'/'+route.view;
  if(location.hash.slice(1)!==h){ try{ history.replaceState(null,'','#'+h); }catch(e){} }
}

function navGo(tab,view){
  const sub=navSub(tab);
  if(!sub || sub.disabled) return;
  const ids=sub.views.map(v=>v[0]);
  route={tab, view: ids.includes(view) ? view : ids[0]};
  navApply();
}

function navFromHash(){
  let h=(location.hash||'').slice(1);
  if(NAV_LEGACY[h]) h=NAV_LEGACY[h];                     // old #mapa / #3d / #esquema
  const [t,v]=h.split('/');
  const sub=navSub(t);
  return (sub && !sub.disabled) ? {tab:t, view:v} : null;
}

addEventListener('hashchange',()=>{ const r=navFromHash(); if(r) navGo(r.tab,r.view); });
addEventListener('load',()=>{                            // after the basemap has sized things
  const r=navFromHash();
  if(r) navGo(r.tab,r.view);
  else navGo('general', is3d ? '3d' : 'mapa');
});
