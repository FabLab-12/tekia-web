/* Motor WebGL del cuerpo (prototipo). Pinta solo la capa del cuerpo:
   1) volumen: cada vértice de la piel deja una mancha suave en un búfer de densidad; un umbral da una silueta limpia,
      y dentro se rellena (verde salvia en claro, sombra cálida en obscuro), con una variación interna suave;
   2) red: cada hebra es un segmento con antialias, coloreado por su nivel de luz;
   3) brillo: la red se difumina a media resolución y se suma con radio pequeño, solo sobre las líneas.
   El resto (anillo, nodos, partículas, textos) sigue en Canvas 2D encima. Si no hay WebGL2, el atlas usa 2D. */
(function(){
  var gl,cv,P={},B={},F={},w=0,h=0,segCap=0,segBuf=null,ptCap=0,ptBuf=null,quad;
  function sh(t,s){var o=gl.createShader(t);gl.shaderSource(o,'#version 300 es\nprecision highp float;\n'+s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw gl.getShaderInfoLog(o);return o}
  function prog(vs,fs){var p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,vs));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw gl.getProgramInfoLog(p);
    var u={},n=gl.getProgramParameter(p,gl.ACTIVE_UNIFORMS);for(var i=0;i<n;i++){var a=gl.getActiveUniform(p,i),k=a.name.replace(/\[0\]$/,'');u[k]=gl.getUniformLocation(p,a.name)}return {p:p,u:u}}
  function tex(W,H){var t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,W,H,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    var f=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,f);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,t,0);return {t:t,f:f,w:W,h:H}}
  function free(o){if(o){gl.deleteTexture(o.t);gl.deleteFramebuffer(o.f)}}
  var FSQ='in vec2 q;out vec2 uv;void main(){uv=q;gl_Position=vec4(q*2.-1.,0,1);}';
  function init(c){cv=c;gl=c.getContext('webgl2',{premultipliedAlpha:true,alpha:true,antialias:false,preserveDrawingBuffer:false});if(!gl)return false;
    try{
      P.pt=prog('in vec2 p;uniform vec2 res;uniform float ps;void main(){vec2 c=p/res*2.-1.;gl_Position=vec4(c.x,-c.y,0,1);gl_PointSize=ps;}',
        'out vec4 o;void main(){vec2 d=gl_PointCoord*2.-1.;float r=dot(d,d);if(r>1.)discard;float g=exp(-r*2.6)-exp(-2.6);o=vec4(g*.16);}');
      P.vol=prog(FSQ,'in vec2 uv;out vec4 o;uniform sampler2D d;uniform float claro,ga,t;'+
        'void main(){float v=texture(d,uv).r;float m=smoothstep(.2,.27,v);if(m<.002){o=vec4(0);return;}float core=smoothstep(.27,1.,v);'+
        'float n=sin(uv.x*17.+t*.07)*sin(uv.y*9.-uv.x*6.+t*.05)*.5+.5;'+
        'vec3 cl=mix(vec3(.5,.6,.43),vec3(.42,.52,.36),core*.35);cl*=.95+.08*n;'+
        'vec3 cd=mix(vec3(.16,.12,.085),vec3(.11,.085,.06),core);'+
        'vec3 c=mix(cd,cl,claro);float a=m*mix(.32,.56,claro)*ga;o=vec4(c*a,a);}');
      P.ln=prog('layout(location=0) in vec2 q;layout(location=1) in vec4 s;layout(location=2) in vec2 m;'+
        'uniform vec2 res;uniform float dpr;uniform vec3 cols[6];uniform float al[18];uniform float wd[3];out vec4 vc;out float vd;out float hw;'+
        'void main(){vec2 a=s.xy*dpr,b=s.zw*dpr,e=b-a;float L=length(e);vec2 dr=L>.001?e/L:vec2(1,0),nr=vec2(-dr.y,dr.x);int lv=int(m.x+.5),k=int(m.y+.5);'+
        'float wr=wd[k]*dpr,w=max(1.,wr);hw=w*.5+.75;vec2 p=mix(a,b,q.x)+dr*(q.x*2.-1.)*w*.5+nr*q.y*hw;vd=q.y*hw;'+
        'vc=vec4(cols[lv],al[k*6+lv]*min(1.,wr));vec2 c=p/res*2.-1.;gl_Position=vec4(c.x,-c.y,0,1);}',
        'in vec4 vc;in float vd;in float hw;out vec4 o;void main(){float a=vc.a*clamp(hw-abs(vd),0.,1.);o=vec4(vc.rgb*a,a);}');
      P.cp=prog(FSQ,'in vec2 uv;out vec4 o;uniform sampler2D s;uniform float k;void main(){o=texture(s,uv)*k;}');
      P.bl=prog(FSQ,'in vec2 uv;out vec4 o;uniform sampler2D s;uniform vec2 st;void main(){vec4 c=texture(s,uv)*.2270;'+
        'c+=(texture(s,uv+st*1.3846)+texture(s,uv-st*1.3846))*.3162;c+=(texture(s,uv+st*3.2308)+texture(s,uv-st*3.2308))*.0703;o=c;}');
      P.gw=prog(FSQ,'in vec2 uv;out vec4 o;uniform sampler2D s;uniform vec3 tint;uniform float k;void main(){vec4 c=texture(s,uv);o=vec4(tint*c.a*k,0.);}');
    }catch(e){console.warn('TEKIA WebGL:',e);gl=null;return false}
    quad=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([0,0,1,0,0,1,1,1]),gl.STATIC_DRAW);
    B.corner=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,B.corner);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([0,-1,1,-1,0,1,1,1]),gl.STATIC_DRAW);
    B.seg=gl.createBuffer();B.pt=gl.createBuffer();
    B.vaoQ=gl.createVertexArray();gl.bindVertexArray(B.vaoQ);gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
    B.vaoP=gl.createVertexArray();gl.bindVertexArray(B.vaoP);gl.bindBuffer(gl.ARRAY_BUFFER,B.pt);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
    B.vaoL=gl.createVertexArray();gl.bindVertexArray(B.vaoL);gl.bindBuffer(gl.ARRAY_BUFFER,B.corner);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
    gl.bindBuffer(gl.ARRAY_BUFFER,B.seg);gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,4,gl.FLOAT,false,24,0);gl.vertexAttribDivisor(1,1);
    gl.enableVertexAttribArray(2);gl.vertexAttribPointer(2,2,gl.FLOAT,false,24,16);gl.vertexAttribDivisor(2,1);
    gl.bindVertexArray(null);
    c.addEventListener('webglcontextlost',function(e){e.preventDefault();api.ok=false});
    return true}
  function size(W,H){if(W===w&&H===h)return;w=W;h=H;cv.width=W;cv.height=H;free(F.d);free(F.s);free(F.b1);free(F.b2);
    F.d=tex(Math.max(1,W>>1),Math.max(1,H>>1));F.s=tex(W,H);F.b1=tex(Math.max(1,W>>1),Math.max(1,H>>1));F.b2=tex(Math.max(1,W>>1),Math.max(1,H>>1))}
  function target(f){gl.bindFramebuffer(gl.FRAMEBUFFER,f?f.f:null);gl.viewport(0,0,f?f.w:w,f?f.h:h)}
  function full(p){gl.useProgram(p.p);gl.bindVertexArray(B.vaoQ);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)}
  // segmentos: [x1,y1,x2,y2,nivel,tipo] en px CSS; puntos: [x,y]
  var api={ok:false,
    segs:function(n){if(n>segCap){segCap=Math.ceil(n*1.3);segBuf=new Float32Array(segCap*6)}return segBuf},
    pts:function(n){if(n>ptCap){ptCap=Math.ceil(n*1.3);ptBuf=new Float32Array(ptCap*2)}return ptBuf},
    clear:function(){if(!api.ok)return;target(null);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT)},
    draw:function(o){if(!api.ok)return;var W=Math.round(o.W*o.dpr),H=Math.round(o.H*o.dpr);size(W,H);var dpr=o.dpr;
      gl.disable(gl.DEPTH_TEST);gl.enable(gl.BLEND);
      // 1. densidad del volumen a media resolución
      target(F.d);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.blendFunc(gl.ONE,gl.ONE);
      gl.useProgram(P.pt.p);gl.uniform2f(P.pt.u.res,o.W,o.H);gl.uniform1f(P.pt.u.ps,Math.min(gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)[1],o.vr*2*2.4*dpr*.5));
      gl.bindVertexArray(B.vaoP);gl.bindBuffer(gl.ARRAY_BUFFER,B.pt);gl.bufferData(gl.ARRAY_BUFFER,ptBuf.subarray(0,o.np*2),gl.DYNAMIC_DRAW);gl.drawArrays(gl.POINTS,0,o.np);
      // 2. red de hebras a resolución completa
      target(F.s);gl.clear(gl.COLOR_BUFFER_BIT);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(P.ln.p);gl.uniform2f(P.ln.u.res,W,H);gl.uniform1f(P.ln.u.dpr,dpr);gl.uniform3fv(P.ln.u.cols,o.cols);gl.uniform1fv(P.ln.u.al,o.al);gl.uniform1fv(P.ln.u.wd,o.wd);
      gl.bindVertexArray(B.vaoL);gl.bindBuffer(gl.ARRAY_BUFFER,B.seg);gl.bufferData(gl.ARRAY_BUFFER,segBuf.subarray(0,o.ns*6),gl.DYNAMIC_DRAW);gl.drawArraysInstanced(gl.TRIANGLE_STRIP,0,4,o.ns);
      // 3. brillo: difuminar la red a media resolución
      gl.disable(gl.BLEND);target(F.b1);gl.useProgram(P.cp.p);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,F.s.t);gl.uniform1i(P.cp.u.s,0);gl.uniform1f(P.cp.u.k,1);full(P.cp);
      for(var it=0;it<1;it++){target(F.b2);gl.useProgram(P.bl.p);gl.bindTexture(gl.TEXTURE_2D,F.b1.t);gl.uniform1i(P.bl.u.s,0);gl.uniform2f(P.bl.u.st,1/F.b1.w,0);full(P.bl);
        target(F.b1);gl.bindTexture(gl.TEXTURE_2D,F.b2.t);gl.uniform2f(P.bl.u.st,0,1/F.b1.h);full(P.bl)}
      // 4. componer en pantalla: volumen, red, brillo sumado
      target(null);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(P.vol.p);gl.bindTexture(gl.TEXTURE_2D,F.d.t);gl.uniform1i(P.vol.u.d,0);gl.uniform1f(P.vol.u.claro,o.claro?1:0);gl.uniform1f(P.vol.u.ga,o.gA);gl.uniform1f(P.vol.u.t,o.t);full(P.vol);
      gl.useProgram(P.cp.p);gl.bindTexture(gl.TEXTURE_2D,F.s.t);gl.uniform1f(P.cp.u.k,1);full(P.cp);
      gl.blendFunc(gl.ONE,gl.ONE);gl.useProgram(P.gw.p);gl.bindTexture(gl.TEXTURE_2D,F.b1.t);gl.uniform1i(P.gw.u.s,0);gl.uniform3fv(P.gw.u.tint,o.claro?[1,.88,.66]:[.95,.8,.55]);gl.uniform1f(P.gw.u.k,o.claro?.32:.6);full(P.gw);
      gl.bindVertexArray(null)}};
  api.init=function(c){api.ok=init(c);return api.ok};
  window.TEKIA_GL=api;
})();
