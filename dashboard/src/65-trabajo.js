/* ---- Trabajo: what is open, and on what -------------------------------
   A ticket is two things: the entity it hangs off, and what needs doing. There is no
   priority, no status, no assignee — Manuel's rule, and a good one: state you have to
   maintain is state that ends up lying. A ticket that exists is open. Closing it
   deletes it, and git keeps the history.

   The value the tab adds over a list in a file is the SECOND half of each row: the
   thing itself, named and locatable. Click a ticket and the map goes there. */
const TRAB_SUB={agua:['Agua','#4fc3f7'], predio:['Predio','#ffee58'],
                tierra:['Tierra','#26c6da'], ganado:['Ganado','#ce93d8'],
                sitio:['Sitios','#b0bec5']};

function renderTrabajo(){
  const T=D.tickets||[];
  const page=document.getElementById('page');
  if(!T.length){
    page.innerHTML=`<h2>Trabajo</h2><p class="muted">No hay tiquetes abiertos.</p>`;
    return;
  }
  const groups={};
  T.forEach(t=>{ (groups[t.sub]=groups[t.sub]||[]).push(t); });
  const orden=['predio','tierra','agua','ganado','sitio']
    .filter(k=>groups[k]).concat(Object.keys(groups).filter(k=>!TRAB_SUB[k]));
  let h=`<h2>Trabajo <small class="muted">${T.length} abiertos</small></h2>
    <p class="muted">Sobre qué, y qué hay que hacer. Nada más.
    Toca un tiquete para verlo en el mapa.</p>`;
  for(const g of orden){
    const [label,col]=TRAB_SUB[g]||[g,'#b0bec5'];
    h+=`<div class="grp" style="color:${col}">${label} · ${groups[g].length}</div>
        <div class="tks">`;
    for(const t of groups[g]){
      // No point means we know the thing but not where it is — which is usually the
      // whole content of the ticket, so it is said rather than left to a dead click.
      const sitio = t.pt ? `<a href="#" data-tk="${t.id}">${t.nombre}</a>`
                         : `${t.nombre} <span class="nopos">sin ubicación</span>`;
      h+=`<div class="tk"><div class="tkh"><b>${t.id}</b> ${sitio}${
        t.perdido?' <span class="nopos">no encontrado</span>':''}</div>
        <div class="tkt">${t.texto}</div></div>`;
    }
    h+='</div>';
  }
  page.innerHTML=h;
  page.querySelectorAll('[data-tk]').forEach(a=>{
    a.onclick=e=>{
      e.preventDefault();
      const t=T.find(x=>x.id===a.dataset.tk);
      if(t && t.pt) irAlPunto(t.pt);
    };
  });
}

/* Jump to the map centred on a coordinate, zoomed in enough to see the thing rather
   than the farm. Lives here rather than in the map module because the map does not
   otherwise need to be told where to go from outside. */
function irAlPunto(pt){
  navGo('general','mapa');
  const s=Math.max(view.s, W*7);
  view.s=s;
  view.x = W/2 - fx(pt[0])*s;
  view.y = H/2 - fy(pt[1])*s*aspect();
  saveView(); draw();
  marcaTicket=pt; setTimeout(()=>{ marcaTicket=null; draw(); }, 6000);
}
/* A ring that fades after a few seconds — the map is dense, and "it is somewhere in
   the middle" is not an answer. */
let marcaTicket=null;
function drawMarcaTicket(){
  if(!marcaTicket) return;
  const [x,y]=toScreen(marcaTicket[0],marcaTicket[1]);
  cx.save();
  cx.strokeStyle='#00e676'; cx.lineWidth=2.5;
  cx.beginPath(); cx.arc(x,y,17,0,6.284); cx.stroke();
  cx.globalAlpha=.45;
  cx.beginPath(); cx.arc(x,y,28,0,6.284); cx.stroke();
  cx.restore();
}
