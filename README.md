# BMS — Pedidos por Establecimiento

Sistema web ligero para registrar y gestionar pedidos de los distintos establecimientos (sucursales, tiendas, puntos de venta).

## Funcionalidades

- **Registro de pedidos** con establecimiento, solicitante, fecha de entrega, notas y múltiples artículos (cantidad y precio unitario, con subtotales y total automáticos).
- **Flujo de estados**: Pendiente → En proceso → Entregado, con opción de cancelar.
- **Edición y eliminación** de pedidos existentes.
- **Filtros** por establecimiento, estado y búsqueda libre (folio, producto, solicitante, notas).
- **Panel de resumen**: totales por estado y monto activo acumulado.
- **Exportación a CSV** (una fila por artículo) para análisis en Excel u otras herramientas.
- **Persistencia local** en el navegador (`localStorage`) — no requiere servidor ni base de datos.

## Uso

Abrir `index.html` en cualquier navegador moderno. No hay dependencias ni proceso de instalación.

Para servirlo en red local (opcional):

```bash
python3 -m http.server 8080
# luego visitar http://localhost:8080
```

## Estructura

- `index.html` — aplicación completa (HTML, CSS y JavaScript en un solo archivo, sin dependencias externas).

## Notas técnicas

- Los datos se guardan bajo la clave `bms_pedidos_v1` de `localStorage`, por lo que son locales a cada navegador/equipo.
- Si en el futuro se necesita acceso multiusuario o centralizado, el modelo de datos (pedidos con folio, establecimiento, estado, artículos) está listo para migrarse a un backend con API.
