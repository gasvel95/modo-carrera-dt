import type { Effects, EventOption, GameEvent } from "../domain/game.ts";

const option = (id: string, text: string, approach: EventOption["approach"], positive: Effects, negative: Effects): EventOption => ({
  id, text, approach,
  outcomes: [
    { id: `${id}_works`, title: "La jugada sale bien", description: `La decisión de “${text}” encuentra una respuesta positiva dentro del club.`, baseProbability: .46, tone: "positive", effects: positive },
    { id: `${id}_mixed`, title: "Un equilibrio inestable", description: "El problema pierde temperatura, aunque deja una cuenta pendiente.", baseProbability: .30, tone: "neutral", effects: { pressure: -2, respect: 2 } },
    { id: `${id}_fails`, title: "La situación se vuelve en contra", description: "El mensaje no cayó como esperabas y ahora necesitás resultados.", baseProbability: .24, tone: "negative", effects: negative },
  ],
});

const event = (value: Omit<GameEvent, "weight">): GameEvent => ({ ...value, weight: 10 });

export const EVENTS: GameEvent[] = [
  event({ id: "substitute_demands", category: "vestuario", level: "MEDIUM", kicker: "PUERTAS ADENTRO", title: "El suplente golpeó la puerta", description: "{player} está cansado de esperar. Pide ser titular el próximo partido y amenaza con hablar públicamente.", minWeek: 4, condition: "any", options: [
    option("start_him", "Darle la titularidad", "bold", { morale: 5, harmony: 7, performance: .02 }, { respect: -8, harmony: -5 }),
    option("earn_it", "Decirle que se lo gane entrenando", "calm", { respect: 10, harmony: 4 }, { morale: -7, pressure: 5 }),
    option("loan_list", "Ponerlo en la lista de salidas", "safe", { harmony: 6, respect: 4 }, { morale: -10, harmony: -9 }),
  ] }),
  event({ id: "referent_bed", category: "vestuario", level: "MAJOR", kicker: "INTERNA PESADA", title: "Un referente te está haciendo la cama", description: "El cuerpo técnico detectó reuniones sin vos. {player} cuestiona tus métodos y tiene ascendencia sobre el plantel.", minWeek: 7, condition: "low_morale", options: [
    option("confront", "Enfrentarlo delante del grupo", "bold", { respect: 16, harmony: 6 }, { harmony: -18, morale: -10 }),
    option("private_talk", "Citarlo a una charla privada", "calm", { harmony: 13, respect: 7 }, { pressure: 8, respect: -5 }),
    option("bench_referent", "Sacarlo del equipo", "safe", { respect: 11, performance: .02 }, { morale: -13, performance: -.04 }),
  ] }),
  event({ id: "captain_tactics", category: "vestuario", level: "MEDIUM", kicker: "VOCES DEL PLANTEL", title: "El capitán cuestiona el sistema", description: "El capitán cree que el esquema expone demasiado al equipo y te pide un cambio antes de la próxima fecha.", minWeek: 5, condition: "any", options: [
    option("listen_captain", "Aceptar su lectura", "calm", { harmony: 12, morale: 5 }, { respect: -7, performance: -.02 }),
    option("hold_system", "Sostener el sistema", "bold", { respect: 11, performance: .04 }, { harmony: -9, pressure: 7 }),
    option("co_design", "Diseñar juntos un ajuste", "safe", { harmony: 9, performance: .025 }, { respect: -3, pressure: 3 }),
  ] }),
  event({ id: "penalty_taker", category: "vestuario", level: "MEDIUM", kicker: "EGO Y GOLES", title: "Dos jugadores quieren los penales", description: "{player} discutió con el goleador por quién ejecuta el próximo penal. El vestuario espera una orden clara.", minWeek: 6, condition: "any", options: [
    option("keep_scorer", "Mantener al goleador", "safe", { respect: 7, performance: .02 }, { harmony: -6 }),
    option("competition", "Definirlo en una competencia", "calm", { morale: 8, harmony: 5 }, { respect: -4 }),
    option("captain_decides", "Que decida el capitán", "safe", { harmony: 9 }, { respect: -8, pressure: 4 }),
  ] }),
  event({ id: "late_training", category: "vestuario", level: "MEDIUM", kicker: "DISCIPLINA", title: "La figura llegó tarde otra vez", description: "{topScorer} volvió a llegar tarde al entrenamiento. Es decisivo en la cancha, pero el grupo empieza a cansarse.", minWeek: 8, condition: "good_form", options: [
    option("fine_star", "Multarlo como a cualquiera", "bold", { respect: 14, harmony: 9 }, { morale: -7, performance: -.02 }),
    option("protect_star", "Protegerlo por su rendimiento", "safe", { performance: .035, morale: 3 }, { respect: -13, harmony: -10 }),
    option("private_warning", "Última advertencia privada", "calm", { respect: 7, harmony: 6 }, { pressure: 5 }),
  ] }),
  event({ id: "contract_scorer", category: "mercado", level: "MAJOR", kicker: "CONTRATO EN DISPUTA", title: "El goleador quiere una mejora", description: "{topScorer} siente que sus goles no están reconocidos. Su representante pide una respuesta esta semana.", minWeek: 9, condition: "good_form", options: [
    option("back_contract", "Apoyar el aumento", "bold", { morale: 9, performance: .03, respect: 6 }, { boardTrust: -11, pressure: 5 }),
    option("wait_year", "Pedirle que espere hasta fin de año", "calm", { boardTrust: 7, respect: 3 }, { morale: -12, performance: -.03 }),
    option("bonus_goals", "Ofrecer premios por goles", "safe", { performance: .04, morale: 5 }, { harmony: -5, pressure: 4 }),
  ] }),
  event({ id: "offer_star", category: "mercado", level: "MAJOR", kicker: "OFERTA FORMAL", title: "Quieren comprar a tu figura", description: "Llegó una propuesta importante por {topScorer}. La dirigencia necesita dinero, pero perderlo puede cambiar la temporada.", minWeek: 12, condition: "any", options: [
    option("reject_sale", "Exigir que se quede", "bold", { morale: 10, fanApproval: 10 }, { boardTrust: -15, pressure: 7 }),
    option("sell_replace", "Vender sólo con reemplazo", "calm", { boardTrust: 8, strength: 2 }, { performance: -.04, morale: -6 }),
    option("accept_sale", "Aceptar la oferta", "safe", { boardTrust: 14, pressure: -5 }, { fanApproval: -14, performance: -.05 }),
  ] }),
  event({ id: "board_youth", category: "dirigentes", level: "MEDIUM", kicker: "PEDIDO DE ARRIBA", title: "La dirigencia exige juveniles", description: "El presidente quiere ver patrimonio del club en cancha, aunque el equipo está peleando puntos importantes.", minWeek: 5, condition: "any", options: [
    option("play_youth", "Darles minutos ahora", "bold", { fanApproval: 8, respect: 6, performance: .015 }, { performance: -.035, morale: -4 }),
    option("protect_process", "Defender los tiempos del proceso", "calm", { respect: 8, harmony: 4 }, { boardTrust: -10, pressure: 6 }),
    option("one_youth", "Subir sólo a la mejor promesa", "safe", { boardTrust: 6, fanApproval: 4 }, { harmony: -3 }),
  ] }),
  event({ id: "board_ultimatum", category: "dirigentes", level: "MAJOR", kicker: "ULTIMÁTUM", title: "Te dieron tres partidos", description: "La comisión directiva perdió la paciencia. Necesitás una reacción inmediata para sostener el proyecto.", minWeek: 10, condition: "crisis", options: [
    option("promise_points", "Prometer siete puntos", "bold", { boardTrust: 13, performance: .045 }, { pressure: 16, boardTrust: -12 }),
    option("ask_support", "Pedir respaldo público", "calm", { morale: 8, boardTrust: 6 }, { pressure: 8 }),
    option("change_staff", "Cambiar parte del cuerpo técnico", "safe", { performance: .03, pressure: -5 }, { harmony: -10, respect: -5 }),
  ] }),
  event({ id: "supporters_training", category: "institucional", level: "MAJOR", kicker: "CLIMA CALIENTE", title: "La protesta llegó al entrenamiento", description: "Un grupo organizado ficticio exige hablar con el plantel después de la mala racha.", minWeek: 8, condition: "crisis", options: [
    option("face_supporters", "Dar la cara personalmente", "bold", { respect: 16, morale: 10 }, { pressure: 17, harmony: -9 }),
    option("security", "Cerrar el predio y llamar a seguridad", "safe", { pressure: -7, boardTrust: 7 }, { fanApproval: -13, morale: -5 }),
    option("referents_talk", "Que hablen los referentes", "calm", { harmony: 11, pressure: -4 }, { respect: -10, pressure: 8 }),
    option("board_handles", "Que lo resuelva la dirigencia", "safe", { boardTrust: 8, pressure: -5 }, { respect: -9, morale: -6 }),
  ] }),
  event({ id: "press_question", category: "medios", level: "MEDIUM", kicker: "CONFERENCIA CALIENTE", title: "¿Tenés fuerzas para seguir?", description: "La pregunta llegó después de otra derrota. Tu respuesta será la tapa de mañana.", minWeek: 7, condition: "crisis", options: [
    option("we_reverse", "Vamos a revertirlo", "bold", { morale: 7, fanApproval: 5 }, { pressure: 10 }),
    option("ask_board", "Pregúntenle a los dirigentes", "safe", { pressure: -4 }, { boardTrust: -12, respect: -5 }),
    option("no_talk", "Hoy no voy a hablar", "calm", { harmony: 4 }, { fanApproval: -7, pressure: 5 }),
  ] }),
  event({ id: "leaked_audio", category: "medios", level: "MAJOR", kicker: "SE FILTRÓ TODO", title: "Un audio del vestuario salió a la luz", description: "Una crítica táctica privada apareció en redes. El club busca al responsable y los jugadores desconfían entre sí.", minWeek: 11, condition: "any", options: [
    option("investigate", "Investigar hasta encontrarlo", "bold", { respect: 10, boardTrust: 6 }, { harmony: -14, pressure: 8 }),
    option("close_case", "Cerrar el tema públicamente", "calm", { harmony: 9, pressure: -5 }, { respect: -6 }),
    option("own_message", "Asumir que la crítica fue tuya", "bold", { respect: 13, morale: 4 }, { fanApproval: -8, boardTrust: -7 }),
  ] }),
  event({ id: "striker_injury", category: "lesiones", level: "MAJOR", kicker: "BAJA SENSIBLE", title: "Se lesionó el goleador", description: "{topScorer} estará varias semanas afuera y se acerca una parte decisiva del torneo.", minWeek: 10, condition: "any", options: [
    option("backup", "Confiar en el suplente", "safe", { morale: 7, harmony: 5 }, { performance: -.04 }),
    option("youth_striker", "Subir un juvenil", "bold", { fanApproval: 8, performance: .02 }, { performance: -.05, pressure: 5 }),
    option("new_system", "Jugar sin nueve", "calm", { performance: .035, respect: 5 }, { morale: -5, performance: -.03 }),
  ] }),
  event({ id: "keeper_errors", category: "deportivo", level: "MEDIUM", kicker: "BAJO LOS TRES PALOS", title: "El arquero quedó señalado", description: "Dos errores de {player} costaron puntos. Sostenerlo o sacarlo puede marcar al grupo.", minWeek: 6, condition: "low_morale", options: [
    option("keep_keeper", "Respaldarlo públicamente", "calm", { morale: 10, harmony: 5 }, { performance: -.04, pressure: 6 }),
    option("change_keeper", "Cambiar de arquero", "safe", { performance: .025, respect: 7 }, { morale: -8, harmony: -4 }),
    option("compete_week", "Definirlo en la semana", "bold", { performance: .02, morale: 4 }, { pressure: 4 }),
  ] }),
  event({ id: "derby_plan", category: "deportivo", level: "CAREER_DEFINING", kicker: "SE VIENE EL CLÁSICO", title: "La ciudad se detiene", description: "El clásico llega con la tabla apretada. La gente no quiere explicaciones: quiere ganar.", minWeek: 13, condition: "any", options: [
    option("attack_derby", "Salir a ganar desde el minuto uno", "bold", { fanApproval: 16, performance: .05 }, { fanApproval: -17, pressure: 12 }),
    option("normal_derby", "Jugar como siempre", "calm", { harmony: 7, performance: .02 }, { pressure: 4 }),
    option("dont_lose", "Primero, no perder", "safe", { pressure: -6, boardTrust: 5 }, { fanApproval: -9, respect: -4 }),
  ] }),
  event({ id: "winning_streak", category: "deportivo", level: "MEDIUM", kicker: "TODO SALE", title: "La racha empieza a pesar", description: "Cinco partidos sin perder pusieron al equipo en boca de todos. El plantel empieza a mirar la tabla.", minWeek: 9, condition: "good_form", options: [
    option("title_talk", "Decir que van por todo", "bold", { morale: 9, performance: .04 }, { pressure: 13, performance: -.02 }),
    option("low_profile", "Bajar el perfil", "safe", { pressure: -8, harmony: 5 }, { fanApproval: -5 }),
    option("raise_bar", "Subir la exigencia interna", "calm", { performance: .035, respect: 7 }, { morale: -6 }),
  ] }),
  event({ id: "youth_gem", category: "juveniles", level: "MEDIUM", kicker: "LA CANTERA PIDE PISTA", title: "Apareció una joya", description: "Un delantero de 17 años viene rompiéndola en Reserva. Los hinchas ya piden verlo en Primera.", minWeek: 7, condition: "any", options: [
    option("promote_gem", "Subirlo al plantel", "bold", { fanApproval: 10, performance: .02 }, { pressure: 5, morale: -3 }),
    option("develop_gem", "Dejarlo desarrollarse", "safe", { boardTrust: 6, harmony: 3 }, { fanApproval: -5 }),
    option("bench_minutes", "Llevarlo de a poco", "calm", { fanApproval: 6, performance: .015 }, { pressure: 2 }),
  ] }),
  event({ id: "bonus_dispute", category: "dirigentes", level: "MEDIUM", kicker: "NÚMEROS EN ROJO", title: "No aparece el premio prometido", description: "El plantel reclama un premio por objetivos que todavía no fue pagado. La dirigencia te pide que calmes las aguas.", minWeek: 12, condition: "any", options: [
    option("side_players", "Ponerte del lado del plantel", "bold", { respect: 13, morale: 8 }, { boardTrust: -14, pressure: 6 }),
    option("ask_patience", "Pedir paciencia", "calm", { boardTrust: 7, harmony: 3 }, { morale: -8, respect: -5 }),
    option("mediate_bonus", "Negociar un pago parcial", "safe", { harmony: 9, boardTrust: 4 }, { pressure: 4 }),
  ] }),
  event({ id: "rival_interest", category: "carrera", level: "MAJOR", kicker: "RUMOR DE PASILLO", title: "Otro club preguntó por vos", description: "Tu campaña llamó la atención. La noticia llegó al vestuario antes de que pudieras hablar con el presidente.", minWeek: 14, condition: "good_form", options: [
    option("deny_interest", "Negar todo y enfocarte", "safe", { harmony: 9, boardTrust: 8 }, { respect: -3 }),
    option("admit_interest", "Admitir que te seduce", "bold", { respect: 5, fanApproval: 3 }, { harmony: -9, boardTrust: -12 }),
    option("no_comment", "No hacer comentarios", "calm", { pressure: -2 }, { boardTrust: -6, pressure: 5 }),
  ] }),
  event({ id: "training_fight", category: "vestuario", level: "MAJOR", kicker: "VOLÓ UNA PIÑA", title: "Dos jugadores se pelearon", description: "La práctica terminó antes de tiempo. Uno es referente; el otro, una de las apariciones del año.", minWeek: 10, condition: "any", options: [
    option("punish_both", "Sancionar a los dos", "safe", { respect: 12, harmony: 6 }, { morale: -8 }),
    option("protect_youth", "Proteger al más joven", "calm", { fanApproval: 5, morale: 4 }, { harmony: -10, respect: -4 }),
    option("group_decides", "Que el grupo resuelva", "bold", { harmony: 13, respect: 5 }, { respect: -11, pressure: 6 }),
  ] }),
  event({ id: "assistant_disagrees", category: "cuerpo_tecnico", level: "MEDIUM", kicker: "MESA TÁCTICA", title: "Tu ayudante propone romper el libreto", description: "El segundo entrenador ve al equipo previsible y pide ensayar una variante que nunca usaron.", minWeek: 5, condition: "any", options: [
    option("test_variant", "Probarla a puertas cerradas", "calm", { performance: .03, respect: 5 }, { harmony: -4 }), option("keep_plan", "Mantener el plan original", "safe", { harmony: 5 }, { performance: -.025 }), option("delegate_variant", "Darle un partido para demostrarlo", "bold", { respect: 9, performance: .04 }, { pressure: 8 }),
  ] }),
  event({ id: "reserve_recommendation", category: "juveniles", level: "MEDIUM", kicker: "INFORME DE RESERVA", title: "Un lateral juvenil pide pista", description: "El técnico de Reserva insiste con un defensor veloz que todavía no debutó.", minWeek: 4, condition: "any", options: [
    option("debut_youth", "Hacerlo debutar", "bold", { fanApproval: 8, performance: .025 }, { performance: -.03 }), option("train_first", "Sumarlo sólo a los entrenamientos", "calm", { harmony: 5, respect: 4 }, { fanApproval: -3 }), option("leave_reserve", "Dejarlo completar su proceso", "safe", { boardTrust: 5 }, { respect: -4 }),
  ] }),
  event({ id: "set_piece_specialist", category: "deportivo", level: "MEDIUM", kicker: "PELOTA PARADA", title: "Apareció un especialista inesperado", description: "Un defensor suplente convirtió tiros libres toda la semana y pide ejecutarlos en competencia.", minWeek: 6, condition: "any", options: [
    option("give_kicks", "Darle los tiros libres", "bold", { morale: 7, performance: .03 }, { harmony: -5 }), option("share_kicks", "Repartir las ejecuciones", "calm", { harmony: 8 }, { performance: -.015 }), option("keep_taker", "Sostener al ejecutante habitual", "safe", { respect: 6 }, { morale: -5 }),
  ] }),
  event({ id: "travel_fatigue", category: "deportivo", level: "MEDIUM", kicker: "CALENDARIO PESADO", title: "El viaje dejó al plantel sin piernas", description: "La delegación volvió de madrugada y el próximo partido llega con poco descanso.", minWeek: 9, condition: "any", options: [
    option("rest_starters", "Descansar a los titulares", "safe", { morale: 7, performance: .015 }, { performance: -.035 }), option("train_normal", "Entrenar con normalidad", "bold", { performance: .03, respect: 4 }, { morale: -9 }), option("recovery", "Hacer sólo recuperación", "calm", { harmony: 6, pressure: -3 }, { performance: -.015 }),
  ] }),
  event({ id: "pitch_condition", category: "institucional", level: "MEDIUM", kicker: "CANCHA DIFÍCIL", title: "El campo de juego está en mal estado", description: "La lluvia dañó el césped y el partido de local exige adaptar el plan.", minWeek: 5, condition: "any", options: [
    option("direct_play", "Preparar un juego directo", "safe", { performance: .025 }, { morale: -3 }), option("keep_style", "No cambiar la identidad", "bold", { respect: 7, performance: .035 }, { pressure: 5 }), option("ask_delay", "Pedir que posterguen el partido", "calm", { boardTrust: 5 }, { fanApproval: -6 }),
  ] }),
  event({ id: "agent_leak", category: "mercado", level: "MAJOR", kicker: "RUIDO DE MERCADO", title: "Un representante filtró una salida", description: "El agente de {player} asegura que su jugador se irá aunque el club no recibió ninguna oferta.", minWeek: 11, condition: "any", options: [
    option("deny_agent", "Desmentirlo públicamente", "bold", { fanApproval: 7, respect: 5 }, { pressure: 8 }), option("meet_agent", "Reunirte con el representante", "calm", { harmony: 7 }, { boardTrust: -5 }), option("ignore_agent", "No alimentar el rumor", "safe", { pressure: -4 }, { morale: -6 }),
  ] }),
  event({ id: "captaincy_vote", category: "vestuario", level: "MAJOR", kicker: "BRAZALETE EN DISPUTA", title: "El grupo discute la capitanía", description: "Dos referentes creen representar mejor al plantel y la división ya se nota en las prácticas.", minWeek: 8, condition: "low_morale", options: [
    option("choose_captain", "Elegir vos al capitán", "bold", { respect: 12 }, { harmony: -12 }), option("squad_vote", "Hacer una votación", "calm", { harmony: 10 }, { respect: -6 }), option("two_captains", "Repartir la capitanía", "safe", { morale: 6, harmony: 4 }, { pressure: 5 }),
  ] }),
  event({ id: "medical_dispute", category: "lesiones", level: "MAJOR", kicker: "PARTE MÉDICO", title: "Los médicos no se ponen de acuerdo", description: "{topScorer} dice estar listo, pero el área médica recomienda esperar una fecha más.", minWeek: 12, condition: "any", options: [
    option("trust_doctors", "Respetar el alta médica", "safe", { boardTrust: 7, respect: 4 }, { performance: -.025 }), option("trust_player", "Dejar que el jugador decida", "bold", { morale: 8, performance: .035 }, { pressure: 9 }), option("limited_minutes", "Llevarlo al banco", "calm", { harmony: 6, performance: .015 }, { pressure: 3 }),
  ] }),
  event({ id: "sponsor_obligation", category: "institucional", level: "MEDIUM", kicker: "AGENDA DEL CLUB", title: "El sponsor exige una aparición", description: "La actividad comercial cae justo antes de un partido importante y la dirigencia quiere al plantel completo.", minWeek: 7, condition: "any", options: [
    option("send_stars", "Cumplir con las figuras", "safe", { boardTrust: 10 }, { morale: -6, performance: -.02 }), option("send_youth", "Enviar juveniles", "calm", { morale: 4 }, { boardTrust: -7 }), option("cancel_event", "Cancelar la aparición", "bold", { performance: .03, respect: 5 }, { boardTrust: -12 }),
  ] }),
  event({ id: "supporters_mural", category: "institucional", level: "MEDIUM", kicker: "IDENTIDAD", title: "Los hinchas quieren homenajear a un ídolo", description: "Una agrupación propone pintar un mural en el predio y pide que el plantel participe.", minWeek: 6, condition: "good_form", options: [
    option("join_mural", "Participar con todo el plantel", "calm", { fanApproval: 12, harmony: 5 }, { performance: -.015 }), option("captains_only", "Mandar sólo a los capitanes", "safe", { fanApproval: 6 }, { respect: -3 }), option("focus_match", "Concentrarse sólo en competir", "bold", { performance: .025 }, { fanApproval: -8 }),
  ] }),
  event({ id: "veteran_retirement", category: "vestuario", level: "MEDIUM", kicker: "FIN DE CICLO", title: "Un veterano anuncia su retiro", description: "Uno de los jugadores más respetados decidió que ésta será su última temporada.", minWeek: 15, condition: "any", options: [
    option("farewell_now", "Anunciar una despedida grande", "calm", { morale: 10, fanApproval: 8 }, { pressure: 5 }), option("wait_end", "Esperar al final del torneo", "safe", { harmony: 5 }, { morale: -3 }), option("offer_staff", "Ofrecerle sumarse al cuerpo técnico", "bold", { respect: 12, harmony: 6 }, { boardTrust: -5 }),
  ] }),
  event({ id: "viral_celebration", category: "medios", level: "MEDIUM", kicker: "REDES ENCENDIDAS", title: "Un festejo se volvió viral", description: "La celebración de {player} gustó a los hinchas pero molestó al próximo rival.", minWeek: 5, condition: "good_form", options: [
    option("celebrate_more", "Defender la espontaneidad", "bold", { fanApproval: 9, morale: 6 }, { pressure: 7 }), option("lower_tone", "Pedirle que baje el tono", "safe", { respect: 5, pressure: -3 }, { morale: -5 }), option("use_message", "Convertirlo en una campaña del club", "calm", { boardTrust: 7, fanApproval: 6 }, { harmony: -3 }),
  ] }),
  event({ id: "afa_fixed_match", category: "institucional", level: "CAREER_DEFINING", kicker: "UNA VISITA INACEPTABLE", title: "Un dirigente de AFA te pide perder", description: "Un dirigente ficticio te insinúa que entregues el próximo partido. A cambio promete favorecer al club más adelante. No hay testigos y cualquier decisión puede volverse en tu contra.", minWeek: 13, condition: "any", options: [
    { id: "accept_fix", text: "Aceptar el arreglo", approach: "bold", outcomes: [
      { id: "accept_fix_works", title: "El pacto clandestino rinde frutos", description: "El partido se pierde sin sospechas y después aparecen fallos favorables. Deportivamente obtenés una ventaja, aunque el secreto queda enterrado.", baseProbability: .44, tone: "positive", effects: { performance: .075, boardTrust: 7, respect: -6 } },
      { id: "accept_fix_fails", title: "El vestuario detecta la maniobra", description: "Los jugadores sienten que fueron utilizados. La promesa nunca se cumple y la confianza interna se derrumba.", baseProbability: .56, tone: "negative", effects: { morale: -16, harmony: -13, pressure: 10, performance: -.04 } },
    ] },
    { id: "reject_fix", text: "Rechazarlo y jugar para ganar", approach: "calm", outcomes: [
      { id: "reject_fix_works", title: "El plantel se une detrás de vos", description: "Tu negativa llega al vestuario y refuerza la convicción del grupo. El equipo compite con una energía distinta.", baseProbability: .58, tone: "positive", effects: { morale: 14, harmony: 10, respect: 12, performance: .025 } },
      { id: "reject_fix_fails", title: "Empiezan los fallos inexplicables", description: "La negativa tiene costo: decisiones arbitrales dudosas perjudican al equipo durante varias fechas.", baseProbability: .42, tone: "negative", effects: { performance: -.085, pressure: 12, boardTrust: -5 } },
    ] },
    { id: "report_fix", text: "Denunciarlo ante la dirigencia del club", approach: "safe", outcomes: [
      { id: "report_fix_backing", title: "El club te respalda", description: "La dirigencia documenta la situación y cierra filas. El plantel valora que hayas protegido al equipo.", baseProbability: .52, tone: "positive", effects: { boardTrust: 13, morale: 8, respect: 10 } },
      { id: "report_fix_leak", title: "La denuncia se filtra", description: "La historia llega a los medios sin pruebas suficientes y el club queda bajo una presión feroz.", baseProbability: .48, tone: "negative", effects: { pressure: 16, boardTrust: -8, performance: -.035 } },
    ] },
  ] }),
  event({ id: "night_out", category: "vestuario", level: "MEDIUM", kicker: "SALIDA NOCTURNA", title: "Tres titulares rompieron la concentración", description: "Una foto confirma que varios jugadores salieron de madrugada antes de un partido importante.", minWeek: 8, condition: "any", options: [
    option("suspend_three", "Suspender a los tres", "bold", { respect: 14, harmony: 6 }, { performance: -.05, morale: -7 }), option("fine_three", "Multarlos y mantenerlos", "calm", { respect: 7, performance: .015 }, { harmony: -7 }), option("internal_case", "Resolverlo sin hacerlo público", "safe", { harmony: 8, pressure: -3 }, { respect: -10 }),
  ] }),
  event({ id: "training_facilities", category: "dirigentes", level: "MEDIUM", kicker: "PREDIO POSTERGADO", title: "La obra del vestuario quedó frenada", description: "La dirigencia desvió fondos y el plantel entrena con instalaciones deterioradas.", minWeek: 7, condition: "any", options: [
    option("demand_facilities", "Exigir que terminen la obra", "bold", { morale: 8, respect: 8 }, { boardTrust: -12 }), option("adapt_facilities", "Adaptarse hasta fin de año", "safe", { boardTrust: 8 }, { morale: -7, performance: -.02 }), option("players_meeting", "Negociar junto a los referentes", "calm", { harmony: 9, boardTrust: 4 }, { pressure: 5 }),
  ] }),
  event({ id: "loan_recall", category: "mercado", level: "MAJOR", kicker: "LLAMADO INESPERADO", title: "El club dueño reclama a un cedido", description: "Uno de los jugadores de mayor recambio puede irse antes de la parte decisiva del torneo.", minWeek: 14, condition: "any", options: [
    option("buy_loan", "Pedir que compren su pase", "bold", { strength: 3, morale: 6 }, { boardTrust: -11 }), option("replace_loan", "Preparar un reemplazo interno", "calm", { performance: .02, respect: 5 }, { strength: -2 }), option("release_loan", "Dejarlo regresar", "safe", { boardTrust: 7 }, { morale: -7, performance: -.03 }),
  ] }),
  event({ id: "analyst_warning", category: "deportivo", level: "MEDIUM", kicker: "DATOS EN ROJO", title: "El analista detecta una tendencia peligrosa", description: "El equipo concede casi todas sus ocasiones por el mismo sector y los rivales ya parecen haberlo notado.", minWeek: 9, condition: "any", options: [
    option("change_sector", "Modificar ese sector", "calm", { performance: .04, respect: 5 }, { harmony: -5 }), option("individual_work", "Hacer trabajo individual", "safe", { morale: 5, performance: .02 }, { pressure: 4 }), option("ignore_data", "Confiar en la lectura del campo", "bold", { respect: 8 }, { performance: -.045 }),
  ] }),
  event({ id: "president_election", category: "dirigentes", level: "MAJOR", kicker: "AÑO ELECTORAL", title: "La campaña política entra al vestuario", description: "Dos candidatos quieren una foto con vos y prometen proyectos deportivos opuestos.", minWeek: 12, condition: "any", options: [
    option("current_board", "Respaldar al oficialismo", "safe", { boardTrust: 13 }, { fanApproval: -8 }), option("stay_neutral", "Mantenerte neutral", "calm", { respect: 8, pressure: -4 }, { boardTrust: -6 }), option("demand_plan", "Escuchar a ambos y exigir un plan", "bold", { respect: 11, fanApproval: 6 }, { pressure: 7 }),
  ] }),
  event({ id: "player_family_issue", category: "vestuario", level: "MEDIUM", kicker: "ANTES QUE EL FÚTBOL", title: "Un titular pide licencia personal", description: "{player} atraviesa un problema familiar y no sabe cuándo estará listo para volver.", minWeek: 6, condition: "any", options: [
    option("full_leave", "Darle licencia sin plazo", "calm", { harmony: 13, respect: 9 }, { performance: -.035 }), option("short_leave", "Acordar una semana", "safe", { morale: 6, performance: -.015 }, { respect: -4 }), option("need_player", "Pedirle que siga disponible", "bold", { performance: .025 }, { harmony: -14, morale: -8 }),
  ] }),
  event({ id: "fan_tactical_demand", category: "institucional", level: "MEDIUM", kicker: "MURMULLO DE TRIBUNA", title: "La gente pide jugar con dos delanteros", description: "El reclamo crece incluso cuando llegan resultados. La identidad del equipo quedó en discusión.", minWeek: 8, condition: "any", options: [
    option("two_strikers", "Probar dos delanteros", "bold", { fanApproval: 10, performance: .03 }, { harmony: -5 }), option("defend_identity", "Defender tu idea", "calm", { respect: 9, performance: .02 }, { fanApproval: -8 }), option("situational_change", "Usarlo sólo según el rival", "safe", { fanApproval: 5, respect: 5 }, { pressure: 3 }),
  ] }),
];
