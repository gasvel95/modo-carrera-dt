export type DivisionProfile = {
  summary: string;
  challenge: string;
  game: string;
};

export const DIVISION_PROFILES: Record<string, DivisionProfile> = {
  "Liga Profesional": {
    summary: "La Liga Profesional es la máxima categoría del fútbol argentino. Reúne a los clubes con mayor exposición mediática, las hinchadas más numerosas y los presupuestos más altos del país.",
    challenge: "En esta categoría la paciencia es corta. Los resultados se analizan semana a semana, la prensa amplifica cada derrota y la dirigencia suele reaccionar rápido ante una mala racha. A cambio, es la única categoría que ofrece plazas internacionales y la visibilidad más grande para jugadores y entrenadores.",
    game: "En Modo Carrera DT los clubes de esta división exigen objetivos ambiciosos, como pelear arriba o clasificar a una copa continental, y trasladan mucha presión al entrenador y a los futbolistas.",
  },
  "Primera Nacional": {
    summary: "La Primera Nacional es la segunda categoría del sistema. Combina clubes históricos que buscan regresar a la elite con instituciones que crecieron desde el ascenso y sueñan con dar el salto.",
    challenge: "Es una categoría extensa, de gran exigencia física y logística. Los viajes son largos, la competencia es pareja y el premio del ascenso, económico y deportivo, hace que cada punto pese durante toda la temporada.",
    game: "En el juego, los equipos de esta división suelen tener como meta el ascenso o el Reducido, y la presión de hinchas y dirigentes crece a medida que se acercan las últimas fechas.",
  },
  "Primera B": {
    summary: "La Primera B reúne a clubes afiliados directamente a la AFA, mayormente del Gran Buenos Aires y la Capital Federal. Es una categoría de barrio, con estadios cercanos entre sí y clásicos de alta intensidad.",
    challenge: "Los presupuestos son acotados y los planteles mezclan jugadores con recorrido y juveniles. La regularidad y el aprovechamiento de las pelotas paradas suelen definir una campaña, y un buen torneo puede abrir las puertas de la Primera Nacional.",
    game: "En Modo Carrera DT, los clubes de Primera B proponen objetivos de equilibrio entre ascender y consolidarse. Una racha corta puede cambiar la temporada de un equipo.",
  },
  "Federal A": {
    summary: "El Federal A es la categoría que reúne a los clubes del interior con afiliación indirecta, organizada por el Consejo Federal. Representa a provincias y ciudades de todo el país, desde la Patagonia hasta el norte.",
    challenge: "Las distancias son su rasgo distintivo. Viajar muchas horas en micro condiciona el descanso, los costos y el rendimiento. Los equipos locales suelen hacerse fuertes en su cancha, donde el clima, el público y la altura aportan ventajas.",
    game: "En el juego, esa realidad aparece como una categoría de rivales del interior donde los viajes y la localía pesan en la historia de la temporada.",
  },
  "Primera C": {
    summary: "La Primera C es la cuarta categoría para los clubes afiliados directamente a la AFA. Es una competencia de barrio, con instituciones que funcionan como centros sociales y deportivos de su comunidad.",
    challenge: "Los recursos son limitados y cada club depende en gran medida de socios, voluntarios y pequeños auspiciantes. Por eso conservar un buen plantel y sostener la categoría ya constituye un logro importante.",
    game: "Los clubes de Primera C son un punto de partida habitual para la carrera de DT y un escalón clave para la carrera de jugador, con objetivos como evitar el descenso o entrar al Reducido.",
  },
  "Primera D": {
    summary: "La Primera D es la base de la pirámide del fútbol argentino para clubes afiliados directamente. Allí compiten instituciones pequeñas, con canchas modestas y una vida social muy ligada al barrio.",
    challenge: "Es una categoría de enorme sacrificio. Muchos futbolistas combinan el fútbol con otros trabajos y los clubes se sostienen con esfuerzo comunitario. Sin embargo, de allí salieron jugadores que luego construyeron carreras en categorías superiores.",
    game: "En la carrera de jugador de Modo Carrera DT todos los futbolistas comienzan en esta división y avanzan escalón por escalón hasta llegar a Primera.",
  },
};
