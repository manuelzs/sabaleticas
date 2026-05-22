# Lo que necesito de ti para armar el P&L — guía de captura

> Este es **el dato #1 que destraba todo.** GSMI tiene los movimientos pero **nunca tiene
> precios ni pesos.** Sin tus registros no puedo confirmar por qué se está perdiendo plata
> (ver [`diagnosis.md`](diagnosis.md)). Con una versión *aunque sea aproximada* de lo de
> abajo, armo: P&L de 12 meses, cabezas rotadas/año, spread $/kg compra-vs-venta, y costo
> por cabeza/mes — que es lo que muestra dónde está la fuga.

## Cómo llenarlo

Hay tres archivos para llenar en [`intake/`](intake/). Cada uno trae
**una fila de EJEMPLO marcada — bórrala** y pon tus datos. No tienen que ser perfectos;
**aproximado y completo gana a exacto e incompleto.** Si no sabes un dato, déjalo en blanco.
Objetivo: **los últimos 12 meses.**

### 1. `sales_intake.csv` — cada venta
La más importante. Una fila por venta (puedes guiarte por las guías GSMI para las fechas).

| Columna | Qué poner |
|---|---|
| `fecha_venta` | YYYY-MM-DD |
| `n_cabezas` | cuántas cabezas en esa venta |
| `kg_total` | peso total del lote **en pie** (kg). Si solo tienes promedio por animal, multiplícalo |
| `valor_total_cop` | **lo que TE pagaron** (neto de comisión si fue consignación) |
| `comprador` | frigorífico / feria / finca |
| `canal` | `consignacion` o `directo` (PSE) |
| `comisionista` | ELUPI / Agroequina / ninguno |
| `notas` | lo que sea (venta forzada por accidente, etc.) |

### 2. `purchases_intake.csv` — cada compra de hembras
Necesario para el **spread**: a cuánto el kg compraste vs. a cuánto vendiste.

| Columna | Qué poner |
|---|---|
| `fecha_compra` | YYYY-MM-DD |
| `n_cabezas` / `kg_total` | cabezas y peso total al **entrar** |
| `valor_total_cop` | lo que pagaste por el lote |
| `vendedor_o_feria` | de dónde vinieron |

### 3. `costs_intake.csv` — gastos mensuales
Aunque sea **un total por mes** ya sirve. Mejor si lo partes por categoría.

| Columna | Qué poner |
|---|---|
| `mes` | YYYY-MM |
| `categoria` | `labor` / `feed` (sal, melaza) / `health` (drogas, vacunas) / `pasture` / `transport` / `admin` / `other` |
| `valor_cop` | monto |

## Qué hago yo cuando me los pases

1. Los cargo a `lotes` / `sales` / `costs` (CSVs canónicos) y reconstruyo `sabaleticas.db`.
2. Saco: **P&L de 12 meses**, **cabezas rotadas/año** (cierra el hueco de [`../herd/turnover.md`](../herd/turnover.md)),
   **spread $/kg compra-vs-venta** (prueba H3), **costo/cabeza/mes** (prueba H4), y
   **$/kg realizado por canal** vs. el benchmark de Medellín (prueba H6).
3. Con eso confirmamos o matamos cada hipótesis con números reales.

## Si solo puedes darme una cosa primero

`sales_intake.csv` de los últimos 12 meses. Las ventas solas ya me dan cabezas rotadas/año
y el $/kg realizado — los dos números que más faltan ahora mismo.
