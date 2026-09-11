# SRM CSN · Seguimiento con BM Systems

Herramienta para el **seguimiento del proyecto SRM** de Carnes Selectas Nayarit (CSN) con
**BM Systems** (Daniel Beltrán / Alejandro Tamayo): la presentación de lo que se quiere
hacer y la **trazabilidad de cada tema y folio** del proyecto.

## Qué incluye

- **Seguimiento**: tabla de temas y folios con BMS. Cada tema tiene tipo (Módulo SRM,
  Folio, Pendiente, Acuerdo), folio de BMS si aplica, de quién es el siguiente paso
  (CSN / BMS / Ambos) y su estado:
  Planteado → En revisión → Acordado → En desarrollo → Entregado → Validado (o Detenido).
  Al abrir un tema se ve su **trazabilidad**: la línea de tiempo de movimientos con fecha,
  nota y quién lo registró.
- **Planteamiento**: la presentación con los **diagramas ya existentes** del documento
  "SRM CSN — Flujo y áreas de oportunidad" (enviado a BMS el 27/08/2026): el flujo de la
  orden de compra al pago, el ciclo en 9 pasos por áreas y el resumen de las 9 etapas.

## Cómo se usa

Todo está en un solo archivo: [`index.html`](index.html).

- **Publicado como Artifact en claude.ai**: los datos se comparten en vivo entre todos los
  que abran la página (el encabezado muestra "● datos compartidos en vivo") — útil para
  revisarlo en las reuniones de seguimiento con BMS.
- **Abierto directamente en el navegador**: funciona igual, pero los datos se guardan solo
  en ese navegador (localStorage).

No requiere instalación, servidor ni dependencias.
