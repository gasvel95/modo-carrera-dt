# Arquitectura

La aplicación respeta una separación unidireccional:

`UI → Application/Game Engine → Domain → Data`

- `app/`: shell y metadatos.
- `src/ui/`: interacción React, navegación de pantallas y persistencia local.
- `src/game-engine/`: RNG, simulación, ofertas, temporadas y resolución de outcomes.
- `src/domain/`: contratos TypeScript sin dependencias de React.
- `src/data/`: clubes y eventos configurables.
- `tests/`: simulaciones deterministas y smoke test del render.

El estado completo es serializable. `CareerState.version` permite futuras migraciones de guardados. El frontend sólo solicita transiciones al motor y nunca modifica directamente probabilidades o resultados.

La persistencia actual usa `localStorage`, apropiado para una carrera local. Un futuro repositorio de carreras podrá implementar el mismo límite de aplicación con PostgreSQL sin acoplar el motor al transporte.
