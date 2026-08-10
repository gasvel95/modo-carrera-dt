import type { TransferCandidate } from "../domain/game.ts";

export const SQUAD_NAMES = [
  "Tomás Ferreyra", "Lautaro Acosta", "Bruno Sosa", "Franco Quiroga", "Matías Roldán", "Nicolás Vera", "Agustín Ledesma", "Ramiro Paz",
  "Facundo Luna", "Joaquín Benítez", "Santiago Correa", "Iván Cardozo", "Ezequiel Toledo", "Lucas Villalba", "Bautista Romero", "Thiago Navarro",
];

export const TRANSFER_POOL: TransferCandidate[] = [
  { id: "veterano_9", name: "Mauro Quiroga", age: 34, position: "DEL", profile: "Goleador veterano · impacto inmediato", cost: 320000, strength: 5, risk: 0.25 },
  { id: "promesa_10", name: "Benjamín Luna", age: 19, position: "MCO", profile: "Promesa creativa · alto potencial", cost: 780000, strength: 4, risk: 0.34 },
  { id: "central_lider", name: "Gastón Pereyra", age: 29, position: "DFC", profile: "Central con mando · ordena el fondo", cost: 510000, strength: 4, risk: 0.18 },
  { id: "extremo_prestamo", name: "Iñaki Sosa", age: 22, position: "EXT", profile: "Préstamo veloz · desequilibrio", cost: 140000, strength: 3, risk: 0.30 },
  { id: "arquero", name: "Nahuel Toledo", age: 27, position: "ARQ", profile: "Arquero seguro · regularidad", cost: 390000, strength: 3, risk: 0.14 },
  { id: "cinco", name: "Damián Villalba", age: 31, position: "MCD", profile: "Volante de equilibrio · experiencia", cost: 280000, strength: 3, risk: 0.12 },
  { id: "juvenil_9", name: "Valentín Ríos", age: 18, position: "DEL", profile: "Apuesta del ascenso · techo enorme", cost: 620000, strength: 2, risk: 0.42 },
  { id: "lateral", name: "Franco Medina", age: 24, position: "LAT", profile: "Lateral intenso · ida y vuelta", cost: 350000, strength: 3, risk: 0.20 },
];
