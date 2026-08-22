/* ---- Readings and their sources ---------------------------------------
   A READING is entity + magnitude + value + when + how it was obtained.
   A SOURCE is where it came from. A hand-written reading counts exactly as much as
   an automated one — only `origen` and the freshness we should expect differ.
   That is what lets the viewer show levels today, with no hardware at all. */
const SRC_STATE={
  en_linea:      ['#00e676','en línea'],
  sin_datos:     ['#ffd54f','sin datos'],
  por_investigar:['#ff9100','por investigar'],
  planificado:   ['#78909c','planificado'],
};
const MAG_UNIT={nivel:'%', temperatura:'°C'};

function readingAge(ts){
  const t=Date.parse(ts.length<=10 ? ts+'T12:00:00' : ts);
  if(isNaN(t)) return {label:'?', col:'#78909c', hours:1e9};
  const h=(Date.now()-t)/3.6e6;
  const label = h<1 ? 'hace minutos'
              : h<48 ? `hace ${Math.round(h)} h`
              : `hace ${Math.round(h/24)} d`;
  return {label, col: h<24?'#00e676' : h<24*8?'#ffd54f' : '#ff9100', hours:h};
}
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
    n.nivel_pct = (r && r.unidad==='%') ? parseFloat(r.valor) : null;
  }
}

/* ---- the two views of the Sensores tab -------------------------------- */
function cardReading(r){
  const a=readingAge(r.ts);
  return `<div class="card" style="--acc:${a.col}">
    <div class="top"><span class="dot"></span>${a.label}</div>
    <div class="big">${r.valor}<small>${r.unidad||''}</small></div>
    <div class="mag">${r.magnitud}</div>
    <div class="ent">${entityName(r.entidad)}</div>
    <div class="meta">${r.origen==='manual'?'✍︎ anotado a mano':'⚙ automático'}${
      r.fuente?' · '+r.fuente:''}</div>
    ${r.nota?`<div class="meta">${r.nota}</div>`:''}
  </div>`;
}
function cardSource(f){
  const [col,label]=SRC_STATE[f.estado]||['#78909c',f.estado||'?'];
  const ghost=f.estado==='planificado'||f.estado==='por_investigar';
  const canales=(f.canales||[]).map(c=>c.magnitud).join(' · ')||'—';
  const pend=(Array.isArray(f.pendiente)?f.pendiente:f.pendiente?[f.pendiente]:[]);
  return `<div class="card${ghost?' ghost':''}" style="--acc:${col}">
    <div class="top"><span class="dot"></span>${label}</div>
    <div class="big" style="font-size:19px">${canales}</div>
    <div class="mag">${f.origen==='manual'?'anotación humana':(f.transporte||'—')}</div>
    <div class="ent">${f.nombre}</div>
    <div class="meta">${f.entidad?entityName(f.entidad):'cualquier entidad'}</div>
    ${f.por_que_importa?`<div class="why">${f.por_que_importa}</div>`:''}
    ${pend.length?`<div class="why"><ul>${pend.map(p=>`<li>${p}</li>`).join('')}</ul></div>`:''}
  </div>`;
}

/* Everything we have decided to measure but have not measured yet. Derived from the
   sources — no placeholder rows in readings.csv, because a reading with no value is not
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
  const cap=(D.net&&D.net.nodes||[]).find(n=>n.id===p.entidad);
  const lit=cap&&cap.capacidad_l ? cap.capacidad_l.toLocaleString('es-CO')+' L' : '';
  return `<div class="card ghost" style="--acc:#78909c">
    <div class="top"><span class="dot"></span>esperando primera lectura</div>
    <div class="big">—<small>${p.unidad}</small></div>
    <div class="mag">${p.magnitud}</div>
    <div class="ent">${entityName(p.entidad)}</div>
    <div class="meta">${lit?lit+' · ':''}${p.fuente}</div>
    <div class="why">Se llena con una fila en <code>data/readings.csv</code> — a mano vale.</div>
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
  const live=S.filter(f=>f.estado==='en_linea').length;
  document.getElementById('pageInner').innerHTML=`
    <div class="sect"><h2>Fuentes</h2><span class="n">${live} de ${S.length} en línea</span></div>
    <div class="cards">${S.map(cardSource).join('')}</div>`;
}
