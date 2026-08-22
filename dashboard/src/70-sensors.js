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

function renderSensores(){
  const S=(D.sources&&D.sources.fuentes)||[];
  const R=Object.values(D.readings||{});
  const box=document.getElementById('pageInner');

  const readRows = R.length ? R.map(r=>{
    const a=readingAge(r.ts);
    return `<tr>
      <td><b>${entityName(r.entidad)}</b><div class="sub2">${r.entidad}</div></td>
      <td>${r.magnitud}</td>
      <td class="val">${r.valor} ${r.unidad||''}</td>
      <td><span class="pill" style="background:${a.col}22;color:${a.col}">${a.label}</span>
          <div class="sub2">${r.ts}</div></td>
      <td>${r.origen==='manual'?'✍︎ manual':'⚙ automático'}<div class="sub2">${r.fuente||''}</div></td>
      <td class="sub2">${r.nota||''}</td>
    </tr>`;}).join('')
    : `<tr><td colspan="6" class="sub2">Sin lecturas todavía. Una anotación manual ya cuenta:
        añade una fila a <code>data/readings.csv</code> y aparece aquí y en el mapa.</td></tr>`;

  const srcRows=S.map(f=>{
    const [col,label]=SRC_STATE[f.estado]||['#78909c',f.estado||'?'];
    const canales=(f.canales||[]).map(c=>c.magnitud+(c.unidad?` (${c.unidad})`:'')).join(' · ');
    const pend=(Array.isArray(f.pendiente)?f.pendiente:f.pendiente?[f.pendiente]:[]);
    return `<tr>
      <td><b>${f.nombre}</b>
          ${f.por_que_importa?`<div class="sub2">${f.por_que_importa}</div>`:''}
          ${pend.length?`<ul class="todo">${pend.map(p=>`<li>${p}</li>`).join('')}</ul>`:''}</td>
      <td><span class="pill" style="background:${col}22;color:${col}">${label}</span></td>
      <td>${f.origen==='manual'?'✍︎ manual':'⚙ automático'}</td>
      <td>${f.entidad?entityName(f.entidad):'—'}</td>
      <td>${canales||'—'}</td>
      <td>${f.transporte||'—'}</td>
    </tr>`;}).join('');

  box.innerHTML=`
    <h2>Lecturas</h2>
    <p class="lead">Una lectura es <b>entidad + magnitud + valor + fecha + cómo se obtuvo</b>.
      Una anotación a mano vale igual que una automática — cambia el <b>origen</b> y la frescura
      que cabe esperar, no la lectura. Por eso esto funciona hoy, sin comprar nada.</p>
    <table><thead><tr><th>Entidad</th><th>Magnitud</th><th>Valor</th><th>Actualizado</th>
      <th>Origen</th><th>Nota</th></tr></thead><tbody>${readRows}</tbody></table>

    <h2 style="margin-top:34px">Fuentes</h2>
    <p class="lead">De dónde vienen (o vendrán) esas lecturas.
      <b>${S.filter(f=>f.estado==='en_linea').length} de ${S.length} en línea.</b>
      La regla del proyecto sigue siendo <b>arreglar primero, medir después</b>.</p>
    <table><thead><tr><th>Fuente</th><th>Estado</th><th>Origen</th><th>Entidad</th>
      <th>Canales</th><th>Transporte</th></tr></thead><tbody>${srcRows}</tbody></table>`;
}
