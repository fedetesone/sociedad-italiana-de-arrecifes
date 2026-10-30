# Sociedad Italiana de S.M. "Voz de Caprera"

Sitio institucional en español argentino de la Sociedad Italiana de Socorros Mutuos "Voz de Caprera", Arrecifes. Astro + TypeScript, Tailwind CSS 4, Sanity Studio y alojamiento estático en Cloudflare Pages. Monorepo npm: `web/` contiene el sitio público y `studio/` el administrador independiente.

## Requisitos y desarrollo

Node.js 24 LTS y npm. Las versiones exactas resueltas se conservan en `package-lock.json`.

```sh
npm ci
npm run dev            # http://localhost:4321
npm run check
npm test
npm run build          # web/dist
npm run dev:studio     # http://localhost:3333 (requiere configurar Sanity)
```

El sitio funciona sin Sanity con textos institucionales de base y una agenda vacía. No se publican eventos de ejemplo ni datos de contacto inventados. La fotografía de Italia es ilustrativa; reemplazarla con imágenes propias desde el Studio. La reseña histórica incorpora datos contrastados y enlaces a fuentes públicas; el detalle de la investigación está en [docs/historia-fuentes.md](docs/historia-fuentes.md). La institución puede ampliarla desde Sanity.

## Configurar Sanity (plan gratuito)

1. Creá un proyecto en <https://www.sanity.io/manage>, elegí el plan gratuito y creá el dataset **público** `production`. No cargues información personal o interna: el dataset público es legible por cualquiera.
2. Copiá las plantillas locales:

   ```sh
   cp web/.env.example web/.env
   cp studio/.env.example studio/.env
   ```

3. En `web/.env`, completá `PUBLIC_SANITY_PROJECT_ID` y `PUBLIC_SANITY_DATASET`. En `studio/.env`, completá `SANITY_STUDIO_PROJECT_ID` y `SANITY_STUDIO_DATASET` con los mismos valores. Los IDs de proyecto no son secretos; no hace falta un token de lectura para un dataset público.
4. Ejecutá `npm run dev:studio` e iniciá sesión con Sanity. En la configuración del proyecto, agregá `http://localhost:3333` a CORS con credenciales si es necesario.
5. En **La institución**, completá presentación, historia, propósito, actividades, fotos, dirección, contacto y redes. Publicá el documento. Es un singleton con ID `siteSettings`.
6. En **Eventos**, creá un evento, generá su dirección, completá fecha y hora, lugar, resumen y descripción. Agregá afiche y enlace de inscripción si corresponde. Confirmá la zona horaria del selector y publicá.
7. Volvé a compilar la web. Las consultas leen únicamente documentos publicados y no usan caché CDN. Un error de Sanity hace fallar el build para evitar desplegar contenido vacío por accidente.

### Publicar el Studio

```sh
cd studio
npx sanity login
npm run deploy
```

Elegí un nombre disponible para obtener `https://<nombre>.sanity.studio`. El alojamiento y la autenticación son los de Sanity; no hay autenticación propia. Agregá esa URL a los orígenes CORS permitidos del proyecto con credenciales y administrá los permisos de edición desde Sanity Manage. La disponibilidad de miembros y cuotas depende del plan gratuito vigente.

## Publicar en Cloudflare Pages

La web es **100 % estática**, sin adaptador SSR, Workers, base de datos ni funciones de pago.

1. Iniciá sesión en Cloudflare y abrí **Workers & Pages → Create application → Pages → Import an existing Git repository**.
2. Seleccioná `fedetesone/sociedad-italiana-de-arrecifes` y la rama `main`.
3. Configurá:

   | Opción                     | Valor                                         |
   | -------------------------- | --------------------------------------------- |
   | Directorio raíz            | raíz del repositorio (vacío)                  |
   | Comando de compilación     | `npm run build`                               |
   | Directorio de salida       | `web/dist`                                    |
   | `NODE_VERSION`             | `24`                                          |
   | `PUBLIC_SITE_URL`          | URL HTTPS final del sitio, sin barra al final |
   | `PUBLIC_SANITY_PROJECT_ID` | ID real de Sanity                             |
   | `PUBLIC_SANITY_DATASET`    | `production`                                  |

4. Desplegá. Cada push a `main` genera una nueva versión. Si agregás un dominio propio, actualizá `PUBLIC_SITE_URL` y recompilá para corregir enlaces canónicos, sitemap y metadatos sociales.

La URL `sociedad-italiana-de-arrecifes.pages.dev` es un valor por defecto, **no una afirmación de que ya existe un despliegue**. Configurá la URL real asignada por Cloudflare. El despliegue requiere acceso a la cuenta de Cloudflare.

### Actualizaciones de contenido y fechas

Un sitio estático necesita reconstruirse cuando cambia el contenido. En Cloudflare Pages, creá un **Deploy Hook** para `main`. Su URL es un secreto: nunca la guardes en código ni en variables públicas.

- En Sanity Manage → API → Webhooks, agregá el hook con método `POST`, dataset `production`, eventos create/update/delete y filtro `(_type == "event" || _type == "siteSettings") && !(_id in path("drafts.**"))`. Esto incluye publicaciones, ediciones, eliminaciones y retiros de publicación.
- En GitHub → Settings → Secrets and variables → Actions, guardá la misma URL como `CLOUDFLARE_DEPLOY_HOOK`. El workflow `rebuild.yml` solicita un build diario a las 00:15 de Argentina para mover eventos pasados. Puede ejecutarse manualmente. Sin el secreto, informa la configuración pendiente y no hace solicitudes.
- La agenda se clasifica en el momento del build. La finalización, cuando existe, mantiene el evento en próximos mientras está en curso. Sin finalización, pasa a anteriores después del inicio. Entre builds puede haber hasta un día de demora; las tareas programadas de GitHub pueden retrasarse y deshabilitarse en repositorios públicos inactivos. Se puede ejecutar el workflow o redesplegar manualmente.
- Los borradores nunca se muestran. No se implementó vista previa editorial de borradores.

## Contenido y accesibilidad

- Páginas: inicio, eventos, detalle por slug, nosotros, contacto y 404.
- Las fechas se muestran en `America/Argentina/Buenos_Aires`, independientemente de la zona del servidor.
- Navegación móvil con estado expandido y cierre con Escape; enlace para saltar al contenido, foco visible y HTML semántico.
- El texto enriquecido se renderiza escapado, con lista permitida de protocolos para enlaces. Las imágenes tienen texto alternativo editable.
- Sin formularios que aparenten enviar mensajes: Contacto muestra únicamente los canales reales cargados en Sanity.
- Fuentes locales (DM Sans y Newsreader); ninguna petición a Google Fonts. Imagen de portada almacenada localmente.
- Metadata Open Graph, Twitter, URL canónica, sitemap, robots y cabeceras estáticas de seguridad.

## Verificaciones

```sh
npm run check
npm test
npm run build
SANITY_STUDIO_PROJECT_ID=ci123456 npm run build:studio
```

El último comando verifica la compilación del Studio con un ID ficticio válido; no verifica un proyecto ni autenticación reales. Para uso real se necesita el ID propio. CI ejecuta estos controles en cada push/PR. Las pruebas cubren orden cronológico, eventos en curso, límite horario, cambio de fecha UTC/Argentina y enlaces inseguros.

## Publicar el repositorio manualmente

Si se trabaja en una copia nueva que todavía no tiene Git ni remoto:

```sh
git init -b main
git add .
git commit -m "feat: build Sociedad Italiana website and Sanity Studio"
gh auth login
gh repo create sociedad-italiana-de-arrecifes --public --source=. --remote=origin --push
```

Nunca subas `.env`, tokens ni URLs privadas de hooks. Los ejemplos `.env.example` no contienen secretos.

## Referencias y recursos

- [Astro: estilos y Tailwind](https://docs.astro.build/en/guides/styling/)
- [Cloudflare Pages: Astro](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)
- [Sanity: instalación](https://www.sanity.io/docs/studio/installation)
- [Sanity: despliegue del Studio](https://www.sanity.io/docs/studio/deployment)
- Foto ilustrativa de Cinque Terre: [Unsplash](https://unsplash.com/photos/pEFIxD6atFQ), [archivo utilizado](https://images.unsplash.com/photo-1516483638261-f4dbaf036963), bajo [licencia Unsplash](https://unsplash.com/license). No representa la sede de Arrecifes.
- Fuentes distribuidas mediante Fontsource bajo sus licencias SIL OFL incluidas en los paquetes.

### Validación de la implementación inicial

Verificada con Node 24: chequeo de Astro y TypeScript sin errores, cuatro pruebas unitarias aprobadas y builds del sitio y Studio correctos. Se probó además un evento temporal (sin publicarlo ni conservarlo) para verificar generación de su detalle, enlaces, fecha argentina y escape de HTML. La portada estática obtuvo 100 en accesibilidad, buenas prácticas y SEO en Lighthouse móvil local; estos resultados no sustituyen una revisión del contenido real ni una medición del despliegue final. `npm audit` no reportó vulnerabilidades al entregar.

Los overrides de npm actualizan tres dependencias indirectas del CLI de Sanity (`js-yaml`, `smol-toml` y `undici`) dentro de sus versiones mayores para aplicar correcciones de seguridad. Revisalos al actualizar Sanity. `npm run format` aplica el formato de código, incluidos los archivos Astro.
