/* Tema claro / oscuro (prueba). Una palanquita bajo «Sonido» cambia entre los dos sin recargar; la elección se recuerda.
   También responde a ?tema=claro y ?tema=oscuro.
   En claro, los dibujos en canvas pensados para fondo oscuro se traducen así:
   - el cuerpo lleva dentro una capa verde recortada por su silueta (se dibuja en index.html, sin traducir);
   - las hebras y luces más claras pasan a blanco cálido; las intermedias, a naranja y ámbar;
   - la mezcla aditiva («lighter») se vuelve normal. */
(function(){
  var root=document.documentElement,KEY='tekia-tema-v2',on=false,cache={};
  var q=/[?&]tema=(claro|oscuro)\b/.exec(location.search),t=null;
  try{if(q)localStorage.setItem(KEY,q[1]);t=localStorage.getItem(KEY)}catch(e){}
  if(q)t=q[1];
  if(window.TEKIA_TEMA)t=window.TEKIA_TEMA;
  function hsl2rgb(h,s,l){function f(n){var k=(n+h/30)%12,a=s*Math.min(l,1-l);return Math.round(255*(l-a*Math.max(-1,Math.min(k-3,9-k,1))))}return f(0)+','+f(8)+','+f(4)}
  // devuelve [rgb, factor de opacidad, es volumen]; k = 'f' relleno o 's' trazo
  function rgb(r,g,b,k){var key=k+r+','+g+','+b;if(cache[key])return cache[key];
    var R=r/255,G=g/255,B=b/255,mx=Math.max(R,G,B),mn=Math.min(R,G,B),l=(mx+mn)/2,d=mx-mn,h=0;
    if(d){h=mx===R?((G-B)/d)%6:mx===G?(B-R)/d+2:(R-G)/d+4;h*=60;if(h<0)h+=360}
    var hw=Math.max(22,Math.min(40,d?h:32)),o;
    if(l<.2)o=k==='f'?[hsl2rgb(34,.8,.6),2.0,1]                         // volumen del cuerpo: miel ámbar, con halo
                    :[hsl2rgb(40,.85,.78),1.6];                                   // hebras profundas: ámbar tenue
    else if(l<.42)o=[hsl2rgb(41,.9,.8),1.9];                    // hebras del fondo: oro suave
    else if(k==='f'&&l>=.6)o=[hsl2rgb(44,.9,.965),1.5];                         // polvo y destellos: luz blanca cálida
    else if(l<.8)o=[hsl2rgb(43,.95,.84-.04*(l-.42)/.38),1.6,2];   // hebras: oro pálido luminoso
    else o=[hsl2rgb(44,.9,.96),1.3,2];                                          // hebras más claras: blanco cálido, con brillo
    return cache[key]=o}
  function map(v,k,c){if(!on||typeof v!=='string')return v;
    var m=/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(v),o;
    if(m){o=rgb(+m[1],+m[2],+m[3],k);if(c)c.__vol=o[2]===1;if(k==='s'&&c)c.__glow=o[2]===2;return 'rgba('+o[0]+','+(m[4]==null?1:Math.min(1,m[4]*o[1])).toFixed(3)+')'}
    m=/^#([0-9a-f]{6})$/i.exec(v);if(m){var n=parseInt(m[1],16);return 'rgb('+rgb(n>>16,n>>8&255,n&255,k)[0]+')'}
    return v}
  var P=CanvasRenderingContext2D.prototype,fs=Object.getOwnPropertyDescriptor(P,'fillStyle'),ss=Object.getOwnPropertyDescriptor(P,'strokeStyle'),gc=Object.getOwnPropertyDescriptor(P,'globalCompositeOperation');
  function wrapG(g,raw){var a=g.addColorStop;g.addColorStop=function(o,c){a.call(g,o,raw?c:map(c,'f'))};return g}
  function wrap(c){if(!c||c.__tema)return c;c.__tema=1;
    Object.defineProperty(c,'fillStyle',{get:function(){return fs.get.call(this)},set:function(v){fs.set.call(this,this.__raw?v:map(v,'f',this))}});
    Object.defineProperty(c,'strokeStyle',{get:function(){return ss.get.call(this)},set:function(v){this.__glow=false;ss.set.call(this,this.__raw?v:map(v,'s',this))}});
    Object.defineProperty(c,'globalCompositeOperation',{get:function(){return gc.get.call(this)},set:function(v){gc.set.call(this,on&&v==='lighter'?'source-over':v)}});
    // las hebras más claras brillan con un halo dorado
    var sk=c.stroke;c.stroke=function(){if(on&&this.__glow){var sc=this.shadowColor,sb=this.shadowBlur;this.shadowColor='rgba(240,180,90,.95)';this.shadowBlur=5;sk.apply(this,arguments);this.shadowColor=sc;this.shadowBlur=sb}else sk.apply(this,arguments)};
    var rg=c.createRadialGradient,lg=c.createLinearGradient;
    c.createRadialGradient=function(){return wrapG(rg.apply(this,arguments),this.__raw)};
    c.createLinearGradient=function(){return wrapG(lg.apply(this,arguments),this.__raw)};
    return c}
  var gx=HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext=function(k){var c=gx.apply(this,arguments);return k==='2d'?wrap(c):c};
  var meta=document.createElement('meta');meta.name='theme-color';document.head.appendChild(meta);
  function apply(claro){on=claro;root.classList.toggle('claro',claro);meta.content=claro?'#F6F1E4':'#120F0D';
    [].forEach.call(document.querySelectorAll('.tm-sw'),function(b){b.setAttribute('aria-checked',claro?'true':'false');b.querySelector('.tm-l').textContent=claro?'Claro':'Obscuro'});
    if(window.TEKIA_nosHalo)try{TEKIA_nosHalo()}catch(e){}}
  apply(t!=='oscuro'); // la web empieza en claro
  window.TEKIA_claro=function(){return on};
  // cambio en calma: la escena se desvanece, cambia el tema y vuelve a aparecer
  var busy=false,still=matchMedia('(prefers-reduced-motion: reduce)');
  function cambiar(){if(busy)return;var claro=!on;try{localStorage.setItem(KEY,claro?'claro':'oscuro')}catch(e){}
    if(still.matches){apply(claro);return}
    busy=true;root.classList.add('tm-velo');
    setTimeout(function(){apply(claro);requestAnimationFrame(function(){root.classList.remove('tm-velo');setTimeout(function(){busy=false},900)})},900)}
  function crear(id,cls){var b=document.createElement('button');b.type='button';b.id=id;b.className=cls;b.setAttribute('role','switch');b.setAttribute('aria-label','Tema claro');
    b.innerHTML='<span class="tm-t" aria-hidden="true"><i></i></span><span class="tm-l" aria-hidden="true"></span>';b.addEventListener('click',cambiar);return b}
  // una palanquita en la barra superior y otra en la pantalla de entrada
  function boton(){var top=document.querySelector('.top'),gate=document.getElementById('gate');
    if(top&&!document.getElementById('tema-sw'))top.appendChild(crear('tema-sw','tm-sw'));
    if(gate&&!document.getElementById('tema-sw-gate'))gate.appendChild(crear('tema-sw-gate','tm-sw tm-gate'));
    apply(on)}
  var st=document.createElement('style');
  st.textContent=
   '.tm-sw{position:absolute;right:max(20px,env(safe-area-inset-right,0px));top:calc(100% + 10px);display:inline-flex;align-items:center;gap:.5rem;min-height:32px;padding:.2rem .3rem;background:none;border:0;cursor:pointer;font:400 .72rem/1 "Montserrat",system-ui,sans-serif;letter-spacing:.04em;color:#B4AA97;-webkit-tap-highlight-color:transparent}'+
   '.tm-t{position:relative;width:26px;height:14px;border-radius:99px;border:.5px solid rgba(217,195,138,.55);transition:border-color 1.2s ease,background 1.2s ease}'+
   '.tm-t i{position:absolute;top:2px;left:2px;width:9px;height:9px;border-radius:50%;background:#D9C38A;transition:transform 1.2s ease,background 1.2s ease}'+
   '.tm-sw[aria-checked="true"]{color:#6B6156}.tm-sw[aria-checked="true"] .tm-t{border-color:rgba(193,161,92,.7);background:rgba(255,253,246,.6)}.tm-sw[aria-checked="true"] .tm-t i{transform:translateX(12px);background:#C1A15C}'+
   '.tm-sw:focus-visible{outline:1px solid #C1A15C;outline-offset:3px;border-radius:6px}'+
   '.pd-open{margin-top:34px}'+
   '.tm-sw.tm-gate{position:absolute;top:max(22px,env(safe-area-inset-top,0px));right:max(24px,env(safe-area-inset-right,0px));z-index:2}'+
   '@media (max-width:640px){.tm-sw.tm-gate{top:max(16px,env(safe-area-inset-top,0px))}.tm-gate .tm-l{display:inline}}'+
   '@media (max-width:640px){.tm-sw{top:calc(100% + 6px)}.tm-l{display:none}}'+
   'html.tm-velo #umbral,html.tm-velo .vista-nos,html.tm-velo main.nos{opacity:0!important}'+
   '#umbral,.vista-nos,main.nos{transition:opacity .9s ease}'+
   '@media (prefers-reduced-motion:reduce){#umbral,.vista-nos,main.nos{transition:none}}';
  document.head.appendChild(st);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boton);else boton();
})();
