# Reconstruir los potreros — bitácora y método

> **En curso, 2026-08-22.** Estado al cierre de esta sesión: **15 caras cerradas · 99.8 ha ·
> 4 con nombre · 17 extremos sueltos** (de 60 al empezar).
> Lo produce [`../../scripts/extract_potreros.py`](../../scripts/extract_potreros.py).

## El problema

La capa `Cerca` del IGAC son 70 fragmentos que **no se tocan entre sí**. No es un problema de
nodado: la mediana entre un extremo suelto y la cerca más cercana era **26,6 m**. Faltan cercas,
sobre todo bajo dosel, donde la imagen no las ve.

Manuel, 2026-08-22: *"cuando las miras parece que sí cierran; es sólo un problema de la
estructura de datos"* — cierto en parte. Algunas sí se tocaban y el nodado las unió; muchas
otras faltaban de verdad.

## El método

1. **Grafo planar** de `Cerca` (sólo las nuestras) + linderos.
2. **Nodado** — partir tramos donde otra línea termina encima. Agrupación por **proximidad**,
   no por rejilla: dos vértices a 5 cm que caen a lados distintos de una celda quedaban
   separados, y eso solo ya rompía la red.
3. **Cierres dictados por Manuel** — abajo.
4. **Podar** extremos colgantes y **recorrer las caras**.
5. Descartar caras que sean **mayoritariamente del vecino** o el **contorno del predio**.

## Las cinco formas de cierre

Las cercas se juntan de varias maneras y cada una necesita su forma. En
[`geo/cercas-cierres.json`](geo/cercas-cierres.json):

| Forma | Para qué |
|---|---|
| `[a, b]` | dos extremos numerados se unen |
| `[n, "@extend"]` | una cerca **muere en T** sobre otra — dos extremos no pueden decir eso |
| `[n, "agua:beb-3"]` | varias cercas **concurren en una cosa** (bebedero, saladero) |
| `[n, [lon, lat]]` | llega a un **punto** que Manuel marca con la tecla **C** |
| `[[lon,lat], [lon,lat]]` | cerca entre **dos puntos marcados**, sin extremo numerado |

Un **4º elemento `true`** significa *"esto ES una cerca real, el IGAC no la vio"*. Esas además
salen a `cercas-inferidas.geojson`, se dibujan aparte, y **entran al grafo como geometría** —
así una cerca posterior puede morir a media luz sobre ellas.

Sin la marca, el cierre **cierra el potrero pero no dibuja cerca**: un quiebrapatas o el corte
para un bebedero son huecos reales donde no hay cerca.

## Reglas que se ganaron a golpes

- **Los números de extremo NO se reciclan.** [`geo/cercas-numeracion.json`](geo/cercas-numeracion.json)
  es un registro permanente. Cuando un hueco se cierra desaparece de la lista de abiertos, y al
  renumerar, tres instrucciones correctas de Manuel se convirtieron en aristas de 271, 309 y
  **685 m**. Por eso hay guardas de longitud.
- **El motivo lo dice Manuel, no se infiere.** Un hueco de 7–12 m parece un quiebrapatas y
  resultó ser un bebedero con la cerca partida. Y **no deducir del bosque**: en la mayor parte
  del bosque *sí* hay cerca; lo que falla es la visibilidad.
- **Una cara se juzga por su ÁREA, no por su centroide.** Un potrero grande o cóncavo pegado al
  lindero puede tener el centroide fuera. Ese test descartó en silencio una cara real de 23 ha.
- **Una cerca perimetral abraza el lindero.** Rozarlo en un punto no basta: una cerca del vecino
  de 2.183 m calificaba por un solo vértice a 10 m.
- **Los puntos que marca Manuel enganchan a 6 m**, los vértices crudos del IGAC a 2 m. Él señala
  una unión en el terreno; la línea catastral está corrida un par de metros por naturaleza.

## Lo que apareció de paso

Cerrar potreros resultó ser también un **inventario de infraestructura**:

| | |
|---|---|
| **Cercas recuperadas** | **13 · ~2 km** que el IGAC no capturó, casi todas bajo dosel |
| **Bebedero 4** | reubicado 68 m, de `baja` a `alta` |
| **Bebedero 9** | reubicado 4 m, de `baja` a `alta` |
| **Bebedero nuevo** | en el hueco 32–33, a 95 m de todo lo conocido |
| **Saladero 1** | primera capa de infraestructura de **ganado** |
| **Confirmación cruzada** | los huecos 16–17 y 14–15 caen a **0 m** de los Bebederos 2 y 3 |

> **La regla de Manuel:** los bebederos se construyen en **límites de potrero**, sobre todo donde
> concurren varios, para servir a más de uno. Sirve como control de calidad — pero **no es regla
> dura**: si el potrero es grande y los demás ya tienen agua, puede ir en otra parte.

## Agua y sal por potrero

Cada cara lleva sus fuentes. Un punto sirve al potrero si está **dentro o sobre el anillo**
(tolerancia 8 m — error de coordenada, no alcance). Los bebederos y saladeros nuevos van en el
lindero para servir a varios; los viejos van en el **centro** de uno solo.

**Sin bebedero mapeado ≠ toma de la quebrada.** Puede ser que el ganado beba del cauce, o que no
hayamos ubicado su bebedero. Las dos quedan abiertas.

## Abierto

- **17 extremos sueltos.** Los fáciles ya están; quedan los que necesitan un punto marcado.
- **El rectángulo NO cierra** pese a tener sus cuatro lados dibujados — pendiente de diagnóstico.
- **Hueco 21–22**: hay algo, Manuel no distingue si bebedero o saladero. **Importa**: si es
  bebedero hay que conectarlo a la red de agua.
- **Bebederos 6, 7 y 8** siguen flotando a 24–79 m de toda cerca, con posición `baja`.
- **Siete potreros sin bebedero mapeado.**
- **El Guaico (Santa Bárbara) no tiene datos de cerca.** Verificado: el IGAC **no ha producido**
  cartografía vectorial 1:5000 para ese municipio. Habría que digitalizar desde la ortofoto.
- **Herramienta pedida por Manuel**: seleccionar aristas con el ratón (resaltar al pasar por
  encima, selección múltiple con ⌘, entre capas) para poder señalar exactamente de qué línea
  habla, en vez de describirla.

## Los nombres son del lugar, no del número

La numeración va por área y se baraja cada vez que aparece una cara nueva, así que los nombres
se anclan a un **punto** en [`geo/potreros-nombres.json`](geo/potreros-nombres.json).

Con nombre: **Portugal · Lajas · Paraíso · Ciruelo**. Tres de los cuatro **ya estaban en el plano
de 2003** junto con Bilbao, Siberia y Marruecos — los nombres han sobrevivido veintitrés años,
así que los que faltan probablemente siguen vivos.
