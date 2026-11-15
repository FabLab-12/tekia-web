/* TEKIA · Rutas de mezclas del atlas · v0.2 (2026-11-15: seta de cardo con nodo propio)
 * Fuente única de datos para: intenciones del cuerpo → mezcla → hongos del anillo,
 * y hongo del anillo → «Aparece en». Todo lo demás se DERIVA de RUTAS (ver derivar()).
 * Reglas: sin claims de salud, sin dosis, sin porcentajes de mejora.
 * Contenido editorial (investigación), separado de cualquier ficha de venta.
 * Verificado contra fuentes primarias el 2026-11-15 (ver VERIFICACION.md).
 */
(function (root) {
  'use strict';

  // Nodos del anillo, en el MISMO orden que el arreglo HONG del atlas (v0.61).
  var NODOS = [
    { clave: 'melena',     i: 0, nombre: 'Melena de león', sci: 'Hericium erinaceus' },
    { clave: 'cordyceps',  i: 1, nombre: 'Cordyceps',      sci: 'Cordyceps militaris' },
    { clave: 'reishi',     i: 2, nombre: 'Reishi',         sci: 'Ganoderma', generico: true },
    { clave: 'shiitake',   i: 3, nombre: 'Shiitake',       sci: 'Lentinula edodes' },
    { clave: 'nieve',      i: 4, nombre: 'Hongo de nieve', sci: 'Tremella fuciformis' },
    { clave: 'ostra',      i: 5, nombre: 'Seta de ostra',  sci: 'Pleurotus ostreatus' },
    { clave: 'maitake',    i: 6, nombre: 'Maitake',        sci: 'Grifola frondosa' },
    { clave: 'cola-pavo',  i: 7, nombre: 'Cola de pavo',   sci: 'Trametes versicolor' },
    { clave: 'chaga',      i: 8, nombre: 'Chaga',          sci: 'Inonotus obliquus' },
    { clave: 'sol',        i: 9, nombre: 'Hongo del sol',  sci: 'Agaricus subrufescens' },
    { clave: 'cardo',      i: 10, nombre: 'Seta de cardo', sci: 'Pleurotus eryngii' }
  ];

  var TIPOS = {
    hipotesis:  { etiqueta: 'Hipótesis de TEKIA', nota: 'Combinación propuesta para investigar. No es un producto ni una preparación estudiada.' },
    estudiada:  { etiqueta: 'Mezcla estudiada',   nota: 'Preparación externa publicada en un ensayo con personas. No es un producto de TEKIA.' },
    registrado: { etiqueta: 'Ensayo registrado',  nota: 'Ensayo inscrito en un registro público, todavía sin resultados depositados.' }
  };

  // taxon_estado: 'especie' = el estudio declara la especie; 'comun' = solo nombre común.
  // nodo: clave del anillo o null. Regla (Mónica, 2026-11-15): si el hongo está en la mezcla investigada y tiene nodo, se ilumina.
  // Solo queda en reposo lo que no figura en la mezcla (p. ej. seta de ostra en PeakO₂, que lleva P. eryngii).
  var RUTAS = [
    {
      id: 'pensamiento',
      intencion: 'Pensamiento',
      titulo_ficha: 'Pensamiento',
      tipo: 'hipotesis',
      preparacion: {
        nombre: null,
        descripcion: 'Sin preparación definida. Es una pareja propuesta por TEKIA para investigar.'
      },
      ingredientes: [
        { nombre: 'Melena de león', declarado: 'Hericium erinaceus', taxon: 'Hericium erinaceus', taxon_estado: 'especie', nodo: 'melena' },
        { nombre: 'Seta de ostra',  declarado: 'Pleurotus ostreatus', taxon: 'Pleurotus ostreatus', taxon_estado: 'especie', nodo: 'ostra' }
      ],
      texto_breve: 'Dos hongos con investigación individual sobre cognición. La pregunta de TEKIA es cómo se comportan juntos en una prueba de memoria.',
      lectura_ampliada: [
        'La evidencia disponible corresponde a cada ingrediente por separado. Ningún estudio ha probado esta pareja.',
        'Los dos trabajos estudiaron poblaciones y preparaciones distintas: adultos jóvenes con cápsulas de melena de león, y adultos mayores con seta de ostra en polvo como alimento.',
        'La comparación de la pareja frente a cada hongo por separado es la hipótesis que TEKIA propone investigar.'
      ],
      investigacion: [
        {
          ingrediente: 'Melena de león',
          cita: 'Docherty S, Doughty FL, Smith EF. Nutrients. 2023;15(22):4842.',
          url: 'https://pubmed.ncbi.nlm.nih.gov/38004235/',
          doi: '10.3390/nu15224842',
          diseno: 'Ensayo piloto aleatorizado, doble ciego, con placebo.',
          poblacion: 'Adultos sanos de 18 a 45 años en Reino Unido (43 en la medición inicial, 41 a los 28 días).',
          preparacion: 'Cápsulas de un complejo de Hericium erinaceus (SO-DSX1). El artículo no precisa si es cuerpo fructífero o micelio.',
          duracion: 'Una toma y 28 días.',
          midio: 'Pruebas de atención y memoria, estrés percibido y estado de ánimo.',
          observacion: 'Resultados distintos según la prueba. Los autores los describen como preliminares.',
          financiacion: 'El fabricante aportó el producto. Los autores declaran no tener conflictos de interés.'
        },
        {
          ingrediente: 'Seta de ostra',
          cita: 'Cha S, Bell L, Eastwood J, et al. Food & Function. 2026 (estudio OYSCOG).',
          url: 'https://doi.org/10.1039/D5FO04951B',
          doi: '10.1039/D5FO04951B',
          registro: 'NCT06846827',
          diseno: 'Ensayo aleatorizado, doble ciego, con placebo, en paralelo.',
          poblacion: 'Adultos mayores sanos de 60 a 80 años en Reino Unido (80 asignados, 72 analizados).',
          preparacion: 'Seta de ostra (Pleurotus ostreatus) liofilizada en polvo, como alimento.',
          duracion: '12 semanas.',
          midio: 'Memoria, atención, estado de ánimo y marcadores metabólicos.',
          observacion: 'Diferencias frente a placebo en algunas pruebas de memoria verbal. Sin diferencias en las demás pruebas cognitivas ni en los marcadores.',
          financiacion: 'Pendiente de verificar en el texto completo.'
        }
      ],
      fuentes: [
        { etiqueta: 'Estudio de melena de león', url: 'https://pubmed.ncbi.nlm.nih.gov/38004235/' },
        { etiqueta: 'Estudio de seta de ostra', url: 'https://doi.org/10.1039/D5FO04951B' }
      ]
    },
    {
      id: 'descanso',
      intencion: 'Descanso',
      titulo_ficha: 'Descanso',
      tipo: 'estudiada',
      preparacion: {
        nombre: 'Restake',
        descripcion: 'Restake es la preparación externa del ensayo: un extracto de cinco hongos en cápsulas, elaborado por una empresa de Malasia que también financió el estudio.'
      },
      ingredientes: [
        { nombre: 'Melena de león', declarado: 'Hericium erinaceus', taxon: 'Hericium erinaceus', taxon_estado: 'especie', nodo: 'melena' },
        { nombre: 'Cordyceps',      declarado: 'Cordyceps militaris', taxon: 'Cordyceps militaris', taxon_estado: 'especie', nodo: 'cordyceps' },
        { nombre: 'Reishi',         declarado: 'Ganoderma lucidum', taxon: 'Ganoderma lucidum', taxon_estado: 'especie', nodo: 'reishi' },
        { nombre: 'Shiitake',       declarado: 'Lentinula edodes', taxon: 'Lentinula edodes', taxon_estado: 'especie', nodo: 'shiitake' },
        { nombre: 'Maitake',        declarado: 'Grifola frondosa', taxon: 'Grifola frondosa', taxon_estado: 'especie', nodo: 'maitake' }
      ],
      texto_breve: 'Cinco hongos forman parte de Restake, una preparación estudiada durante doce semanas en adultos con estrés.',
      lectura_ampliada: [
        'El ensayo comparó Restake con un placebo en adultos de 22 a 55 años con síntomas de estrés.',
        'La tabla 4 reporta valores iniciales de sueño por encima del máximo de la escala utilizada, que va de 0 a 21. Esa inconsistencia limita la interpretación del resultado de sueño.',
        'El artículo presenta además diferencias entre algunas de sus secciones. Por eso lo leemos como un antecedente y no como una conclusión.'
      ],
      investigacion: [
        {
          ingrediente: 'Restake (mezcla completa)',
          cita: 'Hisamuddin ASD, Ramli F, Leo TK, et al. Brain and Behavior. 2026;16(1):e71193.',
          url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12808922/',
          doi: '10.1002/brb3.71193',
          diseno: 'Ensayo aleatorizado, doble ciego, con placebo.',
          poblacion: 'Adultos de 22 a 55 años con síntomas de estrés, en Malasia (51 asignados, 50 analizados).',
          preparacion: 'Restake: extracto de Hericium erinaceus, Cordyceps militaris, Ganoderma lucidum, Lentinula edodes y Grifola frondosa en cápsulas. El texto no indica la parte del hongo.',
          duracion: '12 semanas.',
          midio: 'Ansiedad, estrés percibido, cansancio, sueño (cuestionario PSQI) y hormonas en sangre.',
          observacion: 'La tabla 4 muestra valores iniciales de sueño de 21.9 y 21.5, por encima del máximo de 21 de la escala.',
          financiacion: 'Financiado por la empresa que elabora Restake. Varios autores pertenecen a esa empresa.'
        }
      ],
      fuentes: [
        { etiqueta: 'Ensayo original, tabla 4', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12808922/' },
        { etiqueta: 'Instrumento de sueño utilizado', url: 'https://www.sleep.pitt.edu/psqi' }
      ]
    },
    {
      id: 'cuidado',
      intencion: 'Cuidado',
      titulo_ficha: 'Cuidado digestivo',
      tipo: 'registrado',
      preparacion: {
        nombre: null,
        descripcion: 'Mezcla de tres hongos registrada por una empresa de Estados Unidos. El registro no da nombre comercial.'
      },
      ingredientes: [
        { nombre: 'Cordyceps',      declarado: 'cordyceps', taxon: 'Cordyceps', taxon_estado: 'comun', nodo: 'cordyceps',
          nota: 'El registro usa el nombre común sin indicar la especie.' },
        { nombre: 'Reishi',         declarado: 'reishi', taxon: 'Ganoderma', taxon_estado: 'comun', nodo: 'reishi',
          nota: 'El registro usa el nombre común sin indicar la especie.' },
        { nombre: 'Melena de león', declarado: "lion's mane", taxon: 'Hericium erinaceus', taxon_estado: 'comun', nodo: 'melena' }
      ],
      texto_breve: 'Esta combinación se investigó durante seis semanas en personas con molestias digestivas ocasionales. El ensayo evaluó síntomas digestivos y microbiota.',
      lectura_ampliada: [
        'Participaron adultos sanos de 30 a 60 años con molestias digestivas ocasionales y sin diagnóstico digestivo.',
        'El registro consultado figura como completado y sin resultados depositados.',
        'El registro nombra el cordyceps y el reishi solo por su nombre común, sin especie. Se iluminan en el anillo porque forman parte de la mezcla investigada.'
      ],
      investigacion: [
        {
          ingrediente: 'Mezcla completa',
          cita: 'Registro ISRCTN26924191 (también NCT07027462). Universidad de Carolina del Sur.',
          url: 'https://www.isrctn.com/pdf/ISRCTN26924191',
          registro: 'ISRCTN26924191',
          diseno: 'Ensayo aleatorizado, doble ciego, con placebo, en paralelo.',
          poblacion: 'Adultos sanos de 30 a 60 años con molestias digestivas ocasionales, en Estados Unidos (40 inscritos).',
          preparacion: 'Cordyceps, reishi y melena de león, una vez al día. El registro no indica la especie de cordyceps ni de reishi.',
          duracion: '6 semanas.',
          midio: 'Microbiota intestinal como resultado principal. Síntomas digestivos, estado de ánimo y metabolitos como secundarios.',
          observacion: 'Completado en diciembre de 2025. Sin resultados depositados al 15 de noviembre de 2026.',
          financiacion: 'Financiado por una empresa de ingredientes.'
        }
      ],
      fuentes: [
        { etiqueta: 'Registro primario del ensayo', url: 'https://www.isrctn.com/pdf/ISRCTN26924191' }
      ]
    },
    {
      id: 'movimiento',
      intencion: 'Movimiento',
      titulo_ficha: 'Rendimiento físico',
      tipo: 'estudiada',
      preparacion: {
        nombre: 'PeakO₂',
        descripcion: 'PeakO₂ es la preparación externa del ensayo: polvo de seis hongos. El artículo describe el cordyceps como micelio cultivado sobre avena y no detalla las demás especies.'
      },
      ingredientes: [
        { nombre: 'Cordyceps',      declarado: 'Cordyceps militaris', taxon: 'Cordyceps militaris', taxon_estado: 'especie', nodo: 'cordyceps' },
        { nombre: 'Reishi',         declarado: 'Ganoderma lucidum', taxon: 'Ganoderma lucidum', taxon_estado: 'especie', nodo: 'reishi' },
        { nombre: 'Seta de cardo',  declarado: 'Pleurotus eryngii', taxon: 'Pleurotus eryngii', taxon_estado: 'especie', nodo: 'cardo',
          nota: 'No es la seta de ostra (Pleurotus ostreatus).' },
        { nombre: 'Shiitake',       declarado: 'Lentinula edodes', taxon: 'Lentinula edodes', taxon_estado: 'especie', nodo: 'shiitake' },
        { nombre: 'Melena de león', declarado: 'Hericium erinaceus', taxon: 'Hericium erinaceus', taxon_estado: 'especie', nodo: 'melena' },
        { nombre: 'Cola de pavo',   declarado: 'Trametes versicolor', taxon: 'Trametes versicolor', taxon_estado: 'especie', nodo: 'cola-pavo' }
      ],
      texto_breve: 'Seis hongos integran PeakO₂, una preparación estudiada durante pruebas de ejercicio aeróbico.',
      lectura_ampliada: [
        'Participaron adultos de 18 a 35 años que hacían ejercicio con regularidad. Las pruebas se hicieron en bicicleta estática.',
        'A una semana, los resultados fueron similares al placebo.',
        'La señal favorable en consumo máximo de oxígeno procede de una extensión de dos semanas más con diez participantes, seis con la mezcla y cuatro con placebo. Los autores la consideran exploratoria.'
      ],
      investigacion: [
        {
          ingrediente: 'PeakO₂ (mezcla completa)',
          cita: 'Hirsch KR, Smith-Ryan AE, Roelofs EJ, Trexler ET, Mock MG. Journal of Dietary Supplements. 2017;14(1):42-53.',
          url: 'https://pubmed.ncbi.nlm.nih.gov/27408987/',
          doi: '10.1080/19390211.2016.1203386',
          diseno: 'Ensayo aleatorizado, doble ciego, con placebo.',
          poblacion: 'Adultos de 18 a 35 años físicamente activos, en Estados Unidos (30 asignados, 28 analizados a una semana, 10 en la extensión).',
          preparacion: 'PeakO₂: Cordyceps militaris, Ganoderma lucidum, Pleurotus eryngii, Lentinula edodes, Hericium erinaceus y Trametes versicolor (tabla 3).',
          duracion: 'Una semana, más una extensión de dos semanas con un subgrupo.',
          midio: 'Consumo máximo de oxígeno, umbral ventilatorio y tiempo hasta el agotamiento en una prueba incremental en bicicleta. También una prueba máxima de tres minutos.',
          observacion: 'A una semana, sin diferencias frente a placebo. En la extensión, diferencia en consumo máximo de oxígeno con una muestra muy pequeña.',
          financiacion: 'Financiado por una empresa de nutrición deportiva, con apoyo de una beca de los NIH.'
        }
      ],
      fuentes: [
        { etiqueta: 'Ensayo original de rendimiento', url: 'https://pubmed.ncbi.nlm.nih.gov/27408987/' },
        { etiqueta: 'Composición, tabla 3', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5236007/' }
      ]
    }
  ];

  // ---------- Derivaciones (no editar a mano: todo sale de RUTAS) ----------
  function derivar() {
    var porClave = {}, porIndice = [], porRuta = {}, aparece = {};
    NODOS.forEach(function (n) { porClave[n.clave] = n; porIndice[n.i] = n; aparece[n.clave] = []; });
    RUTAS.forEach(function (r) {
      porRuta[r.id] = r;
      var nodos = [];
      r.ingredientes.forEach(function (ing) {
        if (!ing.nodo) return;
        if (!porClave[ing.nodo]) throw new Error('Nodo desconocido: ' + ing.nodo + ' en ' + r.id);
        if (nodos.indexOf(ing.nodo) < 0) nodos.push(ing.nodo);
        // «Aparece en»: guarda la especie exacta que declaró cada estudio
        aparece[ing.nodo].push({ ruta: r.id, titulo: r.titulo_ficha, tipo: TIPOS[r.tipo].etiqueta,
          preparacion: r.preparacion.nombre, declarado: ing.declarado, taxon: ing.taxon, taxon_estado: ing.taxon_estado });
      });
      r.nodos = nodos;                       // intención → hongos que se iluminan
      r.tipo_etiqueta = TIPOS[r.tipo].etiqueta;
      r.tipo_nota = TIPOS[r.tipo].nota;
    });
    return { porClave: porClave, porIndice: porIndice, porRuta: porRuta, aparece: aparece };
  }

  var IDX = derivar();

  var API = {
    version: '0.1',
    verificado: '2026-11-15',
    NODOS: NODOS, TIPOS: TIPOS, RUTAS: RUTAS,
    ruta: function (id) { return IDX.porRuta[id] || null; },
    nodosDeRuta: function (id) { var r = IDX.porRuta[id]; return r ? r.nodos.slice() : []; },
    indicesDeRuta: function (id) { return API.nodosDeRuta(id).map(function (k) { return IDX.porClave[k].i; }); },
    apareceEn: function (clave) { return (IDX.aparece[clave] || []).slice(); },
    claveDeIndice: function (i) { return IDX.porIndice[i] ? IDX.porIndice[i].clave : null; },
    nodo: function (clave) { return IDX.porClave[clave] || null; }
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.TEKIA_RUTAS = API;
})(typeof window !== 'undefined' ? window : this);
