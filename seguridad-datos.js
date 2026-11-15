/* TEKIA · Datos de seguridad de ingredientes (Precauciones).
   Las advertencias salen de estos registros revisados; la interfaz no genera advertencias propias.
   Una advertencia clínica sobre un ingrediente NO equivale a una incompatibilidad entre dos hongos:
   las incompatibilidades solo existen si hay un registro con category "interaction_pair" y fuente revisada (hoy no hay ninguno).
   No se publican registros con reviewStatus "requires_review" ni con publicVisible false.

   SafetyRecord = {
     id, ingredientIds[],          // ids del atlas (atlas-datos.js)
     title, summary, details,
     category: "allergy"|"medication"|"medical_condition"|"pregnancy_lactation"|"adverse_event"|"preparation",
     evidenceType: "clinical_trial"|"case_report"|"review"|"official_guidance",
     preparation?,                 // preparación concreta en la que se observó
     sourceIds[],                  // ids de REFS
     reviewStatus: "reviewed"|"requires_review",
     publicVisible: boolean,
     blendNotice?: boolean         // se muestra como «Información importante» en Mi blend
   }
   Reference = { id, author, title, year, pmid?, doi?, url, preparation?, population?, evidenceType, reviewedOn } */
window.TEKIA_SEGURIDAD = {
  revisado: '2026-11-15',
  general: {
    kicker: 'TEKIA · Elección informada',
    titulo: 'Conocer también es cuidarse.',
    intro: 'Cada hongo tiene sus propias características. Antes de incorporar un complemento a tu rutina, hay algunos aspectos importantes que vale la pena conocer.',
    principios: [
      {icono:'sprout', titulo:'Conoce lo que eliges', texto:'Revisa la especie, los ingredientes y el tipo de preparación. Un extracto y un polvo de hongo entero no son necesariamente equivalentes.'},
      {icono:'heart-pulse', titulo:'Considera tu situación personal', texto:'Si tomas medicamentos, tienes alguna condición médica o estás bajo tratamiento, consulta con tu profesional de salud antes de consumir suplementos de hongos.'},
      {icono:'leaf', titulo:'Respeta las precauciones de cada hongo', texto:'Algunas preparaciones requieren especial atención por sus posibles interacciones o efectos adversos.'},
      {icono:'clipboard-check', titulo:'Observa cómo responde tu cuerpo', texto:'Si aparece una reacción inesperada, suspende el consumo y solicita orientación profesional.'}
    ],
    nota: 'Durante el embarazo y la lactancia, evita iniciar estos complementos sin valoración profesional. Mantén los productos fuera del alcance de niñas y niños.',
    antes: {
      titulo: 'Antes de incorporar un complemento',
      intro: 'Hay situaciones en las que una consulta previa ayuda a tomar una decisión mejor informada.',
      grupos: [
        {icono:'pill', titulo:'Medicamentos', texto:'Si utilizas anticoagulantes, medicamentos para la diabetes o inmunosupresores.'},
        {icono:'heart-pulse', titulo:'Etapas de la vida', texto:'Si estás embarazada, en lactancia o el complemento está destinado a una persona menor de edad.'},
        {icono:'shield-check', titulo:'Condiciones y tratamientos', texto:'Si estás bajo tratamiento oncológico, tienes enfermedad renal o hepática, recibiste un trasplante o tienes una cirugía programada.'},
        {icono:'leaf', titulo:'Alergias', texto:'Si tienes antecedentes de alergias a hongos o a cualquiera de los ingredientes de la fórmula.'}
      ],
      cierre: 'Esto no es una prohibición universal para todos los hongos. Las restricciones concretas dependen de la especie, la preparación y la situación de cada persona.'
    },
    reaccion: {titulo:'Si notas una reacción inesperada', texto:'Suspende el consumo y solicita orientación profesional. Si presentas dificultad para respirar, hinchazón de labios o lengua, o una reacción intensa, busca atención médica inmediata.'},
    fino: 'Información general y educativa. No es una evaluación personal ni sustituye las advertencias de la etiqueta de cada producto ni la consulta con un profesional de la salud.'
  },
  ingredientes: [
    {id:'lion', comun:'Melena de león', latin:'Hericium erinaceus'},
    {id:'reishi', comun:'Reishi', latin:'Ganoderma spp.', prep:'Identifica la especie y el tipo de extracto de cada producto. Lo observado con una preparación no se traslada por sí solo a otra.'},
    {id:'cord', comun:'Cordyceps', latin:'Cordyceps militaris · Ophiocordyceps sinensis', prep:'Cordyceps militaris, Ophiocordyceps sinensis y los preparados fermentados de micelio como Cs-4 son preparaciones distintas. Sus precauciones no son intercambiables.'},
    {id:'maitake', comun:'Maitake', latin:'Grifola frondosa'},
    {id:'chaga', comun:'Chaga', latin:'Inonotus obliquus'},
    {id:'shiitake', comun:'Shiitake', latin:'Lentinula edodes'},
    {id:'oyster', comun:'Seta de ostra', latin:'Pleurotus ostreatus'},
    {id:'agaricus', comun:'Hongo del sol', latin:'Agaricus subrufescens y nombres comerciales relacionados', prep:'Antes de aplicar una advertencia a un producto concreto, identifica su especie y su extracto.'},
    {id:'turkey', comun:'Cola de pavo', latin:'Trametes versicolor', prep:'PSK, PSP y el hongo entero son preparaciones distintas. No comparten necesariamente el mismo perfil de seguridad.'},
    {id:'snow', comun:'Hongo de nieve', latin:'Tremella fuciformis'},
    {id:'king', comun:'Seta de cardo', latin:'Pleurotus eryngii', prep:'Es una especie distinta de la seta de ostra (Pleurotus ostreatus). Lo observado en una no se traslada a la otra.'}
  ],
  records: [
    {id:'lion-tolerancia', ingredientIds:['lion'], title:'Molestias digestivas y piel',
     summary:'Algunas personas pueden experimentar molestias digestivas, náuseas o reacciones cutáneas.',
     details:'En un ensayo con micelio enriquecido en erinacina A hubo abandonos por molestias abdominales, náusea o erupción cutánea. Esa observación corresponde a esa preparación y no cuantifica el riesgo de otras.',
     category:'adverse_event', evidenceType:'clinical_trial', preparation:'Micelio enriquecido en erinacina A', sourceIds:['li2020'], reviewStatus:'reviewed', publicVisible:true},
    {id:'lion-alergia', ingredientIds:['lion'], title:'Alergia a hongos',
     summary:'Si tienes antecedentes de alergia a hongos, revisa los ingredientes y consulta antes de consumirlo.',
     details:'', category:'allergy', evidenceType:'official_guidance', sourceIds:[], reviewStatus:'requires_review', publicVisible:false},
    {id:'reishi-medicamentos', ingredientIds:['reishi'], title:'Anticoagulantes e inmunosupresores',
     summary:'Consulta antes de combinar preparaciones de reishi con anticoagulantes o medicamentos inmunosupresores.',
     details:'La monografía de Memorial Sloan Kettering señala un posible aumento del riesgo de sangrado con anticoagulantes y antiagregantes, y posibles efectos sobre la respuesta inmunitaria.',
     category:'medication', evidenceType:'review', sourceIds:['mskcc-reishi'], reviewStatus:'reviewed', publicVisible:true},
    {id:'reishi-digestivo', ingredientIds:['reishi'], title:'Efectos digestivos',
     summary:'Se han descrito efectos adversos digestivos con algunas preparaciones.',
     details:'Entre los efectos descritos están náusea, boca seca y estreñimiento.',
     category:'adverse_event', evidenceType:'review', sourceIds:['mskcc-reishi'], reviewStatus:'reviewed', publicVisible:true},
    {id:'reishi-higado', ingredientIds:['reishi'], title:'Casos de lesión hepática', blendNotice:true,
     summary:'Se han descrito casos de lesión hepática relacionados con determinadas preparaciones.',
     details:'Un informe clínico describió hepatitis fulminante tras el uso de un polvo de lingzhi, con exposición a otros agentes al mismo tiempo. LiverTox, la base de datos de los Institutos Nacionales de Salud de Estados Unidos, lo considera una causa posible y rara de lesión hepática, con pocos casos publicados. No permite conocer su frecuencia ni trasladarla a cualquier extracto.',
     category:'adverse_event', evidenceType:'case_report', preparation:'Polvo de lingzhi', sourceIds:['wanmuang2007','livertox-reishi'], reviewStatus:'reviewed', publicVisible:true},
    {id:'cord-medicamentos', ingredientIds:['cord'], title:'Anticoagulantes y control de la glucosa',
     summary:'Algunas preparaciones podrían interactuar con medicamentos anticoagulantes o utilizados para controlar la glucosa. Las precauciones dependen de la especie y de la preparación.',
     details:'La evidencia proviene sobre todo de estudios de laboratorio y de un caso de sangrado tras una extracción dental. Su relevancia clínica para la glucosa todavía no se conoce.',
     category:'medication', evidenceType:'review', sourceIds:['mskcc-cordyceps'], reviewStatus:'reviewed', publicVisible:true},
    {id:'maitake-warfarina', ingredientIds:['maitake'], title:'Maitake y warfarina', blendNotice:true,
     summary:'Requiere especial atención si tomas warfarina. Existe un caso clínico publicado de interacción con warfarina.',
     details:'Se publicó un reporte de elevación del INR, el indicador de coagulación, en una persona que combinó un extracto de maitake con warfarina. Es un reporte individual: no significa que todas las preparaciones produzcan la misma interacción, pero si usas este anticoagulante conviene revisarlo antes con tu equipo de salud.',
     category:'medication', evidenceType:'case_report', preparation:'Extracto de maitake', sourceIds:['hanselin2010','mskcc-maitake'], reviewStatus:'reviewed', publicVisible:true},
    {id:'maitake-glucosa', ingredientIds:['maitake'], title:'Medicamentos para la glucosa',
     summary:'Requiere atención si tomas medicamentos para controlar la glucosa.',
     details:'Se ha descrito un posible efecto hipoglucemiante en un reporte en personas con diabetes tipo 2. Combinado con medicamentos para la glucosa podría sumar su efecto.',
     category:'medication', evidenceType:'review', sourceIds:['mskcc-maitake','konno2001'], reviewStatus:'reviewed', publicVisible:true},
    {id:'chaga-renal', ingredientIds:['chaga'], title:'Chaga y salud renal', blendNotice:true,
     summary:'Se han documentado casos de daño renal asociados al consumo elevado o prolongado de chaga en polvo. Si tienes enfermedad renal o antecedentes de cálculos, solicita orientación profesional antes de consumir preparaciones concentradas.',
     details:'El consumo prolongado de chaga en polvo se ha asociado con nefropatía por oxalato. Hay al menos tres casos publicados. En uno, con enfermedad renal terminal, la biopsia mostró depósitos de oxalato y se analizó el polvo consumido. La frecuencia del daño no puede deducirse de estos casos.',
     category:'medical_condition', evidenceType:'case_report', preparation:'Chaga en polvo, consumo prolongado', sourceIds:['kikuchi2014','lee2020','kwon2022','mskcc-chaga'], reviewStatus:'reviewed', publicVisible:true},
    {id:'chaga-medicamentos', ingredientIds:['chaga'], title:'Anticoagulantes y control de la glucosa',
     summary:'Consulta si tomas anticoagulantes, antiagregantes o medicamentos para controlar la glucosa.',
     details:'Se han descrito posibles efectos sobre las plaquetas y la glucosa. Su relevancia clínica todavía no se conoce.',
     category:'medication', evidenceType:'review', sourceIds:['mskcc-chaga'], reviewStatus:'reviewed', publicVisible:true},
    {id:'shiitake-dermatitis', ingredientIds:['shiitake'], title:'Dermatitis por shiitake crudo',
     summary:'El shiitake crudo o insuficientemente cocinado puede provocar una reacción cutánea característica. Esta observación no se extrapola automáticamente a todas las preparaciones procesadas.',
     details:'Una serie de centros toxicológicos franceses registró 59 episodios de dermatitis tras consumir shiitake crudo o poco cocido. Describe a personas que consultaron; no estima la frecuencia entre quienes lo comen. Con menos frecuencia también se ha descrito tras comerlo cocinado.',
     category:'adverse_event', evidenceType:'case_report', preparation:'Shiitake crudo o poco cocido', sourceIds:['boels2022','chu2013','mskcc-shiitake'], reviewStatus:'reviewed', publicVisible:true},
    {id:'oyster-alergia', ingredientIds:['oyster'], title:'Reacciones alérgicas',
     summary:'Puede ocasionar reacciones alérgicas en personas susceptibles, como otros hongos comestibles. Revisa la composición del producto si tienes antecedentes de alergia.',
     details:'Existe un caso publicado de alergia a la ingestión de P. ostreatus confirmado mediante provocación oral. También se han descrito reacciones por inhalar sus esporas en personas que lo cultivan. Un caso no determina la frecuencia.',
     category:'allergy', evidenceType:'case_report', preparation:'Seta de ostra cocinada, ingestión', sourceIds:['oyster2023','branicka2021'], reviewStatus:'reviewed', publicVisible:true},
    {id:'agaricus-higado', ingredientIds:['agaricus'], title:'Alteraciones hepáticas', blendNotice:true,
     summary:'Se han descrito alteraciones hepáticas asociadas con determinadas preparaciones comerciales de Agaricus.',
     details:'Se describieron tres pacientes con cáncer avanzado y daño hepático grave tras tomar un extracto comercializado como A. blazei; en un caso el deterioro reapareció al reiniciar el producto. Es una señal clínica, sin estimación de frecuencia.',
     category:'adverse_event', evidenceType:'case_report', preparation:'Extracto comercial declarado como A. blazei', sourceIds:['mukai2006','mskcc-agaricus'], reviewStatus:'reviewed', publicVisible:true},
    {id:'turkey-psp', ingredientIds:['turkey'], title:'Observación con PSP',
     summary:'En un estudio con el extracto PSP, una persona notificó más gases y eructos mientras lo tomaba.',
     details:'El tamaño del estudio no permite estimar la frecuencia de reacciones poco comunes. Esta observación corresponde al PSP y no se traslada al PSK ni al hongo entero. No se han documentado interacciones específicas, y no está claro que PSK y PSP sean comparables entre sí.',
     category:'adverse_event', evidenceType:'clinical_trial', preparation:'PSP (polisacaropéptido)', sourceIds:['pallav2014','mskcc-coriolus'], reviewStatus:'reviewed', publicVisible:true},
    {id:'king-alergia', ingredientIds:['king'], title:'Alergia alimentaria',
     summary:'Se ha descrito un caso de alergia alimentaria inmediata a varias setas que incluyó P. eryngii.',
     details:'Los síntomas orales y la tos aparecieron tras comidas que contenían esas setas. Por separado, se describió una inflamación pulmonar por inhalar sus esporas en el trabajo de cultivo. Un caso no permite calcular la frecuencia.',
     category:'allergy', evidenceType:'case_report', preparation:'Setas cocinadas en comidas', sourceIds:['ide2022','saikai2002'], reviewStatus:'reviewed', publicVisible:true}
  ],
  refs: [
    {id:'hanselin2010', author:'Hanselin MR, Vande Griend JP, Linnebur SA', title:'INR elevation with maitake extract in combination with warfarin', journal:'Annals of Pharmacotherapy', year:2010, pmid:'20040699', url:'https://pubmed.ncbi.nlm.nih.gov/20040699/', preparation:'Extracto de maitake', population:'Una persona en tratamiento con warfarina', evidenceType:'case_report', reviewedOn:'2026-11-15'},
    {id:'lee2020', author:'Lee S y colaboradores', title:'Development of end stage renal disease after long-term ingestion of chaga mushroom', journal:'Journal of Korean Medical Science', year:2020, pmid:'32419395', url:'https://pubmed.ncbi.nlm.nih.gov/32419395/', preparation:'Chaga en polvo, consumo prolongado', population:'Una persona con enfermedad renal terminal', evidenceType:'case_report', reviewedOn:'2026-11-15'},
    {id:'wanmuang2007', author:'Wanmuang H y colaboradores', title:'Fatal fulminant hepatitis associated with Ganoderma lucidum (Lingzhi) mushroom powder', journal:'Journal of the Medical Association of Thailand', year:2007, pmid:'17621752', url:'https://pubmed.ncbi.nlm.nih.gov/17621752/', preparation:'Polvo de lingzhi', population:'Un caso clínico', evidenceType:'case_report', reviewedOn:'2026-11-15'},
    {id:'boels2022', author:'Boels D y colaboradores', title:'Shiitake dermatitis: a series of cases from French poison control centres', journal:'', year:2022, pmid:'35404185', url:'https://pubmed.ncbi.nlm.nih.gov/35404185/', preparation:'Shiitake crudo o poco cocido', population:'59 episodios notificados', evidenceType:'case_report', reviewedOn:'2026-11-15'},
    {id:'oyster2023', author:'Caso clínico, 2023', title:'Alergia a la ingestión de Pleurotus ostreatus confirmada por provocación oral', journal:'', year:2023, url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC10509983/', preparation:'Seta de ostra, ingestión', population:'Un caso clínico', evidenceType:'case_report', reviewedOn:'2026-11-15'},
    {id:'mukai2006', author:'Mukai H y colaboradores', title:'Liver injury in cancer patients taking Agaricus blazei extract', journal:'Japanese Journal of Clinical Oncology', year:2006, pmid:'17105737', url:'https://pubmed.ncbi.nlm.nih.gov/17105737/', preparation:'Extracto comercial declarado como A. blazei', population:'Tres pacientes con cáncer avanzado', evidenceType:'case_report', reviewedOn:'2026-11-15'},
    {id:'li2020', author:'Li IC y colaboradores', title:'Erinacine A-enriched Hericium erinaceus mycelia in mild Alzheimer’s disease', journal:'Frontiers in Aging Neuroscience', year:2020, url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC7283924/', preparation:'Micelio enriquecido en erinacina A', population:'Adultos con enfermedad de Alzheimer leve', evidenceType:'clinical_trial', reviewedOn:'2026-11-15'},
    {id:'pallav2014', author:'Pallav K y colaboradores', title:'Effects of polysaccharopeptide from Trametes versicolor and amoxicillin on the gut microbiome', journal:'Gut Microbes', year:2014, doi:'10.4161/gmic.29558', url:'https://doi.org/10.4161/gmic.29558', preparation:'PSP', population:'Voluntarios sanos', evidenceType:'clinical_trial', reviewedOn:'2026-11-15'},
    {id:'ide2022', author:'Ide y colaboradores', title:'Alergia alimentaria a varias setas y proteínas alergénicas', journal:'Journal of Investigational Allergology and Clinical Immunology', year:2022, url:'https://www.jiaci.org/revistas/vol32issue1_6-5.pdf', preparation:'Setas en comidas', population:'Un caso clínico', evidenceType:'case_report', reviewedOn:'2026-11-15'}
    ,{id:'mskcc-reishi', author:'Memorial Sloan Kettering Cancer Center', title:'Reishi Mushroom · About Herbs', journal:'', year:2026, url:'https://www.mskcc.org/cancer-care/integrative-medicine/herbs/reishi-mushroom', evidenceType:'review', reviewedOn:'2026-11-15'},
    {id:'livertox-reishi', author:'NIDDK · LiverTox', title:'Lingzhi, Reishi', journal:'NCBI Bookshelf', year:2024, url:'https://www.ncbi.nlm.nih.gov/books/NBK609014/', evidenceType:'review', reviewedOn:'2026-11-15'},
    {id:'mskcc-cordyceps', author:'Memorial Sloan Kettering Cancer Center', title:'Cordyceps · About Herbs', journal:'', year:2023, url:'https://www.mskcc.org/cancer-care/integrative-medicine/herbs/cordyceps', evidenceType:'review', reviewedOn:'2026-11-15'},
    {id:'mskcc-maitake', author:'Memorial Sloan Kettering Cancer Center', title:'Maitake · About Herbs', journal:'', year:2026, url:'https://www.mskcc.org/cancer-care/integrative-medicine/herbs/maitake', evidenceType:'review', reviewedOn:'2026-11-15'},
    {id:'konno2001', author:'Konno S y colaboradores', title:'A possible hypoglycaemic effect of maitake mushroom on Type 2 diabetic patients', journal:'Diabetic Medicine', year:2001, pmid:'11903406', url:'https://pubmed.ncbi.nlm.nih.gov/11903406/', population:'Personas con diabetes tipo 2', evidenceType:'case_report', reviewedOn:'2026-11-15'},
    {id:'mskcc-chaga', author:'Memorial Sloan Kettering Cancer Center', title:'Chaga Mushroom · About Herbs', journal:'', year:2025, url:'https://www.mskcc.org/cancer-care/integrative-medicine/herbs/chaga-mushroom', evidenceType:'review', reviewedOn:'2026-11-15'},
    {id:'kikuchi2014', author:'Kikuchi Y y colaboradores', title:'Chaga mushroom-induced oxalate nephropathy', journal:'Clinical Nephrology', year:2014, pmid:'23149251', doi:'10.5414/CN107655', url:'https://doi.org/10.5414/CN107655', preparation:'Chaga en polvo', population:'Un caso clínico', evidenceType:'case_report', reviewedOn:'2026-11-15'},
    {id:'kwon2022', author:'Kwon O y colaboradores', title:'Chaga mushroom-induced oxalate nephropathy that clinically manifested as nephrotic syndrome', journal:'', year:2022, pmid:'35451393', url:'https://pubmed.ncbi.nlm.nih.gov/35451393/', population:'Un caso clínico', evidenceType:'case_report', reviewedOn:'2026-11-15'},
    {id:'mskcc-shiitake', author:'Memorial Sloan Kettering Cancer Center', title:'Shiitake Mushroom · About Herbs', journal:'', year:2025, url:'https://www.mskcc.org/cancer-care/integrative-medicine/herbs/shiitake-mushroom', evidenceType:'review', reviewedOn:'2026-11-15'},
    {id:'chu2013', author:'Chu EY y colaboradores', title:'Shiitake dermatitis: a report of 3 cases and review of the literature', journal:'Cutis', year:2013, pmid:'23837150', url:'https://pubmed.ncbi.nlm.nih.gov/23837150/', population:'Tres casos', evidenceType:'case_report', reviewedOn:'2026-11-15'},
    {id:'branicka2021', author:'Branicka O, Rozłucka L, Gawlik R', title:'A case of anaphylactic reaction following oyster mushroom (Pleurotus ostreatus) inhalation', journal:'International Journal of Occupational Medicine and Environmental Health', year:2021, doi:'10.13075/ijomeh.1896.01610', url:'https://doi.org/10.13075/ijomeh.1896.01610', preparation:'Inhalación de esporas', population:'Un cultivador', evidenceType:'case_report', reviewedOn:'2026-11-15'},
    {id:'saikai2002', author:'Saikai T y colaboradores', title:'Hypersensitivity pneumonitis induced by the spore of Pleurotus eryngii', journal:'Internal Medicine', year:2002, doi:'10.2169/internalmedicine.41.571', url:'https://doi.org/10.2169/internalmedicine.41.571', preparation:'Inhalación de esporas', population:'Trabajador de cultivo', evidenceType:'case_report', reviewedOn:'2026-11-15'},
    {id:'mskcc-agaricus', author:'Memorial Sloan Kettering Cancer Center', title:'Agaricus · About Herbs', journal:'', year:2025, url:'https://www.mskcc.org/cancer-care/integrative-medicine/herbs/agaricus', evidenceType:'review', reviewedOn:'2026-11-15'},
    {id:'mskcc-coriolus', author:'Memorial Sloan Kettering Cancer Center', title:'Coriolus versicolor · About Herbs', journal:'', year:2026, url:'https://www.mskcc.org/cancer-care/integrative-medicine/herbs/coriolus-versicolor', evidenceType:'review', reviewedOn:'2026-11-15'},
    {id:'nci-pdq', author:'National Cancer Institute', title:'Medicinal Mushrooms (PDQ) · Versión para profesionales', journal:'', year:2024, url:'https://www.cancer.gov/about-cancer/treatment/cam/hp/mushrooms-pdq', evidenceType:'official_guidance', reviewedOn:'2026-11-15'}
  ]
};
