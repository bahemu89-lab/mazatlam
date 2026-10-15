# Precios USA

Carpeta para llevar el control de los precios y el catálogo de la operación en USA, a partir de los archivos que manda Erika.

## Contenido

- `CONTROL_PRECIOS_USA.xlsx`: libro de control.
  - **Léeme**: parámetros (margen objetivo y lb/kg en celdas amarillas) y cómo se calcula el precio.
  - **Catálogo USA**: 72 productos con código, nombre en el BMS, español, inglés revisado, proveedor, costos SELECT/CHOICE en USD/lb, precio de venta en USD/lb y USD/kg, observación y estatus.
  - **Observaciones**: pendientes de la revisión, con prioridad y estatus.
  - **Bitácora**: qué archivo llegó, cuándo y si ya se revisó.
  - **Importar Odoo**: productos con el formato para cargarlos en Odoo (código y nombre del BMS, inglés como descripción secundaria, unidad lb).
- **`ODOO_USA_COMPLETO.xlsx` (el que se usa)**: todo en un solo archivo.
  - **PLAN ODOO**: los 28 pasos en orden (empresa, ajustes, catálogos, productos, arranque y trámites fuera de Odoo), con menú de Odoo, hoja a importar, si ya se puede hacer, responsable y estatus.
  - Hojas **Imp 1 a Imp 6**: lo que se importa, en ese orden (categorías, impuestos, proveedores, productos, inventario inicial y pedido inicial).
  - **Pendientes**: productos a los que les falta algún dato.
- `PRODUCTOS_USA_ODOO.xlsx` y `ODOO_CONFIG_USA.xlsx`: versiones anteriores por separado; su contenido ya está dentro de `ODOO_USA_COMPLETO.xlsx`.
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

## Formato Odoo (12-oct-2026)

Se llenó `formato_ejemplo_odoo` con los productos del catálogo de Erika, del planograma y de `2. Productos`. Cambios respecto al formato de México:

- **Impuestos:** los de México (IVA, IEPS, retenciones) no aplican. Alimentos llevan `CA Exempt Food 0%`; lo gravable (bebidas con alcohol, desechables, comida preparada) lleva `CA Sales Tax` con la tasa de la dirección de cada tienda. En compras no va impuesto.
- **Código SAT:** no se usa en USA. Se llenó con la clave UNSPSC de la categoría, pero al importar en la empresa de USA se marca como *No importar*.
- **Tipo de producto:** `Bienes` con inventario *Por cantidad* (el ejemplo traía `Combo`).
- **Columnas agregadas:** descripción de venta en inglés, disponible en PdV, pesar con báscula, proveedor y precio de proveedor.
- **No se pasaron** "Dividendos Pagados" ni "ASESORIAS" (servicios contables de México).

## Productos de Compras (correo de Jessica, 12-oct-2026)

Archivo `ALTA DE PRODUCTO USA.xlsx` (correo "Alta de productos USA", cc Erika): 13 productos con costo USD/lb y precio = costo / 0.55.

- **9 completan** productos que estaban sin costo (chorizo uruguayo, chorizo ahumado, longaniza picante, pollo fresco blanco, patas, hígado, mollejas, buche y corazón de pollo). El costo de Jessica reemplaza al de Erika donde había (pollo blanco 1.42 → 1.29, mollejas 1.17 → 1.19).
- **4 son nuevos**: costilla marinada BBQ, chuleta natural adobada, churrasco de sirloin, bistec de lomo al pastor.
- **3 ya tienen código** por nombre idéntico en el BMS: 13045 Pata de pollo, 13046 Hígado de pollo, 13047 Molleja de pollo (confirmar). Pasaron a *Productos* (ahora 48 listos).
- **10 siguen sin código** BMS y quedan en *Pendientes*, ya con costo y precio.
- Revisar con Compras: el periodo de afectación trae una fecha de inicio distinta en cada renglón (12 al 24 de octubre) y la unidad dice KG aunque el precio es por libra.

## Impuestos por producto (13-oct-2026)

Hoja **Impuestos por producto** en `ODOO_USA_COMPLETO.xlsx`: los 167 productos con su impuesto y fundamento.

- **Ninguno paga sales tax en California**: todos son alimentos para preparar en casa (carne cruda y marinada, pollo, lácteos, huevo, tortillas, botanas, salsas, especias, verdura). Llevan `CA Exempt Food 0%`. Fundamento: CDTFA Regulación 1602.
- La michelada de 32 oz se dejó exenta porque las del mercado son mezcla sin alcohol para preparar con cerveza; si la etiqueta dice que trae alcohol o gas, cambia a `CA Sales Tax` (y lleva CRV).
- Pagarían sales tax si se venden: refrescos y bebidas con gas, cerveza/alcohol, hielo, carbón, desechables, limpieza y comida caliente o para consumir en tienda (Reg. 1603). Lo pagado con EBT/SNAP no lleva impuesto (Reg. 1602.5).

## Revisión final del archivo (13-oct-2026)

Se validaron los 167 productos (48 listos + 119 pendientes) contra las listas del propio archivo: categoría, impuesto, unidad de medida, clave UNSPSC, tipo/rastreo, inglés, báscula, proveedor, referencias y nombres duplicados, precio mayor que costo, y que inventario y pedido inicial solo usen productos listos. Sin errores.

Correcciones: papas (granel, por libra) marcadas para báscula; pollo empanizado/procesado con clave UNSPSC 50112010 (pollo procesado) en vez de pollo fresco.

## Formato del proveedor de Odoo (15-oct-2026)

`2._Productos_USA_LLENO.xlsx`: el formato que pidió el proveedor (`2._Productos1.xlsx`) llenado sin cambiar su estructura (se editaron solo las celdas; se conservan listas desplegables, protección de hoja y hojas ocultas).

- Productos en las filas 4 a 170: 48 completos (filas 4–51) y 119 con datos pendientes (filas 52–170). Las 2 filas de ejemplo del proveedor no se tocaron.
- Único ajuste: en la hoja *Impuestos* se agregaron `CA Exempt Food 0%` y `CA Sales Tax` (filas 34–35) y la lista de "Impuestos cliente" se amplió a esas filas.
- Clave SAT: la lista del formato no trae res ni pollo frescos; se usaron 50112000 (carnes) y 50112010 (pollo).
- El formato no tiene columnas para descripción en inglés, báscula ni proveedor; esos datos siguen en `ODOO_USA_COMPLETO.xlsx`.

## Precios de mercado en California (15-oct-2026)

Hoja **Mercado California** en `ODOO_USA_COMPLETO.xlsx`: precio al público encontrado en supermercados hispanos de California (Northgate, Cardenas, El Super, Superior, Vallarta, Rancho San Miguel, Food 4 Less, Smart & Final; abarrotes también Walmart, Ralphs, Costco, H-E-B) para 140 de los 167 productos, con fuente.

- Compara tu precio contra el típico del mercado: 19 productos ARRIBA (>10%), 19 ABAJO, 18 EN LÍNEA (los demás no tienen precio propio todavía).
- Precio sugerido = mercado − 5 % (editable); costo máximo = el que permite 45 % de margen con ese precio (editable).
- 32 productos no alcanzan 45 % de margen a precio de mercado con su costo actual (costilla cargada, cola, lengua, diezmillo c/hueso, pulpa bola/negra, T-bone, costilla BBQ, churrasco, deshebrada, patas/molleja/dentros de pollo, entre otros): hay que negociar costo o aceptar menos margen.
- Son precios en línea (suelen ser 10–20 % más altos que en anaquel) tomados de resultados de búsqueda; verificar en tienda.
- Aviso: Tío Francisco (Rizo-López Foods) retiró sus lácteos en feb-2024 por listeria; confirmar marca con el proveedor.

## Formato del proveedor completo (15-oct-2026)

`2._Productos_USA_LLENO.xlsx` regenerado desde el formato original del proveedor:
- Productos desde la fila 2 (se quitaron los 2 ejemplos de México con retención de ISR, que fallarían en la empresa de USA).
- 158 productos: 58 con costo y precio reales y 100 con precio estimado del mercado de California (precio = mercado − 5 %; costo = precio × 55 %).
- 9 productos sin precio ni comparable quedaron fuera para que no entren con precio 0 (queso fresco Jiménez, jamón 6 lb, huevo flat 20, cueritos 45 g, tostadas de nopal, sopes, platanillo, machaca a granel, arrachera Paosa).
- Validado contra las listas del propio formato (tipo, rastreo, clave SAT, unidad, impuestos, políticas): sin errores.
- Hoja *Formato proveedor* en `ODOO_USA_COMPLETO.xlsx` dice el origen del precio de cada producto.

