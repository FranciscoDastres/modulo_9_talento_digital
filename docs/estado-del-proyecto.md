# Estado del proyecto del módulo 9

Fecha: 13 de octubre de 2026. Autor: Francisco Meza Dastres.

## Implementación y documentación

| Requisito de la consigna | Evidencia | Estado |
| --- | --- | --- |
| Portada con proyecto, etapa, nombre y apellido | Página 1 del PDF | Elaborado |
| Empresa real y tabla de cinco aspectos | Mercado Libre, página 2; `/desarrollo-profesional/#empresa` | Elaborado con referencias |
| Al menos tres aportes | Página 3 y `#aportes` | 3 aportes con evidencia |
| Tres preguntas para el reclutador | Página 3 y `#aportes` | 3 preguntas |
| Mínimo tres proyectos del curso | Página 4; portada `#formacion` | Alke Wallet, TaskFlow y API del módulo 8 |
| Contacto personal | Portafolio, página 4 y CV | Correo, GitHub y enlace de LinkedIn |
| Sección distinguible para el caso de estudio | Portada `#caso-de-estudio`, página 5 del PDF | Implementado |
| Actividad, desafío, solución, herramientas, aprendizajes, métricas, habilidades y justificación | Página 5; relato y panel de resultados en Astro | Elaborado |
| PLUS FODA | Páginas 6 y 7; `/desarrollo-profesional/#foda` | 5 fortalezas, 5 áreas de mejora, 5 amenazas y 5 oportunidades |
| Documento de entrega con enlace al portafolio | PDF de ocho páginas | Elaborado; publicación pendiente |
| CV disponible | PDF de una página y enlaces de descarga | Elaborado con información existente |

## Verificación realizada

- `npm run build`: Astro Check con 0 errores, 0 advertencias y 0 hints; dos páginas compiladas.
- API del módulo 8: `npm test`, 10 pruebas aprobadas, 0 fallidas, 0 omitidas; PostgreSQL real y base temporal. 56 solicitudes HTTP. Commit `52d52240c4cbeb5da311ec735556544771a2af3b`.
- Navegador: portada y perfil revisados a 1440 y 390 píxeles. Sin desbordamiento horizontal del documento; tabla desplazable dentro de su contenedor en móvil. Navegación desde el menú hacia el perfil comprobada.
- Recuentos: 3 proyectos; 5 aspectos de empresa; 3 aportes; 3 preguntas; FODA con 5 elementos por categoría.
- Archivos públicos locales: PDF, CV y JSON de evidencia devolvieron HTTP 200.
- PDF: revisión visual de las ocho páginas y del CV. Enlaces PDF presentes y sin cortes de tablas o texto.

## Publicación en GitHub Pages

Repositorio: https://github.com/FranciscoDastres/modulo_9_talento_digital

Dirección del portafolio: https://franciscodastres.github.io/modulo_9_talento_digital/

El workflow `.github/workflows/pages.yml` compila Astro y despliega mediante GitHub Actions desde `main`. La configuración usa `site` y `base`, y los enlaces, imágenes y descargas respetan el prefijo del repositorio.

Estado: publicado y verificado el 13 de octubre de 2026. GitHub Actions completó los jobs de compilación y despliegue. La portada, la página profesional, los documentos y los recursos comprobados responden HTTP 200. Los PDF públicos coinciden byte por byte con los archivos de entrega.

Workflow verificado: https://github.com/FranciscoDastres/modulo_9_talento_digital/actions/runs/38486476245

Commit del sitio desplegado: `e2f750ea30cd77149efa14acb3c8f7b116b85c6d`. La revisión del navegador comprobó escritorio y móvil, tres proyectos, navegación al perfil y cinco elementos por categoría del FODA.

## Entrega

El documento principal y el CV están en `entrega/`. Los paquetes `entrega_modulo_9.zip` y `entrega_modulo_9.rar` se generan en la carpeta superior `pruebas`, junto a `modulo_9`. Incluyen los documentos y el código fuente en `codigo_fuente/`, sin dependencias ni archivos temporales.

La estructura de Astro está directamente en la raíz del repositorio. Para revisar la aplicación: `npm ci`, `npm run build` y `npm run preview`; abrir la ruta `/modulo_9_talento_digital/`.

La cuenta de LinkedIn no se modificó; se incluye su enlace existente. No se envió la entrega al aula, correo o Drive.
