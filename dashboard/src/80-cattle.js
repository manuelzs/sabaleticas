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
  if(!H){ box.innerHTML='<h2>Ganado</h2><p class="lead">Sin datos de hato.</p>'; return; }
  const ha=(D.farm&&D.farm.area_ha)||0;
  const carga=ha?(H.total/ha).toFixed(2):'—';
  // group the age classes, keeping both sexes in one bar
  const byClass={};
  for(const g of H.grupos){ (byClass[g.orden]=byClass[g.orden]||{orden:g.orden,clase:g.clase,segs:[],total:0});
    byClass[g.orden].segs.push(g); byClass[g.orden].total+=g.head; }
  const rows=Object.values(byClass).sort((a,b)=>b.orden-a.orden);
  const max=Math.max(...rows.map(r=>r.total));
  const jovenes=rows.filter(r=>r.orden>=4&&r.orden<=5).reduce((s,r)=>s+r.total,0);

  box.innerHTML=`
    <div class="sect"><h2>Hato</h2>
      <span class="n">SINIGAN · ${H.fecha}</span></div>
    ${horizon(H.fecha,'Nacimientos, compras y ventas',
      herdStale()?`<b>${H.meta.por_que}</b>`:'')}
    <div class="cards">
      ${(()=>{const f=freshness(H.fecha,'conteo');
        return statCard(H.total,'',`reses · ${f.estado}`,'Total del hato',
          `${f.label} · cota superior, hay ventas en curso`, f.col);})()}
      ${statCard(H.por_sexo.hembras,'','hembras',
        `${(H.por_sexo.hembras/H.total*100).toFixed(0)} % del hato`,'ceba de hembras','#f06292')}
      ${statCard(H.por_sexo.machos,'','machos',
        `${(H.por_sexo.machos/H.total*100).toFixed(0)} % del hato`,
        'probablemente nacidos en finca','#4fc3f7')}
      ${statCard(carga,'res/ha','carga',`sobre ${ha} ha`,'área total, no sólo pastoreable','#ffd54f')}
    </div>

    <div class="sect"><h2>Por grupo etario</h2>
      <span class="n">confianza baja — ver nota</span></div>
    <div class="legend">
      <span><i style="background:${SEXO_COL.hembras}"></i>hembras</span>
      <span><i style="background:${SEXO_COL.machos}"></i>machos</span></div>
    <div class="bars">${rows.map(r=>barRow(r.clase,r.segs,r.total,max)).join('')}</div>
    <div class="warn">⚠ <span><b>${(jovenes/H.total*100).toFixed(0)} % del hato está entre 1 y 3
      años.</b> Es la señal de la hipótesis de <b>baja rotación</b>: si los animales se acumulan
      en vez de ciclar, los costos mensuales corren sobre capital quieto. Señal direccional,
      no evidencia — las edades son de confianza baja.</span></div>

    <div class="sect"><h2>Lo que falta</h2><span class="n">${H.faltante.length} vacíos</span></div>
    <div class="rows">${H.faltante.map(f=>`<div class="row" style="--acc:#546e7a">
      <div class="main"><div class="nm">${f.que}</div>
        <div class="why">${f.por_que}</div></div></div>`).join('')}</div>`;
}

function renderMovimientos(){
  const M=D.movements||[], box=document.getElementById('pageInner');
  const withHead=M.filter(m=>+m.head>0);
  const totalHead=withHead.reduce((s,m)=>s+ +m.head,0);
  const months={};
  for(const m of M){ if(!m.mov_date) continue;
    const k=m.mov_date.slice(0,7); months[k]=(months[k]||0)+ (+m.head||0); }
  const mk=Object.keys(months).sort(), mx=Math.max(1,...Object.values(months));
  const dest={};
  for(const m of M){ const d=m.destino||'—';
    dest[d]=dest[d]||{g:0,h:0}; dest[d].g++; dest[d].h+= +m.head||0; }
  const dl=Object.entries(dest).sort((a,b)=>b[1].g-a[1].g).slice(0,6);
  const dmax=Math.max(...dl.map(d=>d[1].g));
  const estados={};
  for(const m of M) estados[m.estado||'—']=(estados[m.estado||'—']||0)+1;

  const fechas=M.map(m=>m.mov_date).filter(Boolean).sort();
  const ultima=fechas[fechas.length-1]||'';
  box.innerHTML=`
    <div class="sect"><h2>Movimientos</h2>
      <span class="n">guías GSMI · ${fechas[0]||''} → ${ultima}</span></div>
    ${ultima?horizon(ultima,'Guías'):''}
    <div class="cards">
      ${statCard(M.length,'','guías emitidas','Total en el registro','','#4fc3f7')}
      ${statCard(totalHead,'','reses movidas',`en ${withHead.length} guías`,
        'sólo las que traen conteo','#00e676')}
      ${statCard(M.length-withHead.length,'','guías sin conteo',
        `${((M.length-withHead.length)/M.length*100).toFixed(0)} % del total`,
        'no se puede sumar lo que no se anotó','#ff9100')}
      ${statCard(Object.keys(dest).length,'','destinos','Plantas y comercializadoras','','#ffd54f')}
    </div>

    <div class="sect"><h2>Reses por mes</h2><span class="n">sólo guías con conteo</span></div>
    <div class="mini">${mk.map(k=>
      `<div class="${months[k]===mx?'hi':''}" style="height:${Math.max(2,months[k]/mx*100)}%" title="${k}: ${months[k]}"></div>`).join('')}
      <div style="flex:0 0 2px;background:#ff5252;height:100%" title="fin del registro"></div>
      <div style="flex:1.2;background:repeating-linear-gradient(45deg,#1b222a,#1b222a 4px,#151b21 4px,#151b21 8px);height:100%" title="sin datos cargados"></div></div>
    <div class="legend"><span>${mk[0]}</span>
      <span style="margin-left:auto;color:#ff5252">▲ fin del registro · ${ultima}</span></div>

    <div class="sect"><h2>Destinos</h2><span class="n">por número de guías</span></div>
    <div class="bars">${dl.map(([d,v])=>barRow(
      d.length>26?d.slice(0,25)+'…':d, [{head:v.g,sexo:'machos'}], v.g, dmax)).join('')}</div>

    <div class="warn">⚠ <span><b>El destino es el matadero en casi todos los casos.</b>
      Estas guías registran salidas a sacrificio, no ventas entre fincas — así que son la mejor
      señal disponible de rotación, pero <b>no llevan precio ni kilos</b>. El $/kg realizado
      sigue sin poderse calcular.</span></div>

    <div class="sect"><h2>Estado de las guías</h2><span class="n">${M.length}</span></div>
    <div class="bars">${Object.entries(estados).sort((a,b)=>b[1]-a[1]).map(([k,v])=>barRow(
      k||'—', [{head:v,sexo:k==='ANULADA'?null:'machos'}], v,
      Math.max(...Object.values(estados)))).join('')}</div>`;
}
