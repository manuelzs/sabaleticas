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

function renderLecturas(){
  const R=Object.values(D.readings||{});
  document.getElementById('pageInner').innerHTML=`
    <div class="sect"><h2>Lecturas</h2><span class="n">${R.length} · última por entidad</span></div>
    <p class="lead">Entidad + magnitud + valor + fecha + <b>cómo se obtuvo</b>. Una anotación a
      mano vale igual que una automática: cambia el <b>origen</b> y la frescura que cabe esperar,
      no la lectura. Por eso esto funciona hoy, sin comprar nada.</p>
    <div class="cards">${
      R.length ? R.map(cardReading).join('')
      : `<div class="card ghost" style="--acc:#78909c"><div class="top">sin lecturas</div>
         <div class="big" style="font-size:19px">—</div>
         <div class="why">Añade una fila a <code>data/readings.csv</code> y aparece aquí,
         en el mapa y en el esquema.</div></div>`}</div>`;
}

function renderFuentes(){
  const S=(D.sources&&D.sources.fuentes)||[];
  const live=S.filter(f=>f.estado==='en_linea').length;
  document.getElementById('pageInner').innerHTML=`
    <div class="sect"><h2>Fuentes</h2><span class="n">${live} de ${S.length} en línea</span></div>
    <p class="lead">De dónde vienen, o vendrán, las lecturas. Cada una se ancla a una
      <b>entidad</b>, y por eso un valor puede dibujarse sobre el mapa y sobre el esquema sin
      plomería adicional. La regla sigue siendo <b>arreglar primero, medir después</b>.</p>
    <div class="cards">${S.map(cardSource).join('')}</div>`;
}
