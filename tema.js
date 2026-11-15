/* Tema claro / oscuro (prueba). Una palanquita bajo «Sonido» cambia entre los dos sin recargar; la elección se recuerda.
   También responde a ?tema=claro y ?tema=oscuro.
   En claro, los dibujos en canvas pensados para fondo oscuro se traducen así:
   - el volumen del cuerpo (tonos muy oscuros) pasa a verde salvia, para que las hebras contrasten;
   - las hebras y luces más claras pasan a blanco cálido; las intermedias, a naranja y ámbar;
   - la mezcla aditiva («lighter») se vuelve normal. */
(function(){
  var root=document.documentElement,KEY='tekia-tema',on=false,cache={};
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
    if(l<.2)o=k==='f'?[hsl2rgb(84,.2,.6),2.6,1]                          // volumen del cuerpo: salvia, difuminado
                    :[hsl2rgb(30,.7,.62),.9];                                   // hebras profundas: ámbar tenue
    else if(l<.42)o=[hsl2rgb(30,.68,.62-.08*(l-.2)/.22),1.1];                  // hebras del fondo: ámbar suave
    else if(k==='f'&&l>=.6)o=[hsl2rgb(44,.9,.965),1.5];                         // polvo y destellos: luz blanca cálida
    else if(l<.8)o=[hsl2rgb(hw,.8,.56-.08*(l-.42)/.38),1.12];                  // hebras: naranja y ámbar
    else o=[hsl2rgb(44,.9,.96),1.3];                                            // hebras más claras: blanco cálido
    return cache[key]=o}
  function map(v,k,c){if(!on||typeof v!=='string')return v;
    var m=/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(v),o;
    if(m){o=rgb(+m[1],+m[2],+m[3],k);if(c)c.__vol=!!o[2];return 'rgba('+o[0]+','+(m[4]==null?1:Math.min(1,m[4]*o[1])).toFixed(3)+')'}
    m=/^#([0-9a-f]{6})$/i.exec(v);if(m){var n=parseInt(m[1],16);return 'rgb('+rgb(n>>16,n>>8&255,n&255,k)[0]+')'}
    return v}
  var P=CanvasRenderingContext2D.prototype,fs=Object.getOwnPropertyDescriptor(P,'fillStyle'),ss=Object.getOwnPropertyDescriptor(P,'strokeStyle'),gc=Object.getOwnPropertyDescriptor(P,'globalCompositeOperation');
  function wrapG(g){var a=g.addColorStop;g.addColorStop=function(o,c){a.call(g,o,map(c,'f'))};return g}
  function wrap(c){if(!c||c.__tema)return c;c.__tema=1;
    Object.defineProperty(c,'fillStyle',{get:function(){return fs.get.call(this)},set:function(v){this.__vol=false;fs.set.call(this,map(v,'f',this))}});
    Object.defineProperty(c,'strokeStyle',{get:function(){return ss.get.call(this)},set:function(v){ss.set.call(this,map(v,'s'))}});
    Object.defineProperty(c,'globalCompositeOperation',{get:function(){return gc.get.call(this)},set:function(v){gc.set.call(this,on&&v==='lighter'?'source-over':v)}});
    // el volumen del cuerpo se rellena difuminado, como una bruma verde dentro de la figura
    var fl=c.fill;c.fill=function(){if(on&&this.__vol&&'filter' in this){var f=this.filter;this.filter='blur(5px)';fl.apply(this,arguments);this.filter=f}else fl.apply(this,arguments)};
    var rg=c.createRadialGradient,lg=c.createLinearGradient;
    c.createRadialGradient=function(){return wrapG(rg.apply(this,arguments))};
    c.createLinearGradient=function(){return wrapG(lg.apply(this,arguments))};
    return c}
  var gx=HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext=function(k){var c=gx.apply(this,arguments);return k==='2d'?wrap(c):c};
  var meta=document.createElement('meta');meta.name='theme-color';document.head.appendChild(meta);
  function apply(claro){on=claro;root.classList.toggle('claro',claro);meta.content=claro?'#F6F1E4':'#120F0D';
    var b=document.getElementById('tema-sw');if(b){b.setAttribute('aria-checked',claro?'true':'false');b.querySelector('.tm-l').textContent=claro?'Claro':'Oscuro'}
    if(window.TEKIA_nosHalo)try{TEKIA_nosHalo()}catch(e){}}
  apply(t==='claro');
  window.TEKIA_claro=function(){return on};
  // cambio en calma: la escena se desvanece, cambia el tema y vuelve a aparecer
  var busy=false,still=matchMedia('(prefers-reduced-motion: reduce)');
  function cambiar(){if(busy)return;var claro=!on;try{localStorage.setItem(KEY,claro?'claro':'oscuro')}catch(e){}
    if(still.matches){apply(claro);return}
    busy=true;root.classList.add('tm-velo');
    setTimeout(function(){apply(claro);requestAnimationFrame(function(){root.classList.remove('tm-velo');setTimeout(function(){busy=false},900)})},900)}
  function boton(){var top=document.querySelector('.top');if(!top||document.getElementById('tema-sw'))return;
    var b=document.createElement('button');b.type='button';b.id='tema-sw';b.className='tm-sw';b.setAttribute('role','switch');b.setAttribute('aria-label','Tema claro');
    b.innerHTML='<span class="tm-t" aria-hidden="true"><i></i></span><span class="tm-l" aria-hidden="true"></span>';
    b.addEventListener('click',cambiar);top.appendChild(b);apply(on)}
  var st=document.createElement('style');
  st.textContent=
   '.tm-sw{position:absolute;right:max(20px,env(safe-area-inset-right,0px));top:calc(100% + 10px);display:inline-flex;align-items:center;gap:.5rem;min-height:32px;padding:.2rem .3rem;background:none;border:0;cursor:pointer;font:400 .72rem/1 "Montserrat",system-ui,sans-serif;letter-spacing:.04em;color:#B4AA97;-webkit-tap-highlight-color:transparent}'+
   '.tm-t{position:relative;width:26px;height:14px;border-radius:99px;border:.5px solid rgba(217,195,138,.55);transition:border-color 1.2s ease,background 1.2s ease}'+
   '.tm-t i{position:absolute;top:2px;left:2px;width:9px;height:9px;border-radius:50%;background:#D9C38A;transition:transform 1.2s ease,background 1.2s ease}'+
   '.tm-sw[aria-checked="true"]{color:#6B6156}.tm-sw[aria-checked="true"] .tm-t{border-color:rgba(193,161,92,.7);background:rgba(255,253,246,.6)}.tm-sw[aria-checked="true"] .tm-t i{transform:translateX(12px);background:#C1A15C}'+
   '.tm-sw:focus-visible{outline:1px solid #C1A15C;outline-offset:3px;border-radius:6px}'+
   '.pd-open{margin-top:34px}'+
   '@media (max-width:640px){.tm-sw{top:calc(100% + 6px)}.tm-l{display:none}}'+
   'html.tm-velo #umbral,html.tm-velo .vista-nos,html.tm-velo main.nos{opacity:0!important}'+
   '#umbral,.vista-nos,main.nos{transition:opacity .9s ease}'+
   '@media (prefers-reduced-motion:reduce){#umbral,.vista-nos,main.nos{transition:none}}';
  document.head.appendChild(st);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boton);else boton();
})();
