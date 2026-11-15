/* TEKIA · Precauciones: ventana «Elección informada», precauciones por ingrediente y avisos en Mi blend.
   Todo el texto sale de seguridad-datos.js (registros revisados). Aquí no se generan advertencias:
   solo se muestran registros con reviewStatus "reviewed" y publicVisible true.
   Una advertencia de un ingrediente nunca se presenta como incompatibilidad entre dos hongos. */
(function(){
  var S=window.TEKIA_SEGURIDAD;if(!S)return;
  var G=S.general,ING={},REF={},reduce=matchMedia('(prefers-reduced-motion: reduce)');
  S.ingredientes.forEach(function(x){ING[x.id]=x});S.refs.forEach(function(r){REF[r.id]=r});
  function pub(r){return r.reviewStatus==='reviewed'&&r.publicVisible===true}
  function recsDe(id){return S.records.filter(function(r){return pub(r)&&r.ingredientIds.indexOf(id)>=0}).sort(function(a,b){return (b.blendNotice?1:0)-(a.blendNotice?1:0)})}
  function esc(x){return String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
  // une las dos últimas palabras para que ninguna quede sola en su línea
  function nb(x){return esc(x).replace(/ (\S+)$/,'&nbsp;$1')}

  // iconos de línea fina (dibujo de Lucide, licencia ISC), mismo trazo en ambos temas
  var IC={
    'sprout':'<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
    'heart-pulse':'<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>',
    'leaf':'<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    'clipboard-check':'<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
    'pill':'<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>',
    'shield-check':'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    'book-open':'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    'info':'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    'chev':'<path d="m9 6 6 6-6 6"/>'
  };
  function ic(k,c){return '<svg class="pc-ic'+(c?' '+c:'')+'" viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+IC[k]+'</svg>'}

  // ---- ventana ----
  var pc=document.createElement('div');pc.className='hm pc';pc.id='pc';pc.hidden=true;
  pc.innerHTML='<div class="hm-box pc-box" role="dialog" aria-modal="true" aria-labelledby="pc-h">'+
    '<button type="button" class="hm-bk" id="pc-bk" aria-label="Volver" hidden><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>'+
    '<button type="button" class="hm-x" id="pc-x" aria-label="Cerrar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></button>'+
    '<div class="pc-c" id="pc-c"></div></div>';
  document.body.appendChild(pc);
  var box=pc.querySelector('.pc-box'),C=pc.querySelector('#pc-c'),X=pc.querySelector('#pc-x'),BK=pc.querySelector('#pc-bk'),STK=[],back=null,inertos=[],hideT=0,SEL=[];

  function reaccion(){return '<section class="pc-rx" aria-labelledby="pc-rx-h">'+ic('info')+'<div><h3 id="pc-rx-h">'+esc(G.reaccion.titulo)+'</h3><p>'+nb(G.reaccion.texto)+'</p></div></section>'}
  function fino(){return '<p class="pc-fine">'+nb(G.fino)+'</p>'}
  function fuente(id){var r=REF[id];if(!r)return '';var t=r.author+(r.year?', '+r.year:'')+' · '+r.title+(r.journal?' · '+r.journal:'');
    return '<li><a href="'+esc(r.url)+'" target="_blank" rel="noopener">'+ic('book-open')+'<span>'+esc(t)+'<span class="ci-sr"> (se abre en otra pestaña)</span></span></a></li>'}
  function registro(r){return '<article class="pc-rec'+(r.blendNotice?' imp':'')+'" id="rec-'+r.id+'"><h3>'+esc(r.title)+'</h3><p class="pc-sum">'+nb(r.summary)+'</p>'+
    (r.details?'<p class="pc-det">'+nb(r.details)+'</p>':'')+(r.preparation?'<p class="pc-prep"><span>Preparación observada</span> '+esc(r.preparation)+'</p>':'')+
    (r.sourceIds.length?'<ul class="pc-src" aria-label="Fuentes">'+r.sourceIds.map(fuente).join('')+'</ul>':'')+'</article>'}
  function bloqueIng(id,h){var x=ING[id],rs=recsDe(id),hh=h||'h2';
    return (x.prep?'<p class="pc-note">'+ic('info')+'<span>'+nb(x.prep)+'</span></p>':'')+
      (rs.length?'<div class="pc-recs">'+rs.map(registro).join('')+'</div>':'<p class="pc-gen">En nuestras fuentes revisadas no encontramos advertencias específicas para esta especie más allá de las precauciones generales. Esto no significa que su seguridad esté demostrada para cualquier preparación.</p>')}

  var V={
    main:function(){return '<header class="pc-hd"><p class="pc-k">'+esc(G.kicker).replace(/ · (.*)$/,' · <span class="nw">$1</span>')+'</p><h2 id="pc-h" tabindex="-1">'+esc(G.titulo)+'</h2><p class="pc-in">'+nb(G.intro)+'</p></header>'+
      '<div class="pc-cols"><div class="pc-col">'+'<ul class="pc-pr">'+G.principios.map(function(p){return '<li>'+ic(p.icono)+'<div><h3>'+esc(p.titulo)+'</h3><p>'+nb(p.texto)+'</p></div></li>'}).join('')+'</ul>'+
      '<div class="pc-nota">'+ic('info')+'<p>'+nb(G.nota)+'</p></div>'+
      '<button type="button" class="pc-more" data-v="lista">'+ic('leaf')+'<span>Precauciones por ingrediente</span>'+ic('chev','pc-ch')+'</button></div>'+
      '<div class="pc-col"><section class="pc-antes" aria-labelledby="pc-an-h"><h3 class="pc-st" id="pc-an-h">'+esc(G.antes.titulo)+'</h3><p class="pc-in2">'+nb(G.antes.intro)+'</p><ul class="pc-gr">'+
      G.antes.grupos.map(function(g){return '<li>'+ic(g.icono)+'<div><h4>'+esc(g.titulo)+'</h4><p>'+nb(g.texto)+'</p></div></li>'}).join('')+'</ul><p class="pc-cl">'+nb(G.antes.cierre)+'</p></section>'+reaccion()+'</div></div>'+fino()},
    lista:function(){return '<header class="pc-hd"><p class="pc-k">'+esc(G.kicker).replace(/ · (.*)$/,' · <span class="nw">$1</span>')+'</p><h2 id="pc-h" tabindex="-1">Precauciones por ingrediente</h2><p class="pc-in">Cada especie y cada preparación tiene su propio perfil. Lo observado con un extracto, un polvo, el micelio o el hongo entero no se traslada por sí solo a&nbsp;otro.</p></header>'+
      '<ul class="pc-ings">'+S.ingredientes.map(function(x){var n=recsDe(x.id).length;return '<li><button type="button" data-v="ing:'+x.id+'"><span class="pc-in-t"><b>'+esc(x.comun)+'</b><em>'+esc(x.latin)+'</em></span>'+(n?'<small>'+n+(n===1?' nota':' notas')+'</small>':'<small>Generales</small>')+ic('chev','pc-ch')+'</button></li>'}).join('')+'</ul>'+reaccion()+fino()},
    ing:function(id){var x=ING[id];return '<header class="pc-hd"><p class="pc-k">Precauciones por ingrediente</p><h2 id="pc-h" tabindex="-1">'+esc(x.comun)+'</h2><p class="pc-sci">'+esc(x.latin)+'</p></header>'+bloqueIng(id)+reaccion()+fino()},
    sel:function(){var ids=SEL.filter(function(id){return ING[id]});return '<header class="pc-hd"><p class="pc-k"><span class="nw">Mi blend</span> · <span class="nw">Tu selección</span></p><h2 id="pc-h" tabindex="-1">Precauciones de tu selección</h2><p class="pc-in">Mostramos las precauciones de cada ingrediente por separado. Que no conozcamos una interacción publicada entre ellos no significa que la mezcla haya sido evaluada como&nbsp;conjunto.</p></header>'+
      (ids.length?'<div class="pc-secs">'+ids.map(function(id){var x=ING[id];return '<section class="pc-ingsec"><h3 class="pc-st">'+esc(x.comun)+' <em>'+esc(x.latin)+'</em></h3>'+bloqueIng(id)+'</section>'}).join('')+'</div>':'<p class="pc-gen">Tu blend está vacío.</p>')+
      '<button type="button" class="pc-more" data-v="main">'+ic('shield-check')+'<span>Precauciones generales</span>'+ic('chev','pc-ch')+'</button>'+reaccion()+fino()}
  };
  V.contacto=function(){return '<header class="pc-hd"><p class="pc-k">TEKIA · <span class="nw">Acompañamiento</span></p><h2 id="pc-h" tabindex="-1">¿Tienes dudas antes de&nbsp;elegir?</h2><p class="pc-in">Escríbenos. Te ayudamos a entender tus&nbsp;opciones.</p></header>'+
    '<ul class="pc-ct">'+[['Correo'],['WhatsApp'],['Redes'],['Horario de atención']].map(function(r){return '<li><span>'+r[0]+'</span><b>Muy pronto</b></li>'}).join('')+'</ul>'+
    '<p class="pc-fine">Este acompañamiento no sustituye la consulta con un profesional de la&nbsp;salud.</p>'};
  function pintar(foco,rec){var v=STK[STK.length-1],k=v.split(':');box.setAttribute('data-vista',k[0]);C.innerHTML=V[k[0]](k[1]);C.scrollTop=0;BK.hidden=STK.length<2;
    if(rec){var el=C.querySelector('#rec-'+rec);if(el){el.classList.add('on');setTimeout(function(){C.scrollTo({top:Math.max(0,el.offsetTop-24),behavior:reduce.matches?'auto':'smooth'})},reduce.matches?0:120)}}
    if(foco!==false)setTimeout(function(){var h=C.querySelector('#pc-h');h&&h.focus({preventScroll:true})},foco==='x'?0:30)}
  function abrir(v,from,rec){var was=!pc.hidden&&pc.classList.contains('on');if(!was){back=from||document.activeElement;STK=[]}
    STK.push(v||'main');clearTimeout(hideT);
    if(!was){[].forEach.call(document.body.children,function(e){if(e!==pc&&!e.inert&&e.tagName!=='SCRIPT'&&e.tagName!=='STYLE'){e.inert=true;inertos.push(e)}});document.documentElement.classList.add('pc-open');pc.hidden=false;requestAnimationFrame(function(){pc.classList.add('on')})}
    pintar(true,rec)}
  function cerrar(){if(pc.hidden)return;pc.classList.remove('on');document.documentElement.classList.remove('pc-open');inertos.forEach(function(e){e.inert=false});inertos=[];STK=[];
    hideT=setTimeout(function(){pc.hidden=true;C.innerHTML=''},reduce.matches?0:520);if(back&&back.focus&&document.contains(back))back.focus({preventScroll:true});back=null}
  function volver(){if(STK.length<2)return;STK.pop();pintar(true)}
  X.addEventListener('click',cerrar);BK.addEventListener('click',volver);
  pc.addEventListener('click',function(e){if(e.target===pc){cerrar();return}var b=e.target.closest('[data-v]');if(b){STK.push(b.dataset.v);pintar(true)}});
  window.addEventListener('keydown',function(e){if(pc.hidden||!pc.classList.contains('on'))return;
    if(e.key==='Escape'){e.preventDefault();e.stopPropagation();cerrar();return}
    if(e.key==='Tab'){var f=[].slice.call(box.querySelectorAll('button,a[href],[tabindex="0"]')).filter(function(x){return x.offsetParent!==null&&!x.hidden});if(!f.length)return;var a=f[0],z=f[f.length-1];
      if(e.shiftKey&&(document.activeElement===a||!box.contains(document.activeElement))){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}},true);

  // ---- avisos en Mi blend: solo los registros marcados como blendNotice de los ingredientes elegidos ----
  var sg=document.getElementById('bt-sg');
  function blend(ids){SEL=(ids||[]).slice();if(!sg)return;if(!SEL.length){sg.hidden=true;sg.innerHTML='';return}
    var av=[];SEL.forEach(function(id){recsDe(id).forEach(function(r){if(r.blendNotice&&av.indexOf(r)<0)av.push(r)})});
    sg.innerHTML=av.map(function(r){return '<button type="button" class="bt-av" data-rec="'+r.id+'" data-ing="'+r.ingredientIds[0]+'">'+ic('info')+'<span><b>Información importante</b> · '+esc(r.title)+'</span></button>'}).join('')+
      '<button type="button" class="bt-pcl" data-sel="1">'+ic('shield-check')+'<span>Precauciones de tu selección</span></button>';
    sg.hidden=false;
    if(!pc.hidden&&STK[STK.length-1]==='sel')pintar(false)}
  if(sg)sg.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;if(b.dataset.rec)abrir('ing:'+b.dataset.ing,b,b.dataset.rec);else abrir('sel',b)});

  // ---- accesos: menú, enlaces antiguos a #f-precauciones y #precauciones ----
  document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href$="#precauciones"],a[href$="#f-precauciones"],a[href$="#escribenos"],a[href$="#f-acomp"]');if(!a)return;e.preventDefault();e.stopImmediatePropagation();abrir(/acomp|escribenos/.test(a.getAttribute('href'))?'contacto':'main',a)},true);
  var hz=/^#(f-)?(precauciones|acomp|escribenos)$/.exec(location.hash);
  if(hz){history.replaceState(history.state,'',location.pathname+location.search);setTimeout(function(){abrir(hz[2]==='precauciones'?'main':'contacto',document.querySelector(hz[2]==='precauciones'?'.top nav a.pre':'.top nav a.esc'))},400)}
  window.TEKIA_PC={abrir:abrir,cerrar:cerrar,blend:blend};
})();
