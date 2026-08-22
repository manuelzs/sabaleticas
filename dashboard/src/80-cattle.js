/* ---- Ganado: the herd, and what has left it -----------------------------
   Two things are true at once and the view has to hold both: we have a usable
   count, and it is out of date because Manuel is selling. Every derived figure is
   therefore an upper bound, and says so. */
const SEXO_COL={hembras:'#f06292', machos:'#4fc3f7'};

function herdStale(){ return !!(D.herd && D.herd.meta && D.herd.meta.obsoleto); }

/* The data has a HORIZON, and that is different from the data being wrong.
   Movements are logged continuously in real life; this repo simply holds them up to a
   date. Silence after that date means "not given to us", never "nothing happened", and
   the view must not let anyone read it the other way. */
function horizon(fecha, que, extra){
  const f=freshness(fecha, 'conteo');
  return `<div class="warn" style="background:${f.col}12;border-color:${f.col}33;color:${f.col}">
    ⏱ <span><b>Datos hasta ${fecha}</b> · ${f.label}.
    ${que} posteriores a esa fecha <b>no están cargados</b> — eso no significa que no hayan
    ocurrido. En la finca se registra todo; lo que falta es la entrega.${extra?' '+extra:''}</span>
  </div>`;
}
function statCard(big,unit,mag,ent,meta,acc){
  return `<div class="card" style="--acc:${acc||'#4fc3f7'}">
    <div class="top"><span class="dot"></span>${mag}</div>
    <div class="big">${big}<small>${unit||''}</small></div>
    <div class="ent">${ent}</div>${meta?`<div class="meta">${meta}</div>`:''}</div>`;
}
function barRow(label,segments,total,max){
  const w=s=>`${(s.head/max*100).toFixed(1)}%`;
  return `<div class="bar">
    <div class="lbl">${label}</div>
    <div class="track">${segments.map(s=>
      `<div class="fill" style="width:${w(s)};background:${SEXO_COL[s.sexo]||'#78909c'}"></div>`).join('')}</div>
    <div class="num">${total}</div></div>`;
}

function renderHato(){
  const H=D.herd, box=document.getElementById('pageInner');
  if(!H){ box.innerHTML='<h2>Hato</h2>'; return; }
  const ha=(D.farm&&D.farm.area_ha)||0, f=freshness(H.fecha,'conteo');
  const byClass={};
  for(const g of H.grupos){ (byClass[g.orden]=byClass[g.orden]||{orden:g.orden,clase:g.clase,segs:[],total:0});
    byClass[g.orden].segs.push(g); byClass[g.orden].total+=g.head; }
  const rows=Object.values(byClass).sort((a,b)=>b.orden-a.orden);
  const max=Math.max(...rows.map(r=>r.total));

  box.innerHTML=`
    <div class="sect"><h2>Hato</h2><span class="n">SINIGAN</span></div>
    <div class="strip">
      <span>corte <b>${H.fecha}</b></span>
      <span style="color:${f.col}">${f.label}</span>
      <span>cota superior</span>
    </div>
    <div class="cards">
      ${statCard(H.total,'','reses','Hato',`al ${H.fecha}`,f.col)}
      ${statCard(H.por_sexo.hembras,'',
        `hembras · ${Math.round(H.por_sexo.hembras/H.total*100)} %`,'Ceba','','#f06292')}
      ${statCard(ha?(H.total/ha).toFixed(2):'—','res/ha','carga',
        `sobre ${ha} ha totales`,'','#ffd54f')}
      ${statCard(rows.filter(r=>r.orden>=4&&r.orden<=5).reduce((a,r)=>a+r.total,0),'',
        'entre 1 y 3 años','Banda dominante','','#4fc3f7')}
    </div>

    <div class="sect"><h2>Grupo etario</h2><span class="n">confianza baja</span></div>
    <div class="legend">
      <span><i style="background:${SEXO_COL.hembras}"></i>hembras</span>
      <span><i style="background:${SEXO_COL.machos}"></i>machos</span></div>
    <div class="bars">${rows.map(r=>barRow(r.clase,r.segs,r.total,max)).join('')}</div>`;
}

/* A guide is inbound when this farm is the destination. Everything else leaves. */
const ABIERTO=['EN TRANSITO','REGISTRADA','VALIDACION EN GSMI'];
function esEntrada(m){
  const al=(D.farm&&D.farm.alias_gsmi)||[];
  return al.some(a=>(m.destino||'').toUpperCase().includes(a.toUpperCase()));
}

/* Windows are anchored on the last record, not on today — "últimos 12 meses" has to
   mean 12 months of DATA, or a stale extract silently reads as a quiet farm. */
function movWindow(M, days, corte){
  const end=Date.parse(corte+'T12:00:00'), start=end-days*864e5;
  return M.filter(m=>{ const t=Date.parse((m.mov_date||'')+'T12:00:00');
    return !isNaN(t) && t>start && t<=end; });
}
function renderMovimientos(){
  const M=D.movements||[], box=document.getElementById('pageInner');
  const fechas=M.map(m=>m.mov_date).filter(Boolean).sort();
  if(!fechas.length){ box.innerHTML='<h2>Movimientos</h2>'; return; }
  const corte=fechas[fechas.length-1], f=freshness(corte,'conteo');
  const y=movWindow(M,365,corte), q=movWindow(M,90,corte);
  const head=a=>a.reduce((s,m)=>s+(+m.head||0),0);
  const meses=new Set(y.map(m=>m.mov_date.slice(0,7))).size;
  const anulada=y.filter(m=>m.estado==='ANULADA').length;

  const months={};
  for(const m of y) months[m.mov_date.slice(0,7)]=(months[m.mov_date.slice(0,7)]||0)+(+m.head||0);
  const mk=Object.keys(months).sort(), mx=Math.max(1,...Object.values(months));
  const dest={};
  for(const m of y){ const d=m.destino||'—'; dest[d]=(dest[d]||0)+1; }
  const dl=Object.entries(dest).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const dmax=Math.max(...dl.map(d=>d[1]));

  box.innerHTML=`
    <div class="sect"><h2>Movimientos</h2><span class="n">GSMI · 12 meses a ${corte}</span></div>
    <div class="strip">
      <span>corte <b>${corte}</b></span>
      <span style="color:${f.col}">${f.label}</span>
      <span>posteriores <b>no cargados</b></span>
    </div>
    <div class="cards">
      ${statCard(head(y),'','reses · 12 meses',`hasta ${corte}`,'','#00e676')}
      ${statCard(head(q),'','reses · 90 días',`hasta ${corte}`,'','#4fc3f7')}
      ${statCard(meses,'/ 12','meses con salidas','Ritmo','','#ffd54f')}
      ${statCard(dl.length?Math.round(dl[0][1]/y.length*100):0,'%','destino principal',
        dl.length?dl[0][0]:'—','de las guías del periodo','#f06292')}
    </div>

    <div class="sect"><h2>Reses por mes</h2><span class="n">12 meses a ${corte}</span></div>
    <div class="mini">${mk.map(k=>
      `<div class="${months[k]===mx?'hi':''}" style="height:${Math.max(2,months[k]/mx*100)}%"
        title="${k}: ${months[k]}"></div>`).join('')}
      <div style="flex:0 0 2px;background:#ff5252;height:100%"></div>
      <div style="flex:1.1;background:repeating-linear-gradient(45deg,#1b222a,#1b222a 4px,#151b21 4px,#151b21 8px);height:100%"></div></div>
    <div class="legend"><span>${mk[0]||''}</span>
      <span style="margin-left:auto;color:#ff5252">▲ fin del registro</span></div>

    <div class="sect"><h2>Destinos</h2><span class="n">guías · 12 meses</span></div>
    <div class="bars">${dl.map(([d,v])=>barRow(
      d.length>26?d.slice(0,25)+'…':d,[{head:v,sexo:'machos'}],v,dmax)).join('')}</div>
    ${anulada?`<div class="strip"><span>anuladas en el periodo <b>${anulada}</b></span></div>`:''}`;
}

/* Closed guides are history and need no attention. Open ones are the operational
   question: what is moving right now, in which direction, and what has been sitting. */
function renderGuias(){
  const M=(D.movements||[]).filter(m=>ABIERTO.includes(m.estado));
  const box=document.getElementById('pageInner');
  const ent=M.filter(esEntrada), sal=M.filter(m=>!esEntrada(m));
  const head=a=>a.reduce((s,m)=>s+(+m.head||0),0);
  const varada=m=>ageHours(m.mov_date)/24 > 30;
  const varadas=M.filter(varada);
  const row=m=>{
    const d=Math.round(ageHours(m.mov_date)/24);
    const col=varada(m)?'#ff5252':(m.estado==='EN TRANSITO'?'#ffd54f':'#4fc3f7');
    return `<div class="row" style="--acc:${col}">
      <div class="main"><div class="nm">${esEntrada(m)?'↓ entrada':'↑ salida'} · ${
        m.destino||'—'}</div></div>
      <div class="side">
        <div class="col"><div class="k">reses</div><div class="v">${m.head||'—'}</div></div>
        <div class="col"><div class="k">estado</div>
          <div class="v"><span class="pill" style="background:${col}22;color:${col}">${
            m.estado.toLowerCase()}</span></div></div>
        <div class="col"><div class="k">emitida</div>
          <div class="v">${m.mov_date}<br><span style="color:${col}">hace ${d} d</span></div></div>
        <div class="col"><div class="k">guía</div>
          <div class="v" style="font-size:11px">${(m.codigo||'').slice(-10)}</div></div>
      </div></div>`;};
  box.innerHTML=`
    <div class="sect"><h2>Guías abiertas</h2>
      <span class="n">las cerradas no requieren nada</span></div>
    <div class="cards">
      ${statCard(M.length,'','abiertas','Requieren seguimiento','','#ffd54f')}
      ${statCard(sal.length,'',`salidas · ${head(sal)} reses`,'Van a planta','','#f06292')}
      ${statCard(ent.length,'',`entradas · ${head(ent)} reses`,'Llegan a la finca','','#00e676')}
      ${statCard(varadas.length,'','varadas','Más de 30 días abiertas',
        varadas.length?'revisar':'','#ff5252')}
    </div>
    ${M.length?`<div class="rows">${M.slice().sort((a,b)=>
      (b.mov_date||'').localeCompare(a.mov_date||'')).map(row).join('')}</div>`
      :'<div class="strip"><span>ninguna abierta</span></div>'}`;
}
