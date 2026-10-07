# Precios USA

Carpeta para llevar el control de los precios y el catálogo de la operación en USA, a partir de los archivos que manda Erika.

## Contenido

- `CONTROL_PRECIOS_USA.xlsx`: libro de control.
  - **Léeme**: parámetros (margen objetivo y lb/kg en celdas amarillas) y cómo se calcula el precio.
  - **Catálogo USA**: 72 productos con código, nombre en el BMS, español, inglés revisado, proveedor, costos SELECT/CHOICE en USD/lb, precio de venta en USD/lb y USD/kg, observación y estatus.
  - **Observaciones**: pendientes de la revisión, con prioridad y estatus.
  - **Bitácora**: qué archivo llegó, cuándo y si ya se revisó.
  - **Importar Odoo**: productos con el formato para cargarlos en Odoo (código y nombre del BMS, inglés como descripción secundaria, unidad lb).
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

## Sistema y idioma (decidido 07-oct-2026)

- **USA se maneja en Odoo**, con **los mismos productos, códigos y descripciones del BMS** de México. Por eso los códigos equivocados (11014, 16025, 31035) sí hay que corregirlos antes de cargar.
- **Descripción principal: español**, igual que en el BMS (campo *Name* en Odoo).
- **Descripción secundaria: inglés** (campo *Sales Description* en Odoo, o traducción del nombre si se activa el idioma inglés). Es la que sirve para etiqueta de báscula y empaque, porque en USA las etiquetas de carne deben ir en inglés (USDA-FSIS).
- **Proveedores americanos (EG MEAT, Bay Premium, Sukarne USA):** pedir con el nombre del corte en inglés (por ejemplo pulpa negra = *bottom round*).
- **Unidad: libra (lb)** y precio en USD por libra.

La hoja **Importar Odoo** del libro de control ya trae los productos con los nombres de campo de Odoo. 44 de los 72 productos están listos; los otros 28 están marcados con el motivo (sin código, código equivocado o sin costo).

## Pendientes para cerrar

- Corregir los códigos 11014, 16025 y 31035, y asignar código a los 10 productos que no tienen.
- Definir proveedor único para la ranchera de res.
- Decidir la unidad de venta (lb) y si el precio sale de SELECT o CHOICE.
- Conseguir los 23 costos que faltan.
- Confirmar las traducciones de cortes con EG MEAT.
