export type ArticleSection = { heading: string; paragraphs: string[]; list?: string[] };
export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  published: string;
  minutes: number;
  sections: ArticleSection[];
};

export const ARTICLES: Article[] = [
  {
    slug: "piramide-del-futbol-argentino",
    title: "La pirámide del fútbol argentino: de la Primera D a la Liga Profesional",
    description: "Cómo se organizan las categorías del fútbol argentino, quién juega en cada una y cómo se conectan mediante ascensos y descensos.",
    category: "Fútbol argentino",
    published: "2026-09-20",
    minutes: 6,
    sections: [
      {
        heading: "Una estructura de seis escalones",
        paragraphs: [
          "El fútbol masculino argentino se ordena en una pirámide donde cada categoría alimenta a la siguiente. En la cima está la Liga Profesional, que reúne a los clubes con mayor exposición mediática y económica. Debajo se ubica la Primera Nacional, la segunda categoría del sistema, y más abajo conviven otras divisiones que cambian según la forma de afiliación de cada institución a la AFA.",
          "Esa forma de afiliación es la clave para entender por qué el mapa parece complejo. Los clubes afiliados directamente participan de las categorías metropolitanas: Primera B, Primera C y Primera D. Los clubes de ciudades y provincias del interior se afilian de manera indirecta a través de sus ligas regionales y compiten en torneos organizados por el Consejo Federal, como el Federal A. La Primera Nacional funciona como punto de encuentro entre ambos universos.",
        ],
      },
      {
        heading: "Qué representa cada categoría",
        paragraphs: [
          "La Liga Profesional es la vidriera. Allí están los equipos grandes, los clásicos de mayor audiencia y los clubes que compiten por títulos locales y plazas internacionales. Cada plantel suele combinar figuras consagradas, extranjeros y juveniles formados en la propia institución.",
          "La Primera Nacional es una categoría de enorme exigencia deportiva y logística. Muchos de sus participantes son clubes históricos que descendieron o aspiran a regresar, junto con instituciones que crecieron desde el ascenso. Ascender implica un salto económico considerable, por lo que cada temporada se vive con una presión particular.",
          "El Federal A reúne a clubes del interior y obliga a recorrer distancias enormes. Un equipo patagónico puede cruzar el país en micro para jugar un solo partido, algo que condiciona descanso, presupuesto y rendimiento. Primera B, Primera C y Primera D son el verdadero cimiento metropolitano: canchas de barrio, hinchadas fieles y presupuestos ajustados.",
        ],
      },
      {
        heading: "Ascensos, descensos y puentes entre categorías",
        paragraphs: [
          "La movilidad es el corazón del sistema. Los mejores de cada categoría suben y, en muchos casos, los peores descienden. Los formatos exactos cambian con frecuencia: pueden existir torneos largos, campeonatos cortos, zonas, reducidos, promociones o tablas de promedios. Por eso conviene consultar siempre el reglamento vigente de cada temporada antes de dar por cierta una regla.",
          "Lo que permanece estable es la lógica deportiva: ganar permite avanzar y fallar tiene consecuencias. Esa tensión explica por qué un partido de media tabla en la Primera C puede ser tan intenso como un clásico de Primera: para muchos clubes, un ascenso modifica la historia institucional durante décadas.",
        ],
      },
      {
        heading: "Por qué importa conocerla si jugás Modo Carrera DT",
        paragraphs: [
          "En Modo Carrera DT esta pirámide es el tablero del juego. La carrera de jugador arranca en Primera D y avanza escalón por escalón hasta Primera. La carrera de DT ofrece clubes de distintos niveles y objetivos adaptados a cada realidad: evitar el descenso, entrar al Reducido, ascender o clasificar a una copa.",
          "Entender qué significa cada categoría ayuda a tomar mejores decisiones. Aceptar una oferta de una división superior puede ser un gran paso, pero también puede implicar menos minutos o más presión. Conocer el contexto real del fútbol argentino vuelve más rica cada elección.",
        ],
        list: [
          "Primera D, C y B: clubes afiliados directamente, con base metropolitana.",
          "Federal A: clubes del interior, afiliación indirecta y grandes viajes.",
          "Primera Nacional: segunda categoría y puerta de entrada a la élite.",
          "Liga Profesional: máxima categoría del fútbol argentino.",
        ],
      },
    ],
  },
  {
    slug: "como-funcionan-ascensos-y-reducidos",
    title: "Cómo funcionan los ascensos, los reducidos y las promociones",
    description: "Una explicación sencilla de los mecanismos que permiten subir de categoría en el fútbol argentino y por qué los formatos cambian tanto.",
    category: "Fútbol argentino",
    published: "2026-09-22",
    minutes: 5,
    sections: [
      {
        heading: "Ascender no es una sola fórmula",
        paragraphs: [
          "Cuando alguien pregunta cómo se asciende en el fútbol argentino, la respuesta honesta es: depende de la categoría y de la temporada. A lo largo de los años hubo campeonatos de dos ruedas, torneos cortos, zonas con cruces posteriores, tablas anuales y combinaciones de todos esos sistemas. La Asociación del Fútbol Argentino y el Consejo Federal modifican reglamentos con frecuencia.",
          "Lo que sí se mantiene son algunos conceptos que aparecen una y otra vez. Conocerlos permite interpretar cualquier formato nuevo sin perderse.",
        ],
      },
      {
        heading: "Los conceptos que siempre aparecen",
        paragraphs: [
          "El ascenso directo es el más claro: el campeón o los mejores ubicados obtienen el lugar en la categoría superior sin pasos adicionales. Es el premio al rendimiento sostenido durante toda la competencia.",
          "El Reducido es un camino alternativo. Reúne a los equipos que no lograron el ascenso directo pero terminaron arriba y los enfrenta en cruces de eliminación. Su atractivo es evidente: un equipo que fue séptimo en la tabla puede ascender si resuelve bien tres o cuatro series. Su crueldad también: una temporada de esfuerzo puede definirse en noventa minutos.",
          "La promoción o el desempate entre categorías enfrenta a equipos de divisiones distintas. Allí se mezclan la jerarquía de quien viene de arriba y el hambre de quien aspira a subir. Suelen ser series cargadas de tensión.",
        ],
      },
      {
        heading: "Descensos y promedios",
        paragraphs: [
          "Los descensos funcionan como espejo de los ascensos. En algunas épocas se calcularon mediante promedios de varias temporadas para evitar que una mala campaña única condene a un club. En otras se usaron tablas anuales. La discusión sobre qué sistema es más justo forma parte del folclore del fútbol argentino.",
          "Para un club chico, descender puede tener consecuencias económicas profundas: menos ingresos, menos público y dificultades para retener jugadores. Para un club grande, el descenso puede provocar una crisis institucional. En ambos casos explica la intensidad con que se disputan las últimas fechas.",
        ],
      },
      {
        heading: "Cómo lo representa el juego",
        paragraphs: [
          "Modo Carrera DT simplifica estos formatos para que cada temporada resulte comprensible sin eliminar la sensación de riesgo. Los objetivos que recibe el entrenador, como entrar al Reducido o evitar el descenso, representan esa lógica general más que un reglamento puntual de un año determinado.",
          "La idea no es copiar un fixture real sino capturar la emoción: cada punto pesa, cada racha cambia el clima y cada decisión puede mover la aguja entre una temporada normal y una campaña recordada.",
        ],
      },
    ],
  },
  {
    slug: "copa-argentina-camino-al-titulo",
    title: "Copa Argentina: el torneo donde cualquier club puede soñar",
    description: "Qué es la Copa Argentina, por qué su formato de eliminación directa genera sorpresas y qué premio deportivo ofrece al campeón.",
    category: "Competencias",
    published: "2026-09-24",
    minutes: 5,
    sections: [
      {
        heading: "Un torneo federal y de eliminación directa",
        paragraphs: [
          "La Copa Argentina reúne a equipos de distintas categorías en un cuadro de eliminación directa. Su principal atractivo es conceptual: durante noventa minutos, y a veces alargue y penales, un club de ascenso puede medirse con instituciones de primera línea. No existe tabla de posiciones que administrar ni segunda oportunidad en una revancha.",
          "Esa estructura crea una dinámica distinta de la liga. En un campeonato largo, la regularidad suele imponerse. En una copa, la inspiración de un arquero, un error arbitral o una jugada de pelota parada pueden alterar el resultado esperado.",
        ],
      },
      {
        heading: "La magia de la sorpresa",
        paragraphs: [
          "Las eliminaciones inesperadas son parte de la identidad del certamen. Cada edición deja historias de clubes humildes que ganan fuera de casa, de planteles amateurs que enfrentan a campeones y de hinchadas que viajan cientos de kilómetros para alentar a su equipo en una sede neutral.",
          "Para los clubes más chicos, una fase avanzada puede significar ingresos extraordinarios, visibilidad nacional y un récord de público. Para los grandes, una eliminación temprana se transforma en motivo de debate inmediato. La presión es asimétrica: el favorito tiene todo para perder y el aspirante, casi todo para ganar.",
        ],
      },
      {
        heading: "El premio: una plaza internacional",
        paragraphs: [
          "Además del título, el campeón obtiene un beneficio deportivo de enorme valor: la posibilidad de clasificar a una competencia continental. Para un club ubicado fuera de las posiciones de privilegio en la liga, la copa representa un camino alternativo hacia torneos internacionales que de otro modo estarían lejos.",
          "Esa conexión convierte a la Copa Argentina en una competencia estratégica. Los entrenadores deben decidir cuánto esfuerzo y cuántos titulares destinar al torneo sin descuidar el campeonato de liga.",
        ],
      },
      {
        heading: "La Copa dentro de Modo Carrera DT",
        paragraphs: [
          "El juego incorpora la Copa Argentina como una ruta narrativa distinta. Un campeón puede clasificar a la Libertadores siguiente, algo que modifica la proyección del club y la reputación del entrenador o del jugador.",
        ],
        list: [
          "En partidos eliminatorios no hay margen para especular con la tabla.",
          "La rotación de titulares es una decisión de riesgo.",
          "Un solo cruce puede cambiar la temporada completa.",
        ],
      },
    ],
  },
  {
    slug: "grandes-campeones-argentinos-de-libertadores",
    title: "Los clubes argentinos campeones de la Copa Libertadores",
    description: "Un repaso por los ocho clubes argentinos que ganaron la Libertadores y qué significó cada conquista para su historia.",
    category: "Historia",
    published: "2026-09-26",
    minutes: 6,
    sections: [
      {
        heading: "Una tradición continental",
        paragraphs: [
          "Ocho clubes argentinos levantaron la Copa Libertadores de América y, entre todos, acumulan veinticinco títulos. Esa cifra explica por qué la competencia ocupa un lugar central en la conversación futbolera local. Para un hincha argentino, la Libertadores no es un torneo más: es una medida de grandeza.",
        ],
      },
      {
        heading: "Independiente, el Rey de Copas",
        paragraphs: [
          "Independiente es el club con más Libertadores de la historia: siete títulos conseguidos entre 1964 y 1984. Esa serie, que incluye tres conquistas consecutivas a mediados de los años setenta, construyó su apodo. Su identidad quedó ligada a la competitividad continental, a la garra y a una épica propia de las noches de copa.",
        ],
      },
      {
        heading: "Boca Juniors y River Plate",
        paragraphs: [
          "Boca Juniors ganó seis Libertadores, con una generación a fines de los años setenta y un ciclo dorado entre 2000 y 2007. River Plate suma cuatro, con consagraciones en 1986, 1996, 2015 y 2018. La rivalidad entre ambos trascendió el ámbito local y llegó a una final continental disputada en 2018, un episodio que ocupó la atención del mundo del fútbol.",
        ],
      },
      {
        heading: "Estudiantes, Racing, Argentinos, Vélez y San Lorenzo",
        paragraphs: [
          "Estudiantes de La Plata ganó la copa en 1968, 1969 y 1970, y volvió a lograrlo en 2009. Racing Club fue campeón en 1967 y luego se coronó campeón del mundo al vencer al Celtic en la Intercontinental. Argentinos Juniors obtuvo su título en 1985 y Vélez Sarsfield hizo lo propio en 1994, también con una Intercontinental. San Lorenzo, uno de los cinco grandes del fútbol argentino, consiguió por fin su Libertadores en 2014.",
          "Cada una de esas conquistas tiene un contexto distinto: equipos formados en canteras, planteles armados con inteligencia o proyectos que maduraron durante años. Lo que comparten es que modificaron para siempre la historia de sus instituciones.",
        ],
      },
      {
        heading: "Por qué importa para el juego",
        paragraphs: [
          "En Modo Carrera DT, clasificar a la Libertadores representa un hito de reputación. Es el momento en que un entrenador o un futbolista deja de ser una promesa del ascenso para convertirse en un protagonista de primer nivel. Conocer la historia de estos clubes permite apreciar el peso simbólico de cada oferta que aparece durante la carrera.",
        ],
      },
    ],
  },
  {
    slug: "formaciones-y-tacticas-basicas",
    title: "Formaciones y tácticas básicas: 4-4-2, 4-3-3, 3-5-2 y más",
    description: "Una introducción clara a las formaciones más usadas, sus fortalezas, sus debilidades y cómo elegir según las características del plantel.",
    category: "Táctica",
    published: "2026-09-28",
    minutes: 7,
    sections: [
      {
        heading: "Una formación no gana partidos por sí sola",
        paragraphs: [
          "Los números que describen un equipo, como 4-4-2 o 4-3-3, indican cuántos jugadores de campo actúan en defensa, mediocampo y ataque. Son una forma útil de ordenar ideas, pero no explican todo. Dos equipos con la misma formación pueden jugar de manera completamente distinta según la altura de la presión, la movilidad de los volantes o la libertad de los laterales.",
          "Elegir bien significa partir de los futbolistas disponibles. Una táctica brillante sobre el papel fracasa si los intérpretes no están capacitados para ejecutarla.",
        ],
      },
      {
        heading: "El 4-4-2: equilibrio clásico",
        paragraphs: [
          "Dos líneas de cuatro y dos delanteros conforman un bloque ordenado y fácil de entender. Su principal virtud es la solidez: los volantes ayudan a los defensores y los dos puntas se acompañan. Su debilidad es que puede quedar corto en la zona de creación si el rival domina el centro del campo con tres jugadores.",
        ],
      },
      {
        heading: "El 4-3-3: ancho y presión",
        paragraphs: [
          "Con tres delanteros, el equipo ocupa mejor el ancho de la cancha y puede presionar alto. Requiere extremos con desequilibrio y un mediocampo con cobertura para no quedar partido. Es una apuesta ofensiva que, si falla la recuperación, expone a los defensores en situaciones de uno contra uno.",
        ],
      },
      {
        heading: "El 3-5-2 y las variantes con tres centrales",
        paragraphs: [
          "Tres centrales aseguran superioridad numérica atrás y liberan a los carrileros para atacar por los costados. Es una formación muy exigente físicamente: los laterales deben recorrer toda la banda durante noventa minutos. Funciona bien con planteles resistentes y con defensores que se sientan cómodos defendiendo espacios amplios.",
        ],
      },
      {
        heading: "Cómo elegir",
        paragraphs: [
          "Antes de decidir, evaluá tres aspectos. Primero, dónde está la calidad del plantel: si lo mejor está en el medio, conviene poblarlo. Segundo, el rival: un favorito puede proponer mientras que un equipo inferior quizás deba cerrar espacios. Tercero, el contexto: un resultado urgente exige riesgo, mientras que ganar de visitante a veces se logra priorizando el orden.",
          "Modo Carrera DT te invita a razonar exactamente así. El juego muestra las tres líneas del equipo y te permite alinear tu estilo con las fortalezas reales de los futbolistas, sabiendo que el azar siempre estará presente.",
        ],
        list: [
          "Analizá las líneas antes de elegir el estilo.",
          "No cambies de sistema tras una sola derrota.",
          "Los refuerzos deben resolver una necesidad concreta.",
        ],
      },
    ],
  },
  {
    slug: "el-rol-del-director-tecnico",
    title: "El rol del director técnico: liderar un vestuario más allá de la táctica",
    description: "Qué hace realmente un entrenador: gestión de grupo, relación con la dirigencia, manejo de la prensa y construcción de confianza.",
    category: "Gestión",
    published: "2026-09-29",
    minutes: 6,
    sections: [
      {
        heading: "Mucho más que dibujar jugadas",
        paragraphs: [
          "En la imaginación popular, el director técnico es quien elige la formación y grita desde el borde del campo. En realidad, buena parte del trabajo ocurre lejos de la cancha: conversar con un delantero que perdió confianza, administrar los egos de un plantel, explicar una decisión a la dirigencia o responder preguntas incómodas en una conferencia de prensa.",
          "La táctica es una herramienta. La gestión humana es lo que determina si esa herramienta se utiliza bien. Un entrenador con buenas ideas pero sin respeto del vestuario suele tener una vida corta.",
        ],
      },
      {
        heading: "El vínculo con el plantel",
        paragraphs: [
          "Los futbolistas necesitan claridad. Quieren saber qué se espera de ellos, por qué juegan o no juegan y cuál es el proyecto. La transparencia no garantiza la felicidad de todos, pero reduce los conflictos silenciosos. Un suplente que entiende su rol puede convertirse en un recurso valioso; uno que se siente ignorado puede contaminar el clima.",
          "También importa detectar a los líderes naturales. En cada vestuario hay referentes que influyen más que el propio entrenador. Ganarse su respaldo es una forma eficaz de sostener la autoridad.",
        ],
      },
      {
        heading: "La dirigencia y la presión del resultado",
        paragraphs: [
          "En el fútbol argentino la paciencia suele ser un recurso escaso. Los dirigentes responden a socios, hinchas y a veces a presiones políticas internas. Un mal arranque puede convertir cada partido en una final. Saber comunicar objetivos realistas y mostrar un proceso es fundamental para ganar tiempo.",
          "La presión no es sólo externa. También afecta a los jugadores, que rinden diferente cuando sienten que el clima es hostil. Administrar esa tensión sin trasladarla al grupo es una de las habilidades más difíciles de la profesión.",
        ],
      },
      {
        heading: "Cómo lo vive el juego",
        paragraphs: [
          "La carrera de DT de Modo Carrera DT pone en primer plano estas dimensiones. Los eventos de vestuario, prensa, dirigencia y hinchada plantean decisiones sin respuesta perfecta. Una opción conservadora puede proteger el presente y costar autoridad; una respuesta audaz puede unir al grupo o profundizar una crisis.",
          "Esa ambigüedad es intencional. Dirigir es decidir con información incompleta y aceptar las consecuencias.",
        ],
      },
    ],
  },
  {
    slug: "como-crece-un-futbolista-del-ascenso",
    title: "Cómo crece un futbolista en el ascenso argentino",
    description: "Los desafíos de empezar en las categorías inferiores: continuidad, entrenamiento, ofertas y decisiones que moldean una carrera.",
    category: "Carrera de jugador",
    published: "2026-09-30",
    minutes: 6,
    sections: [
      {
        heading: "El punto de partida",
        paragraphs: [
          "Para la enorme mayoría de los futbolistas profesionales, la carrera no empieza en un estadio colmado. Comienza en canchas modestas, con tribunas chicas y condiciones a veces difíciles. En esos escenarios se forja el carácter y se descubre si el talento puede sostenerse semana tras semana.",
          "El ascenso es también una escuela de fútbol puro. Hay menos recursos tecnológicos y más intensidad física, lo que obliga a desarrollar versatilidad y resistencia.",
        ],
      },
      {
        heading: "Continuidad antes que vitrina",
        paragraphs: [
          "Un error frecuente es pensar que el mejor paso siempre es subir lo más rápido posible. En la práctica, jugar con regularidad suele ser más valioso que sentarse en el banco de una categoría superior. La continuidad permite ganar confianza, corregir errores y construir un historial de rendimiento que respalde futuras ofertas.",
          "Los entrenadores confían en quienes muestran constancia. Un futbolista que alterna actuaciones brillantes con ausencias prolongadas genera dudas, mientras que quien sostiene un nivel decente durante toda la temporada gana credibilidad.",
        ],
      },
      {
        heading: "Entrenamiento y cuidado físico",
        paragraphs: [
          "Cada posición requiere un perfil de trabajo distinto. Un delantero puede dedicar más tiempo a la definición, un mediocampista a la técnica y la circulación, y un defensor a la fortaleza física. Sin embargo, ninguna cualidad sirve si el cuerpo no responde. Las lesiones y la fatiga acumulada interrumpen carreras prometedoras.",
        ],
      },
      {
        heading: "Decidir cuándo cambiar de club",
        paragraphs: [
          "Llega un momento en que aparece una oferta de una categoría superior. Aceptarla abre puertas pero también implica competir con jugadores de mayor nivel. Renovar en el club actual brinda seguridad y minutos. No existe una respuesta universal: depende de la edad, de la valoración, del momento deportivo y de las expectativas de cada futbolista.",
          "La carrera de jugador de Modo Carrera DT recrea ese dilema. Comenzás en Primera D y avanzás hacia Primera, equilibrando entrenamiento, rendimiento reciente, decisiones narrativas y ofertas. Una gran temporada puede acelerar el camino, pero la paciencia también puede ser una estrategia ganadora.",
        ],
        list: [
          "Priorizá minutos antes que saltos demasiado grandes.",
          "La valoración media pesa más que un partido aislado.",
          "Cuidá el estado físico para sostener la titularidad.",
        ],
      },
    ],
  },
  {
    slug: "cultura-del-futbol-de-ascenso",
    title: "Folclore del ascenso: viajes, canchas de barrio y pasión de domingo",
    description: "Un recorrido por la cultura que rodea al fútbol de las categorías inferiores argentinas y por qué enamora a tantos hinchas.",
    category: "Cultura",
    published: "2026-10-01",
    minutes: 5,
    sections: [
      {
        heading: "Un fútbol cercano",
        paragraphs: [
          "En el ascenso, la distancia entre hinchada y jugadores es mínima. Es posible encontrarse con el lateral en el almacén del barrio o con el presidente del club ayudando a pintar una tribuna. Esa cercanía crea un vínculo de pertenencia que muchas veces falta en estadios gigantes.",
          "Los clubes del ascenso suelen ser mucho más que un equipo. Funcionan como centros sociales: ofrecen escuelas deportivas, actividades para chicos, espacios para jubilados y eventos comunitarios. El resultado del domingo importa, pero la vida institucional continúa durante toda la semana.",
        ],
      },
      {
        heading: "Viajes, micros y sacrificio",
        paragraphs: [
          "Ser visitante en el ascenso es una experiencia casi épica. Las delegaciones viajan en micro durante horas, los hinchas se organizan con rifas y colectas, y los presupuestos obligan a optimizar cada gasto. Esos desplazamientos forman parte del imaginario del fútbol argentino y cimentan una identidad de resistencia.",
        ],
      },
      {
        heading: "Canchas con personalidad",
        paragraphs: [
          "Cada estadio tiene sus rarezas: un campo irregular, una tribuna que casi toca la línea de cal, un viento particular o una pendiente que complica el juego. Los equipos locales aprenden a convertir esas características en ventajas. Los rivales deben adaptarse rápido para no sufrir.",
        ],
      },
      {
        heading: "Mística, cábalas y anécdotas",
        paragraphs: [
          "El folclore se completa con supersticiones, cantitos, rivalidades barriales y historias que se transmiten de generación en generación. Esa mezcla de humor, tradición y emoción es lo que Modo Carrera DT intenta capturar en sus eventos narrativos: situaciones de vestuario, promesas de dirigentes, polémicas con la prensa y desafíos propios de cada categoría.",
          "No se trata de imitar un partido real, sino de transmitir el espíritu de un fútbol donde todavía se vive cada punto como si fuera el último.",
        ],
      },
    ],
  },
];

export function getArticle(slug: string) {
  return ARTICLES.find((article) => article.slug === slug);
}
