# Auditoría móvil de Ébano Parfums

Fecha: 2 de septiembre de 2026, hora de República Dominicana.

Se auditó la versión local antes de aplicar las mejoras. Después se verificaron el diseño responsive, la navegación, la accesibilidad automática y el rendimiento. No se ha publicado esta versión.

## Resultado de rendimiento

Lighthouse 13.4.1 sobre `http://127.0.0.1:4173/`, emulación móvil de 412 × 823, DPR 1.75, ralentización de CPU ×4 y red simulada. Google Tag Manager se mantuvo habilitado. Las dos mediciones posteriores usan la misma configuración que la inicial.

| Indicador | Antes | Después | Repetición |
| --- | ---: | ---: | ---: |
| Rendimiento | 80/100 | 95/100 | 94/100 |
| Accesibilidad automática | 93/100 | 100/100 | 100/100 |
| Buenas prácticas | 100/100 | 100/100 | 100/100 |
| SEO técnico automático | 100/100 | 100/100 | 100/100 |
| Primera aparición de contenido, FCP | 2.91 s | 1.44 s | 1.42 s |
| Elemento principal visible, LCP | 4.16 s | 2.79 s | 2.78 s |
| Bloqueo de ejecución, TBT | 7.5 ms | 106.5 ms | 128.5 ms |
| Desplazamientos inesperados, CLS | 0 | 0 | 0 |
| Datos transferidos en la auditoría | 1,231,947 bytes | 576,300 bytes | 576,300 bytes |

La transferencia se redujo un 53.2 %. El LCP bajó aproximadamente un 33 % y el FCP un 51 %. TBT no mejoró en estas ejecuciones; se conserva el dato para evitar presentar una mejora uniforme que no se midió.

Son mediciones de laboratorio locales, no resultados de teléfonos físicos ni de usuarios reales. No incluyen la latencia del alojamiento público, datos de campo de Core Web Vitals ni INP. Un 100 en accesibilidad no sustituye una evaluación manual completa con lectores de pantalla; un 100 en SEO técnico no garantiza posiciones en Google.

Informes completos:

- [Antes, HTML](mobile-before.report.html) · [JSON](mobile-before.report.json)
- [Después, HTML](mobile-after.report.html) · [JSON](mobile-after.report.json)
- [Repetición, HTML](mobile-after-repeat.report.html) · [JSON](mobile-after-repeat.report.json)

La repetición generó informes completos, sin `runtimeError` ni advertencias de auditoría. Al cerrar, Windows denegó la limpieza de su carpeta temporal y Lighthouse terminó con código 1. Este error corresponde al cierre del proceso, no a la página. Las mediciones preceden al último ajuste de dos reglas CSS que eliminó un margen duplicado al navegar a las secciones.

## Hallazgos y correcciones

| Hallazgo inicial | Cambio aplicado |
| --- | --- |
| El contenedor principal tenía `pointer-events: none`, impidiendo utilizar sus enlaces. | Las llamadas al catálogo y WhatsApp vuelven a admitir interacción. |
| Contenido importante arrancaba transparente y dependía de una biblioteca externa de animación. | Contenido visible desde el HTML; se eliminó esa dependencia. |
| Se detectaron 19 enlaces o controles con alguna dimensión menor de 44 px en la revisión inicial. | Objetivos táctiles de al menos 44 × 44 px y botones principales de 46–50 px de alto. |
| Textos pequeños, tenues y con poca jerarquía en móvil. | Mayor contraste, tamaños legibles, encabezados proporcionados y espaciado más compacto. |
| Menú móvil sin un estado accesible y manejo de cierre consistentes. | Botón con `aria-expanded`, cierre al seleccionar, pulsar Escape, salir del menú o cambiar de tamaño. Escape devuelve el foco al botón. |
| La portada dedicaba demasiado espacio a elementos decorativos antes de la compra. | Catálogo y WhatsApp aparecen antes del texto largo; se conserva la identidad negro/dorado. |
| Fondo de 684,848 bytes y dibujo continuo en canvas. | Imagen móvil de 81,490 bytes y fondo estático, sin bucle de redibujado. |
| Hoja de Google Fonts bloqueando el renderizado. | Mismas tipografías, Cinzel y Montserrat, alojadas localmente y precargadas; licencias incluidas. |
| WhatsApp flotante duplicado junto a la llamada principal. | Se oculta cuando la acción de WhatsApp de portada o contacto está visible. |
| Foco de teclado y navegación a secciones mejorables. | Enlace «Saltar al contenido», foco visible y separación bajo el encabezado fijo. |
| Enlaces de atención y envíos apuntaban a `#`. | Apuntan a contacto y zonas de entrega. |

Se conservaron las secciones, fotografías, contenido SEO local, catálogo de Treinta, enlace `https://wa.link/jnib6m` y analítica existentes. Las imágenes originales no se sobrescribieron. La guía `frontend-design` orientó las decisiones de jerarquía y estilo, manteniendo la identidad de la marca.

## Verificación funcional

- Nueve tamaños de ventana: 320 × 740, 360 × 800, 390 × 844, 430 × 932, 768 × 1024, 844 × 390, 968 × 900, 969 × 900 y 1280 × 900. En este navegador la barra de desplazamiento reserva 15 px del ancho.
- Sin desbordamiento horizontal y sin enlaces o botones visibles por debajo de 44 × 44 px en esos tamaños.
- Revisión visual de portada, menú, colección y contenido en móvil, tablet y escritorio.
- Menú abre y cierra; Escape restaura el foco; seleccionar una sección cierra el menú. Los destinos de catálogo y WhatsApp son los solicitados. No se realizaron pedidos ni se enviaron mensajes externos.
- Sin errores o advertencias de consola en la revisión local final.
- Siete pruebas automáticas aprobadas: estado del menú, Escape/foco, cuatro vías de cierre, pulsación interior, visibilidad del WhatsApp flotante, conservación de contenido/enlaces y validez de recursos/datos estructurados.
- Sintaxis JavaScript validada. Se implementó adaptación a movimiento reducido y navegación alternativa sin JavaScript; estas dos preferencias se revisaron en código, no mediante emulación del navegador.

Pruebas reproducibles, desde la raíz del proyecto:

```powershell
node --test scripts/mobile-ux.test.mjs
node --check site.js
git diff --check
```

Para repetir Lighthouse, servir el directorio por HTTP y ejecutar con Lighthouse 13.4.1 instalado:

```powershell
lighthouse http://127.0.0.1:4173/ --chrome-flags="--headless=new" --only-categories=performance,accessibility,best-practices,seo --output=json --output=html --output-path=./audit/mobile-new --quiet
```

## Pendiente antes y después de publicar

1. Publicar el conjunto completo, incluidos `mobile.css`, `site.js`, las imágenes WebP y `fonts/`; subir solo `index.html` dejaría recursos sin cargar.
2. Configurar compresión y caché en el alojamiento real, con invalidación/versionado de recursos. No se modificó una configuración de servidor desconocida.
3. Repetir la auditoría sobre la URL pública y probar en Android/iPhone físicos. El LCP local sigue alrededor de 2.8 s; todavía existe margen de mejora.
4. Revisar las etiquetas realmente necesarias en Google Tag Manager para reducir trabajo de terceros. No se eliminó analítica sin confirmar su uso.
5. Completar las URL reales de Instagram/Facebook y las páginas de devoluciones, términos, privacidad y cookies: los enlaces existentes siguen apuntando a `#`. No se inventaron perfiles ni políticas comerciales.
6. Comprobar datos de campo cuando haya tráfico suficiente; la puntuación local por sí sola no demuestra una mejora de conversiones o de posicionamiento.
