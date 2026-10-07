# Precios USA

Carpeta para llevar el control de los precios y el catálogo de la operación en USA, a partir de los archivos que manda Erika.

## Contenido

- `CONTROL_PRECIOS_USA.xlsx`: libro de control.
  - **Léeme**: parámetros (margen objetivo y lb/kg en celdas amarillas) y cómo se calcula el precio.
  - **Catálogo USA**: 72 productos con código, nombre en el BMS, español, inglés revisado, proveedor, costos SELECT/CHOICE en USD/lb, precio de venta en USD/lb y USD/kg, observación y estatus.
  - **Observaciones**: pendientes de la revisión, con prioridad y estatus.
  - **Bitácora**: qué archivo llegó, cuándo y si ya se revisó.
- `originales/`: copia sin cambios de los archivos recibidos.

> Los `.xlsx` tienen costos, márgenes y teléfonos de proveedores. Este repositorio es **público**, por eso `.gitignore` los deja fuera del repo hasta que se decida dónde guardarlos.

## Revisión del archivo de Erika (06-oct-2026)

El archivo **sí sirve como base**, pero no está listo para dar de alta productos ni publicar precios. Puntos principales (el detalle completo está en la hoja *Observaciones*):

1. **Dos códigos equivocados** (comparados con la Lista 11 del BMS):
   - `11014` dice "Pescuezo c/hueso" y en el BMS es CHAMBARETE SIN HUESO.
   - `16025` dice "Ranchera res" y en el BMS es FRIJOLES C/CHORIZO DOÑA CHELA. Además se piden 2,000 kg a EDGAR **y** 2,000 kg a EG MEAT.
   - `31035` (Ranchera de cerdo, 1,500 kg a EDGAR) en el BMS es ARRACHERA MARINADA PAOSA 1 KG, un producto empacado.
2. **Unidad mezclada**: el costo y el precio están en USD por **libra**, pero la unidad de venta dice **KG** y el stock sugerido está en kg.
3. **10 productos sin código** y **23 sin costo** (en el original el precio sale en 0).
4. **Precio de venta** = costo / 0.55 (45 % de margen). Casi siempre usa el costo SELECT, pero en 3 productos usa CHOICE (en uno de ellos hay SELECT y aun así usa CHOICE).
5. **Totales que no cuadran**: COMPRA CARNICO suma 20,670 kg; los pedidos por proveedor suman 21,990 kg.
6. **Traducciones al inglés con errores**: pulpa blanca, negra y bola se traducen distinto en cada hoja; "RIB EYE" sale como T-BONE, "TENDER DE POLLO" como FRENCH FRIES, "LONGANIZA PREMIUM" como chicharrón, además de faltas de ortografía (CHIKEN, SAUSAJ, TONGE…).

## ¿Español o inglés?

Recomendación: **el español se queda como nombre principal y el inglés va como segundo nombre.**

- **BMS y operación interna (altas, pedidos, inventario, reportes): español.** La plantilla de altas y el BMS trabajan con la descripción en español y en mayúsculas, igual que en México. Así los códigos y nombres siguen siendo los mismos en los dos países.
- **Cliente en tienda: bilingüe.** La competencia que puso Erika (Northgate, Superior) son súper hispanos, donde el cliente busca "pulpa negra" o "diezmillo". El letrero de precio lleva el nombre en español grande y el inglés abajo.
- **Etiqueta de báscula y empaque: inglés obligatorio.** En USA las etiquetas de carne deben ir en inglés (USDA-FSIS); el español se puede agregar. Para esto sirve la columna *Product (English) — revisado*, y puede ir en la "Descripción corta" del producto.
- **Proveedores americanos (EG MEAT, Bay Premium, Sukarne USA): inglés** con el nombre del corte americano, para que no haya confusión al pedir (por ejemplo pulpa negra = *bottom round*).
- **Precio en USD por libra.** En USA se vende por libra; la columna en kg queda solo como referencia para compararla con México.

## Pendientes para cerrar

- Corregir los códigos 11014, 16025 y 31035, y asignar código a los 10 productos que no tienen.
- Definir proveedor único para la ranchera de res.
- Decidir la unidad de venta (lb) y si el precio sale de SELECT o CHOICE.
- Conseguir los 23 costos que faltan.
- Confirmar las traducciones de cortes con EG MEAT.
