# Ébano Parfums · portada, regalos y SEO

Revisión del 3 de septiembre de 2026. Cambios locales; no se realizó un despliegue.

## Resultado visual y funcional

- La primera pantalla contiene el logo grande de Ébano sobre el árbol, con una flecha discreta para continuar. No contiene títulos comerciales, párrafos ni botones de venta superpuestos. Se conserva la navegación superior de la tienda.
- El H1, la introducción, la descripción original, el catálogo y WhatsApp se trasladaron a la sección visible `#presentacion`, después de la portada. No se escondió contenido para buscadores.
- El WhatsApp flotante no cubre la portada ni duplica la llamada principal cuando está visible; reaparece en el resto del recorrido.
- Se añadió `#regalos` después del catálogo: pareja, cumpleaños y aniversarios, con orientación según gustos, presupuesto y fecha. No se inventaron reseñas, descuentos, envoltura de regalo ni existencias de productos concretos.
- Se terminaron las seis páginas del pie: Atención al Cliente, Envíos, Devoluciones, Términos y Condiciones, Política de Privacidad y Cookies. Funcionan con HTML y CSS; las preguntas y el menú de ayuda son desplegables nativos, sin bibliotecas JavaScript.
- Devoluciones y las tres páginas legales están señaladas como borradores, con `noindex, follow`, porque el negocio confirmó que aún no tiene definidos sus datos legales y condiciones. No se aprobaron políticas en su nombre.

La guía `frontend-design` orientó la composición: conservar negro, dorado, Cinzel y Montserrat; recuperar el protagonismo del logo y del árbol; separar la identidad visual del contenido comercial.

## ¿Conviene hablar de regalos?

Sí, como orientación útil al comprador. Es una oportunidad editorial razonable, no una garantía de tráfico o posicionamiento:

| Referencia observada | Evidencia | Aplicación en Ébano |
| --- | --- | --- |
| Internacional Perfumes RD | Una ficha de perfume relaciona el producto con cumpleaños, San Valentín y Navidad. | Hablar de ocasiones reales de compra, sin copiar sus textos ni atribuirnos sus productos o servicios. |
| Sephora | Mantiene una selección de regalos de cumpleaños que incluye fragancias. | Ayudar a elegir según la persona y la ocasión, además de las categorías masculina/femenina/unisex. |
| Google Search Central | Recomienda contenido útil para las personas, descriptivo y sin exageraciones. | Orientación breve y propia sobre preferencias, presupuesto y entrega, sin repetir palabras clave artificialmente. |

Fuentes consultadas: [ficha de Internacional Perfumes](https://internacionalperfumes.com/products/moschino-ladies-toy-2-bubble-gum-gift-set-fragrances), [selección de cumpleaños de Sephora](https://www.sephora.com/buy/best-birthday-gifts-for-her), [guía de contenido útil de Google](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

Esta revisión es un contraste orientativo de contenido comercial, no un estudio exhaustivo de competidores locales. No se midieron volúmenes de búsquedas, conversiones ni posiciones con Search Console. Las expresiones «perfumes para regalar», «regalo para tu pareja» y «regalo de cumpleaños» se aplicaron por su pertinencia, no por afirmar que sean las más buscadas.

## Auditoría SEO

| Comprobación | Resultado |
| --- | --- |
| Dominio principal | La URL sin `www` respondió con 308 hacia `https://www.ebanoparfums.com/`, que respondió 200. |
| Canónicas y referencias | Las siete páginas, datos estructurados, vistas sociales, `robots.txt` y sitemap locales ahora usan el dominio `www`. |
| H1 de inicio | Uno, descriptivo y visible debajo de la portada: perfumes originales en Higüey y República Dominicana. |
| Título y descripción | Se mantiene el título local; la descripción de inicio tiene 145 caracteres e incorpora la intención de regalo. Las seis páginas nuevas tienen títulos, descripciones y canónicas propios. |
| Datos estructurados | JSON válido de WebSite y Store en inicio, con los datos de contacto existentes; WebPage y BreadcrumbList en las páginas nuevas. Sin valoraciones ni reseñas ficticias. |
| Enlaces internos | Destinos de servicios y legales resueltos; acceso a regalos desde el pie; catálogo y WhatsApp conservados. |
| Sitemap | XML válido con inicio, atención y envíos. Los cuatro borradores se excluyeron deliberadamente. Fecha de inicio actualizada tras el cambio real. |
| Imágenes | Texto alternativo útil en producto y logo; árbol decorativo con alternativa vacía. |
| Acceso al contenido | Textos presentes en HTML, sin depender de animaciones ni peticiones a una API para aparecer. |
| Auditoría automática de inicio | SEO técnico 100/100 en las muestras finalizadas. No equivale a posicionamiento ni a indexación confirmada. |

La web pública todavía tenía el sitemap anterior al revisarla; estos ajustes solo tendrán efecto público después de publicar. El 100 automático tampoco valida la razón social, dirección completa o políticas pendientes.

## Rendimiento

Lighthouse 13.4.1 en Chrome 152, sobre `http://127.0.0.1:4173/`. Móvil: 412 × 823, DPR 1.75, red simulada y CPU ×4. Escritorio: configuración `--preset=desktop`. Google Tag Manager se mantuvo activo.

| Indicador | Móvil, muestra 1 | Móvil, muestra 2 | Móvil, muestra 3 | Escritorio |
| --- | ---: | ---: | ---: | ---: |
| Rendimiento | 96/100 | 78/100 | 84/100 | 99/100 |
| Accesibilidad automática | 100/100 | 100/100 | 100/100 | 100/100 |
| Buenas prácticas | 100/100 | 100/100 | 100/100 | 100/100 |
| SEO técnico | 100/100 | 100/100 | 100/100 | 100/100 |
| FCP | 1.21 s | 1.80 s | 1.72 s | 0.36 s |
| LCP | 2.80 s | 4.19 s | 4.00 s | 0.78 s |
| TBT | 20.5 ms | 270.5 ms | 181.5 ms | 0 ms |
| CLS | 0 | 0 | 0 | 0 |
| Transferencia registrada | 584,262 bytes | 584,262 bytes | 584,262 bytes | 773,829 bytes |

Las tres muestras móviles corresponden a la misma versión y transfieren los mismos bytes, pero el trabajo de CPU observado varía. La mediana de rendimiento es 84/100 y el rango 78–96. La tercera ejecución advierte que la CPU del equipo de pruebas es más lenta de lo que Lighthouse espera. Esto limita la comparación, sin demostrar por sí solo el origen de toda la variación. No se debe atribuir únicamente a terceros ni prometer un 96 estable. Incluso en la muestra más rápida, el LCP móvil de 2.80 s conserva margen de mejora.

Optimizaciones realizadas:

- Árbol de escritorio: derivado WebP de 260,192 bytes frente a los 684,848 bytes anteriores, manteniendo el original. Móvil: 81,490 bytes.
- Logo adaptado al tamaño de pantalla y precargado antes de los estilos para adelantar su descarga.
- Fuentes locales y contenido accesible sin animación de entrada obligatoria.
- Sin canvas animado ni bucles continuos de redibujado.
- Se eliminó la lectura de geometría al iniciar el encabezado. Un observador controla su estado; las muestras posteriores ya no señalaron ese cálculo forzado.
- Versiones en las URL de CSS/JS para evitar que una copia antigua en caché mezcle el diseño anterior con el HTML nuevo.

Durante el desarrollo se guardaron muestras intermedias de 69, 88 y 86. No son el resultado final ni se eliminaron del historial de auditoría. El 69 permitió detectar el cálculo de diseño al arrancar; la precarga posterior del logo mejoró su descubrimiento. La variación entre ejecuciones impide atribuir cada diferencia de puntuación a una sola modificación.

Informes finales: [móvil 1](home-delivery-mobile.report.html), [móvil 2](home-delivery-mobile-repeat.report.html), [móvil 3](home-delivery-mobile-third.report.html), [escritorio](home-delivery-desktop.report.html). Cada HTML tiene su JSON correspondiente en esta carpeta.

Los informes se generaron completos y sin `runtimeError`. La tercera muestra móvil contiene la advertencia de CPU indicada arriba; las otras muestras finales no tienen advertencias de auditoría. Al finalizar, Windows impidió borrar carpetas temporales de Lighthouse y el proceso devolvió código 1 durante la limpieza. No es un error JavaScript de la web. Se conserva esta limitación para distinguir una auditoría terminada de un cierre limpio del programa.

Son pruebas de laboratorio locales, no Core Web Vitals de usuarios reales. No miden INP de campo ni la red y el servidor públicos. La caché y compresión del servidor Python local no representan necesariamente el alojamiento Vercel público.

## Verificación y límites

- 30 pruebas automatizadas aprobadas: portada sin mensajes comerciales; reubicación del H1 y copia; regalos; recursos y anclas; canónicas; estados del menú y encabezado; WhatsApp flotante; seis páginas; borradores no indexables; datos estructurados.
- Sintaxis de `site.js` y `git diff --check` correctos.
- Portada comprobada en anchos reales de 320, 360, 390, 430, 768, 844, 970 y 1440 px, incluida orientación horizontal. El alto de la portada coincide con la ventana; la introducción empieza después. Sin desbordamientos horizontales.
- Enlaces y controles revisados con objetivos de al menos 44 px. Las seis páginas de ayuda se revisaron a 320, 390 y 1440 px; se corrigió el área táctil del enlace «Inicio».
- Interacción real: flecha de portada a introducción, navegación de ayuda a Envíos, apertura de preguntas y estado del encabezado. Sin errores de consola en las comprobaciones finales.
- No se enviaron mensajes, pedidos, formularios ni pagos a plataformas externas. No se publicó ni se hizo commit.

Repetir las pruebas locales:

```powershell
node --test scripts/mobile-ux.test.mjs scripts/support-pages.test.mjs scripts/home-cover.test.mjs
node --check site.js
git diff --check
```

## Pendientes del negocio o de publicación

1. Completar razón social, RNC, dirección, condiciones de pago/envío/devolución y revisar los borradores antes de convertirlos en políticas definitivas. No quitar `noindex` sin esa revisión.
2. Inventariar etiquetas/cookies reales y definir el consentimiento. La página de cookies es informativa; no se añadió un panel que aparentara gestionar preferencias sin hacerlo.
3. Incorporar las URL reales de Instagram y Facebook: esos enlaces de inicio siguen pendientes y no se inventaron perfiles.
4. Publicar los siete HTML junto con CSS, JS, fuentes e imágenes. No es necesario publicar `audit/` ni `scripts/`.
5. Medir la URL pública después del despliegue, revisar caché/compresión y comprobar Core Web Vitals cuando existan datos de campo. Investigar la variación móvil antes de afirmar una mejora estable.
6. En Search Console, comprobar el sitemap `www`, indexación y consultas de marca/locales/regalos. No hay garantía de primera posición en Google.
