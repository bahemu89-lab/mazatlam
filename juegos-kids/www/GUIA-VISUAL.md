# Guía visual "renderizada" (pulido profesional de cada juego)

Objetivo: que nada se vea plano. Cada elemento debe tener **volumen, luz y sombra**, como en las apps
infantiles comerciales (Sago Mini, Toca Boca, Lingokids, PBS Kids). Todo sigue siendo offline: solo CSS,
SVG inline y canvas. Nada de imágenes ni fuentes externas.

## Ya lo da la base (common.css) — úsalo, no lo dupliques
- `body` tiene una escena de fondo (cielo con degradado, nubes, sol y colinas verdes). Si tu juego pinta
  su propio fondo en `.game`, hazlo con degradados y elementos con profundidad, nunca un color plano.
- `.btn` (y `.blue .green .yellow .purple .big .round`): botón 3D con degradado, brillo superior, borde
  inferior oscuro y sombra suave. Se puede recolorear con `--a` (claro), `--b` (medio), `--d` (oscuro).
- `.card`: tarjeta blanca con relieve y brillo; `.card.ok` verde brillante. `.panel`: panel de cristal.
- `.emoji` ya lleva sombra proyectada. Animaciones: `pop`, `bounce`, `float`, `shake`, `shine`.
- `.title-outline`: texto blanco con contorno y sombra (estilo título de juego).
- La celebración (`KidsGame.celebrate`) ya tiene rayos de luz girando, caja con relieve y estrellas escalonadas.

## Qué debe cambiar en cada juego
1. **Fondos**: sustituir colores planos por degradados (`linear-gradient`/`radial-gradient`), viñeta suave,
   o una escena temática sencilla (por ejemplo: el laberinto sobre un jardín, los globos sobre un cielo con
   nubes en paralaje, el piano sobre un escenario con telón, la memoria sobre una mesa de madera con veta).
2. **Piezas y fichas**: cada ficha/pieza/tarjeta debe tener degradado de luz (más claro arriba-izquierda),
   brillo (highlight blanco semitransparente en la parte superior), borde inferior más oscuro (efecto de
   grosor) y sombra proyectada suave (`box-shadow: 0 6px 0 <oscuro>, 0 12px 20px rgba(0,0,0,.25)`).
3. **SVG**: usa `<linearGradient>`/`<radialGradient>` para dar volumen (por ejemplo, un radial con el punto
   de luz desplazado hacia arriba-izquierda para esferas y globos), `<filter>` con `feDropShadow` para
   sombras, brillos con elipses blancas semitransparentes, contornos redondeados (`stroke-linejoin: round`).
   Los dibujos de escena (rompecabezas, colorear, monstruo) deben tener sombras en el suelo y luz.
4. **Emojis grandes**: mantener `.emoji` (ya tiene sombra) y, cuando sean protagonistas, ponerlos sobre un
   "medallón" circular con degradado radial y anillo brillante.
5. **Movimiento con vida**: estados de reposo animados (flotar, respirar, parpadeo), partículas al acertar
   (estrellitas/chispas que salen del punto tocado), transición suave al aparecer (`pop`), squash & stretch
   ligero al tocar (`transform: scale(1.08)` → vuelta).
6. **Tipografía**: textos importantes con `font-weight: 900` y `text-shadow` o `.title-outline`; nunca texto
   negro plano sobre color plano.
7. **Paneles y HUD**: usa `.panel` o el mismo tratamiento (cristal blanco con relieve) para indicadores de
   nivel, progreso, paletas y bandejas.
8. **Barras de progreso**: con degradado, brillo y relleno animado.

## Reglas que NO cambian
- No romper la lógica del juego ni la API (`KidsGame.*`). Los cambios son visuales y de animación.
- Un solo archivo por juego, inline, sin recursos externos, pointer events, mínimo 64 px tocables,
  vertical y horizontal, sin errores de consola.
- Rendimiento: evita `filter: blur()` grande en elementos animados y más de ~40 partículas a la vez.
  Las sombras en `box-shadow` son baratas; los `<filter>` de SVG úsalos con moderación.
- Verifica con capturas en 1024x768 y 768x1024 y compara antes/después.
