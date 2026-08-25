import type { PlayerCareerEvent, PlayerEventEffects, PlayerEventOption } from "../domain/playerCareer.ts";

const outcome = (title: string, description: string, tone: "positive" | "negative" | "neutral", effects: PlayerEventEffects) => ({ title, description, tone, effects });
const option = (id: string, text: string, approach: PlayerEventOption["approach"], successChance: number, good: ReturnType<typeof outcome>, bad: ReturnType<typeof outcome>): PlayerEventOption => ({ id, text, approach, successChance, outcomes: { success: good, failure: bad } });

export const PLAYER_EVENTS: PlayerCareerEvent[] = [
  {
    id: "radio_barrial", kicker: "MICRÓFONO CALIENTE", title: "La radio partidaria te buscó después de una derrota", description: "El conductor más escuchado del barrio quiere una nota en vivo. Dice que la gente necesita escuchar a alguien que dé la cara, pero sabés que una frase mal puesta puede recorrer todas las tribunas.",
    options: [
      option("dar_la_cara", "Ir al estudio y bancar las preguntas", "bold", .58, outcome("La gente valoró que dieras la cara", "Hablaste con firmeza, sin vender humo. El recorte se compartió y el vestuario sintió que defendiste al grupo.", "positive", { reputation: 7, coachTrust: 4, formBoost: .12 }), outcome("Te hicieron pisar el palito", "Una respuesta sacada de contexto encendió la semana. El técnico sintió que hablaste de más.", "negative", { reputation: -3, coachTrust: -8, formBoost: -.1 })),
      option("mensaje_corto", "Mandar un audio breve y medido", "calm", .72, outcome("El mensaje bajó la espuma", "Fuiste directo, respaldaste al equipo y evitaste alimentar la polémica.", "positive", { reputation: 3, coachTrust: 3 }), outcome("El silencio sonó a cassette", "El audio pareció armado y la gente lo tomó como una respuesta vacía.", "neutral", { reputation: -2 })),
      option("no_hablar", "No hablar y concentrarte en entrenar", "safe", .64, outcome("La respuesta estuvo en la cancha", "Tu semana silenciosa terminó con un entrenamiento que llamó la atención del cuerpo técnico.", "positive", { coachTrust: 6, formBoost: .15 }), outcome("El silencio agrandó el ruido", "Otros hablaron por vos y la versión que circuló no te favoreció.", "negative", { reputation: -4, coachTrust: -2 })),
    ],
  },
  {
    id: "micro_roto", kicker: "VIAJE DE ASCENSO", title: "El micro quedó varado en plena ruta", description: "Faltan horas para jugar y el colectivo no arranca. Hay termos, bolsos en la banquina y un dirigente llamando a todo el mundo. El plantel empieza a ponerse nervioso.",
    options: [
      option("armar_mate", "Armar una ronda de mate y calmar al grupo", "calm", .76, outcome("El viaje se convirtió en una anécdota", "La espera unió al plantel y llegaron al estadio con otra energía.", "positive", { coachTrust: 5, fitness: 3, formBoost: .12 }), outcome("La demora pesó en las piernas", "El buen clima no alcanzó para compensar un viaje agotador.", "neutral", { fitness: -8, formBoost: -.05 })),
      option("remis", "Pagar remises y llegar como sea", "bold", .48, outcome("Llegaste antes que todos", "Tu decisión sorprendió al técnico y pudiste completar la entrada en calor.", "positive", { coachTrust: 8, fitness: 2 }), outcome("El plan fue un desorden", "Se perdieron bolsos y llegaste separado del grupo. En el vestuario no cayó bien.", "negative", { coachTrust: -9, reputation: -2 })),
      option("esperar", "Quedarte con el plantel y seguir el plan del club", "safe", .68, outcome("La delegación llegó junta", "La paciencia evitó más caos y el técnico valoró tu compromiso colectivo.", "positive", { coachTrust: 5 }), outcome("No hubo tiempo para entrar en calor", "Llegaron sobre la hora y el cuerpo nunca terminó de activarse.", "negative", { fitness: -10, formBoost: -.1 })),
    ],
  },
  {
    id: "cancha_barro", kicker: "FÚTBOL DE BARRO", title: "La cancha amaneció convertida en un potrero", description: "Llovió toda la noche. La pelota no corre y cada paso levanta agua. El preparador físico ofrece alternativas, pero el técnico todavía no decidió si te va a cuidar.",
    options: [
      option("botines_largos", "Pedir botines largos y jugar igual", "bold", .57, outcome("Te hiciste dueño del barro", "Ganaste cada pelota dividida y tu entrega se escuchó desde el alambrado.", "positive", { reputation: 6, coachTrust: 6, formBoost: .18 }), outcome("El barro te pasó factura", "Terminaste cargado y sin poder imponer tu juego.", "negative", { fitness: -15, formBoost: -.12 })),
      option("juego_simple", "Jugar simple y evitar riesgos", "safe", .75, outcome("Entendiste el partido", "No brillaste, pero casi nunca te equivocaste. El técnico tomó nota.", "positive", { coachTrust: 5, formBoost: .07 }), outcome("Quedaste demasiado al margen", "La prudencia se pareció a falta de carácter.", "neutral", { coachTrust: -3 })),
      option("pedir_banco", "Avisar que no estás cómodo y aceptar el banco", "calm", .62, outcome("La honestidad evitó una lesión", "El cuerpo médico respaldó tu decisión y recuperaste el físico.", "positive", { fitness: 10, coachTrust: 2 }), outcome("El técnico esperaba otra actitud", "La decisión quedó marcada como una oportunidad que no quisiste tomar.", "negative", { coachTrust: -8, reputation: -2 })),
    ],
  },
  {
    id: "cabala_tunel", kicker: "CÁBALA DE VESTUARIO", title: "El referente cambió la salida al túnel", description: "Desde que el equipo ganó dos partidos, nadie puede pisar una baldosa rota camino a la cancha. Hoy el árbitro apura y el ritual está demorando a todos.",
    options: [
      option("seguir_cabala", "Respetar la cábala hasta el final", "safe", .67, outcome("La cábala siguió viva", "El vestuario entró convencido y vos sumaste puntos con los referentes.", "positive", { coachTrust: 4, formBoost: .15 }), outcome("El ritual los sacó del partido", "La demora generó una advertencia y el técnico explotó.", "negative", { coachTrust: -7, formBoost: -.06 })),
      option("romper_cabala", "Pisar la baldosa y cortar la demora", "bold", .46, outcome("La personalidad cayó bien", "Jugaste un partidazo y la historia terminó en carcajadas.", "positive", { reputation: 7, formBoost: .2 }), outcome("Quedaste señalado", "El equipo arrancó mal y todas las miradas fueron hacia vos.", "negative", { reputation: -5, coachTrust: -5, formBoost: -.15 })),
      option("negociar", "Convencerlos de hacer el ritual más corto", "calm", .73, outcome("Hubo cábala y puntualidad", "Encontraste una salida que dejó conformes al árbitro y al vestuario.", "positive", { coachTrust: 6, reputation: 3 }), outcome("Nadie quedó conforme", "El referente sintió que te burlaste y el técnico igual recibió la advertencia.", "neutral", { coachTrust: -3, reputation: -2 })),
    ],
  },
  {
    id: "penal_clasico", kicker: "PELOTA QUE QUEMA", title: "El goleador te ofrece el penal del clásico", description: "El partido está empatado y la tribuna ruge. El ejecutante habitual te alcanza la pelota: cree que necesitás este gol. El técnico mira desde el banco sin hacer señas.",
    options: [
      option("patear_fuerte", "Agarrar la pelota y romper el arco", "bold", .54, outcome("La clavaste contra un palo", "El alambrado tembló y tu nombre bajó de las cuatro tribunas.", "positive", { reputation: 10, coachTrust: 7, formBoost: .25 }), outcome("La mandaste a la popular", "El clásico terminó con tu remate dando vueltas por todas las redes.", "negative", { reputation: -8, coachTrust: -5, formBoost: -.2 })),
      option("colocarla", "Esperar al arquero y definir colocado", "calm", .63, outcome("Engañaste al arquero", "La pausa fue perfecta y el festejo quedó para siempre.", "positive", { reputation: 8, coachTrust: 6, formBoost: .2 }), outcome("El arquero te adivinó", "La espera fue demasiado larga y el remate salió anunciado.", "negative", { reputation: -6, formBoost: -.15 })),
      option("devolver_pelota", "Devolverle la pelota al goleador", "safe", .78, outcome("El goleador convirtió y te abrazó", "El gesto fortaleció al grupo y el técnico valoró que respetaras la jerarquía.", "positive", { coachTrust: 7, reputation: 3 }), outcome("El penal también se perdió", "La tribuna se preguntó por qué no asumiste la responsabilidad.", "neutral", { reputation: -3, formBoost: -.04 })),
    ],
  },
  {
    id: "botines_desaparecidos", kicker: "VESTUARIO VISITANTE", title: "Tus botines desaparecieron antes del partido", description: "Revisaste tres veces el bolso. No están. Un utilero jura que los había dejado en tu lugar y en el vestuario ya circulan teorías para todos los gustos.",
    options: [
      option("pedir_prestados", "Pedirle un par prestado a un compañero", "safe", .7, outcome("Los botines prestados trajeron suerte", "Te adaptaste rápido y la historia terminó como una nueva cábala.", "positive", { coachTrust: 5, formBoost: .14 }), outcome("Nunca te sentiste cómodo", "Las ampollas y el talle equivocado te condicionaron todo el partido.", "negative", { fitness: -10, formBoost: -.1 })),
      option("comprar", "Mandar a comprar unos al negocio del barrio", "bold", .5, outcome("El utilero volvió justo a tiempo", "Estrenaste botines y rendiste como si fueran los de toda la vida.", "positive", { reputation: 3, formBoost: .18 }), outcome("El negocio estaba cerrado", "Terminaste en el banco mientras todos discutían de quién fue la culpa.", "negative", { coachTrust: -8, reputation: -2 })),
      option("denunciar_broma", "Pedir que el técnico pare todo y aclare la situación", "calm", .59, outcome("Aparecieron detrás de una camilla", "El responsable pidió disculpas y el técnico valoró que no dejaras pasar la falta de respeto.", "positive", { coachTrust: 6, reputation: 2 }), outcome("El reclamo rompió el clima", "Los botines aparecieron, pero el vestuario quedó cargado antes de salir.", "negative", { coachTrust: -4, formBoost: -.08 })),
    ],
  },
  {
    id: "mural_hinchas", kicker: "AMOR DE BARRIO", title: "Apareció un mural con tu cara frente al club", description: "Un grupo de hinchas pintó tu festejo después de una buena racha. La dirigencia teme que sea demasiado pronto y el capitán te advierte que la idolatría también pesa.",
    options: [
      option("visitar_mural", "Ir a agradecer y sacarte una foto", "bold", .61, outcome("El barrio te adoptó", "La foto recorrió el club y tu vínculo con la gente creció.", "positive", { reputation: 9, formBoost: .1 }), outcome("La foto pareció agrandada", "El próximo entrenamiento llegó con cargadas y el técnico pidió bajar el perfil.", "negative", { coachTrust: -5, reputation: -2 })),
      option("agradecer_privado", "Agradecer en privado a quienes lo pintaron", "calm", .8, outcome("El gesto quedó entre ustedes", "Los hinchas valoraron la humildad y el vestuario no lo tomó como una provocación.", "positive", { reputation: 6, coachTrust: 3 }), outcome("El mensaje se filtró incompleto", "Algunos interpretaron que querías despegarte del homenaje.", "neutral", { reputation: -2 })),
      option("no_dar_importancia", "No alimentar el tema", "safe", .65, outcome("Seguiste enfocado", "La atención se apagó y tu nivel en la práctica habló por vos.", "positive", { coachTrust: 5, formBoost: .08 }), outcome("Los autores se sintieron ignorados", "En la tribuna apareció algún murmullo inesperado.", "negative", { reputation: -5 })),
    ],
  },
  {
    id: "mate_referente", kicker: "CÓDIGOS DEL PLANTEL", title: "El referente te dejó a cargo del mate", description: "Parece una pavada, pero no lo es. La ronda tiene un orden sagrado y todos miran cómo responde el pibe nuevo cuando le toca cebar antes de una práctica importante.",
    options: [
      option("seguir_orden", "Preguntar el orden y respetarlo", "safe", .82, outcome("Aprobaste el examen silencioso", "El vestuario te abrió una puerta y el entrenamiento fluyó.", "positive", { coachTrust: 4, formBoost: .08 }), outcome("El mate salió lavado", "Las cargadas fueron amistosas, aunque te costó concentrarte.", "neutral", { formBoost: -.03 })),
      option("personalizar", "Cebar a tu manera y cambiar la yerba", "bold", .43, outcome("Tu mezcla fue un éxito", "Hasta el capitán pidió repetir. Ganaste lugar con personalidad.", "positive", { reputation: 4, coachTrust: 5 }), outcome("Tocaste una tradición intocable", "Nadie dijo demasiado, que fue peor. La práctica se sintió helada.", "negative", { coachTrust: -6, formBoost: -.07 })),
      option("pasar_termo", "Decir que preferís concentrarte", "calm", .55, outcome("Respetaron tu rutina", "Tu franqueza cayó bien y el técnico vio una mentalidad profesional.", "positive", { coachTrust: 6 }), outcome("Pareció que no querías integrarte", "El grupo tomó distancia durante la semana.", "negative", { coachTrust: -5, reputation: -2 })),
    ],
  },
  {
    id: "dirigente_premio", kicker: "PROMESA DE DIRIGENTE", title: "Un dirigente prometió un premio si ganan el domingo", description: "La propuesta apareció sin papeles y a último momento. Algunos quieren aceptarla, otros creen que distrae. El capitán te pregunta qué postura llevar al grupo.",
    options: [
      option("pedir_escrito", "Pedir que la promesa quede por escrito", "calm", .69, outcome("El premio quedó claro", "La dirigencia formalizó el acuerdo y el plantel se enfocó.", "positive", { coachTrust: 5, reputation: 4, formBoost: .12 }), outcome("El dirigente se ofendió", "La negociación se cayó y te acusaron de desconfiado.", "negative", { reputation: -3, coachTrust: -3 })),
      option("aceptar_palabra", "Confiar en la palabra y jugar", "bold", .47, outcome("Cumplieron la promesa", "El vestuario celebró también tu confianza.", "positive", { reputation: 6, formBoost: .17 }), outcome("La promesa se evaporó", "Después del partido nadie atendió el teléfono y el grupo quedó caliente.", "negative", { coachTrust: -5, formBoost: -.13 })),
      option("rechazar", "Decir que el partido no necesita premios extra", "safe", .66, outcome("El mensaje fortaleció al grupo", "La postura cayó bien: jugaron por el club y no por una promesa.", "positive", { coachTrust: 6, reputation: 4 }), outcome("El vestuario te vio demasiado solemne", "Algunos compañeros sintieron que hablaste por todos sin consultar.", "neutral", { coachTrust: -4 })),
    ],
  },
  {
    id: "perro_entrenamiento", kicker: "VISITA INESPERADA", title: "Un perro se metió en la práctica y no quiere soltar la pelota", description: "El entrenamiento quedó frenado mientras el visitante corre entre conos y suplentes. Afuera ya hay celulares grabando y el técnico empieza a perder la paciencia.",
    options: [
      option("jugar_perro", "Jugar un minuto para que suelte la pelota", "bold", .74, outcome("El video se volvió querido", "Recuperaste la pelota, aflojaste al grupo y la gente celebró la escena.", "positive", { reputation: 6, fitness: 2 }), outcome("El perro te dejó pagando", "La escena fue graciosa para todos menos para el técnico.", "neutral", { coachTrust: -3 })),
      option("llamar_utilero", "Pedir ayuda al utilero y seguir elongando", "safe", .84, outcome("La práctica retomó rápido", "No perdiste el foco y el cuerpo técnico valoró tu profesionalismo.", "positive", { coachTrust: 5, fitness: 3 }), outcome("La demora enfrió la entrada en calor", "Cuando volvió la pelota, el grupo ya estaba disperso.", "neutral", { formBoost: -.04 })),
      option("subir_video", "Grabar la escena y subirla a redes", "bold", .45, outcome("El club ganó una mascota", "El video explotó y tu nombre quedó asociado a un momento simpático.", "positive", { reputation: 8 }), outcome("El técnico vio el video antes de terminar la práctica", "La charla posterior fue bastante menos divertida.", "negative", { coachTrust: -9, reputation: -2 })),
    ],
  },
];

