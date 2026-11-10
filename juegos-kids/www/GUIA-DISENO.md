# Guía de diseño de juego (pasada "creador de videojuegos")

La mamá dice: "ocupo juegos de mayor calidad, más creativos y bonitos, profesionales, de un creador de juegos".
Esta pasada convierte cada mini-juego en un juego con identidad, tutorial, recompensas, "juice" y arte propio.

## API nueva en common.js (ya disponible)
- `KidsGame.levelPicker({ howto: [{icon:'👆', text:'Toca dos cartas'}, ...], art: '🐵' | '<svg…>', music: 'alegre'|'calma'|'aventura', labels, onPick })`
  Muestra a la mascota **Mazi** explicando "¿Cómo se juega?" (3 pasos cortos, con icono) y lo lee en voz alta. `art` admite un emoji o un SVG inline (hero art del juego).
- `KidsGame.hand({ el })` manita que toca un elemento; `KidsGame.hand({ from, to })` manita que arrastra. Se quita sola al primer toque. Úsala en la **primera ronda del nivel 1**.
- `KidsGame.fx.burst(x, y, {n, colors, chars:['⭐','✨']})`, `fx.burstAt(el, opts)`, `fx.floatText(x, y, '+1', 'good')`, `fx.ring(el)`, `fx.shake(el)`.
- `KidsGame.music.start('tema')` (ya lo arranca el selector), `music.duck(ms)` baja la música un momento.
- `KidsGame.mascot(size)` devuelve el SVG de Mazi; `KidsGame.mascotTalk()`; `KidsGame.say()` ya la hace hablar.
- `KidsGame.loading('Preparando…')` devuelve `cerrar()`; `KidsGame.defer(fn)` ejecuta tras pintar. Úsalos si un cálculo tarda > 100 ms.
- `KidsGame.levelDone(nivel)` ahora otorga un **sticker** (se muestra en celebrate). Llamarlo SOLO al cerrar una serie completa del nivel.
- `KidsGame.go(url)` navega con transición.

## Qué debe tener cada juego al terminar la pasada
1. **Identidad**: un "mundo" con nombre y paleta propia (p. ej. Memoria = "La feria de los animales"), fondo ilustrado coherente, y un **hero art en SVG** (personaje u objeto emblemático, no un emoji suelto) que aparece en el selector (`art`) y en la pantalla.
2. **Tutorial**: `howto` de 3 pasos + manita en la primera acción del nivel 1. La niña no lee: iconos + voz.
3. **Juice**: anticipación y squash & stretch al tocar; partículas con `fx`; texto flotante (+1, ¡Racha x3!); anillo al acertar; sacudida suave al fallar; banner de ronda ("Ronda 2 de 8") que entra y sale; transición entre rondas (deslizar/escala), nunca un cambio seco.
4. **Racha**: 3 aciertos seguidos = "¡Racha!" con bonus (estrella extra cada 5); un fallo la reinicia sin castigo.
5. **Arte propio donde el emoji se queda corto**: el protagonista del juego (personaje, ficha, pieza) se dibuja en SVG con degradados, brillo y sombra; se conservan emojis para los conjuntos grandes (frutas, animales...) pero sobre medallones o tarjetas ilustradas.
6. **Variedad y creatividad**: más contenido (escenas, conjuntos, canciones) para que no se repita en una semana; donde encaje, un elemento creativo (elegir personaje/aspecto, modo libre, desbloqueables cosméticos al completar niveles: p. ej. un marco, un fondo, un color de ficha).
7. **Rendimiento (tablet real)**: sin cálculos síncronos > 100 ms al elegir nivel (precalcular o `defer` + `loading`); animaciones solo con transform/opacity; sin animar box-shadow/filter en bucle; ≤ 30 partículas a la vez; canvas: cachear capas estáticas, limitar devicePixelRatio a 1.5, no redibujar lo que no cambia. Objetivo medido con el harness de CPU lenta (x8): ≥ 45 fps en reposo y "elegir nivel" < 900 ms.
8. **Cero errores**, ambas orientaciones, 4 niveles, `labels` y `levelDone` conservados.

## Medición
`node /tmp/claude-0/-home-user-mazatlam/ec7fbee5-f615-54a3-9f17-6703b8288fce/scratchpad/perf.js juego1,juego2` imprime carga, tiempo de elegir nivel y fps con CPU x8 (niveles 1 y 4). Cópialo con otro nombre si lo modificas: el scratchpad es compartido.
