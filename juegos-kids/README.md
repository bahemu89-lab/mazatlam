# 🎈 Juegos Mazatlam — app Android para niñas y niños de 4 a 6 años

App **sin internet** con 24 juegos, pensada para instalarse en una tablet Android aparte.
Los juegos están inspirados en los más populares para esta edad (memoria, colorear, rompecabezas,
globos, letras, números, formas y colores, sombras, dibujar, piano, Simón dice, atrapa al topo,
laberinto, alimenta a los animales, crea tu monstruo, tres en raya, el intruso, ¿qué sigue?, diferencias,
sumas, carrera, pesca, mi mascota y vestir). Todos tienen tres niveles: Fácil, Medio y Difícil. Todo funciona con toques,
con sonidos, estrellas y celebraciones, sin anuncios ni compras.

## Instalar el APK en la tablet

1. Copia `dist/JuegosMazatlam.apk` a la tablet (por USB, correo, WhatsApp, Drive, etc.).
2. En la tablet abre el archivo. Android preguntará si permites instalar apps de este origen
   ("Instalar aplicaciones desconocidas"): acepta.
3. Si aparece un aviso de Play Protect ("app no verificada"), toca **Más detalles → Instalar de todos modos**.
   Es normal porque la app no viene de Play Store.
4. Aparece el icono **Juegos Mazatlam** (estrella sonriente). Ábrelo y listo: no necesita internet.

Requisitos: Android 5.0 o superior. La app va a pantalla completa y mantiene la pantalla encendida.
Sugerencia: activa en la tablet **"Fijar pantalla"** (Ajustes → Seguridad) para que la niña no salga de la app.

## Juegos incluidos

| Juego | Qué practica |
|---|---|
| 🐵 Memoria | memoria visual, parejas de animales |
| 🎨 Colorear | colores, motricidad fina (toca para rellenar) |
| 🧩 Rompecabezas | lógica espacial (arrastra las piezas) |
| 🎈 Globos | reflejos y colores (toca los globos) |
| 🔤 Letras | abecedario: escucha y toca / traza la letra |
| 🔢 Números | contar del 1 al 10 |
| 🔺 Formas y colores | formas, colores y clasificar |
| 🐘 Sombras | asociación objeto–silueta |
| 🖍️ Dibujar | dibujo libre, stickers, arcoíris |
| 🎹 Piano | música, seguir una canción |
| 🟢 Simón dice | memoria de secuencias |
| 🐹 Atrapa al topo | atención y rapidez |
| 🐰 Laberinto | orientación y planificación |
| 🍌 Alimenta | asociación animal–comida (arrastrar) |
| 👾 Crea tu monstruo | creatividad, combinar partes |
| 🐱 Tres en raya | estrategia sencilla, jugar de a dos |
| 🔍 El intruso | categorías, observación |
| 🔵 ¿Qué sigue? | patrones y secuencias |
| 👀 Diferencias | atención al detalle |
| ➕ Sumas | sumar y restar con objetos |
| 🏃 Carrera | reflejos (salta los obstáculos) |
| 🎣 Pesca | tiempo de reacción, colores |
| 🐶 Mi mascota | cuidar, responsabilidad |
| 👗 Vestir | creatividad, clima y ocasiones |

## Actualizar la app sin desinstalarla

Cada versión nueva se firma con la misma llave y sube el número de versión (`android:versionCode` en
`android/AndroidManifest.xml` y `versionCode` en `android/apktool.yml`). Basta con abrir el APK nuevo en la
tablet y Android lo instala encima del anterior conservando las estrellas y el progreso. Si al instalar dice
"la app no se instaló" o "paquete en conflicto", es que la versión no subió o se firmó con otra llave.

## Probar en la computadora

Abre `www/index.html` en Chrome (funciona igual que en la tablet).

## Cómo se construye el APK

No hace falta Android Studio ni el SDK. El script descarga dos herramientas de GitHub
(apktool y uber-apk-signer) y ensambla el APK:

```bash
cd juegos-kids
./build-apk.sh            # genera dist/JuegosMazatlam.apk
```

Necesita Java 11+ y curl. Para firmar con tu propia llave (recomendado si vas a actualizar la app
después): `KEYSTORE=mi.jks KS_ALIAS=alias KS_PASS=clave ./build-apk.sh`.

Estructura:

- `www/` — la app web (menú + `games/*.html`, un archivo por juego, todo inline y sin dependencias).
- `android/` — manifiesto, recursos, iconos y la actividad (`MainActivity.smali`, con su equivalente en Java
  como referencia) que abre un WebView a pantalla completa con `assets/www/index.html`.
- `icon/` — icono en SVG y script que genera los PNG (`node icon/render-icons.js`, usa Chromium/Playwright).
- `build-apk.sh` — empaqueta, firma (v1+v2+v3) y alinea el APK.
