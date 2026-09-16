import type { Club } from "../domain/game.ts";
import type { PlayerClub } from "../domain/playerCareer.ts";

const STORIES: Record<string, string> = {
  river: "Fundado en 1901 en el barrio de La Boca, River Plate construyó una de las historias más laureadas del fútbol argentino. Su identidad combina grandes equipos, formación de futbolistas y una rivalidad central con Boca Juniors.",
  boca: "Boca Juniors nació en 1905 en La Boca y convirtió a la Bombonera y sus colores azul y oro en símbolos reconocidos mundialmente. Su historia está marcada por títulos locales, conquistas internacionales y una enorme cultura popular.",
  racing: "Racing Club, fundado en 1903, fue el primer gran campeón de la era amateur y ganó siete ligas consecutivas. La Academia también hizo historia internacional al conquistar la Libertadores y la Intercontinental de 1967.",
  independiente: "Independiente nació en 1905 y forjó su identidad copera con una colección extraordinaria de Libertadores. El estadio de Avellaneda y su tradición ofensiva acompañan la historia del llamado Rey de Copas.",
  san_lorenzo: "San Lorenzo fue fundado en 1908 en Almagro y quedó unido para siempre a Boedo. Sus distintas generaciones, el Viejo Gasómetro y el regreso al barrio forman parte central de su identidad.",
  velez: "Vélez Sarsfield fue fundado en 1910 y creció alrededor de Liniers. Su consolidación deportiva tuvo un punto máximo en 1994, cuando ganó la Copa Libertadores y la Copa Intercontinental.",
  argentinos: "Argentinos Juniors nació en 1904 y es reconocido por una cantera que formó figuras decisivas del fútbol argentino. En 1985 alcanzó su mayor conquista al ganar la Copa Libertadores.",
  estudiantes: "Estudiantes de La Plata fue fundado en 1905 y desarrolló una identidad competitiva de enorme influencia. Sus ciclos campeones incluyen cuatro Copas Libertadores y una Copa Intercontinental.",
  gimnasia: "Gimnasia y Esgrima La Plata, fundado en 1887, es una de las instituciones deportivas más antiguas del país. Su historia futbolística está ligada al Bosque, a una hinchada popular y al clásico platense.",
  central: "Rosario Central nació en 1889 alrededor de los trabajadores ferroviarios. Arroyito, el clásico rosarino y sus títulos nacionales e internacionales sostienen una identidad profundamente popular.",
  newells: "Newell's Old Boys fue fundado en 1903 y desarrolló una reconocida escuela de formación. El Parque Independencia, el clásico rosarino y sus equipos campeones son pilares de su historia.",
  talleres: "Talleres fue fundado en Córdoba en 1913 y creció desde sus raíces ferroviarias hasta convertirse en uno de los grandes representantes del interior. Su historia combina protagonismo nacional y expansión institucional.",
  belgrano: "Belgrano nació en Córdoba en 1905 y tomó su nombre del prócer Manuel Belgrano. El Gigante de Alberdi y una multitudinaria pertenencia barrial acompañan su largo recorrido por el fútbol nacional.",
  lanus: "Lanús fue fundado en 1915 y construyó su identidad en el sur bonaerense. El crecimiento de sus inferiores y una gestión sostenida desembocaron en títulos nacionales e internacionales.",
  defensa: "Defensa y Justicia nació en Florencio Varela en 1935. Tras décadas en el ascenso, consolidó un crecimiento excepcional que incluyó el debut en Primera y conquistas sudamericanas.",
  banfield: "Banfield fue fundado en 1896 y representa a una de las instituciones históricas del sur del Gran Buenos Aires. Su cantera, el clásico con Lanús y el título de 2009 marcan su recorrido.",
  godoy: "Godoy Cruz nació en Mendoza en 1921 y se convirtió en un representante habitual del interior en la máxima categoría. Su crecimiento lo llevó también a competir internacionalmente.",
  platense: "Platense fue fundado en 1905 y desarrolló una historia de fuerte arraigo en Saavedra y Vicente López. El Calamar atravesó largos ciclos en Primera y regresos celebrados desde el ascenso.",
  atlanta: "Atlanta nació en 1904 y quedó identificado con Villa Crespo. Su rica vida social, el clásico con Chacarita y una extensa trayectoria entre Primera y el ascenso definen al Bohemio.",
  chacarita: "Chacarita Juniors fue fundado en 1906 y está ligado a Chacarita y San Martín. El Funebrero alcanzó la cumbre con el campeonato Metropolitano de 1969.",
  quilmes: "Quilmes es una institución centenaria del sur bonaerense, con raíces que se remontan al siglo XIX. El Cervecero fue campeón de Primera y mantiene una de las identidades más tradicionales del ascenso.",
  ferro: "Ferro Carril Oeste nació en 1904 junto al ferrocarril y el barrio de Caballito. Vivió su época dorada en los años ochenta, con dos campeonatos nacionales y una institución polideportiva de referencia.",
  all_boys: "All Boys fue fundado en 1913 y representa a Floresta. Su historia alterna campañas en el ascenso con recordados regresos a Primera y una fuerte identidad de barrio.",
  chicago: "Nueva Chicago nació en 1911 y está profundamente ligado a Mataderos. El Torito construyó una historia popular, marcada por ascensos, permanencias en Primera y el clásico con All Boys.",
  colon: "Colón fue fundado en Santa Fe en 1905 y convirtió al Cementerio de los Elefantes en un escenario emblemático. En 2021 celebró el primer título de liga de su historia.",
  patronato: "Patronato nació en Paraná en 1914. Su recorrido desde las ligas entrerrianas hasta Primera tuvo un capítulo histórico con la conquista de la Copa Argentina 2022.",
  olimpo: "Olimpo fue fundado en Bahía Blanca en 1910. Su tradición regional y varias campañas en Primera lo convirtieron en uno de los representantes más reconocibles del sur bonaerense.",
  douglas: "Douglas Haig nació en Pergamino en 1918 y tomó el nombre de un mariscal escocés. El Fogonero desarrolló una fuerte identidad regional y protagonizó etapas recordadas en los torneos nacionales.",
  ituzaingo: "Ituzaingó fue fundado en 1912 y representa al oeste del Gran Buenos Aires. El Verde construyó su historia entre las categorías de ascenso, con una identidad barrial y clásicos regionales.",
  midland: "Ferrocarril Midland nació en 1914 en Libertad, alrededor del ferrocarril. El Funebrero hizo del ascenso y de su rivalidad con Ituzaingó partes esenciales de su identidad.",
};

export function clubHistory(club: Club | PlayerClub) {
  return STORIES[club.id] ?? `${club.name} es una institución arraigada en ${club.region}. Su recorrido se construyó entre competencias regionales y categorías del fútbol argentino, con generaciones de socios, jugadores e hinchas que sostuvieron al club hasta su presente en ${club.division}.`;
}
