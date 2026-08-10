# Convertite en DT — Game Design

## Estado inicial del repositorio

El 10 de agosto de 2026 el workspace estaba vacío y sin historial Git. Se inicializó un proyecto React/TypeScript compatible con Next.js mediante vinext. Este documento registra las decisiones del primer vertical slice.

## Promesa

El jugador no dirige partidos: dirige una carrera. Una temporada avanza sola hasta que aparece una decisión con peso narrativo. El ciclo es: crear DT, elegir oferta, avanzar, decidir, aceptar una consecuencia probabilística, cerrar la temporada y evaluar nuevas ofertas.

## Alcance del vertical slice

- Creación de DT con seis filosofías.
- Tres ofertas dinámicas de clubes reales con ratings ficticios de juego.
- Liga agregada de 18 equipos y temporada de 27 o 38 fechas.
- Partidos internos, tabla aproximada, forma, moral, presión, hinchas y dirigencia.
- 120 instancias de evento data-driven derivadas de diez arquetipos.
- Decisiones con tres enfoques y outcomes no deterministas.
- Resumen narrativo, reputación, títulos, ascensos e historial.
- Guardado local automático y carreras de múltiples temporadas.

## Principios

1. Cada pantalla debe responder “¿qué hacés?”.
2. Ninguna opción promete un resultado.
3. El drama surge del estado: las crisis necesitan presión, derrotas o moral baja.
4. Los clubes grandes tienen fuerza y también mucha menos paciencia.
5. Los ratings son ficción de diseño; no representan una evaluación deportiva actual.

## Fuera del slice

Formatos reales completos, planteles reales, copas continentales, mercado con futbolistas individuales, despidos a mitad de año y tarjeta compartible quedan para iteraciones posteriores.
