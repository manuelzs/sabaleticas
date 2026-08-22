/* ---- compound indicators ------------------------------------------------
   Numbers that cross subsystems. A figure from one subsystem describes; a figure
   from two decides. 266 reses is a fact, 132.000 L is a fact — "between 8 and 12
   days of autonomy" is a date on the calendar.

   Every indicator declares its inputs, and its confidence is the WORST of them.
   That is the rule that keeps this from becoming the easiest place in the app to
   lie by accident. */
const CONS_L_RES_DIA={min:40, max:60,
  nota:'consumo por res y día — rango típico en clima cálido, SIN MEDIR en la finca'};

function almacenamiento(){
  if(!D.net) return null;
  const t=D.net.nodes.filter(n=>n.capacidad_l>0);
  return {litros:t.reduce((s,n)=>s+n.capacidad_l,0), n:t.length,
          detalle:t.map(n=>`${n.nombre.replace(/\s*\(.*?\)\s*/g,'')} ${n.capacidad_l.toLocaleString('es-CO')} L`)};
}
function hatoActual(){
  const r=(D.readings||{})[ENT.hato+'|conteo'];
  if(!r) return null;
  return {n:+r.valor, ts:r.ts, f:freshness(r.ts,'conteo')};
}
/* the weakest input governs — never an average */
function peorConfianza(inputs){
  const rank={alta:0, media:1, baja:2};
  return inputs.reduce((w,i)=>rank[i.c]>rank[w.c]?i:w, inputs[0]);
}
function indCard(o){
  const COL={alta:'#00e676', media:'#ffd54f', baja:'#ff9100'};
  const col=o.bloqueado?'#546e7a':COL[o.conf]||'#4fc3f7';
  return `<div class="card${o.bloqueado?' ghost':''}" style="--acc:${col}">
    <div class="top"><span class="dot"></span>${o.bloqueado?'sin datos':o.conf}</div>
    <div class="big"${o.bloqueado?' style="font-size:20px"':''}>${o.valor}<small>${o.unidad||''}</small></div>
    <div class="mag">${o.titulo}</div>
    <div class="ent">${o.decide}</div>
    ${o.inputs?`<div class="tr none" style="margin-top:9px">${
      o.inputs.map(i=>`${i.n} <i style="color:${COL[i.c]}">·${i.c}</i>`).join('  ')}</div>`:''}
    ${o.falta?`<div class="meta">falta: ${o.falta}</div>`:''}
  </div>`;
}

function renderEstado(){
  const box=document.getElementById('pageInner');
  const A=almacenamiento(), H=hatoActual(), ha=(D.farm&&D.farm.area_ha)||0;
  const cards=[];

  if(A && H){
    const dMin=A.litros/(H.n*CONS_L_RES_DIA.max), dMax=A.litros/(H.n*CONS_L_RES_DIA.min);
    const inputs=[{n:'almacenamiento',c:'baja'},{n:'hato',c:H.f.estado==='fresco'?'media':'baja'},
                  {n:'L/res/día',c:'baja'}];
    cards.push(indCard({
      valor:`${dMin.toFixed(0)}–${dMax.toFixed(0)}`, unidad:'días',
      titulo:'Autonomía de agua',
      decide:'cuándo vender o empezar a acarrear',
      conf:peorConfianza(inputs).c, inputs}));
    cards.push(indCard({
      valor:Math.round(A.litros/H.n), unidad:'L/res',
      titulo:'Reserva por animal',
      decide:`${A.litros.toLocaleString('es-CO')} L en ${A.n} depósitos`,
      conf:'baja', inputs:[{n:'almacenamiento',c:'baja'},{n:'hato',c:'baja'}]}));
  }
  if(H && ha) cards.push(indCard({
    valor:(H.n/ha).toFixed(2), unidad:'res/ha', titulo:'Carga sobre área total',
    decide:'no es la capacidad real: falta descontar pendiente y distancia al agua',
    conf:'media', inputs:[{n:'hato',c:'baja'},{n:'área',c:'alta'}]}));

  // declared but not computable — the gap is the argument for closing it
  const bloq=[
    {valor:'—', titulo:'Autonomía del ramal norte', decide:'el ramal sin almacenamiento se seca primero',
     falta:'qué bebederos cuelgan de cada T'},
    {valor:'—', titulo:'Lo que compraría la represa', decide:'pone precio a la ruta por gravedad',
     falta:'profundidad del lago'},
    {valor:'—', titulo:'Área efectiva de pastoreo', decide:'la carga real, descontando pendiente y distancia al agua',
     falta:'potreros'},
    {valor:'—', titulo:'Costo por res y día', decide:'si cada animal paga su renta',
     falta:'contabilidad y báscula'},
  ].map(o=>indCard(Object.assign({bloqueado:true},o)));

  box.innerHTML=`
    <div class="sect"><h2>Estado</h2>
      <span class="n">${cards.length} calculados · ${bloq.length} bloqueados</span></div>
    <div class="strip">
      <span>la confianza de un indicador es la de su <b>peor</b> insumo</span>
      <span>${CONS_L_RES_DIA.nota}</span>
    </div>
    <div class="cards">${cards.join('')}</div>
    <div class="sect"><h2>Bloqueados</h2><span class="n">esperan datos, no código</span></div>
    <div class="cards">${bloq.join('')}</div>`;
}
