# BMS — Trazabilidad de la Tienda

Proyecto aparte que modela la trazabilidad completa del flujo de la tienda entre los proveedores y **SelectCarnes (CEDIS)**.

## Actores

- **Proveedores (razones)**: Julio, Julián, Procortes y Sherlyn — todos le venden a SelectCarnes.
- **Cliente / CEDIS**: SelectCarnes.

## Flujo de trazabilidad

1. **Pedido** — la razón levanta un pedido para SelectCarnes con productos, kilos solicitados y precio por kilo. El pedido queda en estado *"Por romanear"*.
2. **Romaneo** — el pedido aparece en la pestaña de romaneo; se capturan los kilos reales pesados por producto y el pedido pasa a *"Romaneado"*.
3. **Remisión** — del pedido romaneado se genera una **remisión** con los pesos reales. La remisión produce el **surtido del pedido** que viaja a recepción.
4. **Recepción** — SelectCarnes captura los kilos realmente recibidos por producto.
5. **Devolución** — si la recepción **no es total**, el sistema genera automáticamente una **devolución** en SelectCarnes ligada a la remisión, por la diferencia (con motivo por línea: merma, mal estado, etc.).
6. **Factura** — se emite por lo efectivamente recibido (remitido − devuelto) y queda **relacionada con la recepción y la remisión del CEDIS**.

## Pestaña de Trazabilidad

Muestra la cadena completa de cada pedido (Pedido → Romaneo → Remisión → Recepción → Devolución → Factura) con folios, kilos y fechas en cada eslabón, además de un resumen general (pedidos, remisiones, devoluciones, facturas y monto facturado).

## Uso

Abrir `trazabilidad-tienda/index.html` en cualquier navegador moderno. Sin dependencias ni servidor; los datos se guardan en `localStorage` bajo la clave `bms_trazabilidad_v1`.

## Pendiente de revisar con el negocio

- ¿Los precios se fijan en el pedido o al facturar?
- ¿Una remisión puede agrupar varios pedidos, o siempre es 1 a 1?
- ¿Las devoluciones generan nota de crédito o reponen producto?
- ¿Se necesitan más razones/establecimientos o un catálogo de productos fijo?
