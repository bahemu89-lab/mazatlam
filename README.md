# BMS · SRM — Seguimiento de pedidos

Herramienta para el seguimiento de los proyectos de BMS y la **trazabilidad de los pedidos**:
cada pedido guarda su historial de movimientos (quién lo cambió, cuándo y con qué nota).

## Qué incluye

- **Tablero**: totales, pedidos en curso, entregas vencidas y última actividad.
- **Pedidos**: lista con búsqueda y filtros por estado y proyecto. Al abrir un pedido se ve
  su ficha completa y su línea de tiempo (trazabilidad), y desde ahí se registran los
  cambios de estado con nota y nombre de quien registra.
- **Proyectos**: agrupan los pedidos (cliente, responsable, notas).

Estados del pedido: Solicitado → Aprobado → En proceso → Enviado → Recibido → Cerrado
(o Cancelado).

## Cómo se usa

Todo está en un solo archivo: [`index.html`](index.html).

- **Publicado como Artifact en claude.ai**: los datos se comparten en vivo entre todos los
  que abran la página (por ejemplo, con Daniel). El encabezado muestra
  "● datos compartidos en vivo".
- **Abierto directamente en el navegador** (doble clic al archivo): funciona igual, pero
  los datos se guardan solo en ese navegador (localStorage).

No requiere instalación, servidor ni dependencias.
