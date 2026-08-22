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
- **Una cerca dictada entra UNA sola vez.** Va a `lines` antes del *noding*, para que se parta
  donde otras la tocan. Si además se añade después como arista recta del grafo, esa recta queda
  *en paralelo* sobre sus propias mitades, y el recorrido de caras toma el atajo. Fue justo lo
  que pasó junto al Bebedero 9: una arista de **189,8 m** corría al lado de 158,2 m + 31,6 m y
  se saltaba la esquina, así que el rectángulo de 3,76 ha nunca cerró. Las cuatro esquinas
  existían y tres de los cuatro lados eran adyacencias directas — el grafo *parecía* correcto.
  El síntoma que lo delata: **dos aristas con el mismo rumbo desde un nodo**.
- **Un cierre dictado no se redibuja si la cerca ya está.** Un lado que se inventó entre el
  Bebedero 9 y el vértice al oriente duplicó una cerca existente más matizada y creó una astilla
  de 0,13 ha. Antes de dictar un lado, mirar si ya hay línea.

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

## La auditoría: qué creemos de verdad

[`geo/potreros-estado.json`](geo/potreros-estado.json) — anclado a un PUNTO, por lo mismo que
los nombres: la numeración va por área y se baraja en cuanto aparece o desaparece una cara.

Se marca con `scripts/estado_potrero.py "Potrero 8" final`, diciendo el número que se ve en el
mapa en ese momento; el script lo convierte al punto.

| Estado | Qué significa |
|---|---|
| `final` | Los bordes son **correctos**. Puede faltarle el nombre — eso no lo hace menos final. |
| `por_subdividir` | Cierra, pero es un resto: por dentro hay más de un potrero. |
| `abierto` | Todavía no cierra, o cierra por donde no debe. |
| `por_ajustar` | Es un solo potrero, pero algún borde está mal trazado. |
| *(sin marcar)* | **No auditado.** No quiere decir que esté bien. |

**El estado no se infiere nunca.** Que una cara cierre no dice nada de si sus bordes son
reales: la cara de 23,31 ha del noroeste cerraba sobre un atajo de 97,7 m y parecía perfecta
durante días. Sólo Manuel, sobre la ortofoto, puede confirmar un borde.

En el mapa, **lo confirmado no lleva marca y lo no confirmado lleva `?`** — decisión de Manuel,
y es la correcta: así un mapa limpio es un mapa terminado, y «sin auditar» pesa lo mismo que
«auditado y mal», que es la verdad, porque ambos siguen necesitándolo a él.

El resumen se mide **por área**, no por número de potreros: un potrero confirmado de 1,9 ha y
uno de 35,8 ha no son la misma cantidad de certeza.

## Los nombres son del lugar, no del número

La numeración va por área y se baraja cada vez que aparece una cara nueva, así que los nombres
se anclan a un **punto** en [`geo/potreros-nombres.json`](geo/potreros-nombres.json).

Con nombre: **Portugal · Lajas · Paraíso · Ciruelo**. Tres de los cuatro **ya estaban en el plano
de 2003** junto con Bilbao, Siberia y Marruecos — los nombres han sobrevivido veintitrés años,
así que los que faltan probablemente siguen vivos.
