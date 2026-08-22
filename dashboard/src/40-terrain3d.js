/* ================= 3D terrain (optional overlay) ================= */
let g3=null, is3d=false, cam={az:-0.6,el:0.62,d:2.3}, exag=2;
const c3=document.getElementById('cv3');

function mul(a,b){const o=new Float32Array(16);
  for(let i=0;i<4;i++)for(let j=0;j<4;j++){let s=0;
    for(let k=0;k<4;k++)s+=a[k*4+j]*b[i*4+k]; o[i*4+j]=s;} return o;}
function persp(f,ar,n,fa){const t=1/Math.tan(f/2);return new Float32Array(
  [t/ar,0,0,0, 0,t,0,0, 0,0,(fa+n)/(n-fa),-1, 0,0,2*fa*n/(n-fa),0]);}
function look(e,c,u){
  const z=[e[0]-c[0],e[1]-c[1],e[2]-c[2]];let l=Math.hypot(...z);z.forEach((v,i)=>z[i]=v/l);
  const x=[u[1]*z[2]-u[2]*z[1],u[2]*z[0]-u[0]*z[2],u[0]*z[1]-u[1]*z[0]];
  l=Math.hypot(...x)||1;x.forEach((v,i)=>x[i]=v/l);
  const y=[z[1]*x[2]-z[2]*x[1],z[2]*x[0]-z[0]*x[2],z[0]*x[1]-z[1]*x[0]];
  return new Float32Array([x[0],y[0],z[0],0, x[1],y[1],z[1],0, x[2],y[2],z[2],0,
    -(x[0]*e[0]+x[1]*e[1]+x[2]*e[2]), -(y[0]*e[0]+y[1]*e[1]+y[2]*e[2]),
    -(z[0]*e[0]+z[1]*e[1]+z[2]*e[2]), 1]);}

function init3d(){
  const gl=c3.getContext('webgl',{antialias:true}); if(!gl) return null;
  const M=D.mesh, nx=M.nx, ny=M.ny, G=M.grid;
  let lo=1e9,hi=-1e9;
  for(const r of G) for(const v of r) if(v!=null){ if(v<lo)lo=v; if(v>hi)hi=v; }
  const AR=((B.maxy-B.miny)*LAT2M)/((B.maxx-B.minx)*LON2M);
  const VS=(hi-lo)/((B.maxx-B.minx)*LON2M);   // vertical unit relative to width
  const pos=[],uv=[],idx=[];
  for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){
    const v=G[j][i];
    pos.push(i/(nx-1)-0.5, v==null?0:((v-lo)/(hi-lo))*VS, (0.5-j/(ny-1))*AR);
    uv.push(i/(nx-1), 1-j/(ny-1));
  }
  for(let j=0;j<ny-1;j++)for(let i=0;i<nx-1;i++){
    if(G[j][i]==null||G[j][i+1]==null||G[j+1][i]==null||G[j+1][i+1]==null) continue;
    const a=j*nx+i,b=a+1,c=a+nx,d=c+1;
    idx.push(a,c,b, b,c,d);
  }
  const vs=`attribute vec3 p;attribute vec2 t;uniform mat4 mvp;uniform float ex;
    varying vec2 vt;varying float vh;
    void main(){vec3 q=vec3(p.x,p.y*ex,p.z);vh=p.y;vt=t;gl_Position=mvp*vec4(q,1.0);}`;
  const fs=`precision mediump float;uniform sampler2D s;varying vec2 vt;varying float vh;
    void main(){vec4 c=texture2D(s,vt);gl_FragColor=vec4(c.rgb,1.0);}`;
  function sh(t,src){const o=gl.createShader(t);gl.shaderSource(o,src);gl.compileShader(o);
    if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))console.error(gl.getShaderInfoLog(o));return o;}
  const pr=gl.createProgram();
  gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));
  gl.linkProgram(pr);gl.useProgram(pr);
  function buf(data,loc,n){const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);
    const a=gl.getAttribLocation(pr,loc);gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a,n,gl.FLOAT,false,0,0);
    return {b,a,n};}
  const bpos=buf(pos,'p',3), buv=buf(uv,'t',2);
  const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint32Array(idx),gl.STATIC_DRAW);
  const ext=gl.getExtension('OES_element_index_uint');
  const tex=gl.createTexture();
  const im=new Image();
  im.onload=()=>{gl.bindTexture(gl.TEXTURE_2D,tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    render3d();};
  im.src=D.tex;
  gl.enable(gl.DEPTH_TEST); gl.clearColor(0.05,0.07,0.08,1);

  /* second program: plain coloured lines, draped on the surface */
  /* gl.lineWidth() is clamped to 1 px in Chrome, so every segment is expanded
     into a quad here: both endpoints are projected, and the vertex is pushed
     sideways along the screen-space normal by half the wanted width. */
  const lvs=`attribute vec3 pa;attribute vec3 pb;attribute float side;attribute float endf;
    uniform mat4 mvp;uniform float ex;uniform float lift;uniform vec2 res;uniform float w;
    void main(){
      vec4 ca=mvp*vec4(pa.x, pa.y*ex+lift, pa.z, 1.0);
      vec4 cb=mvp*vec4(pb.x, pb.y*ex+lift, pb.z, 1.0);
      vec4 c=mix(ca,cb,endf);
      vec2 sa=ca.xy/ca.w*res, sb=cb.xy/cb.w*res;
      vec2 d=sb-sa;
      float l=length(d);
      vec2 n=l>1e-6 ? vec2(-d.y,d.x)/l : vec2(0.0);
      c.xy += n*side*(w*0.5)*c.w/res;
      gl_Position=c;}`;
  const lfs=`precision mediump float;uniform vec3 col;
    void main(){gl_FragColor=vec4(col,1.0);}`;
  const lp=gl.createProgram();
  gl.attachShader(lp,sh(gl.VERTEX_SHADER,lvs));
  gl.attachShader(lp,sh(gl.FRAGMENT_SHADER,lfs));
  gl.linkProgram(lp);
  const lbuf=gl.createBuffer();
  return {gl,pr,n:idx.length,ext,lo,hi,VS,AR,lp,lbuf,bpos,buv};
}

/* Convert a lon/lat to the 3D mesh's normalised space, sampling the terrain for height. */
function geoTo3d(lon,lat,lo,hi,VS,AR){
  const fx=(lon-B.minx)/(B.maxx-B.minx), fy=(lat-B.miny)/(B.maxy-B.miny);
  let z=elev(lon,lat);
  if(z==null) z=lo;
  return [fx-0.5, ((z-lo)/(hi-lo))*VS, (0.5-fy)*AR];
}
function hex2rgb(h){
  const v=parseInt(h.slice(1),16);
  return [((v>>16)&255)/255, ((v>>8)&255)/255, (v&255)/255];
}
/* Walk a layer's geometry and emit one quad (6 vertices) per segment, in mesh
   space. Stride is 8 floats: start xyz, end xyz, which side, which endpoint. */
const QUAD=[[-1,0],[1,0],[-1,1], [-1,1],[1,0],[1,1]];
function drapeVerts(L,lo,hi,VS,AR){
  const out=[];
  const seg=(a,b)=>{ for(const q of QUAD) out.push(a[0],a[1],a[2], b[0],b[1],b[2], q[0],q[1]); };
  const push=(ring,close)=>{
    const pr=ring.map(c=>geoTo3d(c[0],c[1],lo,hi,VS,AR));
    for(let k=0;k<pr.length-1;k++) seg(pr[k],pr[k+1]);
    if(close&&pr.length>2) seg(pr[pr.length-1],pr[0]);
  };
  for(const f of L.features){
    const t=f.t,c=f.c;
    if(t==='Polygon')            c.forEach(r=>push(r,true));
    else if(t==='MultiPolygon')  c.forEach(p=>p.forEach(r=>push(r,true)));
    else if(t==='LineString')    push(c,false);
    else if(t==='MultiLineString') c.forEach(l=>push(l,false));
  }
  return out;
}
function draw3dLayers(){
  if(!g3) return;
  const {gl,lp,lbuf,lo,hi,VS,AR}=g3;
  gl.useProgram(lp);
  gl.bindBuffer(gl.ARRAY_BUFFER,lbuf);
  const S=32;                                                // 8 floats per vertex
  const at=['pa','pb','side','endf'].map((n,i)=>{
    const a=gl.getAttribLocation(lp,n);
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, i<2?3:1, gl.FLOAT, false, S, [0,12,24,28][i]);
    return a;});
  gl.uniformMatrix4fv(gl.getUniformLocation(lp,'mvp'),false,g3.mvp);
  gl.uniform1f(gl.getUniformLocation(lp,'ex'),exag);
  gl.uniform1f(gl.getUniformLocation(lp,'lift'),VS*0.012);   // clear of the surface
  gl.uniform2f(gl.getUniformLocation(lp,'res'),c3.width*0.5,c3.height*0.5);
  const wloc=gl.getUniformLocation(lp,'w');
  for(const L of D.layers){
    if(!L.on) continue;
    if(!L._v3) L._v3=drapeVerts(L,lo,hi,VS,AR);              // cached per layer
    if(!L._v3.length) continue;
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(L._v3),gl.DYNAMIC_DRAW);
    gl.uniform3fv(gl.getUniformLocation(lp,'col'),hex2rgb(L.colour));
    gl.uniform1f(wloc, Math.max(1.6, L.width*1.1)*devicePixelRatio);   // ~10% over the 2D weight
    gl.drawArrays(gl.TRIANGLES,0,L._v3.length/8);
  }
  for(const a of at) if(a!==g3.bpos.a && a!==g3.buv.a) gl.disableVertexAttribArray(a);
  gl.useProgram(g3.pr);
}
function render3d(){
  if(!g3) return;
  const {gl,pr,n,bpos,buv}=g3;
  gl.useProgram(pr);
  for(const v of [bpos,buv]){                 // attrib state is global, not per-program
    gl.bindBuffer(gl.ARRAY_BUFFER,v.b);
    gl.enableVertexAttribArray(v.a);
    gl.vertexAttribPointer(v.a,v.n,gl.FLOAT,false,0,0);
  }
  c3.width=W*devicePixelRatio; c3.height=H*devicePixelRatio;
  c3.style.width=W+'px'; c3.style.height=H+'px';
  gl.viewport(0,0,c3.width,c3.height);
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  const e=[Math.cos(cam.el)*Math.sin(cam.az)*cam.d, Math.sin(cam.el)*cam.d,
           Math.cos(cam.el)*Math.cos(cam.az)*cam.d];
  const mvp=mul(persp(0.9,W/H,0.01,20), look(e,[0,0.03,0],[0,1,0]));
  g3.mvp=mvp;
  gl.uniformMatrix4fv(gl.getUniformLocation(pr,'mvp'),false,mvp);
  gl.uniform1f(gl.getUniformLocation(pr,'ex'),exag);
  gl.drawElements(gl.TRIANGLES,n,gl.UNSIGNED_INT,0);
  draw3dLayers();
}
function set3d(on){
  is3d=on;
  document.getElementById('cv').style.display=on?'none':'block';
  c3.style.display=on?'block':'none';
  document.getElementById('ex3d').style.display=on?'block':'none';
  document.getElementById('btn3d').classList.toggle('on',on); saveView();
  document.getElementById('read').style.opacity=on?0.35:1;
  // the compass is a fixed north-up reference; in 3D the camera orbits, so it would lie
  const cmp=document.getElementById('compass'); if(cmp) cmp.style.display=on?'none':'block';
  if(on){ if(!g3) g3=init3d(); render3d(); } else draw();
}
if(D.tex && D.mesh){
  const b=document.getElementById('btn3d'); b.style.display='inline-block';
  b.onclick=()=>navGo('general', is3d?'mapa':'3d');   // superseded by the nav; kept wired
  document.getElementById('exag').oninput=e=>{
    exag=parseFloat(e.target.value);
    document.getElementById('exagv').textContent=exag+'×'; saveView(); render3d();};
  let d3=null;
  c3.addEventListener('mousedown',e=>{d3={x:e.clientX,y:e.clientY,az:cam.az,el:cam.el};});
  addEventListener('mouseup',()=>{d3=null;});
  addEventListener('mousemove',e=>{ if(!d3)return;
    cam.az=d3.az-(e.clientX-d3.x)*0.005;
    cam.el=Math.max(0.05,Math.min(1.45,d3.el+(e.clientY-d3.y)*0.005));
    saveView(); render3d();});
  c3.addEventListener('wheel',e=>{e.preventDefault();
    cam.d=Math.max(0.6,Math.min(6,cam.d*Math.exp(e.deltaY*0.0012))); saveView(); render3d();},{passive:false});
  addEventListener('resize',()=>{ if(is3d) render3d(); });
}

