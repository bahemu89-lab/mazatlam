# Especificación para cada juego (www/games/*.html)

Público: niñas y niños de 4 a 6 años. Tablet Android, sin internet, dentro de un WebView.

Reglas obligatorias:
1. Un solo archivo HTML por juego, con CSS y JS **inline**. Sin librerías externas, sin fuentes web, sin imágenes externas. Gráficos con emoji (clase `.emoji`), SVG inline o canvas.
2. Incluir al inicio del `<head>`:
   ```html
   <meta charset="utf-8">
   <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
   <link rel="stylesheet" href="../common.css">
   ```
   y al final del `<body>`: `<script src="../common.js"></script>` seguido del script del juego.
3. El JS del juego empieza con `var game = KidsGame.init({ title: 'Nombre' });` y dibuja todo dentro de `game` (un `<div class="game">` que ocupa la pantalla).
4. Todo se controla con **toques** (pointer events: `pointerdown`, `pointermove`, `pointerup`). Elementos tocables de mínimo 64x64 px. Funciona en vertical y horizontal (usar flex/grid y `vw`/`vh`/`min()`), sin scroll de página.
5. Textos en **español**, muy cortos; la niña puede no saber leer, así que las instrucciones deben ser visuales (iconos, emoji, animaciones) y opcionalmente con `KidsGame.say('...')`.
6. Feedback siempre: `KidsGame.sound.ok()` / `.wrong()` / `.pop()` / `.tap()`, `KidsGame.addStar()` al acertar, y `KidsGame.celebrate({ onAgain: fn, onNext: fn })` al terminar un nivel/ronda.
7. Nada de perder de forma frustrante: sin "game over" duro, sin temporizadores agresivos. Los errores solo animan (`.bad`) y dejan intentar otra vez.
8. Dificultad progresiva suave (niveles o rondas). Variedad: usar `KidsGame.shuffle` / `KidsGame.pick` para que cada partida sea distinta.
9. Sin `alert()`, sin `prompt()`. Sin `localStorage` obligatorio (se puede usar para guardar progreso pero el juego debe funcionar sin él).
10. El código debe funcionar en Chrome/WebView Android 8+ (ES5/ES2015 sencillo, nada exótico).

API disponible en `KidsGame` (ver `www/common.js`):
- `init({title})` → devuelve el contenedor `.game`
- `sound.tap()`, `sound.pop()`, `sound.ok()`, `sound.wrong()`, `sound.win()`, `sound.note(freqHz)`
- `say(texto)` (voz, si está disponible), `vibrate(ms)`
- `shuffle(arr)`, `rand(n)`, `pick(arr)`
- `addStar(n)`, `getStars()`
- `celebrate({msg, sub, stars, onAgain, onNext})`, `confetti()`, `toast(texto)`

Clases CSS disponibles: `.btn` (+ `.round .blue .green .yellow .purple .big`), `.card` (+ `.ok .bad`), `.emoji`, `.pop`, `.bounce`.

## Niveles de complejidad (obligatorio en todos los juegos)
- Al iniciar, llamar `KidsGame.levelPicker({ onPick: function (nivel) { empezar(nivel); } })` (nivel 1 = Fácil,
  2 = Medio, 3 = Difícil). Mientras se muestra el selector el juego no debe estar corriendo.
- Cada nivel cambia de verdad la dificultad (más piezas, más rapidez, más distractores, menos ayudas).
  Dentro de cada nivel puede haber progresión (rondas más difíciles). `KidsGame.celebrate` con `onNext` avanza.
- Mostrar en el HUD el nivel con `KidsGame.levelBadge(nivel)` y ofrecer un botón "🎚️" para volver al selector.
