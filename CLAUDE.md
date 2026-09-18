# Contexto del proyecto (mazatlam)

Repositorio de apps web ligeras de **BM Systems (BMS)** para la operación de Carnes Selectas Nayarit / SelectCarnes.
Idioma de trabajo: español. Cada app es un `index.html` autocontenido (HTML + CSS + JS), sin dependencias
ni servidor; los datos se guardan en `localStorage`.

## Módulos en esta rama

| Carpeta | App | Clave localStorage |
|---|---|---|
| `index.html` (raíz) | Pedidos por establecimiento: alta, estados, filtros, resumen, CSV | `bms_pedidos_v1` |
| `trazabilidad-tienda/` | Trazabilidad proveedor → SelectCarnes (CEDIS): pedido → romaneo → remisión → recepción → devolución → factura | `bms_trazabilidad_v1` |

Otros trabajos viven en ramas aparte (`claude/gifted-darwin-4rcds1` = seguimiento SRM; `claude/youthful-meitner-k6n5g9` = juegos para niños).

## Convenciones

- Mantener cada app en un solo archivo `index.html`; no introducir frameworks ni build.
- Textos de interfaz en español; folios, kilos y montos con formato mexicano.
- Al cambiar el modelo de datos, subir la versión de la clave de `localStorage` (`_v1` → `_v2`) y migrar.
- Probar abriendo el HTML en el navegador (o `python3 -m http.server 8080`).

## Trabajo con varios agentes

- El hilo principal coordina; cada agente toma **un módulo o archivo distinto** para no pisarse.
- Cada agente entrega: qué cambió, cómo lo probó y qué quedó pendiente.
- El hilo principal integra, prueba y hace un solo commit por bloque de trabajo.

## Preguntas abiertas con el negocio (trazabilidad)

- ¿Los precios se fijan en el pedido o al facturar?
- ¿Una remisión puede agrupar varios pedidos o siempre es 1 a 1?
- ¿Las devoluciones generan nota de crédito o reponen producto?
- ¿Hace falta catálogo fijo de productos o más razones/establecimientos?
