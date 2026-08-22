/* ---- view routing in the URL hash --------------------------------------
   #mapa · #3d · #esquema. Reloading keeps you where you were, and a view is
   now linkable. This is also the seam the subsystem tabs will plug into:
   #agua/esquema and #ganado/tabla are the same mechanism with a second part. */
function setMode(m){
  if(m==='esquema'){ if(!isPid) setPid(true); }
  else if(m==='3d'){ if(isPid) setPid(false); if(!is3d) set3d(true); }
  else { if(isPid) setPid(false); if(is3d) set3d(false); }
  if(location.hash.slice(1)!==m){ try{ history.replaceState(null,'','#'+m); }catch(e){} }
}
function modeFromHash(){
  const m=(location.hash||'').slice(1).split('/')[0];
  return ['mapa','3d','esquema'].includes(m) ? m : null;
}
addEventListener('hashchange',()=>{ const m=modeFromHash(); if(m) setMode(m); });
/* after 'load', so the canvas has been sized and restoreView() has already run —
   otherwise the restored 2D/3D state would overwrite whatever the hash asked for */
addEventListener('load',()=>{
  const m=modeFromHash();
  if(m) setMode(m);                                  // the hash wins over saved state
  else setMode(is3d ? '3d' : 'mapa');
});

