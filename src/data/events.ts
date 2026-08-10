import type { EventOption, GameEvent } from "../domain/game.ts";

const options = (topic: string): EventOption[] => [
  {
    id: "bold",
    text: "Dar la cara y tomar el control",
    approach: "bold",
    outcomes: [
      { id: "rally", title: "El plantel te respalda", description: `Tu decisión sobre ${topic} fortalece al grupo. La respuesta fue mejor de lo esperado.`, baseProbability: .46, tone: "positive", effects: { morale: 12, respect: 15, performance: .04 } },
      { id: "escalates", title: "La apuesta salió mal", description: "La situación se desordenó y ahora todas las miradas caen sobre vos.", baseProbability: .30, tone: "negative", effects: { morale: -10, pressure: 14, boardTrust: -8 } },
      { id: "stays", title: "La tensión sigue", description: "Ganaste tiempo, aunque el problema todavía no desapareció.", baseProbability: .24, tone: "neutral", effects: { respect: 3, pressure: 2 } },
    ],
  },
  {
    id: "calm",
    text: "Hablar puertas adentro",
    approach: "calm",
    outcomes: [
      { id: "dialogue", title: "El diálogo ordena al grupo", description: "Los referentes valoraron el tono y ayudaron a cerrar filas.", baseProbability: .52, tone: "positive", effects: { harmony: 13, morale: 7, respect: 8 } },
      { id: "halfway", title: "Una tregua frágil", description: "El vestuario bajó un cambio, pero espera resultados.", baseProbability: .33, tone: "neutral", effects: { harmony: 4, pressure: -2 } },
      { id: "weak", title: "Confundieron calma con debilidad", description: "La interna creció y la dirigencia pide respuestas.", baseProbability: .15, tone: "negative", effects: { harmony: -12, boardTrust: -8, pressure: 9 } },
    ],
  },
  {
    id: "safe",
    text: "Delegar en la dirigencia",
    approach: "safe",
    outcomes: [
      { id: "board", title: "La dirigencia destraba el conflicto", description: "El club resolvió el frente institucional sin exponer al equipo.", baseProbability: .42, tone: "positive", effects: { boardTrust: 11, pressure: -9 } },
      { id: "distance", title: "El problema queda contenido", description: "No hubo daño inmediato, aunque perdiste algo de ascendencia.", baseProbability: .38, tone: "neutral", effects: { respect: -4, pressure: -2 } },
      { id: "alone", title: "El plantel se sintió solo", description: "Los jugadores esperaban que los defendieras personalmente.", baseProbability: .20, tone: "negative", effects: { morale: -8, respect: -12 } },
    ],
  },
];

const archetypes = [
  ["vestuario", "PUERTAS ADENTRO", "El referente levantó la voz", "Un referente cuestionó el plan delante del grupo. El vestuario espera tu reacción.", "low_morale"],
  ["mercado", "MERCADO DE PASES", "Llegó una oferta por tu figura", "La dirigencia quiere vender. El reemplazo no está asegurado y el plantel mira de cerca.", "any"],
  ["dirigentes", "REUNIÓN URGENTE", "La paciencia tiene un límite", "La comisión directiva pide una explicación por el presente del equipo.", "crisis"],
  ["hinchas", "CLIMA CALIENTE", "La tribuna perdió la paciencia", "Un grupo de hinchas organizados llegó al entrenamiento. Es una situación ficticia dentro de esta partida.", "crisis"],
  ["deportivo", "SEMANA DECISIVA", "El partido que puede cambiar todo", "El próximo resultado puede poner al equipo en carrera o hundirlo en la tabla.", "any"],
  ["medios", "TAPA DE LOS DIARIOS", "Te pusieron en el centro de la escena", "Una frase de la conferencia encendió el debate y todos esperan una respuesta.", "any"],
  ["lesiones", "BAJA SENSIBLE", "Se lesionó una pieza clave", "Quedan semanas importantes y el cuerpo técnico necesita una decisión rápida.", "any"],
  ["institucional", "TENSIÓN EN EL CLUB", "El entrenamiento fue interrumpido", "La seguridad cerró el predio tras una protesta de un grupo organizado ficticio.", "crisis"],
  ["juveniles", "LA CANTERA PIDE PISTA", "Apareció una joya", "Un juvenil de 17 años viene rompiéndola. Subirlo ahora puede cambiar su historia y la tuya.", "good_form"],
  ["carrera", "EL TELÉFONO SONÓ", "Otro club preguntó por vos", "Tu trabajo llamó la atención. Hablar ahora puede afectar la relación con la dirigencia.", "good_form"],
] as const;

export const EVENTS: GameEvent[] = archetypes.flatMap(([category, kicker, title, description, condition], archetypeIndex) =>
  Array.from({ length: 12 }, (_, variant) => ({
    id: `${category}_${variant + 1}`,
    category,
    level: variant === 11 ? "CAREER_DEFINING" : variant % 4 === 0 ? "MAJOR" : "MEDIUM",
    kicker,
    title: variant === 0 ? title : `${title} · capítulo ${variant + 1}`,
    description,
    minWeek: 3 + (variant % 9),
    condition,
    weight: 12 - variant / 2 + archetypeIndex / 10,
    options: options(title.toLowerCase()),
  })),
);
