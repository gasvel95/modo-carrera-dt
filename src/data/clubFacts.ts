import { CLUB_FACTS_B } from "./clubFactsB.ts";
import { CLUB_FACTS_C } from "./clubFactsC.ts";
// Datos verificados contra fuentes públicas (Wikipedia en español e inglés y notas periodísticas) en octubre de 2026.
// Se evitan a propósito los datos que cambian cada temporada, como la categoría actual o los planteles.
export type ClubFacts = {
  founded?: string;
  place: string;
  nicknames: string[];
  colors?: string;
  stadium?: string;
  rival?: string;
  highlights: string[];
  extended: string[];
};

const CLUB_FACTS_A: Record<string, ClubFacts> = {
  almirante: {
    founded: "1 de julio de 1912",
    place: "San Justo, partido de La Matanza (Buenos Aires)",
    nicknames: ["Mirasol", "Aurinegro", "Fragata", "Gigante del Oeste"],
    colors: "Amarillo y negro",
    stadium: "Fragata Presidente Sarmiento (inaugurado el 14 de junio de 1969)",
    rival: "Deportivo Morón, en el Clásico del Oeste",
    highlights: [
      "Es el club más antiguo del partido de La Matanza con nombre, colores y localización definidos desde su fundación.",
      "Ganó la Primera B Metropolitana en la temporada 2006/07.",
      "Acumuló varios subcampeonatos en la segunda división antes de consolidarse en la Primera Nacional.",
    ],
    extended: [
      "Almirante Brown fue fundado el 1 de julio de 1912 en San Justo por Juan Sábas Nicolini y Alejandro Guzzoni. El nombre homenajea al almirante Guillermo Brown, héroe naval de la Independencia, en el año en que se cumplía el centenario de su llegada al país.",
      "Sus colores, el amarillo y el negro, llegaron de manera casi fortuita: se dice que provienen de unas camisetas del Central Uruguay Railway Cricket Club, que a su vez tomó esa combinación de la locomotora inglesa Rocket. De allí viene también el apodo Mirasol.",
      "El Clásico del Oeste lo enfrenta con Deportivo Morón, un duelo entre dos de las instituciones más importantes del oeste del Gran Buenos Aires. En Modo Carrera DT, el club representa la categoría con un objetivo de ascenso que mantiene viva la presión de la dirigencia.",
    ],
  },
  san_martin_t: {
    founded: "2 de noviembre de 1909",
    place: "San Miguel de Tucumán",
    nicknames: ["El Santo", "El Ciruja"],
    colors: "Rojo y blanco",
    stadium: "La Ciudadela (inaugurado el 24 de marzo de 1932)",
    rival: "Atlético Tucumán, en el Clásico Tucumano",
    highlights: [
      "Campeón de la Copa de la República en 1944.",
      "Campeón de la B Nacional en 2007/08, lo que le permitió volver a Primera.",
      "Disputó varias temporadas en Primera División, entre ellas una larga etapa entre 1968 y 1979.",
    ],
    extended: [
      "San Martín nació el 2 de noviembre de 1909, cuando catorce jóvenes del sur de la capital tucumana fundaron el club. Con el tiempo se convirtió en una de las instituciones más populares del norte argentino.",
      "La Ciudadela, su estadio, fue inaugurada en 1932 y es el escenario del Clásico Tucumano ante Atlético Tucumán, uno de los duelos provinciales más intensos del país. La rivalidad divide a la ciudad y a toda la provincia.",
      "Su historia combina épocas de gloria, como la Copa de la República de 1944 y el título de la B Nacional 2007/08, con ciclos de reconstrucción. En el juego, representa a un club de enorme pasión popular donde la exigencia de la hinchada es parte central de cada temporada.",
    ],
  },
  gimnasia_m: {
    founded: "30 de agosto de 1908",
    place: "Mendoza",
    nicknames: ["Lobo mendocino", "Lobo del Parque", "Mensana", "Blanquinegro"],
    colors: "Blanco y negro",
    stadium: "Víctor Antonio Legrotaglie (inaugurado el 25 de marzo de 1934)",
    rival: "Independiente Rivadavia, en el Clásico Mendocino",
    highlights: [
      "Ganó veinte títulos de la Liga Mendocina, el último en 2001.",
      "Participó nueve veces del Campeonato Nacional entre 1970 y 1985.",
      "Su estadio, inaugurado en 1934, fue presentado como el primero de Mendoza.",
    ],
    extended: [
      "Gimnasia y Esgrima de Mendoza fue fundado el 30 de agosto de 1908 y se identifica con el blanco y el negro. Es considerado uno de los cuatro grandes del fútbol mendocino y tiene una amplia vida social más allá del fútbol.",
      "Su estadio, el Víctor Antonio Legrotaglie, fue inaugurado el 25 de marzo de 1934. Allí se juega el Clásico Mendocino contra Independiente Rivadavia, cuyo primer enfrentamiento se remonta a 1913.",
      "En los años setenta se lo consideraba uno de los mejores equipos del interior y participó repetidas veces del Campeonato Nacional. En Modo Carrera DT, el club ofrece una experiencia de tradición y presión regional.",
    ],
  },
  madryn: {
    founded: "7 de mayo de 1924",
    place: "Puerto Madryn, Chubut",
    nicknames: ["Aurinegro", "Depo"],
    colors: "Amarillo y negro (camiseta a rayas verticales)",
    stadium: "Abel Sastre (inaugurado el 19 de noviembre de 2006)",
    rival: "Guillermo Brown, el clásico de Puerto Madryn",
    highlights: [
      "Ganó cinco ligas consecutivas del Valle entre 1959 y 1963.",
      "Campeón del Torneo Argentino B 2013/14 y del Torneo Federal A 2021.",
      "Logró su primer ascenso a la Primera Nacional en 2021.",
    ],
    extended: [
      "El Club Social y Deportivo Madryn fue fundado el 7 de mayo de 1924 y es una de las instituciones más importantes de la costa patagónica. Su identidad aurinegra se asocia a la ciudad de Puerto Madryn y a su puerto.",
      "Durante décadas compitió en torneos regionales, con una racha de cinco campeonatos consecutivos de la liga local entre 1959 y 1963. En 2013/14 se consagró en el Torneo Argentino B y en 2021 ganó el Federal A, lo que le permitió ascender por primera vez a la Primera Nacional.",
      "Su rival histórico es Guillermo Brown, también de Puerto Madryn. En el juego, Madryn representa el crecimiento de un club patagónico que pasó del fútbol regional a competir contra instituciones de todo el país.",
    ],
  },
  temperley: {
    founded: "1 de noviembre de 1912",
    place: "Turdera, partido de Lomas de Zamora (Buenos Aires)",
    nicknames: ["Gasolero", "El Cele"],
    colors: "Celeste y blanco",
    stadium: "Alfredo Martín Beranger (inaugurado el 13 de abril de 1924)",
    rival: "Talleres de Remedios de Escalada",
    highlights: [
      "Su cierre judicial en 1991 fue seguido por una reapertura el 21 de noviembre de ese mismo año.",
      "Ascendió a Primera División en 2014 tras años en el ascenso.",
      "Mantiene un clásico zonal con Talleres de Remedios de Escalada.",
    ],
    extended: [
      "Temperley fue fundado el 1 de noviembre de 1912 en Turdera, partido de Lomas de Zamora, y su estadio, el Alfredo Martín Beranger, fue inaugurado en 1924. Allí se vivieron noches de ascensos y de resistencia.",
      "En 1991 el club atravesó una quiebra y debió cerrar, pero reabrió pocos meses después gracias al compromiso de socios y vecinos. Esa historia de resistencia es parte esencial de su identidad.",
      "Después de décadas de ascenso, consiguió regresar a Primera en 2014. El clásico con Talleres de Remedios de Escalada es el duelo más importante de su zona. En Modo Carrera DT es un club de reputación y presupuestos moderados, que busca consolidarse en la categoría.",
    ],
  },
  moron: {
    founded: "20 de junio de 1947",
    place: "Morón (Buenos Aires)",
    nicknames: ["Gallo", "Gallito"],
    colors: "Blanco y rojo",
    stadium: "Nuevo Francisco Urbano (inaugurado el 26 de julio de 2013)",
    rival: "Almirante Brown, en el Clásico del Oeste (primer partido: 20 de julio de 1957)",
    highlights: [
      "Ganó la Primera B Metropolitana en 1989/90 y en 2016/17.",
      "Fue semifinalista de la Copa Argentina 2016/17, donde cayó ante River Plate.",
      "Ascendió a la Primera B Nacional en 2017.",
    ],
    extended: [
      "Deportivo Morón nació el 20 de junio de 1947 y se convirtió en el club más representativo del partido de Morón. Su camiseta blanca y roja y su apodo, el Gallo, son parte del paisaje futbolero del oeste del Gran Buenos Aires.",
      "En 2016/17 vivió una temporada histórica: ganó la Primera B Metropolitana, ascendió a la B Nacional y llegó a las semifinales de la Copa Argentina, donde fue eliminado por River Plate.",
      "Su estadio actual, el Nuevo Francisco Urbano, fue inaugurado en 2013. El Clásico del Oeste con Almirante Brown, que se jugó por primera vez en 1957, es el partido más esperado del año para la hinchada.",
    ],
  },
  estudiantes_rc: {
    founded: "21 de septiembre de 1912",
    place: "Río Cuarto, Córdoba",
    nicknames: ["Celeste", "León", "Imperio del Sur"],
    colors: "Celeste",
    stadium: "Ciudad de Río Cuarto Antonio Candini (inaugurado el 12 de octubre de 1938)",
    highlights: [
      "Fue fundado por alumnos del Colegio Nacional N.º 1 de Río Cuarto.",
      "Su estadio lleva el nombre de Antonio Candini, histórico dirigente que presidió el club entre 1974 y 1978.",
      "Es uno de los clubes que llevó el fútbol del sur de Córdoba a las competencias nacionales.",
    ],
    extended: [
      "La Asociación Atlética Estudiantes nació el 21 de septiembre de 1912, cuando un grupo de alumnos del Colegio Nacional N.º 1 de Río Cuarto decidió fundar el club. Su nombre y su identidad celeste vienen de ese origen estudiantil.",
      "El estadio, hoy llamado Ciudad de Río Cuarto Antonio Candini en homenaje a un histórico dirigente fallecido en 1992, fue inaugurado el 12 de octubre de 1938 con una victoria 8 a 1 ante Argentino de Marcos Juárez.",
      "Sus apodos, Celeste, León e Imperio del Sur, reflejan la importancia del club en la región. En Modo Carrera DT representa a una institución del interior con enorme apoyo local y una hinchada acostumbrada a los viajes.",
    ],
  },
  gimnasia_j: {
    founded: "18 de marzo de 1931",
    place: "San Salvador de Jujuy",
    nicknames: ["Lobo jujeño", "Albiceleste"],
    colors: "Celeste y blanco",
    stadium: "23 de Agosto (inaugurado el 18 de marzo de 1973)",
    rival: "Altos Hornos Zapla, en el clásico jujeño",
    highlights: [
      "Fue el primer equipo jujeño en disputar la Primera División, en 1970.",
      "Terminó cuarto en el Torneo Nacional de 1975, con el equipo conocido como La Murguita.",
      "Ganó numerosos campeonatos de la Liga Jujeña de Fútbol.",
    ],
    extended: [
      "Gimnasia y Esgrima de Jujuy fue fundado el 18 de marzo de 1931 y se identifica con los colores celeste y blanco. Es una de las instituciones más importantes del noroeste argentino.",
      "En 1970 se convirtió en el primer equipo de la provincia en jugar en Primera División. Su mejor campaña llegó en el Nacional de 1975, con un cuarto puesto que todavía se recuerda como La Murguita.",
      "Su estadio, el 23 de Agosto, fue inaugurado en 1973 y es escenario del clásico jujeño ante Altos Hornos Zapla. En el juego, Gimnasia de Jujuy simboliza el esfuerzo de un club del norte que juega con la altura y la distancia como parte de su historia.",
    ],
  },
  mitre: {
    founded: "2 de abril de 1907",
    place: "Barrio 8 de Abril, Santiago del Estero",
    nicknames: ["Aurinegro", "Tigre de la Roca", "Decano santiagueño"],
    colors: "Amarillo y negro",
    stadium: "Doctores José y Antonio Castiglione (inaugurado el 10 de junio de 1919)",
    rival: "Güemes y Central Córdoba, los otros clubes grandes de Santiago del Estero",
    highlights: [
      "Aportó jugadores a la selección que ganó la Copa Presidente de la Nación en 1928.",
      "El 25 de julio de 1984 derrotó 6 a 3 a River Plate, con tres goles de Julio Barreto.",
      "Ascendió a la B Nacional tras el Federal A 2016/17.",
    ],
    extended: [
      "Mitre es conocido como el decano del fútbol santiagueño por su antigüedad. Fue fundado el 2 de abril de 1907 en el barrio 8 de Abril de la capital provincial y se identifica con los colores amarillo y negro.",
      "Su estadio, el Doctores José y Antonio Castiglione, se inauguró en 1919. Una de las noches más recordadas de su historia ocurrió el 25 de julio de 1984, cuando venció 6 a 3 a River Plate como local, con triplete de Julio Barreto.",
      "Tras el Federal A 2016/17 logró ascender a la B Nacional. En Modo Carrera DT es un club que combina historia, identidad regional y una hinchada que respalda al equipo en cada temporada.",
    ],
  },
  defensores: {
    founded: "25 de mayo de 1906",
    place: "Núñez, Ciudad de Buenos Aires",
    nicknames: ["El Dragón", "La Máquina del Bajo"],
    colors: "Rojo y negro",
    stadium: "Juan Pasquale (inaugurado el 25 de mayo de 1910)",
    rival: "Excursionistas, en el Clásico del Bajo",
    highlights: [
      "Ascendió a la Primera División en 1914, durante la era amateur.",
      "Ascendió a la B Nacional en 2000/01 y volvió a hacerlo en 2017/18.",
      "Formó a René Houseman, campeón del mundo con la selección argentina en 1978.",
    ],
    extended: [
      "Defensores de Belgrano fue fundado el 25 de mayo de 1906 en Núñez y su estadio, el Juan Pasquale, abrió sus puertas en 1910. Es uno de los clubes más antiguos de la Ciudad que sigue compitiendo en el ascenso.",
      "Del club surgió René Houseman, campeón del mundo en 1978. Su figura se menciona con orgullo y forma parte de la identidad del Dragón.",
      "El Clásico del Bajo con Excursionistas es el partido más importante para su gente. En el juego, el club representa a una institución de barrio con una historia que puede competir con instituciones mucho más grandes.",
    ],
  },
};

export const CLUB_FACTS: Record<string, ClubFacts> = { ...CLUB_FACTS_A, ...CLUB_FACTS_B, ...CLUB_FACTS_C };
