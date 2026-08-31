# Plan para procesar el levantamiento de 2007

> **Qué es.** `HAC-SAB-LOTES-2.dwg` — un levantamiento completo de la finca, con **43 capas**
> y unas 7.400 entidades. Hoy le hemos sacado **dos cosas**: los nombres de los potreros y los
> mojones. Todo lo demás sigue ahí sin tocar.
>
> **[owner, 2026-08-22] Manuel:** *«Es un plano muy bueno que no hemos explorado del todo.»*
> Este documento es el plan, no el trabajo. El trabajo queda **pendiente** (tiquete `T-022`).

## La regla que manda sobre todo lo demás

**El levantamiento es evidencia, no es la verdad.** Tiene **19 años**. En ese tiempo la finca
no sólo se ha subdividido: **también se han quitado divisiones**. Manuel lo dijo con San
Matías, y esa sigue siendo la prueba: el plano muestra una división que quizá ya no existe.

Por eso **nada de lo que salga de aquí entra directo a nuestros datos**. Cada capa se publica
como **capa de contraste**, rotulada `2007 (aprox.)`, con su propio color, apagable. Propone;
Manuel confirma. Es exactamente el trato que ya hicimos con los mojones, y funcionó: 17 de 17
nombres coincidieron, y los que no cuadraron resultaron ser el playón, no un error.

## Fase 0 — Georreferenciación. Es una compuerta, no un paso

**Nada se extrae hasta saber con cuánto error se extrae.** Todo lo que saquemos hereda la
transformación, así que medirla es lo primero y lo que decide si el resto sirve.

Hoy el ajuste es un ICP contra los mojones con **~19,6 m de residuo**, y parte de ese residuo
es real: por el lado del río la geometría cambió de verdad. Un residuo así **no sirve para
cercas** — a 20 m de error, una división puede caer en el potrero equivocado.

**La oportunidad:** la capa `COORDENADAS` trae **12 rótulos de texto** con valores del tipo
`1495617,78` y `5650,78`. Tienen pinta de ser **coordenadas de cuadrícula escritas en el plano**
(MAGNA-SIRGAS, coma decimal). Si son puntos de control con coordenada declarada, **se calcula
la transformación exacta en vez de ajustarla**, y pasamos de ~20 m a metros o menos.

Eso además ataca de frente el tiquete **`T-006`**: dónde está de verdad el **mojón de la casa**.
Fijado ése, se sabe cuánto del desfase de los demás mojones es georreferenciación y cuánto es
playón real — que es justo lo que hoy nos impide decidir el contorno del playón.

**Salida de la fase:** un número de error, escrito. Si es bueno, sigue el plan. Si sigue siendo
~20 m, extraemos igual pero **todo se rotula como orientativo** y no se usa para dictar cercas.

## Fase 1 — Las capas que responden tiquetes que ya tenemos

| Capa | Entidades | Qué responde |
|---|---|---|
| `CERCO` + `DIV-` | 141 + 75 polilíneas, 297 + 38 líneas | La geometría de cercas y divisiones. Ataca **`T-001`** (Potrero 1 → Altamira / San Sebastián), **`T-002`** (Potrero 3 → San Mateo / San Matías) y **`T-003`** (hasta dónde llega Rincón) |
| `lotes` + `AREA` | 108 + 98 · 245 puntos + 44 textos | **Los potreros de 2007 con su área rotulada.** Contrastar contra nuestros 47: donde 2007 y hoy no coincidan es exactamente dónde hay que mirar |
| `CANO` + `TUBERIA` | 126 polilíneas + 9 arcos · 3 polilíneas | Cauces y tubería. Alimenta el repaso de agua pendiente y quizá las **5 conexiones hipotéticas** que hoy van con línea discontinua |

Este orden no es arbitrario: son las tres capas que **cierran trabajo abierto** en vez de
abrir más.

## Fase 2 — Lo que no tenemos de ninguna otra fuente

| Capa | Entidades | Por qué interesa |
|---|---|---|
| `RASTROJO` + `MONTE` | 36 + 6 polilíneas | Rastrojo y monte en 2007. Sirve para calidad de pastoreo — y probablemente **explica dónde el IGAC no pudo ver cercas desde el aire**, que es la razón de ser de la capa «bajo dosel» |
| `VIA` · `ENERGIA` · `MURO` · `BRECHA` | 12 · 18 · 41 · 6 | Vías, línea eléctrica, muros y brechas. Infraestructura que hoy no está en ninguna capa |
| `LIMITE` | 9 | El lindero según el levantamiento. Tercera opinión frente al catastro y al plano de 2003 |

### `PROY-1` — probablemente no es de la finca
Es la capa más grande (**2.105 entidades**) y creemos que es **un diseño vial**, no datos del
predio: las capas `R60`, `R80`, `R450`, `R500` son **radios de curva**, y sus textos (`230`,
`225`, `215`, `220`) se leen como **abscisas**, no como cotas — la finca está a ~800 m, no a 230.
**Diez minutos para confirmar qué vía es**, y si es eso, se aparca.

## Fase 3 — La lista de descarte

Para no volver a leerlas cada vez: `HOJA` (marco del plano), `Defpoints` (interno de AutoCAD),
`PUA` (653 puntos — las marcas de púa que decoran `CERCO`, no información), `ANDEN`, `CUBIERTA`,
`DINTEL` (detalle de construcciones), `SOLID`, `VP`, `PL`, `LINEA`, `DOBLE-MAR`, `R`, `RE100`,
`r-100`, `R-100B`.

## Lo que hay que construir para hacerlo

El lector de DXF que tenemos sólo parsea **lo que necesitaban los mojones**. Para esto hace
falta:

- **`LWPOLYLINE`** — es el tipo dominante (1.233 entidades); hoy no lo leemos
- **`ARC`** y `CIRCLE` — los cauces los usan
- **`INSERT` / bloques** — 264 inserciones; los símbolos de mojón y de árbol viven ahí
- **`TEXT` con su posición**, para poder atar un área rotulada al lote que le corresponde

Sale un módulo `scripts/dxf.py` reutilizable, no un script por capa.

## Entregable por capa

Una capa se da por procesada cuando existen las tres cosas:

1. un `*.geojson` en `operations/land/geo/`, rotulado `2007 (aprox.)`,
2. su entrada en `LAYERS` de `sabaleticas/map.py`, **apagada por defecto**,
3. **o un tiquete**, cuando lo que aparece plantea una pregunta en vez de responderla.

Lo tercero es tan entregable como lo primero. Si el plano muestra una división que no sabemos
si existe hoy, el resultado correcto **no es una cerca nueva**: es un tiquete que dice
«confirmar en campo», igual que hicimos con San Matías.
