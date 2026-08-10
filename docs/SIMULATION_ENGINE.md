# Motor de simulación

`advanceUntilNextMeaningfulMoment()` es la operación central. Simula partidos en un bucle, actualiza forma, puntos, posición estimada, moral, aprobación, confianza y presión; sólo retorna ante un evento elegible o el final de temporada.

La probabilidad de victoria combina fuerza del club, filosofía, moral, presión, reputación y modificadores temporales. Se limita a un rango de 18%–66% para evitar certezas. Los resultados alimentan el siguiente partido.

El RNG xorshift32 conserva `rngState` en el guardado. Una semilla y las mismas decisiones reproducen la carrera. Los tests recorren temporadas completas, comprueban invariantes y verifican reproducibilidad.

La tabla del slice es una aproximación agregada, no un fixture completo de todos los clubes. La siguiente etapa reemplazará la estimación por standings calculados con fixtures data-driven.
