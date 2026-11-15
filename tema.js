/* Tema claro (prueba): se activa con ?tema=claro y se apaga con ?tema=oscuro; la elección se recuerda en este navegador.
   En claro, los dibujos en canvas pensados para fondo oscuro se traducen a tonos bronce, champán y oro sobre crema:
   los tonos claros pasan a bronce, los oscuros a luz crema, y la mezcla aditiva («lighter») se vuelve normal. */
(function(){
  var q=/[?&]tema=(claro|oscuro)\b/.exec(location.search),t=null;
  try{if(q)localStorage.setItem('tekia-tema',q[1]);t=localStorage.getItem('tekia-tema')}catch(e){t=q&&q[1]}
  if(q)t=q[1];
  if(window.TEKIA_TEMA)t=window.TEKIA_TEMA;
  if(t!=='claro')return;
  var root=document.documentElement;root.classList.add('claro');
  var meta=document.createElement('meta');meta.name='theme-color';meta.content='#F6F1E4';document.head.appendChild(meta);
  var cache={};
  function hsl2rgb(h,s,l){function f(n){var k=(n+h/30)%12,a=s*Math.min(l,1-l);return Math.round(255*(l-a*Math.max(-1,Math.min(k-3,9-k,1))))}return f(0)+','+f(8)+','+f(4)}
  function rgb(r,g,b){var k=r+','+g+','+b;if(cache[k])return cache[k];
    var R=r/255,G=g/255,B=b/255,mx=Math.max(R,G,B),mn=Math.min(R,G,B),l=(mx+mn)/2,d=mx-mn,s=d?d/(1-Math.abs(2*l-1)):0,h=0;
    if(d){h=mx===R?((G-B)/d)%6:mx===G?(B-R)/d+2:(R-G)/d+4;h*=60;if(h<0)h+=360}
    if(!d||h>60&&h<330)h=38;          // nunca verde ni azul: todo cálido
    h=Math.max(22,Math.min(46,h>300?22:h));
    // claros (hebras, polvo, focos) -> oro y ámbar de luz media; oscuros (volumen, sombras) -> champán luminoso
    var L,S;
    if(l>=.42){L=.64-.17*Math.min(1,(l-.42)/.5);S=Math.min(.68,.48+s*.35)}
    else if(l>=.2){L=.72-.1*(l-.2)/.22;S=Math.min(.66,.5+s*.4)}
    else{L=.88-.12*l/.2;S=Math.min(.6,.42+s*.4)}
    return cache[k]=hsl2rgb(h,S,L)}
  function map(v){if(typeof v!=='string')return v;
    var m=/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(v);
    if(m)return 'rgba('+rgb(+m[1],+m[2],+m[3])+','+(m[4]==null?1:Math.min(1,m[4]*1.12).toFixed(3))+')';
    m=/^#([0-9a-f]{6})$/i.exec(v);if(m){var n=parseInt(m[1],16);return 'rgb('+rgb(n>>16,n>>8&255,n&255)+')'}
    return v}
  window.TEKIA_mapColor=map;
  var P=CanvasRenderingContext2D.prototype,fs=Object.getOwnPropertyDescriptor(P,'fillStyle'),ss=Object.getOwnPropertyDescriptor(P,'strokeStyle'),gc=Object.getOwnPropertyDescriptor(P,'globalCompositeOperation');
  function wrapG(g){var a=g.addColorStop;g.addColorStop=function(o,c){a.call(g,o,map(c))};return g}
  function claro(c){if(!c||c.__claro)return c;c.__claro=1;
    Object.defineProperty(c,'fillStyle',{get:function(){return fs.get.call(this)},set:function(v){fs.set.call(this,map(v))}});
    Object.defineProperty(c,'strokeStyle',{get:function(){return ss.get.call(this)},set:function(v){ss.set.call(this,map(v))}});
    Object.defineProperty(c,'globalCompositeOperation',{get:function(){return gc.get.call(this)},set:function(v){gc.set.call(this,v==='lighter'?'source-over':v)}});
    var rg=c.createRadialGradient,lg=c.createLinearGradient;
    c.createRadialGradient=function(){return wrapG(rg.apply(this,arguments))};
    c.createLinearGradient=function(){return wrapG(lg.apply(this,arguments))};
    return c}
  var gx=HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext=function(k){var c=gx.apply(this,arguments);return k==='2d'?claro(c):c};
})();
