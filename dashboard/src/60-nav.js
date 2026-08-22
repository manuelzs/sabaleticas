/* ---- navigation: subsystems × views ------------------------------------
   Subsystems are data providers; views are renderers. The map is the one view
   every subsystem can contribute to, which is why "Finca" exists as its own tab
   rather than the map being duplicated inside each subsystem.
   See dashboard/ARCHITECTURE.md. Route lives in the hash: #agua/esquema. */
const NAV=[
  /* The shared surface: every subsystem's layers on one map. Not a subsystem itself —
     it is the orientation view, where water is read against land. */
  {id:'general', label:'General', views:[['mapa','Mapa'],['3d','3D']]},
  {id:'agua',   label:'Agua',   views:[['esquema','Esquema'],['mapa','Mapa']]},
  {id:'predio', label:'Predio', views:[['mapa','Mapa']]},
  {id:'ganado', label:'Ganado', views:[], disabled:true, why:'sin datos de ganado todavía'},
  /* Cross-cutting: these are not subsystems. Readings and tickets attach to entities
     and surface in context — a level inside a tank symbol, a badge on a marker. What
     earns these tabs is the MANAGEMENT view of them: "is my telemetry alive", "what
     work is open", which no entity-level badge can answer. */
  {id:'trabajo',  label:'Trabajo',  views:[], disabled:true, cross:true,
   why:'tareas y alertas sobre cualquier entidad — pendiente'},
  {id:'sensores', label:'Sensores', views:[], disabled:true, cross:true,
   why:'estado de los equipos: última lectura, batería, señal — pendiente'},
];
const NAV_LEGACY={mapa:'general/mapa','3d':'general/3d',esquema:'agua/esquema',
                  'finca/mapa':'general/mapa','finca/3d':'general/3d'};
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
  const sub=navSub(route.tab);
  if(sub && sub.views.length>1) for(const [id,label] of sub.views){
    const b=document.createElement('button');
    b.textContent=label;
    if(id===route.view) b.className='on';
    b.onclick=()=>navGo(route.tab,id);
    views.appendChild(b);
  }
}

function navApply(){
  if(route.view==='esquema'){ if(!isPid) setPid(true); }
  else if(route.view==='3d'){ if(isPid) setPid(false); if(!is3d) set3d(true); }
  else { if(isPid) setPid(false); if(is3d) set3d(false); }
  buildLayers(route.tab==='general' ? null : route.tab); // scope the layer list
  navRender();
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
