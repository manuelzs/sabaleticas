/* ---- Readings and their sources ---------------------------------------
   A READING is entity + magnitude + value + when + how it was obtained.
   A SOURCE is where it came from. A hand-written reading counts exactly as much as
   an automated one — only `origen` and the freshness we should expect differ.
   That is what lets the viewer show levels today, with no hardware at all. */
const SRC_STATE={
  en_linea:      ['#00e676','en línea'],
  a_mano:        ['#4fc3f7','a mano'],
  sin_datos:     ['#ffd54f','sin datos'],
  por_investigar:['#ff9100','por investigar'],
  planificado:   ['#78909c','planificado'],
};
const MAG_UNIT={nivel:'%', temperatura:'°C'};

const readingAge=(ts,mag)=>freshness(ts,mag);   // superseded by the shared model
function readingsFor(eid){
  const R=D.readings||{};
  return Object.keys(R).filter(k=>k.split('|')[0]===eid).map(k=>R[k]);
}
function entityName(id){
  const n=(D.net&&D.net.nodes||[]).find(n=>n.id===id);
  return n ? (n.nombre||id) : id;
}
/* level readings drive the tank fill in the schematic */
function applyReadingsToNet(){
  if(!D.net) return;
  for(const n of D.net.nodes){
    const r=(D.readings||{})[n.id+'|nivel'];
    // an obsolete level must not paint a tank — it would assert a state we do not know
    n.nivel_pct = (r && r.unidad==='%' && freshness(r.ts,'nivel').estado!=='obsoleto')
      ? parseFloat(r.valor) : null;
  }
}

/* ---- the two views of the Sensores tab -------------------------------- */
function cardReading(r){
  const a=freshness(r.ts, r.magnitud);
  const dead=a.estado==='obsoleto';
  return `<div class="card${dead?' ghost':''}" style="--acc:${a.col}">
    <div class="top"><span class="dot"></span>${a.label}${
      a.estado!=='fresco'?` · ${a.estado} (vigencia ${a.vigencia} h)`:''}</div>
    <div class="big"${dead?' style="color:#4b5761"':''}>${
      dead?'—':r.valor}<small>${r.unidad||''}</small></div>
    <div class="mag">${r.magnitud}</div>
    <div class="ent">${entityName(r.entidad)}</div>
    <div class="meta">${r.origen==='manual'?'✍︎ anotado a mano':'⚙ automático'}${
      r.fuente?' · '+r.fuente:''}</div>
    ${r.nota?`<div class="meta">${r.nota}</div>`:''}
  </div>`;
}
/* Two periods wide so it can slide one period and repeat seamlessly. */
function sparkPath(live){
  const pts=[];
  for(let x=0;x<=132;x+=3){
    const y = live ? 11 - 6.5*Math.sin(x/66*Math.PI*2) : 11;
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return 'M'+pts.join(' L');
}
function spark(live){
  return `<svg class="spark${live?' live':''}" viewBox="0 0 66 22" preserveAspectRatio="none">
    <path d="${sparkPath(live)}"/></svg>`;
}
/* A source is "flowing" if something it produced arrived recently — not merely if we
   have declared it online. Manual transcription counts: data is data. */
function freshFrom(f){
  return Object.values(D.readings||{})
    .find(r=>r.fuente===f.id && freshness(r.ts,r.magnitud).estado!=='obsoleto') || null;
}
/* Data is arriving — by whatever route. The sparkline shows flow, the pill shows
   whether the DEVICE is connected. A hand-typed value is real data and a
   disconnected sensor at the same time, and the row should say both. */
function sourceLive(f){ return !!freshFrom(f); }

/* Declared status is an intention; this is what is true. A source declared online that
   has been silent for days shows "sin datos", because declaring is not measuring.
   The pill and the sparkline both read from data flow, so they cannot disagree. */
function effState(f){
  const r=freshFrom(f);
  if(r) return r.origen==='automatico' ? 'en_linea' : 'a_mano';
  if(f.estado==='en_linea') return 'sin_datos';
  return f.estado;
}
function rowSource(f){
  const st=effState(f);
  const [col,label]=SRC_STATE[st]||['#78909c',st||'?'];
  const canales=(f.canales||[]).map(c=>c.magnitud).join(' · ')||'—';
  return `<div class="row" style="--acc:${col}">
    <div class="main"><div class="nm">${f.origen==='manual'?'✍︎':'⚙'} ${f.nombre}</div></div>
    <div class="side">
      <div class="col"><div class="k">canales</div><div class="v">${canales}</div></div>
      <div class="col"><div class="k">entidad</div>
        <div class="v">${f.entidad?entityName(f.entidad):'cualquiera'}</div></div>
      <div class="col narrow"><div class="k">transporte</div>
        <div class="v">${f.transporte||'—'}</div></div>
      <div class="col narrow"><div class="k">estado</div>
        <div class="v"><span class="pill" style="background:${col}22;color:${col}">${label}</span></div></div>
      ${spark(sourceLive(f))}
    </div>
  </div>`;
}

/* Everything we have decided to measure but have not measured yet. Derived from the
   sources — no placeholder rows in the series, because a reading with no value is not
   a reading. These are slots, and they say plainly what would fill them. */
function pendingSlots(){
  const R=D.readings||{}, out=[];
  for(const f of (D.sources&&D.sources.fuentes)||[]){
    if(!f.entidad) continue;
    for(const c of f.canales||[]){
      const mag=c.magnitud;
      if(R[f.entidad+'|'+mag]) continue;
      if(out.some(o=>o.entidad===f.entidad && o.magnitud===mag)) continue;
      out.push({entidad:f.entidad, magnitud:mag, unidad:c.unidad||'',
                fuente:f.nombre, estado:f.estado});
    }
  }
  return out;
}
function cardPending(p){
  const n=(D.net&&D.net.nodes||[]).find(n=>n.id===p.entidad);
  const lit=n&&n.capacidad_l ? n.capacidad_l.toLocaleString('es-CO')+' L' : '';
  return `<div class="card ghost" style="--acc:#78909c">
    <div class="top"><span class="dot"></span>esperando primera lectura</div>
    <div class="big">—<small>${p.unidad}</small></div>
    <div class="mag">${p.magnitud}</div>
    <div class="ent">${entityName(p.entidad)}</div>
    <div class="meta">${lit?lit+' · ':''}${p.fuente}</div>
  </div>`;
}

function renderLecturas(){
  const R=Object.values(D.readings||{});
  const P=pendingSlots();
  document.getElementById('pageInner').innerHTML=`
    <div class="sect"><h2>Lecturas</h2>
      <span class="n">${R.length} con dato · ${P.length} esperando</span></div>
    <div class="cards">${R.map(cardReading).join('')}${P.map(cardPending).join('')}</div>`;
}

function renderFuentes(){
  const S=(D.sources&&D.sources.fuentes)||[];
  const live=S.filter(f=>effState(f)==='en_linea').length;
  document.getElementById('pageInner').innerHTML=`
    <div class="sect"><h2>Fuentes</h2><span class="n">${live} de ${S.length} en línea</span></div>
    <div class="rows">${S.map(rowSource).join('')}</div>`;
}
