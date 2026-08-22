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
function statCard(big,unit,mag,ent,meta,acc,tr){
  return `<div class="card" style="--acc:${acc||'#4fc3f7'}">
    <div class="top"><span class="dot"></span>${mag}</div>
    <div class="big">${big}<small>${unit||''}</small></div>
    <div class="ent">${ent}</div>${meta?`<div class="meta">${meta}</div>`:''}
    ${tr||''}</div>`;
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
      ${statCard(H.total,'','reses','Hato',`al ${H.fecha}`,f.col,
        trendMark('hato','conteo',true))}
      ${statCard(H.por_sexo.hembras,'',
        `hembras · ${Math.round(H.por_sexo.hembras/H.total*100)} %`,'Ceba','','#f06292')}
      ${statCard(ha?(H.total/ha).toFixed(2):'—','res/ha','carga',
        `sobre ${ha} ha totales`,'','#ffd54f', trendMark('hato','conteo',true))}
      ${statCard(rows.filter(r=>r.orden>=4&&r.orden<=5).reduce((a,r)=>a+r.total,0),'',
        'entre 1 y 3 años','Banda dominante','','#4fc3f7')}
    </div>

    ${(()=>{ const S=herdSeries(); if(!S) return '';
      return `<div class="sect"><h2>Hato en el tiempo</h2>
        <span class="n">reconstruido desde el conteo del ${D.readings['hato|conteo'].ts.slice(0,10)}</span></div>
      ${herdChart()}
      <div class="legend">
        <span><i style="background:#00e676"></i>reconstruido</span>
        <span><i style="background:#4fc3f7"></i>conteo SINIGAN</span>
        ${S.sinConteo?`<span><i style="background:#ff9100"></i>${S.sinConteo} movimientos
          sin conteo · no están en la línea</span>`:''}
        </div>`;})()}

    <div class="sect"><h2>Grupo etario</h2><span class="n">confianza baja</span></div>
    <div class="legend">
      <span><i style="background:${SEXO_COL.hembras}"></i>hembras</span>
      <span><i style="background:${SEXO_COL.machos}"></i>machos</span></div>
    <div class="bars">${rows.map(r=>barRow(r.clase,r.segs,r.total,max)).join('')}</div>`;
}

/* Reconstruct the herd backwards from a known count.
   A stock is a step function: it holds its value until something moves. With an anchor
   reading and a movement ledger, hato(t) = anchor − net movements between t and the
   anchor. The counts we lack are an EXTRACTION gap (V5 exports dropped the field), so
   every movement without one is drawn as an explicit break in what we know — never
   smoothed over. */
function herdSeries(){
  const anchor=(D.readings||{})['hato|conteo'];
  if(!anchor) return null;
  const t0=Date.parse(anchor.ts+'T12:00:00'), n0=+anchor.valor;
  const mv=(D.movements||[])
    .filter(m=>m.mov_date && m.estado!=='ANULADA')
    .map(m=>({t:Date.parse(m.mov_date+'T12:00:00'), head:+m.head||0,
              ent:esEntrada(m), estado:m.estado, fecha:m.mov_date}))
    .filter(m=>!isNaN(m.t)).sort((a,b)=>a.t-b.t);
  const conteo=mv.filter(m=>m.head>0);
  if(!conteo.length) return null;
  const desde=conteo[0].t, hasta=Date.now();
  // walk forward from the earliest counted movement, so the anchor lands where it should
  let n=n0;
  for(const m of conteo) if(m.t<=t0) n += m.ent ? -m.head : m.head;   // undo, going back
  const pts=[{t:desde-864e5*3, n}];
  for(const m of conteo){ n += m.ent ? m.head : -m.head;
    pts.push({t:m.t, n, mv:m}); }
  const ciegos=mv.filter(m=>m.head===0 && m.t>=desde);   // movements of unknown size
  const cSal=ciegos.filter(m=>!m.ent).length, cEnt=ciegos.filter(m=>m.ent).length;
  return {pts, ciegos, desde, hasta, anchor:{t:t0, n:n0}, cSal, cEnt,
          sinConteo:ciegos.length, total:mv.filter(m=>m.t>=desde).length};
}

function herdChart(){
  const S=herdSeries(); if(!S) return '';
  const W=1000, H=150, pad={l:4,r:4,t:14,b:22};
  const t0=S.desde-864e5*6, t1=S.hasta;
  const ns=S.pts.map(p=>p.n), lo=Math.min(...ns)-6, hi=Math.max(...ns)+6;
  const x=t=>pad.l+(t-t0)/(t1-t0)*(W-pad.l-pad.r);
  const y=n=>pad.t+(hi-n)/(hi-lo)*(H-pad.t-pad.b);
  let d=`M${x(S.pts[0].t).toFixed(1)},${y(S.pts[0].n).toFixed(1)}`;
  for(let i=1;i<S.pts.length;i++){                       // step: hold, then drop
    d+=` L${x(S.pts[i].t).toFixed(1)},${y(S.pts[i-1].n).toFixed(1)}`;
    d+=` L${x(S.pts[i].t).toFixed(1)},${y(S.pts[i].n).toFixed(1)}`;
  }
  const last=S.pts[S.pts.length-1];
  const dash=`M${x(last.t).toFixed(1)},${y(last.n).toFixed(1)} L${x(t1).toFixed(1)},${y(last.n).toFixed(1)}`;
  return `<svg class="strip-t" style="height:${H}px" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
    ${S.ciegos.map(m=>`<line x1="${x(m.t).toFixed(1)}" y1="${pad.t}" x2="${x(m.t).toFixed(1)}"
       y2="${H-pad.b}" stroke="#ff9100" stroke-width="1.2" stroke-dasharray="2 3" opacity=".8">
       <title>${m.fecha} · movimiento sin conteo — el escalón real es mayor</title></line>`).join('')}
    <path d="${d}" fill="none" stroke="#00e676" stroke-width="2"/>
    <path d="${dash}" fill="none" stroke="#00e676" stroke-width="1.4" stroke-dasharray="4 4" opacity=".5"/>
    ${S.pts.map(p=>p.mv?`<circle cx="${x(p.t).toFixed(1)}" cy="${y(p.n).toFixed(1)}" r="3"
       fill="#00e676"><title>${p.mv.fecha} · ${p.mv.ent?'+':'−'}${p.mv.head} → ${p.n}</title></circle>`:'').join('')}
    <circle cx="${x(S.anchor.t).toFixed(1)}" cy="${y(S.anchor.n).toFixed(1)}" r="5" fill="none"
      stroke="#4fc3f7" stroke-width="2"><title>conteo SINIGAN ${S.anchor.n}</title></circle>
    <text x="${x(S.pts[0].t).toFixed(1)}" y="${y(S.pts[0].n)-7}" fill="#8b98a5"
      font-size="11">${S.pts[0].n}</text>
    <text x="${(x(last.t)+8).toFixed(1)}" y="${y(last.n)+4}" fill="#00e676"
      font-size="11">${last.n}</text>
    <text x="4" y="${H-6}" fill="#8b98a5" font-size="10">${new Date(S.desde).toISOString().slice(0,10)}</text>
    <text x="${W-4}" y="${H-6}" fill="#8b98a5" font-size="10" text-anchor="end">hoy</text>
  </svg>`;
}

/* An EVENT STRIP, not a histogram. 85 sparse events bucketed into months lose their
   rhythm and gain precision they never had at the bucket edges. One tick per guide on
   a real time axis keeps both: clusters look like clusters, and a four-month silence
   looks like a four-month silence.
   The axis runs to TODAY, not to the last record, so the gap between what happened and
   what we hold is part of the picture. */
function eventStrip(M){
  const W=1000, H=104, top=16, laneH=26;
  const ts=M.map(m=>Date.parse((m.mov_date||'')+'T12:00:00')).filter(t=>!isNaN(t));
  if(!ts.length) return '';
  const t0=Math.min(...ts), tEnd=Math.max(...ts), t1=Date.now();
  const x=t=>((t-t0)/(t1-t0)*(W-8))+4;
  const COL={ANULADA:'#455a64', 'EN TRANSITO':'#ffd54f', REGISTRADA:'#ffd54f',
             'VALIDACION EN GSMI':'#ffd54f'};
  const ticks=M.map(m=>{
    const t=Date.parse((m.mov_date||'')+'T12:00:00'); if(isNaN(t)) return '';
    const ent=esEntrada(m), conteo=+m.head>0;
    const col=COL[m.estado] || (ent?'#00e676':'#f06292');
    const y=top+(ent?laneH+8:0), h=conteo?laneH:laneH*0.45;
    return `<rect x="${x(t).toFixed(1)}" y="${(y+laneH-h).toFixed(1)}" width="2.4" height="${h}"
      fill="${col}" opacity="${conteo?1:.6}"><title>${m.mov_date} · ${
      ent?'entrada':'salida'} · ${m.head||'sin conteo'} · ${m.estado} · ${m.destino}</title></rect>`;
  }).join('');
  // month gridlines, quarterly labels
  const marks=[]; const d=new Date(t0); d.setUTCDate(1);
  while(d.getTime()<t1){
    const t=d.getTime();
    if(t>t0){ const q=d.getUTCMonth()%3===0;
      marks.push(`<line class="grid" x1="${x(t).toFixed(1)}" y1="${top}" x2="${x(t).toFixed(1)}" y2="${top+laneH*2+8}"
        opacity="${q?.9:.35}"/>`);
      if(q) marks.push(`<text x="${x(t).toFixed(1)}" y="${H-6}" text-anchor="middle">${
        d.toISOString().slice(0,7)}</text>`); }
    d.setUTCMonth(d.getUTCMonth()+1);
  }
  return `<svg class="strip-t" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
    <defs><pattern id="hatch" width="8" height="8" patternTransform="rotate(45)"
      patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="#151b21"/><rect width="4" height="8" fill="#1b222a"/>
    </pattern></defs>
    <rect class="lane" x="0" y="${top}" width="${W}" height="${laneH}"/>
    <rect class="lane" x="0" y="${top+laneH+8}" width="${W}" height="${laneH}"/>
    <rect class="gap" x="${x(tEnd).toFixed(1)}" y="${top}" width="${(W-x(tEnd)).toFixed(1)}"
      height="${laneH*2+8}"/>
    ${marks.join('')}${ticks}
    <line class="horiz" x1="${x(tEnd).toFixed(1)}" y1="${top-4}" x2="${x(tEnd).toFixed(1)}"
      y2="${top+laneH*2+12}"/>
    <text x="${Math.min(W-4,x(tEnd)+6).toFixed(1)}" y="${top-6}" fill="#ff5252">fin del registro</text>
    <text x="4" y="${top-6}">salidas</text>
    <text x="4" y="${top+laneH+2}">entradas</text>
  </svg>`;
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

    <div class="sect"><h2>Cada guía en el tiempo</h2>
      <span class="n">${M.length} eventos · sin agrupar</span></div>
    ${eventStrip(M)}
    <div class="legend">
      <span><i style="background:#f06292"></i>salida</span>
      <span><i style="background:#00e676"></i>entrada</span>
      <span><i style="background:#ffd54f"></i>abierta</span>
      <span><i style="background:#455a64"></i>anulada</span>
      <span style="margin-left:auto">barra alta = trae conteo de reses</span></div>

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
