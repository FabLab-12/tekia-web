/* TEKIA · Mapa de tu intención (IntentionBodyMap)
   Fuente ÚNICA de las zonas de luz: el personaje WebGL (index.html) y el esquema 2D leen estas mismas regiones e intensidades.
   Las regiones están en coordenadas del modelo del personaje (x centrada en ~104, y = 0 en la coronilla y 420 en el piso),
   así la luz pertenece a las fibras y sigue correcta desde cualquier punto de vista.
   La silueta se trazó desde la malla real del personaje (contorno frontal), no es un dibujo aparte.
   Las etiquetas son temas de exploración, no efectos clínicos. Reutilizable después para los once hongos. */
(function(){
  var SIL='M99.4 3.9Q102.0 3.5 106.5 3.9Q111.0 4.2 112.2 5.4Q113.5 6.5 117.0 12.1Q120.5 17.8 120.9 21.9Q121.2 26.0 122.9 27.0Q124.5 28.0 122.4 35.2Q120.2 42.5 117.9 46.9Q115.5 51.2 116.5 57.9Q117.5 64.5 122.1 67.4Q126.8 70.2 131.9 72.2Q137.0 74.2 143.0 78.1Q149.0 82.0 153.6 88.2Q158.2 94.5 166.0 128.9Q173.8 163.2 174.1 179.5Q174.5 195.8 176.1 206.1Q177.8 216.5 177.0 225.1Q176.2 233.8 175.6 234.9Q175.0 236.0 172.6 235.4Q170.2 234.8 169.2 232.5Q168.2 230.2 168.5 227.5Q168.8 224.8 165.9 224.2Q163.0 223.8 161.8 215.9Q160.5 208.0 162.4 203.2Q164.2 198.5 164.4 196.4Q164.5 194.2 163.0 188.1Q161.5 182.0 157.9 174.2Q154.2 166.5 153.5 156.5Q152.8 146.5 149.8 139.8Q146.8 133.0 144.0 124.0Q141.2 115.0 140.4 108.8Q139.5 102.5 138.6 102.1Q137.8 101.8 137.2 102.4Q136.8 103.0 134.4 111.0Q132.0 119.0 131.0 130.8Q130.0 142.5 131.4 150.6Q132.8 158.8 135.4 163.6Q138.0 168.5 141.1 182.1Q144.2 195.8 146.2 216.9Q148.2 238.0 147.1 263.1Q146.0 288.2 147.1 292.5Q148.2 296.8 148.8 320.6Q149.2 344.5 147.4 366.5Q145.5 388.5 146.1 395.0Q146.8 401.5 150.4 408.9Q154.0 416.2 153.2 419.4Q152.5 422.5 151.4 423.4Q150.2 424.2 141.8 424.2Q133.2 424.2 131.4 422.9Q129.5 421.5 130.9 401.5Q132.2 381.5 131.4 372.8Q130.5 364.0 128.2 354.8Q126.0 345.5 124.4 318.8Q122.8 292.0 114.2 257.9Q105.8 223.8 104.5 223.2Q103.2 222.8 102.1 223.9Q101.0 225.0 93.0 258.4Q85.0 291.8 83.4 318.5Q81.8 345.2 79.5 354.6Q77.2 364.0 76.4 372.8Q75.5 381.5 76.9 401.5Q78.2 421.5 76.4 422.9Q74.5 424.2 66.0 424.2Q57.5 424.2 56.6 423.9Q55.8 423.5 54.6 419.9Q53.5 416.2 57.2 408.9Q61.0 401.5 61.5 395.2Q62.0 389.0 60.1 366.6Q58.2 344.2 58.9 320.5Q59.5 296.8 60.5 293.0Q61.5 289.2 60.4 263.8Q59.2 238.2 61.2 217.0Q63.2 195.8 66.5 182.1Q69.8 168.5 72.2 163.6Q74.8 158.8 76.2 150.5Q77.8 142.2 76.6 129.9Q75.5 117.5 73.1 110.0Q70.8 102.5 69.1 102.0Q67.5 101.5 66.9 102.1Q66.2 102.8 65.8 108.0Q65.2 113.2 58.4 129.4Q51.5 145.5 50.1 155.1Q48.8 164.8 44.5 172.9Q40.2 181.0 38.2 187.0Q36.2 193.0 37.8 199.5Q39.2 206.0 37.9 214.1Q36.5 222.2 33.6 222.4Q30.8 222.5 30.8 225.6Q30.8 228.8 29.8 230.8Q28.8 232.8 26.2 233.1Q23.8 233.5 22.9 224.9Q22.0 216.2 24.5 203.0Q27.0 189.8 28.4 175.1Q29.8 160.5 37.5 135.0Q45.2 109.5 47.2 100.8Q49.2 92.0 54.1 86.4Q59.0 80.8 74.5 72.8Q90.0 64.8 91.0 61.1Q92.0 57.5 92.0 54.2Q92.0 51.0 89.6 46.6Q87.2 42.2 85.1 35.1Q83.0 28.0 84.6 27.1Q86.2 26.2 86.6 22.0Q87.0 17.8 90.1 12.6Q93.2 7.5 95.0 5.9Q96.8 4.2 99.4 3.9Z';
  var R={
    head:{x:104,y:30,rx:22,ry:27,nom:'cabeza'},
    upperNeck:{x:104,y:63,rx:12,ry:9,nom:'cuello'},
    chest:{x:104,y:108,rx:32,ry:24,nom:'pecho'},
    upperAbdomen:{x:104,y:150,rx:28,ry:15,nom:'abdomen alto'},
    abdomen:{x:104,y:184,rx:30,ry:17,nom:'abdomen'},
    pelvis:{x:104,y:221,rx:34,ry:13,nom:'zona pélvica'},
    legs:{x:104,y:330,rx:48,ry:95,nom:'piernas',pts:[[71,326],[137,326]]}
  };
  // preset: forma del movimiento; periodo en segundos (el mismo en el cuerpo y en el mapa)
  var I={
    pensamiento:{preset:'focus',ganancia:1.15,periodo:3.2,verde:.08,regiones:[['head',1],['upperNeck',.22]],etiquetas:['Claridad mental','Atención y enfoque','Concentración']},
    descanso:{preset:'breathing',periodo:5,verde:.3,regiones:[['head',.8],['chest',.8],['upperAbdomen',.42]],etiquetas:['Calma mental','Respiración y pausa','Soltar el cuerpo']},
    cuidado:{preset:'flow',periodo:7,verde:.55,regiones:[['abdomen',1],['upperAbdomen',.5],['pelvis',.2]],etiquetas:['Equilibrio interior','Digestión y bienestar','Fluir con naturalidad']},
    movimiento:{preset:'movement',periodo:2.6,verde:.08,ganancia:1.4,regiones:[['legs',1],['chest',.38]],etiquetas:['Energía y movimiento','Resistencia','Actividad física']}
  };
  function sm(a,b,x){var t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t)}
  // peso de una región en un punto del modelo: elipse suave (sin bordes duros)
  function peso(k,x,y){var r=R[k];if(!r)return 0;var dx=(x-r.x)/r.rx,dy=(y-r.y)/r.ry;return 1-sm(.55,1.15,Math.sqrt(dx*dx+dy*dy))}
  var uid=0;
  function mapa(id){var it=I[id];if(!it)return '';var u='im'+(++uid),gl='',nd='';
    it.regiones.forEach(function(p,j){var r=R[p[0]],k=p[1],pts=r.pts||[[r.x,r.y]];
      gl+='<ellipse class="im-gl" cx="'+r.x+'" cy="'+r.y+'" rx="'+r.rx*1.05+'" ry="'+r.ry*1.05+'" fill="url(#'+u+'g)" style="--k:'+k+'"/>';
      pts.forEach(function(q){nd+='<g class="im-nd" style="--k:'+k+'"><circle class="im-nr" cx="'+q[0]+'" cy="'+q[1]+'" r="7"/><circle class="im-n" cx="'+q[0]+'" cy="'+q[1]+'" r="'+(2.2+1.4*k).toFixed(1)+'"/></g>'})});
    var zonas=it.regiones.filter(function(p){return p[1]>=.35}).map(function(p){return R[p[0]].nom});
    return '<figure class="im" data-p="'+it.preset+'" style="--per:'+it.periodo+'s"><div class="im-fig">'+
      '<svg class="im-s" viewBox="16 -2 176 430" aria-hidden="true" focusable="false"><defs><radialGradient id="'+u+'g"><stop offset="0" class="im-g0"/><stop offset=".55" class="im-g1"/><stop offset="1" class="im-g2"/></radialGradient><clipPath id="'+u+'c"><path d="'+SIL+'"/></clipPath></defs>'+
      '<g clip-path="url(#'+u+'c)">'+gl+'</g><path class="im-o" d="'+SIL+'"/>'+nd+'</svg></div>'+
      '<figcaption><span class="im-k">Mapa de tu intención</span><ul>'+it.etiquetas.map(function(e){return '<li>'+e+'</li>'}).join('')+'</ul>'+
      '<span class="ci-sr">Zonas que se iluminan en el cuerpo: '+zonas.join(', ')+'. Son temas de exploración, no efectos garantizados.</span></figcaption></figure>'}
  window.TEKIA_CUERPO={silueta:SIL,regiones:R,intenciones:I,peso:peso,mapa:mapa};
})();
