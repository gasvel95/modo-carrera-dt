# Modelo de datos

## CareerState

Semilla, estado RNG, manager, club actual, temporada activa, historial, títulos, ascensos y división actual de los clubes promovidos. Es la unidad persistida.

## Manager

Identidad, filosofía, reputación (0–1000), liderazgo y respeto.

## Club

Identidad, división, tier, región, reputación, fuerza, presiones, presupuesto, objetivo y rivalidad opcional. Los datos viven fuera de React.

## Season

Calendario agregado, posición, puntos, récord, goles, forma, variables humanas, modificador de rendimiento, eventos vistos y momentos narrativos.

## GameEvent / EventOption / EventOutcome

El evento define cuándo puede aparecer; la opción define la postura; el outcome define probabilidad, tono y efectos. Esta división conserva la regla decisión → probabilidades → RNG → consecuencia.

## Evolución prevista

Se agregarán Competition, Fixture, Player, SeasonModifier y PendingConsequence como entidades persistentes. Los guardados se migrarán mediante `version`.
