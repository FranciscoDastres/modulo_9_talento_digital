# Módulo 9 · Portafolio Digital

**Francisco Meza Dastres** — Parte 1: Desarrollo del Portafolio.

- **Portafolio:** https://franciscodastres.github.io/modulo_9_talento_digital/
- **Caso de estudio:** https://franciscodastres.github.io/modulo_9_talento_digital/#caso-de-estudio
- **Investigación y FODA:** https://franciscodastres.github.io/modulo_9_talento_digital/desarrollo-profesional/
- **Repositorio:** https://github.com/FranciscoDastres/modulo_9_talento_digital

## Demos interactivas

- [Alke Wallet](https://franciscodastres.github.io/modulo_9_talento_digital/demos/alke-wallet/login.html): billetera destacada, acceso con datos de ejemplo, depósitos, transferencias, recepción, retiro e historial con fondos ficticios.
- [TaskFlow](https://franciscodastres.github.io/modulo_9_talento_digital/demos/taskflow/index.html): crear, completar, editar, eliminar e importar tareas, con persistencia en el navegador.
- [Explorador de la API](https://franciscodastres.github.io/modulo_9_talento_digital/demos/api/): consulta de 56 respuestas registradas en las pruebas de integración. Incluye filtros, selección y descarga de colección Postman. El servidor Express/PostgreSQL no se ejecuta en GitHub Pages.

Las copias de Wallet y TaskFlow están en `public/demos/`. El visor de la API está en `src/pages/demos/api/`, con respuestas sanitizadas en `src/data/api-responses.json`. Todas las demos incluyen regreso al portafolio y mantienen Trebuchet MS. El registro original de pruebas de la API se conserva como evidencia; el visor no realiza solicitudes al backend.

## Estructura

```text
src/        Componentes, páginas y contenido editable del portafolio
public/     Imágenes, iconos y documentos descargables
entrega/    PDF solicitado, CV complementario y guía de entrega
docs/      Evidencias y cumplimiento de la consigna
scripts/    Generación de documentos y paquete para la plataforma
```

Astro está directamente en la raíz de este repositorio. La investigación y el FODA se editan en `src/data/professional-profile.json`; los tres proyectos del curso y las métricas del caso están en `src/data/course-projects.ts`.

## Desarrollo y verificación

```bash
npm ci
npm run dev
npm run build
npm run preview
```

El sitio usa el prefijo `/modulo_9_talento_digital/`, también en la vista previa local. La compilación ejecuta `astro check` antes de generar `dist/`.

## GitHub Pages

`.github/workflows/pages.yml` compila y publica desde `main` mediante GitHub Actions. Configuración: `site` apunta a `https://franciscodastres.github.io` y `base` al nombre del repositorio. Las rutas de imágenes, enlaces y descargas incluyen ese prefijo.

Referencias: [Astro en GitHub Pages](https://docs.astro.build/en/guides/deploy/github/) y [workflows de Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Entrega en la plataforma

El documento principal es [el PDF del proyecto](entrega/proyecto-modulo-9-francisco-meza-dastres.pdf). Incluye portada, investigación de Mercado Libre, tres aportes, tres preguntas para el reclutador, enlace al portafolio, caso de estudio y PLUS FODA. El [CV](entrega/cv-francisco-meza-dastres.pdf) es complementario.

Los archivos `entrega_modulo_9.zip` y `entrega_modulo_9.rar` se generan **junto a la carpeta `modulo_9`**, en la carpeta superior `pruebas`. Ambos incluyen el documento, CV, guía y código fuente, sin dependencias, configuración privada ni temporales.

Para regenerarlos, desde esta carpeta:

```bash
.venv/bin/python scripts/generar_entrega.py
python3 scripts/empaquetar_entrega.py
```

Para crear el RAR se necesita `rar` instalado o el ejecutable local `.trabajo/rar/usr/bin/rar`. El ZIP se genera con la biblioteca estándar de Python.

El detalle de requisitos y verificación está en [docs/estado-del-proyecto.md](docs/estado-del-proyecto.md). La consigna original y los archivos temporales se conservan localmente y no forman parte del repositorio ni del paquete de entrega.

## Licencia

Se conserva la licencia MIT y el aviso de autor del portafolio reutilizado; consultar [LICENSE](LICENSE).
