/* Motor WebGL del cuerpo de TEKIA.
   El cuerpo emerge de una red de fibras; el verde vive entre las fibras.
   Orden de composición en cada cuadro:
     1. fibras profundas (detrás, oro apagado)
     2. volumen interior: bruma verde translúcida que nace de puntos interiores, sin umbral ni contorno
     3. fibras cercanas (oro, champán y marfil según profundidad y luz)
     4. brillo selectivo: solo las fibras cercanas más luminosas, radio pequeño
     5. nodos escasos en bifurcaciones
   Un solo conjunto de geometría para claro y obscuro; el tema solo cambia materiales.
   Si el navegador no tiene WebGL2, el atlas sigue con su dibujo 2D. */
(function(){
  var gl,cv,P={},V={},F={},w=0,h=0,bufs={};
  var TEMAS={
    claro:{fib:[[.60,.40,.12],[.92,.66,.24],[1,.86,.52],[1,.97,.90]],aMin:.4,aMax:1,
           volEdge:[.506,.604,.467],volCore:[.259,.361,.263],volA:.6,bloom:[1,.8,.48],bloomK:.45},
    oscuro:{fib:[[.42,.30,.14],[.80,.60,.28],[.96,.80,.50],[1,.96,.87]],aMin:.18,aMax:1,
           volEdge:[.20,.29,.22],volCore:[.16,.24,.18],volA:.5,bloom:[.95,.8,.55],bloomK:.55}};
  function sh(t,s){var o=gl.createShader(t);gl.shaderSource(o,'#version 300 es\nprecision highp float;\n'+s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw gl.getShaderInfoLog(o);return o}
  function prog(vs,fs){var p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,vs));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw gl.getProgramInfoLog(p);
    var u={},n=gl.getProgramParameter(p,gl.ACTIVE_UNIFORMS);for(var i=0;i<n;i++){var a=gl.getActiveUniform(p,i);u[a.name.replace(/\[0\]$/,'')]=gl.getUniformLocation(p,a.name)}return {p:p,u:u}}
  // la densidad del verde se acumula en media precisión (si el equipo lo permite) para que no se formen escalones ni motas
  var HF=false;
  function fbo(W,H,hf){var t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);if(hf&&HF)gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA16F,W,H,0,gl.RGBA,gl.HALF_FLOAT,null);else gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,W,H,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
    [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER].forEach(function(k){gl.texParameteri(gl.TEXTURE_2D,k,gl.LINEAR)});
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    var f=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,f);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,t,0);return {t:t,f:f,w:W,h:H}}
  function drop(o){if(o){gl.deleteTexture(o.t);gl.deleteFramebuffer(o.f)}}
  var FSQ='in vec2 q;out vec2 uv;void main(){uv=q;gl_Position=vec4(q*2.-1.,0,1);}';
  // segmento instanciado: x1,y1,x2,y2 (px CSS), b (0..1: luz y cercanía), ancho (px CSS)
  var SEG_VS='layout(location=0) in vec2 q;layout(location=1) in vec4 s;layout(location=2) in vec2 m;'+
    'uniform vec2 res;uniform float dpr,sc,thr,tt;uniform vec3 c0,c1,c2,c3,pul;uniform float aMin,aMax,ga;out vec4 vc;out float vd,hw;'+
    'void main(){vec2 a=s.xy*dpr*sc,b=s.zw*dpr*sc,e=b-a;float L=length(e);vec2 dr=L>.001?e/L:vec2(1,0),nr=vec2(-dr.y,dr.x);'+
    'float k=m.x,bw=0.;if(pul.z>0.){float d=length((s.xy+s.zw)*.5-pul.xy)/pul.z,cy=fract(tt/7.5),fr=cy*1.25;bw=exp(-pow((d-fr)/.075,2.))*(1.-cy)*smoothstep(0.,.08,cy);k=min(1.,k+bw*.4);k*=.95+.05*sin(tt*1.142);}'+'float wr=m.y*dpr*sc*(1.+bw*.35),wd=max(1.,wr);hw=wd*.5+.6;vec2 p=mix(a,b,q.x)+dr*(q.x*2.-1.)*wd*.5+nr*q.y*hw;vd=q.y*hw;'+
    'vec3 c=k<.33?mix(c0,c1,k/.33):k<.72?mix(c1,c2,(k-.33)/.39):mix(c2,c3,(k-.72)/.28);'+
    'float al=mix(aMin,aMax,k*k)*min(1.,wr)*ga;if(thr>0.)al*=smoothstep(thr,1.,k);'+
    'vc=vec4(c,al);vec2 cl=p/res*2.-1.;gl_Position=vec4(cl.x,-cl.y,0,1);}';
  var SEG_FS='in vec4 vc;in float vd,hw;out vec4 o;void main(){float a=vc.a*clamp(hw-abs(vd),0.,1.);o=vec4(vc.rgb*a,a);}';
  function init(c){cv=c;try{gl=c.getContext('webgl2',{premultipliedAlpha:true,alpha:true,antialias:false})}catch(e){gl=null}if(!gl)return false;HF=!!(gl.getExtension('EXT_color_buffer_float')||gl.getExtension('EXT_color_buffer_half_float'));
    try{
      P.seg=prog(SEG_VS,SEG_FS);
      P.pt=prog('in vec3 p;uniform vec2 res;uniform float ps;out float wt;void main(){vec2 c=p.xy/res*2.-1.;gl_Position=vec4(c.x,-c.y,0,1);gl_PointSize=ps;wt=p.z;}',
        'in float wt;out vec4 o;void main(){vec2 d=gl_PointCoord*2.-1.;float r=dot(d,d);if(r>1.)discard;float g=(exp(-r*3.)-exp(-3.))*.04*wt;o=vec4(g);}');
      // verde interior (como en la versión publicada): bruma translúcida bajo las fibras cercanas
      P.vol=prog(FSQ,'in vec2 uv;out vec4 o;uniform sampler2D d;uniform vec3 ce,cc;uniform float A,ga,t;'+
        'void main(){float v=texture(d,uv).r;float a=max(0.,1.-exp(-v*6.)-.1)/.9;if(a<.003){o=vec4(0);return;}'+
        'float n=sin(uv.x*23.+t*.05)*sin(uv.y*13.-uv.x*7.-t*.04)*.5+.5;float core=smoothstep(.25,.95,a);'+
        'vec3 c=mix(ce,cc,core)*(.96+.07*n);float al=a*A*ga*(.9+.1*n);o=vec4(c*al,al);}');
      P.nod=prog('in vec4 p;uniform vec2 res;uniform float dpr;out float b;void main(){vec2 c=p.xy/res*2.-1.;gl_Position=vec4(c.x,-c.y,0,1);gl_PointSize=p.w*dpr;b=p.z;}',
        'in float b;out vec4 o;uniform vec3 col;void main(){vec2 d=gl_PointCoord*2.-1.;float r=length(d);if(r>1.)discard;float core=1.-smoothstep(.12,.24,r);float halo=exp(-r*r*9.)*.12;float a=(core+halo)*b;o=vec4(col*a,a);}');
      P.cp=prog(FSQ,'in vec2 uv;out vec4 o;uniform sampler2D s;void main(){o=texture(s,uv);}');
      P.bl=prog(FSQ,'in vec2 uv;out vec4 o;uniform sampler2D s;uniform vec2 st;void main(){vec4 c=texture(s,uv)*.2270;c+=(texture(s,uv+st*1.3846)+texture(s,uv-st*1.3846))*.3162;c+=(texture(s,uv+st*3.2308)+texture(s,uv-st*3.2308))*.0703;o=c;}');
      P.gw=prog(FSQ,'in vec2 uv;out vec4 o;uniform sampler2D s;uniform vec3 tint;uniform float k;void main(){vec4 c=texture(s,uv);o=vec4(tint*c.a*k,0.);}');
    }catch(e){console.warn('TEKIA WebGL:',e);gl=null;return false}
    function vbo(d){var b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,d,gl.STATIC_DRAW);return b}
    var quad=vbo(new Float32Array([0,0,1,0,0,1,1,1])),corner=vbo(new Float32Array([0,-1,1,-1,0,1,1,1]));
    V.q=gl.createVertexArray();gl.bindVertexArray(V.q);gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
    ['back','front'].forEach(function(k){bufs[k]=gl.createBuffer();var v=gl.createVertexArray();gl.bindVertexArray(v);gl.bindBuffer(gl.ARRAY_BUFFER,corner);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
      gl.bindBuffer(gl.ARRAY_BUFFER,bufs[k]);gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,4,gl.FLOAT,false,24,0);gl.vertexAttribDivisor(1,1);gl.enableVertexAttribArray(2);gl.vertexAttribPointer(2,2,gl.FLOAT,false,24,16);gl.vertexAttribDivisor(2,1);V[k]=v});
    bufs.vol=gl.createBuffer();V.vol=gl.createVertexArray();gl.bindVertexArray(V.vol);gl.bindBuffer(gl.ARRAY_BUFFER,bufs.vol);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0);
    bufs.nod=gl.createBuffer();V.nod=gl.createVertexArray();gl.bindVertexArray(V.nod);gl.bindBuffer(gl.ARRAY_BUFFER,bufs.nod);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,4,gl.FLOAT,false,0,0);
    bufs.par=gl.createBuffer();V.par=gl.createVertexArray();gl.bindVertexArray(V.par);gl.bindBuffer(gl.ARRAY_BUFFER,bufs.par);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,4,gl.FLOAT,false,0,0);
    gl.bindVertexArray(null);
    c.addEventListener('webglcontextlost',function(e){e.preventDefault();api.ok=false});
    return true}
  function size(W,H){if(W===w&&H===h)return;w=W;h=H;cv.width=W;cv.height=H;drop(F.d);drop(F.b1);drop(F.b2);drop(F.v2);
    var hw=Math.max(1,W>>1),hh=Math.max(1,H>>1);F.d=fbo(hw,hh,1);F.b1=fbo(hw,hh);F.b2=fbo(hw,hh);F.v2=fbo(hw,hh,1)}
  function target(f){gl.bindFramebuffer(gl.FRAMEBUFFER,f?f.f:null);gl.viewport(0,0,f?f.w:w,f?f.h:h)}
  function full(){gl.bindVertexArray(V.q);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)}
  function segs(k,data,n,o,T,sc,thr){if(!n)return;var p=P.seg,u=p.u;gl.useProgram(p.p);gl.uniform2f(u.res,sc<1?F.b1.w:w,sc<1?F.b1.h:h);gl.uniform1f(u.dpr,o.dpr);gl.uniform1f(u.sc,sc);gl.uniform1f(u.thr,thr);
    gl.uniform3fv(u.c0,o.tono&&o.tono.length>5?o.tono.slice(3,6):T.fib[0]);gl.uniform3fv(u.c1,T.fib[1]);gl.uniform3fv(u.c2,T.fib[2]);gl.uniform3fv(u.c3,T.fib[3]);gl.uniform1f(u.tt,o.t);gl.uniform3fv(u.pul,o.pulso?[o.pulso.x,o.pulso.y,o.pulso.s]:[0,0,0]);gl.uniform1f(u.aMin,o.tono?o.tono[1]:T.aMin);gl.uniform1f(u.aMax,T.aMax);gl.uniform1f(u.ga,o.gA);
    gl.bindVertexArray(V[k]);gl.bindBuffer(gl.ARRAY_BUFFER,bufs[k]);gl.bufferData(gl.ARRAY_BUFFER,data.subarray(0,n*6),gl.STREAM_DRAW);gl.drawArraysInstanced(gl.TRIANGLE_STRIP,0,4,n)}
  var api={ok:false,TEMAS:TEMAS,
    clear:function(){if(!api.ok)return;target(null);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT)},
    // o: {W,H,dpr,tema,gA,t,back:{d,n},front:{d,n},vol:{d,n,r},nod:{d,n}}
    draw:function(o){if(!api.ok)return;var C=o.capa||'F',cV=C!=='B'&&C!=='C',cF=C!=='A',cX=C==='F';var T=TEMAS[o.tema]||TEMAS.oscuro,W=Math.round(o.W*o.dpr),H=Math.round(o.H*o.dpr);size(W,H);
      gl.disable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.activeTexture(gl.TEXTURE0);
      // densidad del volumen interior (media resolución)
      target(F.d);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.blendFunc(gl.ONE,gl.ONE);
      gl.useProgram(P.pt.p);gl.uniform2f(P.pt.u.res,o.W,o.H);gl.uniform1f(P.pt.u.ps,Math.min(gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)[1],o.vol.r*2*o.dpr*.5));
      gl.bindVertexArray(V.vol);gl.bindBuffer(gl.ARRAY_BUFFER,bufs.vol);gl.bufferData(gl.ARRAY_BUFFER,o.vol.d.subarray(0,o.vol.n*3),gl.STREAM_DRAW);gl.drawArrays(gl.POINTS,0,o.vol.n);
      // la densidad se suaviza una vez: el verde es una bruma continua, sin manchas
      gl.disable(gl.BLEND);gl.useProgram(P.bl.p);gl.uniform1i(P.bl.u.s,0);
      // tres pasadas de difuminado con radio proporcional al tamaño de cada punto: un velo continuo, sin algodón
      var bs=Math.max(1.4,o.vol.r*o.dpr*.5/3.2);for(var it=0;it<3;it++){
        target(F.v2);gl.bindTexture(gl.TEXTURE_2D,F.d.t);gl.uniform2f(P.bl.u.st,bs/F.d.w,0);full();
        target(F.d);gl.bindTexture(gl.TEXTURE_2D,F.v2.t);gl.uniform2f(P.bl.u.st,0,bs/F.d.h);full()}
      gl.enable(gl.BLEND);
      // brillo selectivo: solo fibras cercanas muy luminosas, a media resolución
      target(F.b1);gl.clear(gl.COLOR_BUFFER_BIT);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);segs('front',o.front.d,o.front.n,o,T,.5,.62);
      gl.disable(gl.BLEND);gl.useProgram(P.bl.p);gl.uniform1i(P.bl.u.s,0);
      target(F.b2);gl.bindTexture(gl.TEXTURE_2D,F.b1.t);gl.uniform2f(P.bl.u.st,1/F.b1.w,0);full();
      target(F.b1);gl.bindTexture(gl.TEXTURE_2D,F.b2.t);gl.uniform2f(P.bl.u.st,0,1/F.b1.h);full();
      // composición en pantalla
      target(null);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
      if(cF)segs('back',o.back.d,o.back.n,o,T,1,0);
      if(cV){gl.useProgram(P.vol.p);gl.bindTexture(gl.TEXTURE_2D,F.d.t);gl.uniform1i(P.vol.u.d,0);gl.uniform3fv(P.vol.u.ce,T.volEdge);gl.uniform3fv(P.vol.u.cc,T.volCore);gl.uniform1f(P.vol.u.A,T.volA*(o.pulso?.93+.07*Math.sin(o.t*1.142):1));gl.uniform1f(P.vol.u.ga,o.gA);gl.uniform1f(P.vol.u.t,o.t);full();}
      if(cF)segs('front',o.front.d,o.front.n,o,T,1,0);
      if(cX){gl.blendFunc(gl.ONE,gl.ONE);gl.useProgram(P.gw.p);gl.bindTexture(gl.TEXTURE_2D,F.b1.t);gl.uniform1i(P.gw.u.s,0);gl.uniform3fv(P.gw.u.tint,T.bloom);gl.uniform1f(P.gw.u.k,(o.tono?o.tono[2]:T.bloomK)*o.gA);full();}
      if(cX&&o.nod.n){gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);gl.useProgram(P.nod.p);gl.uniform2f(P.nod.u.res,o.W,o.H);gl.uniform1f(P.nod.u.dpr,o.dpr);gl.uniform3fv(P.nod.u.col,T.fib[3]);
        gl.bindVertexArray(V.nod);gl.bindBuffer(gl.ARRAY_BUFFER,bufs.nod);gl.bufferData(gl.ARRAY_BUFFER,o.nod.d.subarray(0,o.nod.n*4),gl.STREAM_DRAW);gl.drawArrays(gl.POINTS,0,o.nod.n)}
      // partículas de vida: viajan dentro de las fibras (mismo dibujo que los nodos, más pequeñas)
      if(cX&&o.par&&o.par.n){gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);gl.useProgram(P.nod.p);gl.uniform2f(P.nod.u.res,o.W,o.H);gl.uniform1f(P.nod.u.dpr,o.dpr);gl.uniform3fv(P.nod.u.col,T.fib[3]);
        gl.bindVertexArray(V.par);gl.bindBuffer(gl.ARRAY_BUFFER,bufs.par);gl.bufferData(gl.ARRAY_BUFFER,o.par.d.subarray(0,o.par.n*4),gl.STREAM_DRAW);gl.drawArrays(gl.POINTS,0,o.par.n)}
      gl.bindVertexArray(null)}};
  api.init=function(c){api.ok=init(c);return api.ok};
  window.TEKIA_GL=api;
})();
